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
  username: '',
  first_name: '',
  last_name: '',
  email: ''
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

// Load user data
watch(() => auth.user.value, (user) => {
  if (user) {
    form.value.username = user.username || ''
    form.value.first_name = user.first_name || ''
    form.value.last_name = user.last_name || ''
    form.value.email = user.email || ''
  }
}, { immediate: true })

async function saveProfile() {
  saving.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await fetch(`${config.public.apiBase}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify({
        username: form.value.username,
        first_name: form.value.first_name,
        last_name: form.value.last_name
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Speichern fehlgeschlagen')
    }

    const data = await response.json()
    // Update local auth state
    success.value = 'Profil erfolgreich aktualisiert!'
    
    // Refresh user data
    await auth.initSession()
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
      <h1 class="text-3xl font-bold">Mein Profil</h1>
      <p class="text-muted-foreground">Verwalte deine Account-Einstellungen</p>
    </div>

    <Card v-if="auth.user.value">
      <CardHeader>
        <CardTitle>Profilinformationen</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="first_name">Vorname</Label>
              <Input id="first_name" v-model="form.first_name" />
            </div>
            <div>
              <Label for="last_name">Nachname</Label>
              <Input id="last_name" v-model="form.last_name" />
            </div>
          </div>

          <div>
            <Label for="username">Benutzername</Label>
            <Input id="username" v-model="form.username" />
          </div>

          <div>
            <Label for="email">E-Mail</Label>
            <Input id="email" v-model="form.email" disabled />
            <p class="text-sm text-muted-foreground mt-1">E-Mail kann nicht geändert werden</p>
          </div>

          <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="p-4 bg-green-100 text-green-800 rounded-lg">
            {{ success }}
          </div>

          <div class="flex justify-end">
            <Button type="submit" :loading="saving">Speichern</Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Passwort ändern</CardTitle>
      </CardHeader>
      <CardContent>
        <NuxtLink to="/profil/passwort">
          <Button variant="outline">Passwort ändern</Button>
        </NuxtLink>
      </CardContent>
    </Card>

    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">Rolle</p>
            <p class="text-sm text-muted-foreground">{{ auth.user.value?.role || 'user' }}</p>
          </div>
          <Button variant="destructive" @click="auth.logout(); router.push('/')">
            Abmelden
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>