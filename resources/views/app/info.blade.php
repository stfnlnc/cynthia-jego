@extends('base')
@section('head')
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/js/info.js'])
    @endif
@endsection

@section('content')
    <div id="clickable" class="w-full h-svh inline-flex items-center cursor-pointer">
        <div class="fixed top-0 left-0 grid grid-cols-12 z-1 w-full h-svh">
            <div class="col-span-4"></div>
            <img id="clickable-reveal" class="my-auto col-span-4 blur-xl opacity-15 transition-all duration-1000 ease-in-out"
                src="{{ asset('images/cynthia.png') }}" alt="">
            <div class="col-span-4"></div>
        </div>
        <div id="clickable-remove"
            class="grid grid-cols-12 my-auto w-full relative z-99 transition-opacity duration-1000 ease-in-out">
            <div class="col-span-4 px-2.5">
                Independent brand and web designer based in France, working worldwide.
                <br><br>
                I studied cultural mediation before turning to design and that background never left me. It shapes the way I
                approach every project : with the conviction that great design is never just aesthetic. It's a bridge
                between a
                creative's work and the people it's meant to reach.
                <br><br>
                For the past 7 years, I've been designing brand identities and digital experiences for creative
                professionals.
                Photographers, architects, designers, filmmakers… People who care deeply about how their work is perceived.
                My approach is minimal, typographic, and immersive. I believe every detail matters. From the shape of a
                letter
                to the timing of a transition.
                <br><br>
                I don't take on every project. I take on the right ones.
            </div>
            <div class="col-span-3"></div>
            <div class="col-span-2 px-1.25 flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <div class="text-mid-grey">Contact</div>
                    <div class="flex flex-col">
                        <a href="">Email</a>
                        <a href="">Instagram</a>
                        <a href="">LinkedIn</a>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-mid-grey">Services</div>
                    <div class="flex flex-col">
                        <div>Arti Direction</div>
                        <div>Brand Strategy</div>
                        <div>Visual Identity</div>
                        <div>Typographic Logo</div>
                        <div>Visual System</div>
                        <div>Digital Design</div>
                        <div>Web & Ecommerce</div>
                        <div>UX/UI Design</div>
                        <div>Web Development</div>
                    </div>
                </div>
            </div>
            <div class="col-span-2 px-1.25 flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <div class="text-mid-grey">Awards & Recognition</div>
                    <div class="flex flex-col">
                        <a href="">Email</a>
                        <a href="">Instagram</a>
                        <a href="">LinkedIn</a>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="text-mid-grey">Services</div>
                    <div class="flex flex-col">
                        <div>Arti Direction</div>
                        <div>Brand Strategy</div>
                        <div>Visual Identity</div>
                        <div>Typographic Logo</div>
                        <div>Visual System</div>
                        <div>Digital Design</div>
                        <div>Web & Ecommerce</div>
                        <div>UX/UI Design</div>
                        <div>Web Development</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
@endsection
