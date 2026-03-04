import type { Ref } from 'vue'

interface FetchOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: any
  headers?: Record<string, string>
  immediate?: boolean
  watch?: Ref<any>[]
}

interface FetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  pending: Ref<boolean>
  execute: () => Promise<void>
}

export function useApi<T = any>(url: string, options: FetchOptions<T> = {}): FetchReturn<T> {
  const config = useRuntimeConfig()
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const pending = ref(false)

  const token = useCookie('auth_token')

  const execute = async () => {
    pending.value = true
    error.value = null

    try {
      const response = await fetch(`${config.public.apiBase}${url}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      // If response has success, data, and meta, return the full object for pagination support
      // Otherwise extract just the data property if it exists
      if (result.success !== undefined && result.meta !== undefined) {
        data.value = result
      } else if (result.data !== undefined) {
        data.value = result.data
      } else {
        data.value = result
      }
    } catch (e) {
      error.value = e as Error
    } finally {
      pending.value = false
    }
  }

  if (options.immediate !== false) {
    execute()
  }

  if (options.watch) {
    watch(options.watch, () => execute())
  }

  return { data, error, pending, execute }
}

// Convenience methods
export function useApiGet<T = any>(url: string, options: Omit<FetchOptions<T>, 'method' | 'body'> = {}) {
  return useApi<T>(url, { ...options, method: 'GET' })
}

export function useApiPost<T = any>(url: string, body?: any, options: Omit<FetchOptions<T>, 'method' | 'body'> = {}) {
  return useApi<T>(url, { ...options, method: 'POST', body, immediate: false })
}

export function useApiPut<T = any>(url: string, body?: any, options: Omit<FetchOptions<T>, 'method' | 'body'> = {}) {
  return useApi<T>(url, { ...options, method: 'PUT', body, immediate: false })
}

export function useApiDelete<T = any>(url: string, options: Omit<FetchOptions<T>, 'method'> = {}) {
  return useApi<T>(url, { ...options, method: 'DELETE', immediate: false })
}