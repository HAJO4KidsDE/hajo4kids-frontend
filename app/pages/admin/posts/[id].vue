<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const config = useRuntimeConfig()

const isNew = computed(() => route.params.id === 'new')

const form = ref({
  title: '',
  excerpt: '',
  inhalt: '',
  kategorie: '',
  tags: '',
  status: 'draft'
})

const saving = ref(false)
const error = ref('')

// Load existing if editing
if (!isNew.value) {
  const { data: p } = await useApiGet<any>(`/posts/${route.params.id}`)
  if (p.value) {
    form.value = {
      title: p.value.title || '',
      excerpt: p.value.excerpt || '',
      inhalt: p.value.inhalt || '',
      kategorie: p.value.kategorie || '',
      tags: p.value.tags || '',
      status: p.value.status || 'draft'
    }
  }
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const url = isNew.value
      ? `${config.public.apiBase}/posts`
      : `${config.public.apiBase}/posts/${route.params.id}`

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

    router.push('/admin/posts')
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
      <NuxtLink to="/admin/posts" class="text-muted-foreground hover:text-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isNew ? 'Neuer Blog-Post' : 'Post bearbeiten' }}</h1>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Inhalt</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="title">Titel *</Label>
            <Input id="title" v-model="form.title" required />
          </div>
          <div>
            <Label for="excerpt">Kurzbeschreibung</Label>
            <textarea
              id="excerpt"
              v-model="form.excerpt"
              rows="2"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              placeholder="Kurze Zusammenfassung für Listenansicht"
            />
          </div>
          <div>
            <Label for="inhalt">Inhalt (HTML möglich)</Label>
            <textarea
              id="inhalt"
              v-model="form.inhalt"
              rows="10"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadaten</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="kategorie">Kategorie</Label>
            <Input id="kategorie" v-model="form.kategorie" placeholder="z.B. Neuigkeiten" />
          </div>
          <div>
            <Label for="tags">Tags (Komma-getrennt)</Label>
            <Input id="tags" v-model="form.tags" placeholder="Familie, Ausflug, Tipps" />
          </div>
          <div>
            <Label>Status</Label>
            <div class="flex gap-4 mt-2">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.status" value="draft" />
                <span>Entwurf</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" v-model="form.status" value="published" />
                <span>Veröffentlicht</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
        {{ error }}
      </div>

      <div class="flex justify-end gap-4">
        <NuxtLink to="/admin/posts">
          <Button type="button" variant="outline">Abbrechen</Button>
        </NuxtLink>
        <Button type="submit" :loading="saving">Speichern</Button>
      </div>
    </form>
  </div>
</template>