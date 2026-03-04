interface User {
  id: number
  username: string
  email: string
  role: 'guest' | 'user' | 'reporter' | 'admin'
  first_name?: string
  last_name?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  initialized: boolean
}

export function useAuth() {
  const config = useRuntimeConfig()
  const state = useState<AuthState>('auth', () => ({
    user: null,
    token: null,
    isLoggedIn: false,
    initialized: false,
  }))
  const tokenCookie = useCookie('auth_token', { 
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  async function initSession() {
    // Check if we have a token in cookie but state is not initialized
    if (tokenCookie.value && !state.value.initialized) {
      state.value.token = tokenCookie.value
      await fetchUser()
    }
    state.value.initialized = true
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
    state.value.token = data.data.token
    state.value.user = data.data.user
    state.value.isLoggedIn = true
    state.value.initialized = true
    tokenCookie.value = data.data.token

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

  async function fetchUser() {
    const token = state.value.token || tokenCookie.value
    if (!token) return

    try {
      const response = await fetch(`${config.public.apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        state.value.user = data.data
        state.value.token = token
        state.value.isLoggedIn = true
      } else {
        // Token invalid - clear everything
        logout()
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    }
  }

  function logout() {
    state.value.user = null
    state.value.token = null
    state.value.isLoggedIn = false
    state.value.initialized = true // Keep initialized to show logged out state
    tokenCookie.value = null
  }

  function hasRole(role: string | string[]): boolean {
    if (!state.value.user) return false
    const roles = Array.isArray(role) ? role : [role]
    const roleHierarchy = { guest: 0, user: 1, reporter: 2, admin: 3 }
    const userLevel = roleHierarchy[state.value.user.role] || 0
    return roles.some(r => userLevel >= (roleHierarchy[r] || 0))
  }

  return {
    user: computed(() => state.value.user),
    token: computed(() => state.value.token),
    isLoggedIn: computed(() => state.value.isLoggedIn),
    initialized: computed(() => state.value.initialized),
    login,
    register,
    logout,
    fetchUser,
    initSession,
    hasRole,
  }
}