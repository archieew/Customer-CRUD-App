<?php

use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return phpinfo();
});

Route::get('/', function () {
    return view('welcome');
});
