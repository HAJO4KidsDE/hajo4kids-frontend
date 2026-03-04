<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const config = useRuntimeConfig()

const isNew = computed(() => route.params.id === 'new')

const form = ref({
  title: '',
  beschreibung: '',
  is_public: true
})

const saving = ref(false)
const error = ref('')

// Load existing if editing
if (!isNew.value) {
  const { data: t } = await useApiGet<any>(`/trips/${route.params.id}`)
  if (t.value) {
    form.value = {
      title: t.value.title || '',
      beschreibung: t.value.beschreibung || '',
      is_public: t.value.is_public ?? true
    }
  }
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const url = isNew.value
      ? `${config.public.apiBase}/trips`
      : `${config.public.apiBase}/trips/${route.params.id}`

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

    router.push('/admin/trips')
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
      <NuxtLink to="/admin/trips" class="text-muted-foreground hover:text-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isNew ? 'Neuer Trip' : 'Trip bearbeiten' }}</h1>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
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
            <Label for="beschreibung">Beschreibung</Label>
            <textarea
              id="beschreibung"
              v-model="form.beschreibung"
              rows="4"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="public" v-model="form.is_public" />
            <Label for="public" class="cursor-pointer">Öffentlich sichtbar</Label>
          </div>
        </CardContent>
      </Card>

      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
        {{ error }}
      </div>

      <div class="flex justify-end gap-4">
        <NuxtLink to="/admin/trips">
          <Button type="button" variant="outline">Abbrechen</Button>
        </NuxtLink>
        <Button type="submit" :loading="saving">Speichern</Button>
      </div>
    </form>
  </div>
</template>