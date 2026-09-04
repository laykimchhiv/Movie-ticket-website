```vue
<template>
  <div class="min-h-screen bg-[#0b0b0f] text-white">

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-b from-red-950/30 via-[#0b0b0f]/80 to-[#0b0b0f]"
      ></div>

      <div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-28 text-center mt-40">
        <p class="text-red-500 font-semibold uppercase tracking-[0.25em] text-sm mb-5">
          About Our Platform
        </p>

        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 ">
          Your Next Movie
          <span class="text-red-500"> Awaits.</span>
        </h1>

        <p class="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed">
          Discover amazing movies, explore different genres, and enjoy
          your favorite stories in one simple and beautiful place.
        </p>

        <div class="mt-8 flex justify-center gap-4">
          <NuxtLink
            to="/movie"
            class="px-7 py-3 rounded-lg bg-red-600 hover:bg-red-700
                   transition font-semibold"
          >
            Browse Movies
          </NuxtLink>

          <NuxtLink
            to="/"
            class="px-7 py-3 rounded-lg border border-gray-700
                   hover:bg-white/5 transition font-semibold"
          >
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About -->
    <section class="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div class="grid lg:grid-cols-2 gap-14 items-center">

        <!-- Visual -->
        <div
          class="relative h-[380px] rounded-2xl overflow-hidden
                 border border-gray-800 bg-gradient-to-br
                 from-red-950/50 to-gray-950"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div
                class="w-20 h-20 mx-auto mb-6 rounded-full
                       bg-red-600/20 border border-red-500/30
                       flex items-center justify-center"
              >
                <span class="text-3xl">▶</span>
              </div>

              <h3 class="text-2xl font-bold">MovieStream</h3>
              <p class="text-gray-500 mt-2">
                Entertainment made simple.
              </p>
            </div>
          </div>
        </div>

        <!-- Text -->
        <div>
          <p class="text-red-500 font-semibold uppercase tracking-wider text-sm mb-3">
            Who We Are
          </p>

          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Made for people who love movies.
          </h2>

          <p class="text-gray-400 leading-7 mb-5">
            MovieStream is a movie-watching platform designed to make
            discovering entertainment simple, enjoyable, and convenient.
          </p>

          <p class="text-gray-400 leading-7 mb-5">
            Whether you're looking for action, comedy, romance, drama,
            science fiction, or something completely different, you can
            explore movies and find your next favorite story.
          </p>

          <p class="text-gray-400 leading-7">
            Our goal is to create a clean and easy-to-use experience
            where movie lovers can spend less time searching and more
            time enjoying movies.
          </p>
        </div>

      </div>
    </section>

    <!-- Features -->
    <section class="border-y border-gray-800 bg-[#0d0d12]">
      <div class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

        <div class="text-center mb-14">
          <p class="text-red-500 font-semibold uppercase tracking-wider text-sm mb-3">
            What We Offer
          </p>

          <h2 class="text-3xl md:text-4xl font-bold">
            Everything you need for movie discovery
          </h2>

          <p class="text-gray-500 mt-4 max-w-2xl mx-auto">
            Explore movies with features designed to make your
            entertainment experience better.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <!-- Card 1 -->
          <div
            class="p-7 rounded-2xl border border-gray-800
                   bg-[#111116] hover:border-red-500/40
                   transition"
          >
            <div
              class="w-12 h-12 rounded-xl bg-red-500/10
                     flex items-center justify-center text-red-500
                     text-xl mb-5"
            >
              <Icon name="mdi:movie-open" class="text-xl text-red-500" />
            </div>

            <h3 class="text-lg font-semibold mb-3">
              Discover Movies
            </h3>

            <p class="text-gray-500 text-sm leading-6">
              Find movies from different genres and discover
              something new to watch.
            </p>
          </div>

          <!-- Card 2 -->
          <div
            class="p-7 rounded-2xl border border-gray-800
                   bg-[#111116] hover:border-red-500/40
                   transition"
          >
            <div
              class="w-12 h-12 rounded-xl bg-red-500/10
                     flex items-center justify-center text-red-500
                     text-xl mb-5"
            >
              <Icon name="mdi:magnify" class="text-xl text-red-500" />
            </div>

            <h3 class="text-lg font-semibold mb-3">
              Easy Search
            </h3>

            <p class="text-gray-500 text-sm leading-6">
              Quickly search for your favorite movies and
              find detailed information.
            </p>
          </div>

          <!-- Card 3 -->
          <div
            class="p-7 rounded-2xl border border-gray-800
                   bg-[#111116] hover:border-red-500/40
                   transition"
          >
            <div
              class="w-12 h-12 rounded-xl bg-red-500/10
                     flex items-center justify-center text-red-500
                     text-xl mb-5"
            >
              <Icon name="mdi:heart" class="text-xl text-red-500" />
            </div>

            <h3 class="text-lg font-semibold mb-3">
              Watchlist
            </h3>

            <p class="text-gray-500 text-sm leading-6">
              Save movies you want to watch later and keep
              your favorites organized.
            </p>
          </div>

          <!-- Card 4 -->
          <div
            class="p-7 rounded-2xl border border-gray-800
                   bg-[#111116] hover:border-red-500/40
                   transition"
          >
            <div
              class="w-12 h-12 rounded-xl bg-red-500/10
                     flex items-center justify-center text-red-500
                     text-xl mb-5"
            >
              <Icon name="mdi:cellphone" class="text-xl text-red-500" />
            </div>

            <h3 class="text-lg font-semibold mb-3">
              Responsive Design
            </h3>

            <p class="text-gray-500 text-sm leading-6">
              Enjoy a clean experience across desktop,
              tablet, and mobile devices.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="max-w-7xl mx-auto px-6 lg:px-8 py-20">

      <div class="text-center mb-14">
        <p class="text-red-500 font-semibold uppercase tracking-wider text-sm mb-3">
          Why Choose Us
        </p>

        <h2 class="text-3xl md:text-4xl font-bold">
          Simple. Fast. Enjoyable.
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">

        <div class="text-center">
          <div class="text-4xl font-bold text-red-500 mb-3">
            01
          </div>

          <h3 class="text-xl font-semibold mb-3">
            Simple Experience
          </h3>

          <p class="text-gray-500 leading-6">
            A clean interface makes it easy to browse,
            search, and discover movies.
          </p>
        </div>

        <div class="text-center">
          <div class="text-4xl font-bold text-red-500 mb-3">
            02
          </div>

          <h3 class="text-xl font-semibold mb-3">
            Huge Variety
          </h3>

          <p class="text-gray-500 leading-6">
            Explore different genres and find movies
            that match your mood.
          </p>
        </div>

        <div class="text-center">
          <div class="text-4xl font-bold text-red-500 mb-3">
            03
          </div>

          <h3 class="text-xl font-semibold mb-3">
            Built for Movie Fans
          </h3>

          <p class="text-gray-500 leading-6">
            Everything is designed around making
            movie discovery more enjoyable.
          </p>
        </div>

      </div>
    </section>

    <!-- Stats -->
    <section class="border-y border-gray-800 bg-[#0d0d12] mt-10 mb-10">
      <div class="max-w-5xl mx-auto px-6 py-16">

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <div>
            <p class="text-3xl md:text-4xl font-bold">
              500+
            </p>
            <p class="text-gray-500 mt-2 text-sm">
              Movies
            </p>
          </div>

          <div>
            <p class="text-3xl md:text-4xl font-bold">
              20+
            </p>
            <p class="text-gray-500 mt-2 text-sm">
              Genres
            </p>
          </div>

          <div>
            <p class="text-3xl md:text-4xl font-bold">
              24/7
            </p>
            <p class="text-gray-500 mt-2 text-sm">
              Entertainment
            </p>
          </div>

          <div>
            <p class="text-3xl md:text-4xl font-bold text-red-500">
              ∞
            </p>
            <p class="text-gray-500 mt-2 text-sm">
              Stories
            </p>
          </div>

        </div>
      </div>
    </section>


    <!-- Footer -->
    <footer class="border-t border-gray-800">
      <div
        class="max-w-7xl mx-auto px-6 lg:px-8 py-8
               flex flex-col md:flex-row justify-center
               items-center gap-4"
      >
        <p class="text-gray-500 text-sm ">
          © 2026 MovieStream. All rights reserved.
        </p>

      </div>
    </footer>

  </div>
</template>
```
