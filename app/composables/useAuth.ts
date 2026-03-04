interface User {
  id: number
  username: string
  email: string
  role: 'guest' | 'user' | 'reporter' | 'admin'
  first_name?: string
  last_name?: string
}

// Global reactive state - shared across all components
const authState = reactive<{
  user: User | null
  token: string | null
  isLoggedIn: boolean
  initialized: boolean
  loading: boolean
}>({
  user: null,
  token: null,
  isLoggedIn: false,
  initialized: false,
  loading: false
})

export function useAuth() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token', { 
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  async function initSession() {
    // Prevent multiple initializations
    if (authState.initialized || authState.loading) {
      return
    }
    
    authState.loading = true
    
    const token = tokenCookie.value
    if (token) {
      authState.token = token
      try {
        const response = await fetch(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          authState.user = data.data
          authState.isLoggedIn = true
        } else {
          // Invalid token - clear it
          authState.token = null
          tokenCookie.value = null
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    }
    
    authState.initialized = true
    authState.loading = false
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login fehlgeschlagen')
    }

    const data = await response.json()
    
    // Set cookie first
    tokenCookie.value = data.data.token
    
    // Then update state
    authState.token = data.data.token
    authState.user = data.data.user
    authState.isLoggedIn = true
    authState.initialized = true

    return data.data
  }

  async function register(username: string, email: string, password: string) {
    const response = await fetch(`${config.public.apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registrierung fehlgeschlagen')
    }

    const data = await response.json()
    return data.data
  }

  function logout() {
    authState.user = null
    authState.token = null
    authState.isLoggedIn = false
    authState.initialized = true
    tokenCookie.value = null
  }

  function hasRole(role: string | string[]): boolean {
    if (!authState.user) return false
    const roles = Array.isArray(role) ? role : [role]
    const roleHierarchy = { guest: 0, user: 1, reporter: 2, admin: 3 }
    const userLevel = roleHierarchy[authState.user.role] || 0
    return roles.some(r => userLevel >= (roleHierarchy[r] || 0))
  }

  return {
    user: computed(() => authState.user),
    token: computed(() => authState.token),
    isLoggedIn: computed(() => authState.isLoggedIn),
    initialized: computed(() => authState.initialized),
    loading: computed(() => authState.loading),
    login,
    register,
    logout,
    initSession,
    hasRole,
  }
}