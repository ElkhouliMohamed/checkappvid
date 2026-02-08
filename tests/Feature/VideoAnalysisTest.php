<?php

use App\Models\User;
use App\Models\Video;
use App\Jobs\ProcessVideo;
use Illuminate\Support\Facades\Queue;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authenticated user can submit video for analysis', function () {
    Queue::fake();

    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('videos.store'), [
            'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('videos', [
        'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'user_id' => $user->id,
        'status' => 'pending',
    ]);

    Queue::assertPushed(ProcessVideo::class);
});

test('guest cannot submit video', function () {
    $response = $this->post(route('videos.store'), [
        'url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    ]);

    $response->assertRedirect(route('login'));
});
