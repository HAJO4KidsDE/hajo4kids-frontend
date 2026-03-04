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
      console.log('[Auth] Saving user to localStorage:', user.username)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    }
  }

  // Load user from localStorage
  function loadUserFromStorage(): User | null {
    if (import.meta.client) {
      const stored = localStorage.getItem(USER_STORAGE_KEY)
      if (stored) {
        try {
          const user = JSON.parse(stored)
          console.log('[Auth] Loaded user from localStorage:', user.username)
          return user
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
      console.log('[Auth] Clearing localStorage')
      localStorage.removeItem(USER_STORAGE_KEY)
    }
  }

  async function initSession() {
    console.log('[Auth] initSession called', { 
      initialized: authState.initialized, 
      loading: authState.loading,
      hasToken: !!tokenCookie.value 
    })
    
    // Prevent multiple initializations
    if (authState.initialized || authState.loading) {
      console.log('[Auth] Already initialized or loading, skipping')
      return
    }
    
    authState.loading = true
    
    const token = tokenCookie.value
    console.log('[Auth] Token from cookie:', token ? 'present' : 'missing')
    
    if (token) {
      authState.token = token
      
      // Try to restore user from localStorage first (instant)
      const storedUser = loadUserFromStorage()
      if (storedUser) {
        authState.user = storedUser
        authState.isLoggedIn = true
        console.log('[Auth] Restored user from localStorage, isLoggedIn:', authState.isLoggedIn)
      }
      
      // Then validate with server
      try {
        console.log('[Auth] Fetching user from server...')
        const response = await fetch(`${config.public.apiBase}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        console.log('[Auth] Server response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('[Auth] User data from server:', data.data)
          authState.user = data.data
          authState.isLoggedIn = true
          saveUserToStorage(data.data)
        } else {
          const errorText = await response.text()
          console.log('[Auth] Server error:', errorText)
          // Invalid token - clear everything
          authState.user = null
          authState.token = null
          authState.isLoggedIn = false
          tokenCookie.value = null
          clearUserFromStorage()
        }
      } catch (error) {
        console.error('[Auth] Network error:', error)
        // Keep stored user on network error
      }
    } else {
      console.log('[Auth] No token, checking localStorage anyway')
      // No token but maybe user in localStorage (shouldn't happen normally)
      const storedUser = loadUserFromStorage()
      if (storedUser) {
        // Token expired, clear storage
        clearUserFromStorage()
      }
    }
    
    authState.initialized = true
    authState.loading = false
    console.log('[Auth] initSession done, isLoggedIn:', authState.isLoggedIn)
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
    console.log('[Auth] Login successful, token:', data.data.token?.substring(0, 10) + '...')
    
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