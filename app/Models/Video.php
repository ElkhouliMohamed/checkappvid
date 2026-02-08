<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'url',
        'file_path',
        'status',
        'report_json',
        'model',
    ];

    protected $casts = [
        'report_json' => 'array',
    ];
}
