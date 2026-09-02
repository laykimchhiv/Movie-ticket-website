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
        <h1 class="font-bold text-lg">MovieFlix</h1>
        <p class="text-xs text-gray-500">Admin Panel</p>
      </div>
      <button
        @click="$emit('close')"
        class="ml-auto lg:hidden text-gray-400 hover:text-white"
      >
        <Icon name="mdi:close" />
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

    <!-- Admin Profile -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1b1b22] transition">
        <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">Admin</p>
          <p class="text-xs text-gray-500 truncate">admin@movieflix.com</p>
        </div>
        <button class="text-gray-500 hover:text-white">
          <Icon name="mdi:dots-vertical" />
        </button>
      </div>
    </div>
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
  { label: 'Categories', icon: 'mdi:tag', to: '#' },
  { label: 'Users', icon: 'mdi:account-group', to: '#' }
]

const systemMenu = [
  { label: 'Settings', icon: 'mdi:cog', to: '#' }
]
</script>