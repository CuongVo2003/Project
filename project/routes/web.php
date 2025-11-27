<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('auth.auth');
});
Route::get('/{any}', function () {
    return view('auth.auth');
})->where('any', '^(?!api).*$');
