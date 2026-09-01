<script setup lang="ts">
import { ref } from 'vue'
const { isLoggedIn } = useAuth()
const showLogin = ref(false)

const handleMovieClick = (movie: any) => {
  if (!isLoggedIn.value) {
    showLogin.value = true
    return
  }
  navigateTo(`/watch/${movie.id}`)
}

const movies = ref([
    {
        id: 1,
        title: 'Avengers: Endgame',
        genre: 'Action • Adventure',
        rating: '8.4',
        image:
            'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    },
    {
        id: 2,
        title: 'Spider-Man: No Way Home',
        genre: 'Action • Sci-Fi',
        rating: '8.2',
        image:
            'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    },
    {
        id: 14,
        title: 'The Batman',
        genre: 'Action • Crime',
        rating: '7.8',
        image:
            'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    },
    {
        id: 17,
        title: 'Top Gun: Maverick',
        genre: 'Action • Drama',
        rating: '8.3',
        image:
            'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    },
    {
        id: 15,
        title: 'Dune',
        genre: 'Sci-Fi • Adventure',
        rating: '8.0',
        image:
            'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    },
    {
        id: 16,
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
                        class="mb-5 inline-flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        Now Showing
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
                            class="inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3.5 font-semibold transition hover:bg-red-700 hover:scale-105">
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Book Ticket
                        </button>

                        <button
                            class="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white/20">
                            Explore Movies
                        </button>

                    </div>

                    <div class="mt-8 flex gap-6 text-sm text-gray-400">
                        <span class="inline-flex items-center gap-1">
                            <svg class="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            8.4 Rating
                        </span>
                        <span class="inline-flex items-center gap-1">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            Action
                        </span>
                        <span class="inline-flex items-center gap-1">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            2h 30m
                        </span>
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
                @click="handleMovieClick"
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
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
                        <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
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
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
                        <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
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
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
                        <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
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
                        class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10">
                        <svg class="h-7 w-7 text-red-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
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
                                    <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
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
    <UserLogin v-if="showLogin" @close="showLogin = false" />
</template>
