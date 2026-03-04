export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  
  // Wait for auth to initialize on client side
  if (import.meta.client) {
    await auth.initSession()
  }
})