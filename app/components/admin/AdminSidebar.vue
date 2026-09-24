<template>
  <aside
    :class="[
      'fixed left-0 top-0 z-50 h-screen border-r border-gray-800 bg-[#111116] transition-all duration-300 w-72',
      open ? 'translate-x-0' : '-translate-x-full'
    ]"
    aria-label="Admin navigation"
  >
    <div class="flex flex-col h-full ml-6 mt-4">
      <!-- Left: Menu Buttons + Flixora Branding -->
      <div class="flex items-center gap-3 ml-5 mt-">

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

      <hr class="border-gray-800 mt-5" />

      <nav class="flex-1 flex flex-col gap-2 p-3 overflow-y-auto" aria-label="Admin menu">
        <p
          v-if="open"
          class="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          Main Menu
        </p>

      <NuxtLink
        v-for="item in mainMenu"
        :key="item.label"
        :to="item.to"
        :title="item.label"
        :class="[
          'flex h-11 w-full items-center gap-3 rounded-xl px-3 transition hover:bg-[#1b1b22] hover:text-white',
          open ? 'px-4' : 'justify-center px-0',
          isActive(item.to) ? 'bg-red-600 text-white hover:bg-red-600' : 'text-gray-400'
        ]"
      >
        <Icon :name="item.icon" class="text-lg shrink-0" />
        <span v-if="open">{{ item.label }}</span>
      </NuxtLink>

      <p
        v-if="open"
        class="px-3 pt-6 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        System
      </p>

      <NuxtLink
        v-for="item in systemMenu"
        :key="item.label"
        :to="item.to"
        :title="item.label"
        :class="[
          'flex h-11 w-full items-center gap-3 rounded-xl px-3 transition hover:bg-[#1b1b22] hover:text-white',
          open ? 'px-4' : 'justify-center px-0',
          isActive(item.to) ? 'bg-red-600 text-white hover:bg-red-600' : 'text-gray-400'
        ]"
      >
        <Icon :name="item.icon" class="text-lg shrink-0" />
        <span v-if="open">{{ item.label }}</span>
      </NuxtLink>
</nav>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from '#imports'

defineProps({
  open: { type: Boolean, default: false }
})

defineEmits(['toggle'])

const route = useRoute()

const isActive = (path) => route.path === path

const mainMenu = [
  { label: 'Dashboard', icon: 'mdi:view-dashboard', to: '/admin/dashboard' },
  { label: 'Movies', icon: 'mdi:movie', to: '/admin/movies' },
  { label: 'Categories', icon: 'mdi:tag', to: '/admin/category' },
  { label: 'Users', icon: 'mdi:account-group', to: '/admin/users' }
]

const systemMenu = [
  { label: 'Settings', icon: 'mdi:cog', to: '/admin/settings' }
]
</script>
