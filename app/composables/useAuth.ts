import { ref, computed } from 'vue'

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

interface RegisteredUser {
  id: number
  username: string
  password: string
  email: string
}

interface AuthData {
  user: User
  token: string
}

const user = ref<User | null>(null)
const token = ref<string>('')
const favorites = ref<number[]>([])
const users = ref<RegisteredUser[]>([])

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
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    users.value = JSON.parse(storedUsers)
  } else {
    const seed: RegisteredUser[] = [
      { id: 1, username: 'john_doe', password: 'password123', email: 'john@cinebook.com' },
      { id: 2, username: 'jane_smith', password: 'securepass', email: 'jane@cinebook.com' },
    ]
    users.value = seed
    localStorage.setItem('users', JSON.stringify(seed))
  }
}

loadFromStorage()

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  const login = (username: string, password: string): User => {
    const found = users.value.find((u) => u.username === username && u.password === password)
    if (!found) {
      throw new Error('Invalid username or password')
    }

    const userData: User = {
      id: found.id,
      name: found.username,
      email: found.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(found.username)}&background=dc2626&color=fff`,
    }
    const authToken = 'token_' + Math.random().toString(36).substring(2)

    user.value = userData
    token.value = authToken

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: authToken }))
    }

    return userData
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

  const register = (username: string, email: string, password: string): User => {
    if (users.value.some((u) => u.username === username)) {
      throw new Error('Username already exists')
    }

    const newId = users.value.length > 0 ? Math.max(...users.value.map((u) => u.id)) + 1 : 1
    const newUser: RegisteredUser = { id: newId, username, password, email }
    users.value.push(newUser)

    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users.value))
    }

    const userData: User = {
      id: newUser.id,
      name: newUser.username,
      email: newUser.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.username)}&background=dc2626&color=fff`,
    }
    const authToken = 'token_' + Math.random().toString(36).substring(2)

    user.value = userData
    token.value = authToken

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth', JSON.stringify({ user: userData, token: authToken }))
    }

    return userData
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
    users,
    favorites,
    login,
    logout,
    register,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
