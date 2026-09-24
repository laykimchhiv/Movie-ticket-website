<template>
  <div class="flex items-center gap-2">
    <!-- Notification -->
    <button class="relative w-10 h-10 rounded-xl bg-[#15151c] border border-gray-800 hover:border-gray-700 flex items-center justify-center">
      <Icon name="mdi:bell" />
    </button>

    <!-- Admin Profile -->
    <div class="relative flex items-center">
      <button @click="showProfileDropdown = !showProfileDropdown" class="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[#1b1b22] transition cursor-pointer">
        <div class="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-semibold">
          {{ user?.username?.charAt(0).toUpperCase() || 'A' }}
        </div>
        <div class="hidden md:block text-left">
          <span class="text-sm font-medium text-white">{{ user?.username || 'admin' }}</span>
          <span class="block text-xs text-gray-500">administrator</span>
        </div>
        <Icon name="mdi:chevron-down" class="text-gray-500 text-lg transition-transform" :class="showProfileDropdown ? 'rotate-180' : ''" />
      </button>

      <!-- Dropdown -->
      <div v-if="showProfileDropdown" class="absolute top-full right-0 mt-2 w-48 bg-[#15151c] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
        <button @click="switchToUserView" class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-[#1b1b22] hover:text-white transition flex items-center gap-2">
          <Icon name="mdi:account-switch" class="text-lg" />
          Switch to User View
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, navigateTo } from '#imports'

const { user, switchRole } = useAuth()

const route = useRoute()
const showProfileDropdown = ref(false)

const switchToUserView = () => {
  switchRole('user')
  showProfileDropdown.value = false
  navigateTo('/')
}
</script>