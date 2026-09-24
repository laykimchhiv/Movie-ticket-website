import { ref, computed } from 'vue'

type UserRole = 'user' | 'admin'

interface User {
  id: number
  username: string
  email: string
  avatar: string
  role: UserRole
  about: string
}

interface RegisteredUser {
  id: number
  username: string
  password: string
  email: string
  avatar?: string
  about?: string
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
  // Key used to remember the original role so it can be restored later.
  // This survives reloads and lets the user switch back to admin.
  const ORIGINAL_ROLE_KEY = 'originalRole'

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
      avatar: found.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
        found.username
      )}&background=6b7280&color=fff`,
      role: found.role || 'user',
      about: found.about || '',
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
      // Remember the original role so it can be restored later
      localStorage.setItem(ORIGINAL_ROLE_KEY, userData.role)
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
      about: savedUser.about || '',
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
      // Remember the original role so it can be restored later
      localStorage.setItem(ORIGINAL_ROLE_KEY, userData.role)
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
  // ROLE SWITCHING
  // =========================
  // Toggle between admin and user views without losing the original role.
  // The original role is stored in a separate localStorage key so it
  // survives reloads and the user can always switch back.
  const getOriginalRole = (): UserRole => {
    if (typeof window === 'undefined') return 'user'
    const stored = localStorage.getItem(ORIGINAL_ROLE_KEY) as UserRole | null
    if (stored === 'admin' || stored === 'user') return stored
    // Fall back to the role stored in auth (set at login time)
    const storedAuth = localStorage.getItem('auth')
    if (storedAuth) {
      try {
        const data = JSON.parse(storedAuth)
        return data.user?.role || 'user'
      } catch {
        return 'user'
      }
    }
    return 'user'
  }

  const switchRole = (targetRole: UserRole) => {
    if (!user.value) return

    const updatedUser = { ...user.value, role: targetRole }
    user.value = updatedUser

    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const data = JSON.parse(storedAuth)
        data.user = updatedUser
        localStorage.setItem('auth', JSON.stringify(data))
      }
    }
  }

  // Toggle between the current role and the original role.
  const toggleRole = () => {
    if (!user.value) return
    const original = getOriginalRole()
    const next: UserRole = user.value.role === original ? (original === 'admin' ? 'user' : 'admin') : original
    switchRole(next)
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
  const addToFavorites = (movieId: number | string) => {
    const id = Number(movieId)
    if (!favorites.value.includes(id)) {
      favorites.value.push(id)

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'favorites',
          JSON.stringify(favorites.value)
        )
      }
    }
  }

  const removeFromFavorites = (movieId: number | string) => {
    const id = Number(movieId)
    favorites.value = favorites.value.filter(
      (existingId) => existingId !== id
    )

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'favorites',
        JSON.stringify(favorites.value)
      )
    }
  }

  const isInFavorites = (movieId: number | string) => {
    return favorites.value.includes(Number(movieId))
  }

  const updateAbout = async (about: string) => {
    if (!user.value) return
    const updatedUser = { ...user.value, about }
    user.value = updatedUser

    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const data = JSON.parse(storedAuth)
        data.user = updatedUser
        localStorage.setItem('auth', JSON.stringify(data))
      }
    }

    try {
      await fetch(`${API_URL}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about }),
      })
    } catch {
      // Local state already updated; server failure is non-fatal
    }
  }

  const updateUsername = async (username: string) => {
    if (!user.value) return

    try {
      // Check for duplicate username (excluding the current user)
      const res = await fetch(`${API_URL}/users`)
      if (res.ok) {
        const users: RegisteredUser[] = await res.json()
        const duplicate = users.find(
          (u) => u.username === username && u.id !== user.value!.id
        )
        if (duplicate) {
          throw new Error('Username already exists')
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message === 'Username already exists') {
        throw e
      }
      // Network error is non-fatal; proceed with local update
    }

    const updatedUser = { ...user.value, username }
    user.value = updatedUser

    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const data = JSON.parse(storedAuth)
        data.user = updatedUser
        localStorage.setItem('auth', JSON.stringify(data))
      }
    }

    try {
      await fetch(`${API_URL}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
    } catch {
      // Local state already updated; server failure is non-fatal
    }
  }

  const updateEmail = async (email: string) => {
    if (!user.value) return

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    try {
      // Check for duplicate email (excluding the current user)
      const res = await fetch(`${API_URL}/users`)
      if (res.ok) {
        const users: RegisteredUser[] = await res.json()
        const duplicate = users.find(
          (u) => u.email === email && u.id !== user.value!.id
        )
        if (duplicate) {
          throw new Error('Email already exists')
        }
      }
    } catch (e) {
      if (e instanceof Error && (e.message === 'Email already exists' || e.message === 'Invalid email format')) {
        throw e
      }
      // Network error is non-fatal; proceed with local update
    }

    const updatedUser = { ...user.value, email }
    user.value = updatedUser

    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const data = JSON.parse(storedAuth)
        data.user = updatedUser
        localStorage.setItem('auth', JSON.stringify(data))
      }
    }

    try {
      await fetch(`${API_URL}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {
      // Local state already updated; server failure is non-fatal
    }
  }

  const updateAvatar = async (avatar: string) => {
    if (!user.value) return false

    const updatedUser = { ...user.value, avatar }
    user.value = updatedUser

    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const data = JSON.parse(storedAuth)
        data.user = updatedUser
        localStorage.setItem('auth', JSON.stringify(data))
      }
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar }),
      })

      return response.ok
    } catch {
      return false
    }
  }

  // Update the user's password in JSON Server and locally.
  // Returns true on success, false if the current password doesn't match.
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!user.value) return false

    try {
      // Verify the current password against the server
      const res = await fetch(`${API_URL}/users`)
      if (!res.ok) return false
      const users: RegisteredUser[] = await res.json()
      const found = users.find((u) => u.id === user.value!.id)
      if (!found) return false
      if (found.password !== currentPassword) return false

      // Persist the new password
      const patchRes = await fetch(`${API_URL}/users/${user.value.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })
      if (!patchRes.ok) return false

      return true
    } catch {
      return false
    }
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
    switchRole,
    toggleRole,
    getOriginalRole,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    updateAbout,
    updateUsername,
    updateEmail,
    updateAvatar,
    updatePassword,
  }
}