export default defineNuxtPlugin(async () => {
  // This runs BEFORE the app mounts on client
  const auth = useAuth()
  await auth.initSession()
})