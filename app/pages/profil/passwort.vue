<script setup lang="ts">
const auth = useAuth()
const config = useRuntimeConfig()
const router = useRouter()

// Redirect if not logged in
onMounted(() => {
  if (!auth.isLoggedIn.value) {
    router.push('/auth/login')
  }
})

const form = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const saving = ref(false)
const error = ref('')
const success = ref('')

async function changePassword() {
  error.value = ''
  success.value = ''

  if (form.value.new_password !== form.value.confirm_password) {
    error.value = 'Passwörter stimmen nicht überein'
    return
  }

  if (form.value.new_password.length < 8) {
    error.value = 'Passwort muss mindestens 8 Zeichen haben'
    return
  }

  saving.value = true

  try {
    const response = await fetch(`${config.public.apiBase}/user/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify({
        current_password: form.value.current_password,
        new_password: form.value.new_password
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Passwort ändern fehlgeschlagen')
    }

    success.value = 'Passwort erfolgreich geändert!'
    form.value.current_password = ''
    form.value.new_password = ''
    form.value.confirm_password = ''
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-8">
      <NuxtLink to="/profil" class="text-muted-foreground hover:text-primary flex items-center gap-2 mb-4">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zum Profil
      </NuxtLink>
      <h1 class="text-3xl font-bold">Passwort ändern</h1>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Neues Passwort</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <Label for="current_password">Aktuelles Passwort</Label>
            <Input id="current_password" v-model="form.current_password" type="password" required />
          </div>

          <div>
            <Label for="new_password">Neues Passwort</Label>
            <Input id="new_password" v-model="form.new_password" type="password" required />
            <p class="text-sm text-muted-foreground mt-1">Mindestens 8 Zeichen</p>
          </div>

          <div>
            <Label for="confirm_password">Neues Passwort bestätigen</Label>
            <Input id="confirm_password" v-model="form.confirm_password" type="password" required />
          </div>

          <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="p-4 bg-green-100 text-green-800 rounded-lg">
            {{ success }}
          </div>

          <div class="flex justify-end">
            <Button type="submit" :loading="saving">Passwort ändern</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>