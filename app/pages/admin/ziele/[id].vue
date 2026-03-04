<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const auth = useAuth()
const config = useRuntimeConfig()

const isNew = computed(() => route.params.id === 'new')

// Form data
const form = ref({
  name: '',
  slugname: '',
  stadt: '',
  adresse: '',
  webseite: '',
  telefonnummer: '',
  auszug: '',
  beschreibung: '',
  oeffnungszeiten: '',
  vorteile: '',
  latitude: null as number | null,
  longitude: null as number | null,
  status: 'draft',
  kategorien: [] as number[],
  bilder: [] as number[]
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Load existing data if editing
if (!isNew.value) {
  const { data: ziel } = await useApiGet<any>(`/ziele/${route.params.id}`)
  if (ziel.value) {
    form.value = {
      name: ziel.value.name || '',
      slugname: ziel.value.slugname || '',
      stadt: ziel.value.stadt || '',
      adresse: ziel.value.adresse || '',
      webseite: ziel.value.webseite || '',
      telefonnummer: ziel.value.telefonnummer || '',
      auszug: ziel.value.auszug || '',
      beschreibung: ziel.value.beschreibung || '',
      oeffnungszeiten: ziel.value.oeffnungszeiten || '',
      vorteile: ziel.value.vorteile || '',
      latitude: ziel.value.latitude,
      longitude: ziel.value.longitude,
      status: ziel.value.status || 'draft',
      kategorien: ziel.value.kategorien?.map((k: any) => k.id) || [],
      bilder: ziel.value.bilder?.map((b: any) => b.id) || []
    }
  }
}

// Load categories
const { data: kategorien } = await useApiGet<any[]>('/kategorien')

async function save() {
  saving.value = true
  error.value = ''

  try {
    const url = isNew.value
      ? `${config.public.apiBase}/ziele`
      : `${config.public.apiBase}/ziele/${route.params.id}`

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

    router.push('/admin/ziele')
  } catch (e: any) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

// Auto-generate slug from name
watch(() => form.value.name, (name) => {
  if (isNew.value && name) {
    form.value.slugname = name
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})
</script>

<template>
  <div class="mb-8">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/ziele" class="text-muted-foreground hover:text-primary">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">{{ isNew ? 'Neues Ziel' : 'Ziel bearbeiten' }}</h1>
        <p class="text-muted-foreground">{{ form.name || 'Unbenannt' }}</p>
      </div>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <!-- Basic Info -->
      <Card>
        <CardHeader>
          <CardTitle>Grunddaten</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="name">Name *</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div>
              <Label for="slugname">URL-Slug</Label>
              <Input id="slugname" v-model="form.slugname" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="stadt">Stadt</Label>
              <Input id="stadt" v-model="form.stadt" />
            </div>
            <div>
              <Label for="adresse">Adresse</Label>
              <Input id="adresse" v-model="form.adresse" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="webseite">Webseite</Label>
              <Input id="webseite" v-model="form.webseite" type="url" />
            </div>
            <div>
              <Label for="telefonnummer">Telefon</Label>
              <Input id="telefonnummer" v-model="form.telefonnummer" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="latitude">Latitude</Label>
              <Input id="latitude" v-model.number="form.latitude" type="number" step="any" />
            </div>
            <div>
              <Label for="longitude">Longitude</Label>
              <Input id="longitude" v-model.number="form.longitude" type="number" step="any" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Categories -->
      <Card>
        <CardHeader>
          <CardTitle>Kategorien</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="kat in kategorien"
              :key="kat.id"
              class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors"
              :class="form.kategorien.includes(kat.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'"
            >
              <input
                type="checkbox"
                :value="kat.id"
                :checked="form.kategorien.includes(kat.id)"
                @change="form.kategorien.includes(kat.id) ? form.kategorien = form.kategorien.filter(id => id !== kat.id) : form.kategorien.push(kat.id)"
                class="sr-only"
              />
              <span>{{ kat.name }}</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <!-- Description -->
      <Card>
        <CardHeader>
          <CardTitle>Beschreibung</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label for="auszug">Kurzbeschreibung</Label>
            <textarea
              id="auszug"
              v-model="form.auszug"
              rows="2"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              placeholder="Kurze Zusammenfassung für Listenansicht"
            />
          </div>
          <div>
            <Label for="beschreibung">Beschreibung (HTML möglich)</Label>
            <textarea
              id="beschreibung"
              v-model="form.beschreibung"
              rows="6"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              placeholder="Vollständige Beschreibung"
            />
          </div>
          <div>
            <Label for="oeffnungszeiten">Öffnungszeiten</Label>
            <textarea
              id="oeffnungszeiten"
              v-model="form.oeffnungszeiten"
              rows="4"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              placeholder="Montag: 09:00–17:00 Uhr"
            />
          </div>
          <div>
            <Label for="vorteile">Vorteile / Besonders geeignet für</Label>
            <textarea
              id="vorteile"
              v-model="form.vorteile"
              rows="3"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Status -->
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.status" value="draft" />
              <span>Entwurf</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.status" value="published" />
              <span>Veröffentlicht</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <!-- Error -->
      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <NuxtLink to="/admin/ziele">
          <Button type="button" variant="outline">Abbrechen</Button>
        </NuxtLink>
        <Button type="submit" :loading="saving">
          {{ saving ? 'Speichern...' : 'Speichern' }}
        </Button>
      </div>
    </form>
  </div>
</template>