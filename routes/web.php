<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MainController::class, 'work'])->name('work');
Route::get('/info', [MainController::class, 'info'])->name('info');
Route::get('/index', [MainController::class, 'index'])->name('index');
Route::get('/lab', [MainController::class, 'lab'])->name('lab');
