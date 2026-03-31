<?php

namespace App\Http\Controllers;

class MainController extends Controller
{
    public function work()
    {
        return view('app.work');
    }

    public function info()
    {
        return view('app.info');
    }


    public function index()
    {
        return view('app.index');
    }

    public function lab()
    {
        return view('app.lab');
    }
}
