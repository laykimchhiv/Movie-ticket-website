<script setup>
defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

</script>

<template>
  <div
    class="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#15151b] transition duration-300 hover:-translate-y-2 hover:border-red-500/50"
  >
    <!-- Poster -->
    <div class="relative aspect-3/4 overflow-hidden">
      <img
        :src="movie.image"
        :alt="movie.title"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <!-- Rating -->
      <div
        class="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold backdrop-blur"
      >
        ⭐ {{ movie.rating }}
      </div>
    </div>

    <!-- Movie Info -->
    <div class="p-4">
      <h3 class="truncate font-semibold text-white">
        {{ movie.title }}
      </h3>

      <p class="mt-1 truncate text-xs text-gray-500">
        {{ movie.genre }}
      </p>
    </div>
  </div>
</template>