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

// Local storage key for user data
const USER_STORAGE_KEY = 'hajo4kids_user'

export function useAuth() {
  const config = useRuntimeConfig()
  const tokenCookie = useCookie<string | null>('auth_token', { 
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  // Save user to localStorage
  function saveUserToStorage(user: User) {
    if (import.meta.client) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
  }

  // Load user from localStorage
  function loadUserFromStorage(): User | null {
    if (import.meta.client) {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY)
        }
      }
    }
    return null
  }

  // Clear user from localStorage
  function clearUserFromStorage() {
    if (import.meta.client) {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }

  async function initSession() {
    // Prevent multiple initializations
    if (authState.initialized || authState.loading) {
      return
    }
    
    authState.loading = true
    
    const token = tokenCookie.value
    if (token) {
      authState.token = token
      
      // Try to restore user from localStorage first (instant)
      const storedUser = loadUserFromStorage()
      if (storedUser) {
        authState.user = storedUser
        authState.isLoggedIn = true
      }
      
      // Then validate with server in background
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
          saveUserToStorage(data.data)
        } else {
          // Invalid token - clear everything
          authState.user = null
          authState.token = null
          authState.isLoggedIn = false
          tokenCookie.value = null
          clearUserFromStorage()
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        // Keep stored user on network error
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
    
    // Save user to localStorage for instant restore
    saveUserToStorage(data.data.user)

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
    clearUserFromStorage()
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