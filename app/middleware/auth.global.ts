export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client-side - cookies aren't available during SSR
  if (import.meta.server) return
  
  const auth = useAuth()
  
  // Initialize auth session if not already done
  if (!auth.initialized.value && !auth.loading.value) {
    await auth.initSession()
  }
})