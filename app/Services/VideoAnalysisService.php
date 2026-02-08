<?php

namespace App\Services;

use App\Models\Video;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Support\Facades\Log;

class VideoAnalysisService
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    public function analyze(Video $video): array
    {
        $videoPath = null;

        try {
            // 1. Get Video File
            $video->update(['status' => 'Downloading Video...']);
            if ($video->url) {
                $videoPath = $this->downloadVideo($video->url);
            } elseif ($video->file_path) {
                $videoPath = storage_path('app/private/' . $video->file_path);
            } else {
                throw new Exception("No URL or file provided.");
            }

            if (!file_exists($videoPath)) {
                throw new Exception("Video file not found at $videoPath");
            }

            // 2. Upload to Gemini
            $video->update(['status' => 'Uploading to Gemini...']);
            Log::info("Uploading video to Gemini: $videoPath");
            $uploadResult = $this->geminiService->uploadFile($videoPath);
            $fileUri = $uploadResult['file']['uri'] ?? null;
            $fileName = $uploadResult['file']['name'] ?? null; // e.g., files/enc-name

            if (!$fileName) {
                Log::error("Upload failed result: " . json_encode($uploadResult));
                throw new Exception("Failed to upload video to Gemini.");
            }

            // 3. Wait for processing
            $video->update(['status' => 'Processing Video...']);
            Log::info("Waiting for Gemini processing: $fileName");
            $this->geminiService->waitForProcessing($fileName);

            // 4. Generate Content
            $model = $video->model ?? 'gemini-3.0-flash'; // Default to 3.0-flash if not set
            $video->update(['status' => "Analyzing with $model..."]);
            Log::info("Generating content with model: $model");

            $prompt = "Analyze this video for adult content, violence, and other safety concerns.
            Provide a detailed report in JSON format with the following structure:
            {
                \"safety_score\": 0-100 (where 100 is safe, 0 is very unsafe),
                \"summary\": \"Brief summary of the video content\",
                \"flags\": [
                    {
                        \"timestamp\": \"MM:SS\",
                        \"category\": \"Adult|Violence|Hate|Dangerous\",
                        \"severity\": \"Low|Medium|High\",
                        \"description\": \"Description of the flagged content\"
                    }
                ]
            }
            Ensure the output is strictly valid JSON.";

            $contents = [
                [
                    'role' => 'user',
                    'parts' => [
                        ['file_data' => ['mime_type' => 'video/mp4', 'file_uri' => $fileUri]],
                        ['text' => $prompt]
                    ]
                ]
            ];

            $generationConfig = [
                'temperature' => 0.4,
                'top_p' => 1,
                'top_k' => 32,
                'max_output_tokens' => 8192,
                'response_mime_type' => 'application/json',
            ];

            $result = $this->geminiService->generateContent($model, $contents, $generationConfig);

            // 5. Parse Result
            $text = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$text) {
                throw new Exception("No text generated from Gemini.");
            }

            // Clean markdown json block if present (though response_mime_type json should handle it, sometimes it wraps)
            if (str_starts_with($text, '```json')) {
                $text = substr($text, 7);
                if (str_ends_with(trim($text), '```')) {
                    $text = substr(trim($text), 0, -3);
                }
            }

            $json = json_decode($text, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Failed to parse JSON response: " . json_last_error_msg() . " | Output: " . substr($text, 0, 1000));
            }

            return $json;

        } catch (Exception $e) {
            Log::error("Analysis failed: " . $e->getMessage());
            throw $e;
        } finally {
            // Cleanup temp downloaded file if it was from URL
            if ($video->url && $videoPath && file_exists($videoPath)) {
                @unlink($videoPath);
            }
        }
    }

    protected function downloadVideo(string $url): string
    {
        $tempPath = storage_path('app/temp_videos');
        if (!file_exists($tempPath)) {
            mkdir($tempPath, 0755, true);
        }

        $filename = 'vid_' . uniqid() . '.mp4';
        $outputPath = $tempPath . '/' . $filename;

        $ytDlpPath = storage_path('bin/yt-dlp.exe');

        if (!file_exists($ytDlpPath)) {
            throw new Exception("yt-dlp binary not found at $ytDlpPath. Please download it to storage/bin/yt-dlp.exe");
        }

        $cmd = "\"$ytDlpPath\" --format \"best[ext=mp4]\" -o \"$outputPath\" \"$url\"";

        // Create a dedicated temp directory for yt-dlp extraction to avoid permission issues
        $ytDlpTempPath = storage_path('app/temp_yt_dlp');
        if (!file_exists($ytDlpTempPath)) {
            mkdir($ytDlpTempPath, 0755, true);
        }

        Log::info("Downloading video with command: $cmd");

        // Pass custom TEMP environment variables to the process
        $env = [
            'TEMP' => $ytDlpTempPath,
            'TMP' => $ytDlpTempPath,
            'TMPDIR' => $ytDlpTempPath,
            'SystemRoot' => env('SystemRoot', 'C:\\Windows'), // Required for some windows ops
            'PATH' => env('PATH'),
        ];

        $result = Process::timeout(1200)->env($env)->run($cmd);

        if (!$result->successful()) {
            throw new Exception("yt-dlp download failed: " . $result->errorOutput() . " " . $result->output());
        }

        if (!file_exists($outputPath)) {
            throw new Exception("Download succeeded but file not found at $outputPath");
        }

        return $outputPath;
    }
}
