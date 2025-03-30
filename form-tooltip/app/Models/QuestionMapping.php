<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'question',
        'synonyms',
    ];

    protected $casts = [
        'synonyms' => 'array'
    ];
}
