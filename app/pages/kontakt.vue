<script setup lang="ts">
const form = ref({
  name: '',
  email: '',
  betreff: '',
  nachricht: '',
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

async function submitForm() {
  if (!form.value.name || !form.value.email || !form.value.nachricht) {
    error.value = 'Bitte fülle alle Pflichtfelder aus'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/v1/kontakt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    if (!response.ok) {
      throw new Error('Fehler beim Senden')
    }

    success.value = true
    form.value = { name: '', email: '', betreff: '', nachricht: '' }
  } catch (e: any) {
    error.value = e.message || 'Fehler beim Senden der Nachricht'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Kontakt</h1>
        <p class="text-muted-foreground">Schreibe uns eine Nachricht</p>
      </div>

      <Card v-if="success" class="mb-6 border-green-200 bg-green-50">
        <CardContent class="p-6 text-center">
          <svg class="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-lg font-semibold text-green-800">Nachricht gesendet!</h2>
          <p class="text-green-600">Vielen Dank für deine Nachricht. Wir melden uns schnellstmöglich.</p>
          <Button
            class="mt-4 border-primary text-primary hover:bg-primary/10"
            variant="outline"
            @click="success = false"
          >
            Weitere Nachricht senden
          </Button>
        </CardContent>
      </Card>

      <Card v-else>
        <CardContent class="p-6">
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Name *</Label>
                <Input
                  id="name"
                  v-model="form.name"
                  placeholder="Dein Name"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="email">E-Mail *</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@beispiel.de"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="betreff">Betreff</Label>
              <Input
                id="betreff"
                v-model="form.betreff"
                placeholder="Was möchtest du uns mitteilen?"
              />
            </div>

            <div class="space-y-2">
              <Label for="nachricht">Nachricht *</Label>
              <textarea
                id="nachricht"
                v-model="form.nachricht"
                rows="5"
                placeholder="Deine Nachricht an uns..."
                required
                class="flex min-h-[80px] w-full rounded-lg border border-input bg-background/70 px-3 py-2 text-sm shadow-sm backdrop-blur-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div v-if="error" class="text-sm text-destructive">
              {{ error }}
            </div>

            <Button type="submit" :loading="loading" class="w-full">
              Nachricht senden
            </Button>
          </form>
        </CardContent>
      </Card>

      <!-- Additional Info -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">E-Mail</CardTitle>
          </CardHeader>
          <CardContent>
            <a href="mailto:info@hajo4kids.de" class="text-primary hover:underline">
              info@hajo4kids.de
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex gap-4">
              <a href="#" class="text-muted-foreground hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="text-muted-foreground hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" class="text-muted-foreground hover:text-primary">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>