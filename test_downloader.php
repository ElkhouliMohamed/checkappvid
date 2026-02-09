<?php

require __DIR__ . '/vendor/autoload.php';

use YouTube\YouTubeDownloader;
use YouTube\Exception\YouTubeException;

$url = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // Me at the zoo

echo "Testing URL: $url\n";

$downloader = new YouTubeDownloader();
$downloader->getBrowser()->setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

try {
    $links = $downloader->getDownloadLinks($url);

    echo "Status: " . ($links ? "Links found" : "No links found") . "\n";

    if ($links) {
        $formats = $links->getAllFormats();
        echo "Format count: " . count($formats) . "\n";
        foreach ($formats as $format) {
            echo " - Itag: " . $format->itag . " | Mime: " . $format->mimeType . " | URL: " . (strlen($format->url) > 50 ? substr($format->url, 0, 50) . '...' : $format->url) . "\n";
        }
    } else {
        echo "Error: No links found.\n";
    }

} catch (YouTubeException $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
