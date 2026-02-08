<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Video;

$failedVideos = Video::where('status', 'failed')->get();

foreach ($failedVideos as $video) {
    echo "ID: {$video->id} | URL: {$video->url}\n";
}
