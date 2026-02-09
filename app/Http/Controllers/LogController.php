<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $logFile = storage_path('logs/laravel.log');
        $logs = [];

        if (File::exists($logFile)) {
            $fileContent = File::get($logFile);
            $lines = explode("\n", $fileContent);
            $lines = array_reverse($lines); // Show newest first
            $lines = array_slice($lines, 0, 1000); // Limit to last 1000 lines

            foreach ($lines as $line) {
                if (trim($line) === '') {
                    continue;
                }

                // Simple regex to parse default Laravel logs
                // [2024-05-18 12:00:00] local.ERROR: Message {"context":...}
                if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.*)/', $line, $matches)) {
                    $logs[] = [
                        'date' => $matches[1],
                        'env' => $matches[2],
                        'level' => $matches[3],
                        'message' => $matches[4],
                        'raw' => $line,
                    ];
                } else {
                    // unexpected format, just show raw
                    $logs[] = [
                        'date' => '',
                        'env' => '',
                        'level' => 'INFO', // default
                        'message' => $line,
                        'raw' => $line,
                    ];
                }
            }
        }

        return Inertia::render('Logs/Index', [
            'logs' => $logs,
        ]);
    }
}
