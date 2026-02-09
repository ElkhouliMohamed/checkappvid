<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $baseUrl = config('app.url');

        // Static pages
        $urls = [
            '/' => [
                'changefreq' => 'weekly',
                'priority' => '1.0',
                'lastmod' => date('Y-m-d')
            ],
            // Add other static public pages here if any (e.g., /pricing, /about)
        ];

        // Dynamic Video Reports
        $videos = \App\Models\Video::where('status', 'completed')
            ->latest()
            ->take(1000) // Limit to recent 1000 to avoid performance issues
            ->get();

        foreach ($videos as $video) {
            $urls['/videos/' . $video->id] = [
                'changefreq' => 'monthly',
                'priority' => '0.8',
                'lastmod' => $video->updated_at->format('Y-m-d')
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $path => $data) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . $path . '</loc>';
            $xml .= '<lastmod>' . $data['lastmod'] . '</lastmod>';
            $xml .= '<changefreq>' . $data['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $data['priority'] . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml'
        ]);
    }
}
