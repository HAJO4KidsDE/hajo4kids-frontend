<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()

const form = ref({
  email: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

async function submitForgotPassword() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Anfrage fehlgeschlagen')
    }

    const data = await response.json()
    success.value = 'Falls die E-Mail existiert, wurde ein Reset-Link gesendet.'
    
    // Development: Show token for testing
    if (data.dev_token) {
      success.value += ` (Dev-Token: ${data.dev_token})`
    }
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
      <h1 class="text-3xl font-bold">Passwort vergessen?</h1>
      <p class="text-muted-foreground mt-2">Gib deine E-Mail ein, um dein Passwort zurückzusetzen</p>
    </div>

    <Card>
      <CardContent class="pt-6">
        <form @submit.prevent="submitForgotPassword" class="space-y-4">
          <div>
            <Label for="email">E-Mail</Label>
            <Input id="email" v-model="form.email" type="email" required />
          </div>

          <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
            {{ error }}
          </div>

          <div v-if="success" class="p-4 bg-green-100 text-green-800 rounded-lg">
            {{ success }}
          </div>

          <Button type="submit" :loading="loading" class="w-full">
            Reset-Link senden
          </Button>

          <div class="text-center">
            <NuxtLink to="/auth/login" class="text-primary hover:underline">
              Zurück zum Login
            </NuxtLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>