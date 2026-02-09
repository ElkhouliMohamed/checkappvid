<?php

use App\Models\Video;
use App\Services\VideoAnalysisService;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Log;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Starting debug analysis...\n";

// 1. Check if yt-dlp is available
echo "Checking yt-dlp availability...\n";
$service = app(VideoAnalysisService::class);
try {
    $reflection = new ReflectionClass($service);
    $method = $reflection->getMethod('getYtDlpBinary');
    $method->setAccessible(true);
    $binary = $method->invoke($service);
    echo "Resolved yt-dlp binary: " . $binary . "\n";

    $version = shell_exec("$binary --version");
    echo "yt-dlp version: " . ($version ?: "Generic/Not found via shell_exec") . "\n";
} catch (Exception $e) {
    echo "Error checking binary: " . $e->getMessage() . "\n";
}

// 2. Mock a video and try to download
echo "\nAttempting to download video...\n";
$url = 'https://www.youtube.com/watch?v=RoahnAEM15k';

try {
    // Manually call download logic
    $method = $reflection->getMethod('downloadVideo');
    $method->setAccessible(true);
    echo "Downloading $url...\n";
    $path = $method->invoke($service, $url);
    echo "Download successful: $path\n";
    echo "File size: " . filesize($path) . " bytes\n";

    // Clean up
    unlink($path);
    echo "Cleaned up temp file.\n";

} catch (Exception $e) {
    echo "DOWNLOAD FAILED: " . $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\nDownload test passed.\n";

// 3. Test Full Analysis
echo "\nAttempting full analysis...\n";
try {
    // Create a dummy video record or use existing one
    // We'll mock the object structure to avoid DB dependency if possible, but the service expects a Model.
    // Let's create a temporary in-memory model if possible, or just create one and delete it.

    $video = new Video();
    $video->url = $url;
    $video->status = 'debug_test';

    // We won't save it to DB to avoid polluting, but the service calls $video->update().
    // We need to override the update method or just let it fail DB write?
    // Service calls $video->update(['status' => ...]);
    // If $video exists = false, update() might try to save.

    // Better strategy: Use the service but expect DB errors if we don't save.
    // Or just catch the first exception.

    // Let's create a temp record
    $video->title = 'Debug Test Video';
    $video->platform = 'youtube';
    $video->video_id = 'RoahnAEM15k';
    $video->save();

    echo "Created debug video ID: " . $video->id . "\n";

    $result = $service->analyze($video);

    echo "Analysis result:\n";
    print_r($result);

    $video->delete();
    echo "Deleted debug video.\n";

} catch (Exception $e) {
    echo "ANALYSIS FAILED: " . $e->getMessage() . "\n";
    echo "Trace:\n" . $e->getTraceAsString() . "\n";
}
