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

  if (requiredRole) {
    // Check the ORIGINAL role, not the current role.
    // This allows admins to switch to user view and still access admin pages
    // by navigating to /admin/dashboard directly.
    const originalRole = localStorage.getItem('originalRole') as UserRole | null
    const effectiveRole = (originalRole === 'admin' || originalRole === 'user')
      ? originalRole
      : data.user.role

    if (effectiveRole !== requiredRole) {
      return navigateTo('/')
    }
  }
})
