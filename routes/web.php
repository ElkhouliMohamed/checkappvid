<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [\App\Http\Controllers\VideoController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::post('/videos', [\App\Http\Controllers\VideoController::class, 'store'])->name('videos.store');
Route::get('/videos/{video}', [\App\Http\Controllers\VideoController::class, 'show'])->name('videos.show');
Route::delete('/videos/{video}', [\App\Http\Controllers\VideoController::class, 'destroy'])->name('videos.destroy');

Route::post('/videos/{video}/retry', [\App\Http\Controllers\VideoController::class, 'retry'])->name('videos.retry');
Route::post('/videos/{video}/cancel', [\App\Http\Controllers\VideoController::class, 'cancel'])->name('videos.cancel');

Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index']);

Route::get('/logs', [\App\Http\Controllers\LogController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('logs.index');

require __DIR__ . '/settings.php';
