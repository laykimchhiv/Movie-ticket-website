<template>
  <div class="bg-[#0b0b0f] min-h-screen p-6 md:p-10 text-white">
    <!-- Header Section -->
    <header class="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-800 pb-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-red-500">Movies</h1>
        
      </div>

      <!-- Search Input -->
      <div class="w-full md:w-80 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search movies..."
          class="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 px-4 py-2.5 rounded-xl focus:outline-none focus:border-red-500 text-sm transition-all"
        />
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="max-w-7xl mx-auto">
      <!-- Category Filter Tabs -->
      <nav class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            selectedCategory === cat.id
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
          ]"
        >
          {{ cat.label }}
        </button>
      </nav>

      <!-- Movie Cards Grid -->
      <div 
        v-if="filteredMovies.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div 
          v-for="movie in filteredMovies" 
          :key="movie.id"
          class="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800/80 flex flex-col hover:border-gray-700 transition-all duration-300 shadow-lg cursor-pointer group"
        >
          <div class="relative overflow-hidden">
            <img 
              :src="movie.poster" 
              :alt="movie.title"
              class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-yellow-400 text-xs font-bold">
              ★ {{ movie.rating }}
            </div>
          </div>

          <div class="p-5 flex flex-col flex-grow justify-between">
            <div>
              <h2 class="text-lg font-bold text-white leading-snug mb-2 group-hover:text-red-400 transition-colors">
                {{ movie.title }}
              </h2>
              
              <div class="flex items-center gap-2 mb-3 text-xs">
                <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/20 uppercase">
                  {{ movie.genre }}
                </span>
                <span class="text-gray-400">• {{ movie.duration }} min</span>
              </div>

              <p class="text-gray-400 text-xs leading-relaxed line-clamp-3">
                {{ movie.synopsis }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Filter Result -->
      <div v-else class="text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800">
        <p class="text-gray-400 text-base">No movies found in this category matching your search.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  duration: number;
  releaseDate: string;
  poster: string;
  synopsis: string;
}

const searchQuery = ref('');
const selectedCategory = ref('all');

const categories = [
  { id: 'all', label: 'All Movies' },
  { id: 'kdrama', label: 'K-Drama' },
  { id: 'cdrama', label: 'C-Drama' },
  { id: 'bl', label: 'BL Series' },
  { id: 'hollywood', label: 'Hollywood' },
];

const movies: Movie[] = [
  {
    id: 1,
    title: "My Bias My Boss",
    genre: "K-Drama",
    rating: 8.8,
    duration: 148,
    releaseDate: "2023-05-10",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm8EKnIM6khdRa_rSFjkWxIPtLDDJhi2yI2p7VqKVXkg&s=10",
    synopsis: "An office romance unfolds when an idol superfan accidentally lands a job working under her favorite star."
  },
  {
    id: 2,
    title: "True Beauty",
    genre: "K-Drama",
    rating: 9.3,
    duration: 142,
    releaseDate: "2020-12-09",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EElKa7ncrbbgTaBrCbqQZ2tAoECMtFBiAwp4TxIVZw&s=10",
    synopsis: "A high school student masters the art of makeup to navigate school social life and unexpected love triangles."
  },
  {
    id: 3,
    title: "Lovely Runner",
    genre: "K-Drama",
    rating: 9.0,
    duration: 152,
    releaseDate: "2024-04-08",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfQWCmWxXi2Zon9mFWgd-vSRFPc0fLSwJFJW3zgR31JA&s=10",
    synopsis: "A devoted fan travels back in time to save her favorite celebrity from a tragic fate."
  },
  {
    id: 4,
    title: "Revenged Love",
    genre: "C-Drama",
    rating: 8.9,
    duration: 154,
    releaseDate: "2022-09-14",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHMeGNwJcSSzhzV7DRsTEujnUHEOskbmzdozMq6DT2g&s=10",
    synopsis: "A tale of passion, betrayal, and justice as two rivals navigate power and emotion."
  },
  {
    id: 5,
    title: "Speed and Love",
    genre: "Hollywood",
    rating: 8.8,
    duration: 142,
    releaseDate: "2023-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0WxExpAE7HQjqMt7SC-QxVLA5fiQqdQn_wIKx8wZFA&s=10",
    synopsis: "A high-octane racing thriller exploring ambition, speed, and romance on the track."
  },
  {
    id: 6,
    title: "GoodBoy",
    genre: "K-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "2024-01-15",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDaZtZGmxQVUPr-2U_WFWg6gBQRaTE3wvdZvwdFuhKA&s=10",
    synopsis: "Former Olympic athletes form a special police force unit to fight violent crime."
  },
  {
    id: 7,
    title: "Teach You a Lesson",
    genre: "K-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "2023-11-02",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReFXv9aTMyla5zfKp1NMkZzBqfaOPsN5fQo2_RilS8LQ&s=10",
    synopsis: "A dedicated educator takes unconventional steps to reform a troubled classroom."
  },
  {
    id: 8,
    title: "Falling Into Your Smile",
    genre: "C-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "2021-06-23",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMPwoclH6yHyuAzjzL3bknsETKrebvIu6ugsen_Umew&s=10",
    synopsis: "An aspiring female gamer steps into the professional esports arena and finds love."
  },
  {
    id: 9,
    title: "When I Fly Towards You",
    genre: "C-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "2023-06-13",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyigsrxDWwGBkpfs788k4y-XMPrEzjNUm7tSE_W3PfOg&s=10",
    synopsis: "A sweet youth romance following high school classmates growing up together."
  },
  {
    id: 10,
    title: "ABO Desire",
    genre: "BL Series",
    rating: 8.8,
    duration: 142,
    releaseDate: "2023-08-20",
    poster: "https://i.mydramalist.com/mOYj21_4f.jpg",
    synopsis: "A romantic fantasy story following two contrasting personalities bound by fate."
  },
  {
    id: 12,
    title: "Bloodhounds",
    genre: "K-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "2023-06-09",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl0P50aPfNdBLxNwRED4ILm1rITCRdAvHI7-0m-a3DSQ&s=10",
    synopsis: "Two young boxers join forces with a benevolent moneylender to take down a ruthless loan shark."
  }
];

const filteredMovies = computed(() => {
  return movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase().trim());

    const genreLower = movie.genre.toLowerCase();
    
    let matchesCategory = true;
    if (selectedCategory.value === 'kDrama') {
      matchesCategory = genreLower.includes('k-drama') || genreLower.includes('kdrama');
    } else if (selectedCategory.value === 'cdrama') {
      matchesCategory = genreLower.includes('c-drama') || genreLower.includes('cdrama');
    } else if (selectedCategory.value === 'bl') {
      matchesCategory = genreLower.includes('bl');
    } else if (selectedCategory.value === 'hollywood') {
      matchesCategory = genreLower.includes('hollywood');
    }

    return matchesSearch && matchesCategory;
  });
});
</script>