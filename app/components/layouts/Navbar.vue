<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#imports'
import { useAuth } from '~/composables/useAuth'

const mobileMenu = ref(false)
const showLogin = ref(false)
const showProfileDropdown = ref(false)
const { user, isLoggedIn, isLoaded, logout } = useAuth()
const route = useRoute()

const isActive = (path: string) => route.path === path

const handleLogout = () => {
  logout()
}

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const closeProfileDropdown = () => {
  showProfileDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.profile-dropdown-container')) {
    closeProfileDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<header class="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur-xl">

		<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
			<a href="#" class="flex items-center gap-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
					<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
					</svg>
				</div>

				<span class="text-xl font-bold text-white">
					Fli<span class="text-red-500">xora</span>
				</span>
			</a>

			<nav class="hidden items-center gap-8 md:flex">
				<NuxtLink to="/" :class="['text-sm font-medium transition', isActive('/') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Home</NuxtLink>
				<NuxtLink to="/movie" :class="['text-sm font-medium transition', isActive('/movie') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Movies</NuxtLink>
				<NuxtLink to="/watchlist" :class="['text-sm font-medium transition', isActive('/watchlist') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Watchlist</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium transition', isActive('/about') ? 'text-red-400' : 'text-gray-400 hover:text-white']">About</NuxtLink>
			</nav>

			<div class="hidden items-center gap-4 md:flex">
			<template v-if="isLoaded && isLoggedIn">
			<div class="relative profile-dropdown-container">
				<button
					class="flex items-center gap-1.5 rounded-full p-1 transition hover:bg-white/5"
					@click="toggleProfileDropdown"
					aria-label="Open profile menu"
					:aria-expanded="showProfileDropdown"
					aria-haspopup="true"
				>
					<img :src="user?.avatar" :alt="user?.username" class="h-9 w-9 rounded-full border border-white/10 hover:border-red-500/50 transition-colors" />
				</button>
				
				<div v-if="showProfileDropdown" class="absolute right-0 mt-2 w-56 rounded-xl bg-[#111116] border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
					<!-- User Info Header -->
					<div class="px-4 py-3 border-b border-white/10">
						<p class="text-sm font-medium text-white truncate">{{ user?.username }}</p>
						<p class="text-xs text-gray-500 truncate mt-0.5">{{ user?.email }}</p>
					</div>
					
					<!-- Menu Items -->
					<NuxtLink
						to="/profile"
						class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
						@click="closeProfileDropdown"
					>
						<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Profile
					</NuxtLink>
					
					<div class="border-y border-white/10 my-1"></div>
					
					<button
						class="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white hover:text-red-400 transition-colors"
						@click="handleLogout"
					>
						<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Logout
					</button>
				</div>
			</div>
			</template>

			<template v-else-if="isLoaded && !isLoggedIn">
				<button
					class="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-700"
					@click="showLogin = true"
				>
					Login
				</button>
			</template>
			</div>

			<button
				class="md:hidden"
				aria-label="Toggle navigation menu"
				@click="mobileMenu = !mobileMenu"
			>
				<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>

		<div v-if="mobileMenu" class="border-t border-white/10 bg-[#111116] px-5 py-5 md:hidden">
			<div class="flex flex-col gap-4">
				<NuxtLink to="/" :class="['text-sm font-medium', isActive('/') ? 'text-red-400' : 'text-gray-300']">Home</NuxtLink>
				<NuxtLink to="/movie" :class="['text-sm font-medium', isActive('/movie') ? 'text-red-400' : 'text-gray-300']">Movies</NuxtLink>
				<NuxtLink to="/watchlist" :class="['text-sm font-medium', isActive('/watchlist') ? 'text-red-400' : 'text-gray-300']">Watchlist</NuxtLink>
				<NuxtLink to="/coming" :class="['text-sm font-medium', isActive('/coming') ? 'text-red-400' : 'text-gray-300']">Coming Soon</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium', isActive('/about') ? 'text-red-400' : 'text-gray-300']">About</NuxtLink>
				<NuxtLink to="/profile" :class="['text-sm font-medium', isActive('/profile') ? 'text-red-400' : 'text-gray-300']">Profile</NuxtLink>
			<template v-if="isLoaded && isLoggedIn">
				<NuxtLink to="/profile" class="text-gray-300">My Profile</NuxtLink>
				<button class="rounded-lg bg-red-600 py-3 font-semibold text-left text-red-400" @click="handleLogout">Logout</button>
			</template>
			<template v-else-if="isLoaded && !isLoggedIn">
				<button class="rounded-lg bg-red-600 py-3 font-semibold" @click="showLogin = true">Login</button>
			</template>
			</div>
		</div>
	</header>

	<UserLogin v-if="showLogin" @close="showLogin = false" />
</template>
