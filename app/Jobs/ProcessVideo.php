<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessVideo implements ShouldQueue
{
    use Queueable;

    public $video;
    public $apiKey;

    /**
     * Create a new job instance.
     */
    public function __construct(\App\Models\Video $video, ?string $apiKey = null)
    {
        $this->video = $video;
        $this->apiKey = $apiKey;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->video->update(['status' => 'processing']);

        $pythonScriptPath = base_path('scripts/analyze_video.py');
        $pythonExecutable = 'python'; // Or full path if needed, e.g., 'C:\Python39\python.exe'

        $args = [];
        if ($this->video->url) {
            $args = ['--url', $this->video->url];
        } elseif ($this->video->file_path) {
            $args = ['--file', storage_path('app/private/' . $this->video->file_path)];
        } else {
            $this->video->update(['status' => 'failed', 'report_json' => ['error' => 'No URL or file provided']]);
            return;
        }

        // Add model if needed
        $args[] = '--model';
        $args[] = $this->video->model ?? 'gemini-1.5-flash';

        if ($this->apiKey) {
            $args[] = '--api_key';
            $args[] = $this->apiKey;
        }

        $command = array_merge([$pythonExecutable, $pythonScriptPath], $args);

        $result = \Illuminate\Support\Facades\Process::timeout(3600)->run($command);

        if ($result->successful()) {
            $output = $result->output();

            // Try to find the JSON part in the output
            $jsonStart = strpos($output, '{');
            $jsonEnd = strrpos($output, '}');

            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonString = substr($output, $jsonStart, $jsonEnd - $jsonStart + 1);
                $report = json_decode($jsonString, true);
            } else {
                $report = null;
            }

            if ($report) {
                $updateData = [
                    'status' => 'completed',
                    'report_json' => $report,
                ];

                if (isset($report['title']) && !empty($report['title'])) {
                    $updateData['title'] = $report['title'];
                }

                $this->video->update($updateData);
            } else {
                $this->video->update([
                    'status' => 'failed',
                    'report_json' => ['error' => 'Invalid JSON output from script', 'output' => $output],
                ]);
            }
        } else {
            $currentOutput = $result->output();
            $errorOutput = $result->errorOutput();
            $combinedOutput = $currentOutput . "\n" . $errorOutput;

            $errorMessage = 'Process failed';

            if (str_contains($combinedOutput, 'GEMINI_API_KEY not found')) {
                $errorMessage = 'Gemini API Key is missing. Please set it in .env or provide it in the dashboard.';
            } elseif (str_contains($combinedOutput, 'quota')) {
                $errorMessage = 'Gemini API Quota exceeded. Please try again later or use a different key.';
            }

            $this->video->update([
                'status' => 'failed',
                'report_json' => [
                    'error' => $errorMessage,
                    'output' => $combinedOutput
                ],
            ]);
        }

        // Cleanup: Delete the video file if it exists locally
        if ($this->video->file_path && \Illuminate\Support\Facades\Storage::exists($this->video->file_path)) {
            \Illuminate\Support\Facades\Storage::delete($this->video->file_path);
        }
    }
}
