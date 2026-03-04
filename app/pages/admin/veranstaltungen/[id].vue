<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const config = useRuntimeConfig()

const isNew = computed(() => route.params.id === 'new')

const form = ref({
  title: '',
  beschreibung: '',
  start_datum: '',
  end_datum: '',
  ort: '',
  ziel_id: null as number | null
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Load existing if editing
if (!isNew.value) {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/veranstaltungen/${route.params.id}`)
    if (response.ok) {
      const result = await response.json()
      const v = result.data || result
      form.value = {
        title: v.title || '',
        beschreibung: v.beschreibung || '',
        start_datum: v.start_datum?.substring(0, 10) || '',
        end_datum: v.end_datum?.substring(0, 10) || '',
        ort: v.ort || '',
        ziel_id: v.ziel_id || null
      }
    }
  } catch (e) {
    console.error('Failed to load veranstaltung', e)
    error.value = 'Fehler beim Laden'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const url = isNew.value
      ? `${config.public.apiBase}/veranstaltungen`
      : `${config.public.apiBase}/veranstaltungen/${route.params.id}`

    const response = await fetch(url, {
      method: isNew.value ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify(form.value)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Speichern fehlgeschlagen')
    }

    router.push('/admin/veranstaltungen')
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/veranstaltungen" class="text-muted-foreground hover:text-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isNew ? 'Neue Veranstaltung' : 'Veranstaltung bearbeiten' }}</h1>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-muted-foreground">Laden...</p>
    </div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="title">Titel *</Label>
            <Input id="title" v-model="form.title" required />
          </div>
          <div>
            <Label for="ort">Ort</Label>
            <Input id="ort" v-model="form.ort" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="start">Startdatum</Label>
              <Input id="start" v-model="form.start_datum" type="date" />
            </div>
            <div>
              <Label for="end">Enddatum</Label>
              <Input id="end" v-model="form.end_datum" type="date" />
            </div>
          </div>
          <div>
            <Label>Beschreibung</Label>
            <RichEditor v-model="form.beschreibung" class="mt-1" />
          </div>
        </CardContent>
      </Card>

      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
        {{ error }}
      </div>

      <div class="flex justify-end gap-4">
        <NuxtLink to="/admin/veranstaltungen">
          <Button type="button" variant="outline">Abbrechen</Button>
        </NuxtLink>
        <Button type="submit" :loading="saving">Speichern</Button>
      </div>
    </form>
  </div>
</template>