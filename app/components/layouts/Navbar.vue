<script setup lang="ts">
const mobileMenu = ref(false)
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    navigateTo(`/movie?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>

<template>
	<header class="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur-xl">
     
		<div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
			<a href="#" class="flex items-center gap-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600">
					🎬
				</div>

				<span class="text-xl font-bold text-white">
					Cine<span class="text-red-500">Book</span>
				</span>
			</a>

			<nav class="hidden items-center gap-8 md:flex">
				<NuxtLink to="/" class="text-sm font-medium text-white">Home</NuxtLink>
				<NuxtLink to="/movie" class="text-sm text-gray-400 transition hover:text-white">Movies</NuxtLink>
				<NuxtLink to="/coming" class="text-sm text-gray-400 transition hover:text-white">Coming Soon</NuxtLink>
				<NuxtLink to="/about" class="text-sm text-gray-400 transition hover:text-white">About</NuxtLink>
			</nav>

			<div class="hidden items-center gap-4 md:flex">
				<div class="relative">
					<span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
					<input
						v-model="searchQuery"
						@keyup.enter="handleSearch"
						type="text"
						placeholder="Search movie..."
						class="w-48 rounded-full border text-white border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-500 focus:border-red-500"
					/>
				</div>

				<button class="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-700">
					Login
				</button>
			</div>

			<button
				class="text-2xl md:hidden"
				aria-label="Toggle navigation menu"
				@click="mobileMenu = !mobileMenu"
			>
				☰
			</button>
		</div>

		<div v-if="mobileMenu" class="border-t border-white/10 bg-[#111116] px-5 py-5 md:hidden">
			<div class="flex flex-col gap-4">
				<a href="#" class="text-gray-300">Home</a>
				<a href="#movies" class="text-gray-300">Movies</a>
				<a href="#coming" class="text-gray-300">Coming Soon</a>
				<a href="#about" class="text-gray-300">About</a>
				<button class="rounded-lg bg-red-600 py-3 font-semibold">Login</button>
			</div>
		</div>
	</header>
</template>
