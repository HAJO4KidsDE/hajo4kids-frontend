export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()
  
  // Initialize auth session if not already done
  if (!auth.initialized.value && !auth.loading.value) {
    await auth.initSession()
  }
})