<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Jobs\ProcessVideo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'videos' => Video::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required_without:file|url|nullable',
            'file' => 'required_without:url|file|mimetypes:video/mp4,video/quicktime|nullable',
        ]);

        $url = $validated['url'] ?? null;

        // Caching: Check if we already analyzed this URL successfully
        if ($url) {
            $cachedVideo = Video::where('url', $url)
                ->where('status', 'completed')
                ->latest()
                ->first();

            if ($cachedVideo) {
                return redirect()->route('videos.show', $cachedVideo->id);
            }
        }

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('videos');
        }

        $video = Video::create([
            'user_id' => auth()->id(), // nullable if no auth
            'url' => $url,
            'file_path' => $path,
            'title' => $url ?? $request->file('file')->getClientOriginalName(),
            'status' => 'pending',
            'model' => $request->input('model', 'gemini-1.5-flash'),
        ]);

        // Pass API key if provided, otherwise the job will use .env
        $apiKey = $request->input('api_key');

        ProcessVideo::dispatch($video, $apiKey);

        return redirect()->route('videos.show', $video->id);
    }

    public function show(Video $video)
    {
        return Inertia::render('Video/Show', [
            'video' => $video
        ]);
    }

    public function destroy(Video $video)
    {
        // Delete associated file if it exists
        if ($video->file_path && \Illuminate\Support\Facades\Storage::exists($video->file_path)) {
            \Illuminate\Support\Facades\Storage::delete($video->file_path);
        }

        $video->delete();

        return redirect()->route('dashboard');
    }
}
