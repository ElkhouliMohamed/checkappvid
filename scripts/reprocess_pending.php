<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Video;
use App\Jobs\ProcessVideo;

// Specific video reported by user
$videoUrl = 'https://www.youtube.com/watch?v=7ccLGc2_QPE';
$video = Video::where('url', $videoUrl)->first();
$logFile = __DIR__ . '/../reprocess_log.txt';
file_put_contents($logFile, "Starting reprocessing of URL $videoUrl\n");

if (!$video) {
    file_put_contents($logFile, "Video with URL $videoUrl not found.\n", FILE_APPEND);
    // Try listing all failed urls to debug
    $failed = Video::where('status', 'failed')->get();
    file_put_contents($logFile, "Available failed videos:\n", FILE_APPEND);
    foreach ($failed as $v) {
        file_put_contents($logFile, "ID: {$v->id} - {$v->url}\n", FILE_APPEND);
    }
    exit(1);
}

file_put_contents($logFile, "Current Status: {$video->status}\n", FILE_APPEND);

// Reset status to pending
$video->update([
    'status' => 'pending',
    'model' => 'gemini-2.5-flash' // Try 2.5 to see if it has quota
]);
file_put_contents($logFile, "Status reset to pending and model set to gemini-2.5-flash.\n", FILE_APPEND);

file_put_contents($logFile, "Dispatching ProcessVideo job for ID {$video->id}...\n", FILE_APPEND);

try {
    // This runs synchronously because QUEUE_CONNECTION=sync
    ProcessVideo::dispatch($video);
    file_put_contents($logFile, "Job dispatched.\n", FILE_APPEND);

    // Refresh video to check status
    $video->refresh();
    file_put_contents($logFile, "New Status: {$video->status}\n", FILE_APPEND);

    if ($video->status === 'failed') {
        file_put_contents($logFile, "Job FAILED again.\n", FILE_APPEND);
        file_put_contents($logFile, print_r($video->report_json, true), FILE_APPEND);
    } elseif ($video->status === 'completed') {
        file_put_contents($logFile, "Job COMPLETED successfully!\n", FILE_APPEND);
        file_put_contents($logFile, print_r($video->report_json, true), FILE_APPEND);
    } else {
        file_put_contents($logFile, "Job status is {$video->status}\n", FILE_APPEND);
    }

} catch (\Exception $e) {
    file_put_contents($logFile, "Exception during dispatch: " . $e->getMessage() . "\n", FILE_APPEND);
}
