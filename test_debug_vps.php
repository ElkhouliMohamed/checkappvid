<?php

use App\Models\Video;
use App\Services\VideoAnalysisService;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Log;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Check for Node.js (Required for yt-dlp "n" parameter calculation)
$nodeVersion = shell_exec("node -v");
if (empty($nodeVersion)) {
    echo "WARNING: Node.js is NOT found. yt-dlp requires Node.js to decrypt video signatures.\n";
    echo "Please run: sudo apt update && sudo apt install nodejs -y\n";
} else {
    echo "Node.js found: " . trim($nodeVersion) . "\n";
}

echo "Starting debug analysis...\n";

// Check for API Key
$apiKey = env('GEMINI_API_KEY');
if (empty($apiKey)) {
    echo "WARNING: GEMINI_API_KEY is not set in .env file (via env() function).\n";
} else {
    echo "GEMINI_API_KEY found in .env (length: " . strlen($apiKey) . ")\n";
}

$configKey = config('services.gemini.api_key');
if (empty($configKey)) {
    echo "WARNING: services.gemini.api_key config is empty.\n";
} else {
    echo "services.gemini.api_key config found.\n";
}

$cookiesPath = env('YOUTUBE_COOKIES_PATH', storage_path('app/youtube_cookies.txt'));
if ($cookiesPath) {
    if (file_exists($cookiesPath)) {
        echo "YOUTUBE_COOKIES_PATH (or default) found and file exists: $cookiesPath\n";
    } else {
        echo "WARNING: YOUTUBE_COOKIES_PATH is set ($cookiesPath) but file does NOT exist.\n";
    }
} else {
    echo "Notice: YOUTUBE_COOKIES_PATH is not set. (This might be needed if YouTube blocks the VPS IP)\n";
}

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

echo "Download test passed.\n";

// List available models
echo "Listing available models...\n";
try {
    $apiKey = env('GEMINI_API_KEY');
    $response = Http::get("https://generativelanguage.googleapis.com/v1beta/models?key={$apiKey}");
    if ($response->successful()) {
        $models = $response->json()['models'] ?? [];
        echo "Available Models:\n";
        foreach ($models as $m) {
            if (str_contains($m['name'], 'gemini')) {
                echo " - " . $m['name'] . "\n";
            }
        }
    } else {
        echo "Failed to list models: " . $response->body() . "\n";
    }
} catch (Exception $e) {
    echo "Exception listing models: " . $e->getMessage() . "\n";
}


// 3. Test Full Analysis
echo "\nAttempting full analysis...\n";
$model = env('GEMINI_MODEL', 'gemini-2.0-flash');
echo "Using Gemini Model: $model\n";
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
