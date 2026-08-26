<template>
  <div class="bg-[#0b0b0f]  min-h-screen  from-gray-900 via-gray-800 to-gray-900 p-8">
    <h1 class="text-4xl font-bold text-center text-white mb-12">Now Showing</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
      <div 
        v-for="movie in movies" 
        :key="movie.id" 
        class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
      >
        <img 
          :src="movie.poster" 
          :alt="movie.title" 
          class="w-full h-96 object-cover group-hover:opacity-90 transition-opacity"
        />
        
        <div class="p-5">
          <h3 class="text-xl font-bold text-white mb-2">{{ movie.title }}</h3>
          
          <p class="text-red-500 text-sm font-semibold uppercase mb-3 tracking-wide">
            {{ movie.genre }}
          </p>
          
          <div class="flex justify-between items-center mb-4 text-sm">
            <span class="text-yellow-400 font-bold">★ {{ movie.rating }}</span>
            <span class="text-gray-400">{{ movie.duration }} min</span>
          </div>
          
          <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {{ movie.synopsis }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const movies: Movie[] = [
  {
    id: 1,
    title: "My bias My boss",
    genre: "k-drama",
    rating: 8.8,
    duration: 148,
    releaseDate: "2010-07-16",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm8EKnIM6khdRa_rSFjkWxIPtLDDJhi2yI2p7VqKVXkg&s=10",
    synopsis: "A skilled thief who steals corporate secrets through dream-sharing technology"
  },
  {
    id: 2,
    title: "True Beauty",
    genre: "kDrama and manga",
    rating: 9.3,
    duration: 142,
    releaseDate: "1994-09-23",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8EElKa7ncrbbgTaBrCbqQZ2tAoECMtFBiAwp4TxIVZw&s=10",
    synopsis: "Two imprisoned men bond over years, finding solace and eventual redemption"
  },
  {
    id: 3,
    title: "lovely runner",
    genre: "kDrama",
    rating: 9.0,
    duration: 152,
    releaseDate: "2008-07-18",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfQWCmWxXi2Zon9mFWgd-vSRFPc0fLSwJFJW3zgR31JA&s=10",
    synopsis: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy"
  },
  {
    id: 4,
    title: "Revenged love",
    genre: "C-Drama",
    rating: 8.9,
    duration: 154,
    releaseDate: "1994-10-14",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHMeGNwJcSSzhzV7DRsTEujnUHEOskbmzdozMq6DT2g&s=10",
    synopsis: "Multiple stories of Los Angeles criminals intertwine in four tales of violence and redemption"
  },
  {
    id: 5,
    title: "Speed and love",
    genre: "Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo0WxExpAE7HQjqMt7SC-QxVLA5fiQqdQn_wIKx8wZFA&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 6,
    title: "GoodBoy",
    genre: "KDrama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDaZtZGmxQVUPr-2U_WFWg6gBQRaTE3wvdZvwdFuhKA&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 7,
    title: "Teach you a lesson",
    genre: "KDrama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReFXv9aTMyla5zfKp1NMkZzBqfaOPsN5fQo2_RilS8LQ&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 8,
    title: "falling into your smile",
    genre: "C-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMPwoclH6yHyuAzjzL3bknsETKrebvIu6ugsen_Umew&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 9,
    title: "When I Fly Towards You",
    genre: "C-Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyigsrxDWwGBkpfs788k4y-XMPrEzjNUm7tSE_W3PfOg&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 10,
    title: "ABO Desire the Series",
    genre: "BL CDrama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://i.mydramalist.com/mOYj21_4f.jpg",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 12,
    title: "Bloodhounds",
    genre: "Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl0P50aPfNdBLxNwRED4ILm1rITCRdAvHI7-0m-a3DSQ&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  },
  {
    id: 13,
    title: "GoodBoy",
    genre: "Drama",
    rating: 8.8,
    duration: 142,
    releaseDate: "1994-07-06",
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDaZtZGmxQVUPr-2U_WFWg6gBQRaTE3wvdZvwdFuhKA&s=10",
    synopsis: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man"
  }
];
</script>