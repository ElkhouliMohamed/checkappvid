<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessVideo implements ShouldQueue
{
    use Queueable;

    public $video;

    /**
     * Create a new job instance.
     */
    public function __construct(\App\Models\Video $video)
    {
        $this->video = $video;
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

        // Add model if needed, could be passed in video metadata or default
        $args[] = '--model';
        $args[] = $this->video->model ?? 'gemini-1.5-flash';

        $command = array_merge([$pythonExecutable, $pythonScriptPath], $args);

        $result = \Illuminate\Support\Facades\Process::timeout(3600)->run($command);

        if ($result->successful()) {
            $output = $result->output();
            try {
                $json = json_decode($output, true, 512, JSON_THROW_ON_ERROR);
                $this->video->update([
                    'status' => 'completed',
                    'report_json' => $json,
                ]);
            } catch (\Exception $e) {
                // Determine if output is just not JSON or empty
                $this->video->update([
                    'status' => 'failed',
                    'report_json' => ['error' => 'Invalid JSON output from script', 'output' => $output, 'exception' => $e->getMessage()],
                ]);
            }
        } else {
            $this->video->update([
                'status' => 'failed',
                'report_json' => ['error' => 'Process failed', 'output' => $result->errorOutput()],
            ]);
        }
    }
}
