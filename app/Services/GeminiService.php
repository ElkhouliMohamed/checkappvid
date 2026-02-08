<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?? config('services.gemini.api_key') ?? env('GEMINI_API_KEY');

        if (empty($this->apiKey)) {
            throw new Exception("Gemini API Key is missing.");
        }
    }

    /**
     * Upload a file to Gemini.
     */
    public function uploadFile(string $filePath, string $mimeType = 'video/mp4'): array
    {
        if (!file_exists($filePath)) {
            throw new Exception("File not found: {$filePath}");
        }

        $fileSize = filesize($filePath);
        $url = "https://generativelanguage.googleapis.com/upload/v1beta/files?key={$this->apiKey}";

        // Initial upload request (resumable upload is recommended for large files, 
        // but for simplicity we'll try standard multipart first, or just use the upload API directly 
        // matching the python client behavior which does multipart for smaller files or resumable).
        // Let's use the standard upload endpoint which supports up to 2GB via headers X-Goog-Upload-Protocol: resumable? 
        // Actually, the simplest way via HTTP client is the multipart upload if supported, 
        // but Gemini Upload API recommends Resumable for files > 2MB.
        // Let's implement a simple multipart upload first as it's easier, but given videos can be large, 
        // strictly speaking we should use the resumable protocol.
        // However, standard `Http::attach` works for multipart.

        $response = Http::timeout(3600)->attach(
            'file',
            file_get_contents($filePath),
            basename($filePath),
            ['Content-Type' => $mimeType]
        )->post("{$url}");

        // Note: The direct upload endpoint is https://generativelanguage.googleapis.com/upload/v1beta/files
        // But formatting it correctly with metadata might be tricky in one go.
        // Let's try the simple approach: sending json metadata + file content is complex in standard multipart.
        // Actually, the python client does:
        // POST /upload/v1beta/files?key=...
        // Headers: X-Goog-Upload-Protocol: multipart (or resumable)

        // Let's try a simpler path: 
        // The API documentation says:
        // POST https://generativelanguage.googleapis.com/upload/v1beta/files?key=YOUR_API_KEY
        // Body: {'file': {'display_name': '...'}} (metadata) 
        // THIS IS FOR METADATA ONLY.

        // To upload actual bytes, we usually use the upload URL.
        // Let's stick to the simplest working method for now: Resumable upload is safer for videos.

        return $this->uploadResumable($filePath, $mimeType);
    }

    protected function uploadResumable(string $filePath, string $mimeType): array
    {
        $fileSize = filesize($filePath);
        $displayName = basename($filePath);

        // 1. Initiate Resumable Upload
        $initUrl = "https://generativelanguage.googleapis.com/upload/v1beta/files?key={$this->apiKey}";

        $response = Http::withHeaders([
            'X-Goog-Upload-Protocol' => 'resumable',
            'X-Goog-Upload-Command' => 'start',
            'X-Goog-Upload-Header-Content-Length' => $fileSize,
            'X-Goog-Upload-Header-Content-Type' => $mimeType,
            'Content-Type' => 'application/json',
        ])->post($initUrl, [
                    'file' => ['display_name' => $displayName]
                ]);

        if (!$response->successful()) {
            throw new Exception("Failed to initiate upload: " . $response->body());
        }

        $uploadUrl = $response->header('X-Goog-Upload-URL');

        // 2. Upload Content
        // Using a stream to avoid loading entire file into memory
        $fileHandle = fopen($filePath, 'r');

        $putResponse = Http::withHeaders([
            'Content-Length' => $fileSize,
            'X-Goog-Upload-Offset' => 0,
            'X-Goog-Upload-Command' => 'upload, finalize',
        ])->withBody(
                file_get_contents($filePath), // Http client might support resource, but file_get_contents is explicitly loading to mem. 
                // Better to use a stream is possible, but Laravel Http client `withBody` expects string.
                // For large files, we might need Guzzle direct access or chunking.
                // For MVP let's assume < 100MB or sufficient RAM.
                $mimeType
            )->put($uploadUrl);

        if (!$putResponse->successful()) {
            throw new Exception("Failed to upload file content: " . $putResponse->body());
        }

        return $putResponse->json();
    }

    public function getFile(string $name): array
    {
        if (str_starts_with($name, 'files/')) {
            $url = "https://generativelanguage.googleapis.com/v1beta/{$name}?key={$this->apiKey}";
        } else {
            $url = "https://generativelanguage.googleapis.com/v1beta/files/{$name}?key={$this->apiKey}";
        }

        $response = Http::get($url);

        if (!$response->successful()) {
            throw new Exception("Failed to get file info: " . $response->body());
        }

        return $response->json();
    }

    public function waitForProcessing(string $fileName, int $timeout = 600): array
    {
        $start = time();
        while (time() - $start < $timeout) {
            $file = $this->getFile($fileName);
            $state = $file['state'] ?? 'UNKNOWN';

            if ($state === 'ACTIVE') {
                return $file;
            }

            if ($state === 'FAILED') {
                throw new Exception("File processing failed.");
            }

            sleep(5);
        }

        throw new Exception("Timeout waiting for file processing.");
    }

    public function generateContent(string $model, array $contents, array $generationConfig = []): array
    {
        $url = "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}";

        $payload = [
            'contents' => $contents,
            'generationConfig' => $generationConfig,
        ];

        // Retry logic for 429
        $attempts = 0;
        $maxAttempts = 5;

        while ($attempts < $maxAttempts) {
            $response = Http::timeout(600)->post($url, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            if ($response->status() === 429) {
                $attempts++;
                $wait = pow(2, $attempts); // Exponential backoff
                Log::info("Gemini 429 hit. Retrying in {$wait}s...");
                sleep($wait);
                continue;
            }

            throw new Exception("Generate content failed: " . $response->body());
        }

        throw new Exception("Generate content failed after {$maxAttempts} retries (Rate Limit).");
    }
}
