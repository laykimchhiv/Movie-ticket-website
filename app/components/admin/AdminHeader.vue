<template>
  <header
    class="h-20 sticky top-0 z-30 bg-[#0b0b0f]/90 backdrop-blur-xl
           border-b border-gray-800"
  >
    <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

      <!-- Left: Menu Buttons + Flixora Branding -->
      <div class="flex items-center gap-3 ml-3">

        <!-- Desktop menu -->
        <button
          type="button"
          @click="$emit('toggle')"
          class="hidden lg:flex w-10 h-10 rounded-lg bg-[#15151c]
                 border border-gray-800 text-gray-300 hover:text-white
                 hover:border-red-500/40 hover:bg-red-500/10
                 items-center justify-center transition"
          aria-label="Toggle sidebar"
        >
          <Icon name="mdi:menu" class="text-lg" />
        </button>

        <!-- Mobile menu -->
        <button
          type="button"
          @click="$emit('toggle')"
          class="lg:hidden w-10 h-10 rounded-lg bg-[#15151c]
                 border border-gray-800 text-gray-300 flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <Icon name="mdi:menu" class="text-lg" />
        </button>

        <!-- Flixora Branding -->
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600">
            <Icon name="mdi:movie-open" class="text-xl text-white" />
          </div>
          <div class="min-w-0">
            <h1 class="truncate text-lg font-bold">Flixora</h1>
            <p class="truncate text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <!-- Right side (page-specific content via slot) -->
      <div class="flex items-center gap-3 ml-auto">
        <slot />
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle'])
</script>
