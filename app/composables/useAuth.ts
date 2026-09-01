import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface AuthData {
  user: User
  token: string
}

const user = ref<User | null>(null)
const token = ref<string>('')
const favorites = ref<number[]>([])

const loadFromStorage = () => {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem('auth')
  if (stored) {
    const data: AuthData = JSON.parse(stored)
    user.value = data.user
    token.value = data.token
  }
  const storedFavs = localStorage.getItem('favorites')
  if (storedFavs) {
    favorites.value = JSON.parse(storedFavs)
  }
}

loadFromStorage()

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  const login = (username: string, password: string) => {
    const userData: User = {
      id: 1,
      name: username,
      email: `${username}@cinebook.com`,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=dc2626&color=fff`,
    }
    const authToken = 'token_' + Math.random().toString(36).substring(2)

    user.value = userData
    token.value = authToken

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: authToken }))
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    favorites.value = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth')
      localStorage.removeItem('favorites')
    }
  }

  const addFavorite = (movieId: number) => {
    if (!favorites.value.includes(movieId)) {
      favorites.value.push(movieId)
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
      }
    }
  }

  const removeFavorite = (movieId: number) => {
    favorites.value = favorites.value.filter((id) => id !== movieId)
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }
  }

  const isFavorite = (movieId: number) => favorites.value.includes(movieId)

  return {
    user,
    token,
    isLoggedIn,
    favorites,
    login,
    logout,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
