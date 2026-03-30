<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif
    @yield('head')
</head>

<body class="font-display">
    <header class="p-2.5 fixed top-0 left-0 w-full grid grid-cols-12">
        <a class="text-black hover:text-mid-grey transition-colors duration-500 col-span-2" href="">Cynthia
            Jego</a>
        <nav class="inline-flex gap-0.5 col-span-7">
            <a @class([
                'transition-colors duration-500',
                'text-black hover:text-mid-grey' => request()->routeIs('work'),
                'text-mid-grey hover:text-black' => !request()->routeIs('work'),
            ]) href="">Work,</a>
            <a @class([
                'transition-colors duration-500',
                'text-black hover:text-mid-grey' => request()->routeIs('infos'),
                'text-mid-grey hover:text-black' => !request()->routeIs('infos'),
            ]) href="">Infos,</a>
            <a @class([
                'transition-colors duration-500',
                'text-black hover:text-mid-grey' => request()->routeIs('index'),
                'text-mid-grey hover:text-black' => !request()->routeIs('index'),
            ]) href="">Index,</a>
            <a @class([
                'transition-colors duration-500',
                'text-black hover:text-mid-grey' => request()->routeIs('lab'),
                'text-mid-grey hover:text-black' => !request()->routeIs('lab'),
            ]) href="{{ route('lab') }}">Lab</a>
        </nav>
        <a class="text-mid-grey hover:text-black transition-colors duration-500 col-span-3"
            href="">hello@cynthiajego.com</a>
    </header>
    <main>
        @yield('content')
    </main>
</body>

</html>
