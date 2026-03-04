<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  
  if (password.value !== passwordConfirm.value) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Passwort muss mindestens 8 Zeichen lang sein'
    return
  }
  
  loading.value = true
  
  try {
    const response = await fetch(`${config.public.apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Registrierung fehlgeschlagen')
    }
    
    router.push('/auth/login?registered=true')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <Card>
      <CardHeader>
        <CardTitle>Registrieren</CardTitle>
        <CardDescription>
          Erstelle einen neuen Account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Benutzername</Label>
            <Input
              id="username"
              v-model="username"
              placeholder="dein_name"
              required
            />
          </div>
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
          <div class="space-y-2">
            <Label for="passwordConfirm">Passwort bestätigen</Label>
            <Input
              id="passwordConfirm"
              v-model="passwordConfirm"
              type="password"
              required
            />
          </div>
          <div v-if="error" class="text-sm text-destructive">
            {{ error }}
          </div>
          <Button type="submit" class="w-full" :loading="loading">
            Registrieren
          </Button>
        </form>
        <div class="mt-4 text-center text-sm text-muted-foreground">
          Bereits ein Account?
          <NuxtLink to="/auth/login" class="text-primary hover:underline">
            Anmelden
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>