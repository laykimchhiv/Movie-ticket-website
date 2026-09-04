<script setup lang="ts">
const mobileMenu = ref(false)
const showLogin = ref(false)
const showProfileMenu = ref(false)
const { user, isLoggedIn, logout } = useAuth()
const route = useRoute()

const isActive = (path: string) => route.path === path

const API_BASE = 'http://localhost:8000'
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showSearchDropdown = ref(false)

const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return
  await navigateTo(`/movie?q=${encodeURIComponent(q)}`)
}

const fetchSearchResults = async () => {
  const q = searchQuery.value.trim()
  if (!q) {
    searchResults.value = []
    return
  }
  try {
    const data = await $fetch<any[]>(`${API_BASE}/movies?q=${encodeURIComponent(q)}`)
    searchResults.value = data.slice(0, 6)
  } catch {
    searchResults.value = []
  }
}

watch(
  () => searchQuery.value,
  () => {
    fetchSearchResults()
    showSearchDropdown.value = true
  }
)

const handleResultClick = (title: string) => {
  searchQuery.value = title
  showSearchDropdown.value = false
  navigateTo(`/movie?q=${encodeURIComponent(title)}`)
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchDropdown.value = false
  }, 200)
}

const handleLogout = () => {
  logout()
  showProfileMenu.value = false
}
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
					Cine<span class="text-red-500">Book</span>
				</span>
			</a>

			<nav class="hidden items-center gap-8 md:flex">
				<NuxtLink to="/" :class="['text-sm font-medium transition', isActive('/') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Home</NuxtLink>
				<NuxtLink to="/movie" :class="['text-sm font-medium transition', isActive('/movie') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Movies</NuxtLink>
				<NuxtLink to="/watchlist" :class="['text-sm font-medium transition', isActive('/watchlist') ? 'text-red-400' : 'text-gray-400 hover:text-white']">Watchlist</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium transition', isActive('/about') ? 'text-red-400' : 'text-gray-400 hover:text-white']">About</NuxtLink>
			</nav>

			<div class="hidden items-center gap-4 md:flex">
				<div class="relative">
					<svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						v-model="searchQuery"
						@blur="handleSearchBlur"
						@keyup.enter="handleSearch"
						type="text"
						placeholder="Search movie..."
						class="w-48 rounded-full border text-white border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:border-red-500"
					/>

					<div
						v-if="showSearchDropdown && searchQuery.trim() && searchResults.length > 0"
						class="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[#15151b] shadow-2xl"
					>
						<div class="grid grid-cols-3 gap-2 p-2">
							<div
								v-for="movie in searchResults"
								:key="movie.id"
								@mousedown="handleResultClick(movie.title)"
								class="cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-[#1a1a20] transition hover:border-red-500/50"
							>
								<div class="aspect-2/3 overflow-hidden">
									<img
										:src="movie.poster"
										:alt="movie.title"
										class="h-full w-full object-cover"
									/>
								</div>
								<div class="p-2">
									<p class="truncate text-xs font-medium text-white">{{ movie.title }}</p>
									<p class="mt-1 truncate text-[10px] text-gray-400">{{ movie.rating }}</p>
								</div>
							</div>
						</div>
					</div>

					<div
						v-else-if="showSearchDropdown && searchQuery.trim() && searchResults.length === 0"
						class="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#15151b] p-4 text-center"
					>
						<p class="text-sm text-gray-400">No movies found for "{{ searchQuery }}"</p>
					</div>
				</div>

				<template v-if="isLoggedIn">
					<div class="relative">
						<button
							class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 transition hover:border-white/20"
							@click="showProfileMenu = !showProfileMenu"
						>
<img :src="user?.avatar" :alt="user?.username" class="h-8 w-8 rounded-full" />
						<span class="text-sm font-medium text-white">{{ user?.username }}</span>
							<span class="text-xs text-gray-400">▼</span>
						</button>

						<div
							v-if="showProfileMenu"
							class="absolute right-0 top-14 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#15151b] shadow-xl"
						>
							<div class="border-b border-white/10 p-4">
								<p class="text-sm font-semibold text-white">{{ user?.username }}</p>
								<p class="text-xs text-gray-400">{{ user?.email }}</p>
							</div>
							<div class="p-2">
								<NuxtLink
									to="/profile"
									class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
									@click="showProfileMenu = false"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									My Profile
								</NuxtLink>
								<NuxtLink
									to="/profile?tab=favorites"
									class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
									@click="showProfileMenu = false"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
									</svg>
									Favorites
								</NuxtLink>
							</div>
							<div class="border-t border-white/10 p-2">
								<button
									class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
									@click="handleLogout"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
									</svg>
									Logout
								</button>
							</div>
						</div>
					</div>
				</template>

				<template v-else>
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
				<NuxtLink to="/coming" :class="['text-sm font-medium', isActive('/coming') ? 'text-red-400' : 'text-gray-300']">Coming Soon</NuxtLink>
				<NuxtLink to="/about" :class="['text-sm font-medium', isActive('/about') ? 'text-red-400' : 'text-gray-300']">About</NuxtLink>
				<template v-if="isLoggedIn">
					<NuxtLink to="/profile" class="text-gray-300">My Profile</NuxtLink>
					<button class="rounded-lg bg-red-600 py-3 font-semibold text-left text-red-400" @click="handleLogout">Logout</button>
				</template>
				<template v-else>
					<button class="rounded-lg bg-red-600 py-3 font-semibold" @click="showLogin = true">Login</button>
				</template>
			</div>
		</div>
	</header>

	<UserLogin v-if="showLogin" @close="showLogin = false" />
</template>
