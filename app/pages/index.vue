<script setup lang="ts">
import { ref } from 'vue'

const movies = ref([
    {
        title: 'Avengers: Endgame',
        genre: 'Action • Adventure',
        rating: '8.4',
        image:
            'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    },
    {
        title: 'Spider-Man: No Way Home',
        genre: 'Action • Sci-Fi',
        rating: '8.2',
        image:
            'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    },
    {
        title: 'The Batman',
        genre: 'Action • Crime',
        rating: '7.8',
        image:
            'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    },
    {
        title: 'Top Gun: Maverick',
        genre: 'Action • Drama',
        rating: '8.3',
        image:
            'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    },
    {
        title: 'Dune',
        genre: 'Sci-Fi • Adventure',
        rating: '8.0',
        image:
            'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
    {
        title: 'Inside Out 2',
        genre: 'Animation • Family',
        rating: '7.6',
        image:
            'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    },
])

const comingSoon = ref([
    {
        title: 'Avatar: The Way of Water',
        date: 'Coming Soon',
        image:
            'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    },
    {
        title: 'Guardians of the Galaxy Vol. 3',
        date: 'Coming Soon',
        image:
            'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
    },
    {
        title: 'Black Panther',
        date: 'Coming Soon',
        image:
            'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    },
    {
        title: 'John Wick',
        date: 'Coming Soon',
        image:
            'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    },
])

const search = ref('')

const filteredMovies = () => {
  if (!search.value) return movies.value

  return movies.value.filter((movie) =>
    movie.title.toLowerCase().includes(search.value.toLowerCase())
  )
}

const handleBook = (movie: any) => {
  console.log('Booking:', movie.title)
}
</script>

<template>
    <div class="min-h-screen bg-[#0b0b0f] text-white">

        <Navbar v-model:search="search" />

        <!-- ================= HERO ================= -->
        <section class="relative min-h-162.5 overflow-hidden pt-20">

            <!-- Background -->
            <img src="https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg"
                alt="Cinematic desert landscape from Dune" class="absolute inset-0 h-full w-full object-cover" />

            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-linear-to-r from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent"></div>

            <div class="relative mx-auto flex min-h-142.5 max-w-7xl items-center px-5 lg:px-8">

                <div class="max-w-2xl">

                    <span
                        class="mb-5 inline-block rounded-full bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400">
                        🔥 Now Showing
                    </span>

                    <h1 class="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
                        Experience Movies
                        <span class="text-red-500">Like Never Before.</span>
                    </h1>

                    <p class="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
                        Discover the latest movies, choose your favorite seats,
                        and book your cinema tickets easily with CineBook.
                    </p>

                    <div class="mt-7 flex flex-wrap items-center gap-4">

                        <button
                            class="rounded-xl bg-red-600 px-7 py-3.5 font-semibold transition hover:bg-red-700 hover:scale-105">
                            🎟️ Book Ticket
                        </button>

                        <button
                            class="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white/20">
                            Explore Movies
                        </button>

                    </div>

                    <div class="mt-8 flex gap-6 text-sm text-gray-400">
                        <span>⭐ 8.4 Rating</span>
                        <span>🎬 Action</span>
                        <span>⏱ 2h 30m</span>
                    </div>

                </div>
            </div>
        </section>

        <!-- ================= NOW SHOWING ================= -->
        <section id="movies" class="mx-auto max-w-7xl px-5 py-20 lg:px-8">

            <div class="mb-10 flex items-end justify-between">

                <div>
                    <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
                        Discover
                    </p>

                    <h2 class="text-3xl font-bold sm:text-4xl">
                        Now Showing
                    </h2>
                </div>

                <button class="hidden text-sm font-medium text-red-500 hover:text-red-400 sm:block">
                    View All →
                </button>

            </div>

            <!-- Movie Grid -->
            <div class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                <UserMovieCard
                v-for="movie in filteredMovies()"
                :key="movie.title"
                :movie="movie"
                @book="handleBook"
                />
            </div>

            <!-- Empty Search -->
            <div v-if="filteredMovies().length === 0" class="py-20 text-center text-gray-500">
                No movies found.
            </div>

        </section>

        <!-- ================= COMING SOON ================= -->
        <section id="coming" class="border-y border-white/5 bg-[#101014]">

            <div class="mx-auto max-w-7xl px-5 py-20 lg:px-8">

                <div class="mb-10">
                    <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
                        Coming Soon
                    </p>

                    <h2 class="text-3xl font-bold sm:text-4xl">
                        Upcoming Movies
                    </h2>
                </div>

                <div class="grid grid-cols-2 gap-5 sm:grid-cols-4">

                    <div v-for="movie in comingSoon" :key="movie.title"
                        class="group overflow-hidden rounded-2xl bg-[#18181d]">

                        <div class="relative poster-aspect overflow-hidden">

                            <img :src="movie.image" :alt="movie.title"
                                class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

                            <div
                                class="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-gray-300 backdrop-blur">
                                {{ movie.date }}
                            </div>

                        </div>

                        <div class="p-4">
                            <h3 class="truncate font-semibold">
                                {{ movie.title }}
                            </h3>
                        </div>

                    </div>

                </div>

            </div>

        </section>

        <!-- ================= WHY CHOOSE US ================= -->
        <section id="about" class="mx-auto max-w-7xl px-5 py-20 lg:px-8">

            <div class="mb-12 text-center">

                <p class="mb-2 text-sm font-semibold uppercase tracking-wider text-red-500">
                    Why CineBook?
                </p>

                <h2 class="text-3xl font-bold sm:text-4xl">
                    Everything You Need
                </h2>

            </div>


            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                <div
                    class="rounded-2xl border border-white/10 bg-[#15151b] p-7 text-center transition hover:-translate-y-1 hover:border-red-500/30">

                    <div
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-2xl">
                        🎟️
                    </div>

                    <h3 class="font-bold">
                        Easy Booking
                    </h3>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Book your movie tickets quickly and easily.
                    </p>

                </div>

                <div
                    class="rounded-2xl border border-white/10 bg-[#15151b] p-7 text-center transition hover:-translate-y-1 hover:border-red-500/30">

                    <div
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-2xl">
                        🪑
                    </div>

                    <h3 class="font-bold">
                        Choose Your Seat
                    </h3>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Select your favorite seat before watching.
                    </p>

                </div>

                <div
                    class="rounded-2xl border border-white/10 bg-[#15151b] p-7 text-center transition hover:-translate-y-1 hover:border-red-500/30">

                    <div
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-2xl">
                        💳
                    </div>

                    <h3 class="font-bold">
                        Secure Payment
                    </h3>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Simple and secure ticket payment.
                    </p>

                </div>

                <div
                    class="rounded-2xl border border-white/10 bg-[#15151b] p-7 text-center transition hover:-translate-y-1 hover:border-red-500/30">

                    <div
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-2xl">
                        📱
                    </div>

                    <h3 class="font-bold">
                        Digital Ticket
                    </h3>

                    <p class="mt-2 text-sm leading-6 text-gray-500">
                        Get your ticket digitally after booking.
                    </p>

                </div>

            </div>

        </section>

        <!-- ================= CTA ================= -->
        <section class="px-5 pb-20">

            <div
                class="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-r from-red-700 to-red-500 px-6 py-12 text-center sm:px-12">

                <h2 class="text-3xl font-black sm:text-4xl">
                    Ready for your next movie?
                </h2>

                <p class="mx-auto mt-3 max-w-xl text-sm text-red-100 sm:text-base">
                    Find a movie you love and book your seat today.
                </p>

                <button
                    class="mt-7 rounded-xl bg-white px-7 py-3.5 font-bold text-red-600 transition hover:bg-gray-100">
                    View All Movies →
                </button>

            </div>

        </section>

        <!-- ================= FOOTER ================= -->
        <footer class="border-t border-white/10 bg-[#08080b]">

            <div class="mx-auto max-w-7xl px-5 py-12 lg:px-8">

                <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <div class="flex items-center gap-2">
                            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                                🎬
                            </div>

                            <span class="font-bold">
                                Cine<span class="text-red-500">Book</span>
                            </span>
                        </div>

                        <p class="mt-4 max-w-xs text-sm leading-6 text-gray-500">
                            Your simple and convenient movie ticket booking platform.
                        </p>
                    </div>

                    <div>
                        <h3 class="font-semibold">
                            Quick Links
                        </h3>

                        <div class="mt-4 flex flex-col gap-3 text-sm text-gray-500">
                            <a href="#" class="hover:text-white">Home</a>
                            <a href="#movies" class="hover:text-white">Movies</a>
                            <a href="#coming" class="hover:text-white">Coming Soon</a>
                            <a href="#about" class="hover:text-white">About</a>
                        </div>
                    </div>

                    <div>
                        <h3 class="font-semibold">
                            Support
                        </h3>

                        <div class="mt-4 flex flex-col gap-3 text-sm text-gray-500">
                            <a href="#" class="hover:text-white">Contact Us</a>
                            <a href="#" class="hover:text-white">FAQ</a>
                            <a href="#" class="hover:text-white">Privacy Policy</a>
                            <a href="#" class="hover:text-white">Terms</a>
                        </div>
                    </div>

                    <div>
                        <h3 class="font-semibold">
                            Follow Us
                        </h3>

                        <div class="mt-4 flex gap-3">
                            <button
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-red-600">
                                f
                            </button>

                            <button
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-red-600">
                                ◎
                            </button>

                            <button
                                class="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-red-600">
                                𝕏
                            </button>
                        </div>
                    </div>

                </div>

                <div class="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-600">
                    © 2026 CineBook. All rights reserved.
                </div>

            </div>

        </footer>

    </div>
</template>
