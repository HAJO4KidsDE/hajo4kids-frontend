<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const router = useRouter()

const token = computed(() => route.query.token as string || '')

const form = ref({
  password: '',
  confirm_password: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

async function resetPassword() {
  error.value = ''

  if (!token.value) {
    error.value = 'Ungültiger oder fehlender Reset-Token'
    return
  }

  if (form.value.password !== form.value.confirm_password) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }

  if (form.value.password.length < 8) {
    error.value = 'Passwort muss mindestens 8 Zeichen haben'
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token.value,
        password: form.value.password
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Passwort zurücksetzen fehlgeschlagen')
    }

    success.value = 'Passwort erfolgreich zurückgesetzt!'
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">Passwort zurücksetzen</h1>
      <p class="text-muted-foreground mt-2">Gib dein neues Passwort ein</p>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form v-if="!success" @submit.prevent="resetPassword" class="space-y-4">
          <div v-if="!token" class="p-4 bg-destructive/10 text-destructive rounded-lg">
            Kein Reset-Token gefunden. Bitte nutze den Link aus der E-Mail.
          </div>

          <div>
            <Label for="password">Neues Passwort</Label>
            <Input id="password" v-model="form.password" type="password" required />
            <p class="text-sm text-muted-foreground mt-1">Mindestens 8 Zeichen</p>
          </div>

          <div>
            <Label for="confirm_password">Passwort bestätigen</Label>
            <Input id="confirm_password" v-model="form.confirm_password" type="password" required />
          </div>

          <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
            {{ error }}
          </div>

          <Button type="submit" :loading="loading" :disabled="!token" class="w-full">
            Passwort zurücksetzen
          </Button>
        </form>

        <div v-if="success" class="text-center">
          <div class="p-4 bg-green-100 text-green-800 rounded-lg mb-4">
            {{ success }}
          </div>
          <p class="text-muted-foreground">Du wirst zum Login weitergeleitet...</p>
        </div>

        <div class="text-center mt-4">
          <NuxtLink to="/auth/login" class="text-primary hover:underline">
            Zurück zum Login
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>