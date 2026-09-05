import { ref, computed } from 'vue'

type UserRole = 'user' | 'admin'

interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: UserRole
}

interface RegisteredUser {
  id: number
  username: string
  password: string
  email: string
  role: UserRole
}

interface AuthData {
  user: User
  token: string
}

const API_URL = 'http://localhost:8000'

const user = ref<User | null>(null)
const token = ref<string>('')
const watchlist = ref<number[]>([])
const favorites = ref<number[]>([])
const isLoaded = ref(false)

const loadFromStorage = () => {
  if (typeof window === 'undefined') return

  // Load logged-in user
  const storedAuth = localStorage.getItem('auth')

  if (storedAuth) {
    const data: AuthData = JSON.parse(storedAuth)

    user.value = data.user
    token.value = data.token
  }

  // Load watchlist
  const storedWatchlist = localStorage.getItem('watchlist')

  if (storedWatchlist) {
    watchlist.value = JSON.parse(storedWatchlist)
  }

  // Load favorites
  const storedFavorites = localStorage.getItem('favorites')

  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites)
  }

  isLoaded.value = true
}

loadFromStorage()

export function useAuth() {
  const isLoggedIn = computed(() => {
    return !!user.value && !!token.value
  })

  const role = computed(() => {
    return user.value?.role || 'user'
  })

  const hasRole = (required: UserRole) => {
    return role.value === required
  }

  // =========================
  // LOGIN
  // =========================
  const login = async (
    username: string,
    password: string
  ): Promise<User> => {

    // Get all users from JSON Server
    const response = await fetch(`${API_URL}/users`)

    if (!response.ok) {
      throw new Error('Cannot connect to server')
    }

    const users: RegisteredUser[] = await response.json()

    // Compare username/email and password
    const found = users.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.password === password
    )

    if (!found) {
      throw new Error('Invalid username/email or password')
    }

    // Create user data
    const userData: User = {
      id: found.id,
      username: found.username,
      email: found.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        found.username
      )}&background=6b7280&color=fff`,
      role: found.role || 'user',
    }

    // Create token
    const authToken =
      'token_' + Math.random().toString(36).substring(2)

    user.value = userData
    token.value = authToken

    // Save ONLY login information to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: userData,
          token: authToken,
        })
      )
    }

    return userData
  }

  // =========================
  // REGISTER
  // =========================
  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<User> => {

    // Get users from JSON Server
    const response = await fetch(`${API_URL}/users`)

    if (!response.ok) {
      throw new Error('Cannot connect to server')
    }

    const users: RegisteredUser[] = await response.json()

    // Check username
    if (users.some((u) => u.username === username)) {
      throw new Error('Username already exists')
    }

    // Check email
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already exists')
    }

    // Create new user
    const newUser = {
      username,
      email,
      password,
      role: 'user',
    }

    // Save to JSON Server
    const createResponse = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    if (!createResponse.ok) {
      throw new Error('Registration failed')
    }

    // JSON Server returns the newly created user
    const savedUser: RegisteredUser =
      await createResponse.json()

    // Create frontend user data
    const userData: User = {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        savedUser.username
      )}&background=6b7280&color=fff`,
      role: savedUser.role || 'user',
    }

    // Create token
    const authToken =
      'token_' + Math.random().toString(36).substring(2)

    user.value = userData
    token.value = authToken

    // Save logged-in state
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: userData,
          token: authToken,
        })
      )
    }

    return userData
  }

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    user.value = null
    token.value = ''
    watchlist.value = []
    favorites.value = []

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth')
      localStorage.removeItem('watchlist')
      localStorage.removeItem('favorites')
    }
  }

  // =========================
  // WATCHLIST
  // =========================
  const addToWatchlist = (movieId: number) => {
    if (!watchlist.value.includes(movieId)) {
      watchlist.value.push(movieId)

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'watchlist',
          JSON.stringify(watchlist.value)
        )
      }
    }
  }

  const removeFromWatchlist = (movieId: number) => {
    watchlist.value = watchlist.value.filter(
      (id) => id !== movieId
    )

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'watchlist',
        JSON.stringify(watchlist.value)
      )
    }
  }

  const isInWatchlist = (movieId: number) => {
    return watchlist.value.includes(movieId)
  }

  // =========================
  // FAVORITES
  // =========================
  const addToFavorites = (movieId: number) => {
    if (!favorites.value.includes(movieId)) {
      favorites.value.push(movieId)

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'favorites',
          JSON.stringify(favorites.value)
        )
      }
    }
  }

  const removeFromFavorites = (movieId: number) => {
    favorites.value = favorites.value.filter(
      (id) => id !== movieId
    )

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'favorites',
        JSON.stringify(favorites.value)
      )
    }
  }

  const isInFavorites = (movieId: number) => {
    return favorites.value.includes(movieId)
  }

  return {
    user,
    token,
    isLoggedIn,
    isLoaded,
    role,
    hasRole,
    watchlist,
    favorites,
    login,
    logout,
    register,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
  }
}