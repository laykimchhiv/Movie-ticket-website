<template>
  <aside
    :class="[
      'fixed left-0 top-0 z-50 h-screen border-r border-gray-800 bg-[#111116] transition-all duration-300',
      open
        ? 'w-64 translate-x-0'
        : '-translate-x-full w-64 lg:w-16 lg:translate-x-0'
    ]"
    aria-label="Admin navigation"
  >
    <div class="flex h-20 items-center border-b border-gray-800 px-3">
      <button
        v-if="!open"
        type="button"
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-gray-300 transition hover:bg-[#1b1b22] hover:text-white"
        aria-label="Open sidebar"
        @click="$emit('toggle')"
      >
        <Icon name="mdi:movie-open" class="text-xl" />
      </button>

      <template v-else>
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600">
            <Icon name="mdi:movie-open" class="text-xl text-white" />
          </div>
          <div class="min-w-0">
            <h1 class="truncate text-lg font-bold">Flixora</h1>
            <p class="truncate text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-gray-800 bg-[#1b1b22] text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <Icon name="mdi:close" class="text-lg" />
        </button>
      </template>
    </div>

    <nav class="flex flex-col gap-2 p-3" aria-label="Admin menu">
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
          open ? 'px-4' : 'lg:justify-center lg:px-0',
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
          open ? 'px-4' : 'lg:justify-center lg:px-0',
          isActive(item.to) ? 'bg-red-600 text-white hover:bg-red-600' : 'text-gray-400'
        ]"
      >
        <Icon :name="item.icon" class="text-lg shrink-0" />
        <span v-if="open">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from '#imports'

defineProps({
  open: { type: Boolean, default: false }
})

defineEmits(['close', 'toggle'])

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
