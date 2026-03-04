<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (e: any) {
    // Extract error message from API response
    const message = e.message || 'Anmeldung fehlgeschlagen'
    error.value = message.replace(/^Error:\s*/, '')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <Card>
      <CardHeader>
        <CardTitle>Anmelden</CardTitle>
        <CardDescription>
          Melde dich mit deinem Account an
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">E-Mail</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@beispiel.de"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Passwort</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              required
            />
          </div>
          <div v-if="error" class="text-sm text-destructive">
            {{ error }}
          </div>
          <Button type="submit" class="w-full" :loading="loading">
            Anmelden
          </Button>
        </form>
        <div class="mt-4 text-center text-sm text-muted-foreground">
          <NuxtLink to="/auth/forgot-password" class="text-primary hover:underline">
            Passwort vergessen?
          </NuxtLink>
        </div>
        <div class="mt-2 text-center text-sm text-muted-foreground">
          Noch kein Account?
          <NuxtLink to="/auth/register" class="text-primary hover:underline">
            Registrieren
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>