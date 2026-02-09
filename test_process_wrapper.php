<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Process;


// Mocking Log
class Log
{
    public static function info($msg, $ctx = [])
    {
        echo "[INFO] $msg " . json_encode($ctx) . "\n";
    }
    public static function error($msg, $ctx = [])
    {
        echo "[ERROR] $msg " . json_encode($ctx) . "\n";
    }
}

class VideoAnalysisServiceTest
{
    protected function getYtDlpBinary(): string
    {
        $localWin = __DIR__ . '/storage/bin/yt-dlp.exe';
        if (file_exists($localWin)) {
            return $localWin;
        }
        return 'yt-dlp';
    }

    public function testDownload($url)
    {
        $binary = $this->getYtDlpBinary();
        echo "Binary resolved to: $binary\n";

        $outputDir = __DIR__ . '/storage/app/temp_videos';
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $outputPath = $outputDir . '/test_vid.mp4';

        $command = [
            $binary,
            '-f',
            'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
            '--no-playlist',
            '--force-overwrites',
            '-o',
            $outputPath,
            $url
        ];

        echo "Running command: " . implode(' ', $command) . "\n";

        // We can't use Facades easily outside app, but we can use Symfony Process directly
        $process = new \Symfony\Component\Process\Process($command);
        $process->setTimeout(600);
        $process->run(function ($type, $buffer) {
            echo $buffer;
        });

        if (!$process->isSuccessful()) {
            echo "Failed: " . $process->getErrorOutput() . "\n";
        } else {
            echo "Success! File at: $outputPath\n";
            echo "Size: " . filesize($outputPath) . " bytes\n";
        }
    }
}

$test = new VideoAnalysisServiceTest();
$test->testDownload('https://www.youtube.com/watch?v=jNQXAC9IVRw');
