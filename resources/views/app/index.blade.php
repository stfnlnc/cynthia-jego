@extends('base')
@section('head')
@if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
@vite(['resources/js/lab.js'])
@endif
@endsection

@section('content')

@endsection
