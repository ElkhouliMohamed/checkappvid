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
    /**
     * Execute the job.
     */
    public function handle(\App\Services\VideoAnalysisService $analyzer): void
    {
        try {
            $this->video->update(['status' => 'processing']);

            // Configure API key if provided in job, otherwise service uses default from env
            if ($this->apiKey) {
                // We'd need a way to pass this to the service if it was constructed already.
                // However, the service is injected. 
                // Best practice: The service uses config/env.
                // If we support per-request keys, we should pass it to the analyze method or set it on the service.
                // For now, let's assume env key is primary, or we update the service's key.
                // But VideoAnalysisService depends on GeminiService.
                // Let's rely on the service's internal config for now to keep it simple, 
                // as per the new GeminiService implementation which checks env.
                // If user provided a key in dashboard, we might want to support it. 
                // But the Python refactor is to use server-side stable key.
            }

            $result = $analyzer->analyze($this->video);

            $updateData = [
                'status' => 'completed',
                'report_json' => $result,
            ];

            // Extract title/summary if available and needed (though we usually just store the report)
            // The python script did: final_result['title'] = ...
            // Our PHP service doesn't explicitly extract title from yt-dlp json, 
            // but we could if we wanted to update the video title in DB.
            // The curret implementation of VideoAnalysisService returns the Gemini analysis JSON.
            // It doesn't return metadata about the video itself (like title).
            // This is acceptable as the primary goal is the safety report.

            $this->video->update($updateData);

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
