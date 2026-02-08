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

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('videos');
        }

        $video = Video::create([
            'user_id' => auth()->id(), // nullable if no auth
            'url' => $validated['url'] ?? null,
            'file_path' => $path,
            'title' => $validated['url'] ?? $request->file('file')->getClientOriginalName(),
            'status' => 'pending',
            'model' => $request->input('model', 'gemini-1.5-flash'),
        ]);

        ProcessVideo::dispatch($video);

        return redirect()->route('videos.show', $video->id);
    }

    public function show(Video $video)
    {
        return Inertia::render('Video/Show', [
            'video' => $video
        ]);
    }
}
