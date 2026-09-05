<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-screen w-64 bg-[#111116] border-r border-gray-800 transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="h-20 flex items-center px-6 border-b border-gray-800">
      <div class="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center mr-3">
        <Icon name="mdi:movie-open" class="text-xl text-white" />
      </div>
      <div>
        <h1 class="font-bold text-lg">Flixora</h1>
        <p class="text-xs text-gray-500">Admin Panel</p>
      </div>
      <button
        @click="$emit('close')"
        class="ml-auto lg:hidden w-10 h-10 rounded-xl bg-[#1b1b22]
               border border-gray-800 text-gray-400 hover:text-white
               hover:border-red-500/40 hover:bg-red-500/10
               flex items-center justify-center transition"
      >
        <Icon name="mdi:close" class="text-lg" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-2">
      <p class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
        Main Menu
      </p>

      <NuxtLink
        v-for="item in mainMenu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#1b1b22] hover:text-white transition"
        active-class="bg-red-600 text-white hover:bg-red-600 hover:text-white"
      >
        <Icon :name="item.icon" class="text-lg shrink-0" />
        <span :class="item.label === 'Dashboard' ? 'font-medium' : ''">
          {{ item.label }}
        </span>
      </NuxtLink>

      <p class="px-3 pt-6 pb-2 text-xs font-semibold text-gray-500 uppercase">
        System
      </p>

      <NuxtLink
        v-for="item in systemMenu"
        :key="item.label"
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#1b1b22] hover:text-white transition"
        active-class="bg-red-600 text-white hover:bg-red-600 hover:text-white"
      >
        <Icon :name="item.icon" class="text-lg shrink-0" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false }
})
defineEmits(['close'])

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