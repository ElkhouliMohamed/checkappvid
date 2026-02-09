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
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 1200;

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
    /**
     * Execute the job.
     */
    public function handle(\App\Services\VideoAnalysisService $analyzer): void
    {
        // Increase PHP execution time limit to infinity for this job
        set_time_limit(0);
        ini_set('max_execution_time', 1800);

        try {
            $this->video->update(['status' => 'Processing (PHP)...']);

            // The service now handles downloading via athlon1600/youtube-downloader
            // and analysis via GeminiService.
            $result = $analyzer->analyze($this->video);

            $this->video->update([
                'status' => 'completed',
                'report_json' => $result,
            ]);

        } catch (\Exception $e) {
            $this->video->update([
                'status' => 'failed',
                'report_json' => [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]
            ]);

            \Illuminate\Support\Facades\Log::error("ProcessVideo Job Failed: " . $e->getMessage());
        }
    }
}
