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
