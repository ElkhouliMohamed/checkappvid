<?php

namespace App\Services;

use App\Models\Video;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use YouTube\YouTubeDownloader;

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

        // Determine yt-dlp binary path
        $binary = $this->getYtDlpBinary();

        $filename = 'vid_' . uniqid() . '.mp4';
        $outputPath = $tempPath . '/' . $filename;

        Log::info("Downloading video with yt-dlp", [
            'url' => $url,
            'binary' => $binary,
            'output' => $outputPath
        ]);

        // Construct command
        // Use 'best' to avoid needing ffmpeg for merging, as ffmpeg might not be present
        // 'best' selects the best single file containing both video and audio
        // Fallback to 'bestvideo+bestaudio' if ffmpeg is present would be ideal, but 'best' is safer here
        $command = [
            $binary,
            '-f',
            'best[ext=mp4]/best',
            '--no-playlist',
            '--force-overwrites',
            '-o',
            $outputPath,
        ];

        // Add cookies if configured (to avoid "Sign in to confirm you’re not a bot" errors)
        $cookiesPath = env('YOUTUBE_COOKIES_PATH', storage_path('app/youtube_cookies.txt'));
        if ($cookiesPath && file_exists($cookiesPath)) {
            $command[] = '--cookies';
            $command[] = $cookiesPath;
        }

        $command[] = $url;

        try {
            // Use Laravel's Process facade
            $result = Process::timeout(600)->run($command);

            if ($result->failed()) {
                Log::error("yt-dlp failed", ['output' => $result->output(), 'error' => $result->errorOutput()]);
                throw new Exception("Video download failed (yt-dlp error): " . $result->errorOutput());
            }

            if (!file_exists($outputPath) || filesize($outputPath) === 0) {
                // Log the output to debug why it failed despite exit code 0
                Log::error("yt-dlp exited successfully but file missing", [
                    'output' => $result->output(),
                    'error' => $result->errorOutput()
                ]);
                throw new Exception("Video download failed: Output file not found or empty. (Check logs for yt-dlp output)");
            }

            return $outputPath;

        } catch (Exception $e) {
            Log::error("Video download exception: " . $e->getMessage());
            throw $e;
        }
    }
    protected function getYtDlpBinary(): string
    {
        $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';

        // 1. Check local storage bin (Windows)
        if ($isWindows) {
            $localWin = storage_path('bin/yt-dlp.exe');
            if (file_exists($localWin)) {
                return $localWin;
            }
        }

        // 2. Check local storage bin (Linux/Unix)
        $localLinux = storage_path('bin/yt-dlp');
        if (file_exists($localLinux)) {
            // Ensure executable
            chmod($localLinux, 0755);
            return $localLinux;
        }

        // 3. Fallback to global path
        return 'yt-dlp';
    }
}
