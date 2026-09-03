type UserRole = 'user' | 'admin'

interface AuthData {
  user: { id: number; username: string; email: string; avatar: string; role: UserRole }
  token: string
}

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const auth = localStorage.getItem('auth')
  const data: AuthData | null = auth ? JSON.parse(auth) : null

  if (!data) {
    return navigateTo('/')
  }

  // If the page declares a required role, enforce it
  const requiredRole: UserRole | undefined = to.meta.role as UserRole | undefined

  if (requiredRole && data.user.role !== requiredRole) {
    return navigateTo('/')
  }
})
