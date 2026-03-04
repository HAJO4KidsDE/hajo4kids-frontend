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
  status: 'DESIGN',
  kategorien: [] as number[],
  bilder: [] as number[]
})

const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Load categories
const { data: kategorien } = await useApiGet<any[]>('/kategorien')

// Load existing data if editing
if (!isNew.value) {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/ziele/${route.params.id}`)
    if (response.ok) {
      const result = await response.json()
      const ziel = result.data || result // Handle both {data: {...}} and {...}
      form.value = {
        name: ziel.name || '',
        slugname: ziel.slugname || '',
        stadt: ziel.stadt || '',
        adresse: ziel.adresse || '',
        webseite: ziel.webseite || '',
        telefonnummer: ziel.telefonnummer || '',
        auszug: ziel.auszug || '',
        beschreibung: ziel.beschreibung || '',
        oeffnungszeiten: ziel.oeffnungszeiten || '',
        vorteile: ziel.vorteile || '',
        latitude: ziel.latitude,
        longitude: ziel.longitude,
        status: ziel.status || 'draft',
        kategorien: ziel.kategorien?.map((k: any) => k.id) || [],
        bilder: ziel.bilder?.map((b: any) => b.id) || []
      }
    }
  } catch (e) {
    console.error('Failed to load ziel', e)
    error.value = 'Fehler beim Laden des Ziels'
  } finally {
    loading.value = false
  }
}

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

async function deleteZiel() {
  if (!confirm('Möchten Sie dieses Ziel wirklich löschen?')) return

  try {
    const response = await fetch(`${config.public.apiBase}/ziele/${route.params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token.value}`
      }
    })

    if (!response.ok) {
      throw new Error('Löschen fehlgeschlagen')
    }

    router.push('/admin/ziele')
  } catch (e: any) {
    error.value = e.message
  }
}
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
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-muted-foreground">Laden...</p>
    </div>

    <form v-else @submit.prevent="save" class="space-y-6">
      <!-- Basisdaten -->
      <Card>
        <CardHeader>
          <CardTitle>Basisdaten</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="name">Name *</Label>
              <Input id="name" v-model="form.name" required />
            </div>
            <div>
              <Label for="slugname">Slug</Label>
              <Input id="slugname" v-model="form.slugname" placeholder="automatisch generiert" />
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
              <Input id="webseite" v-model="form.webseite" type="url" placeholder="https://" />
            </div>
            <div>
              <Label for="telefon">Telefon</Label>
              <Input id="telefon" v-model="form.telefonnummer" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Beschreibung -->
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
            />
          </div>
          <div>
            <Label for="oeffnungszeiten">Öffnungszeiten</Label>
            <textarea
              id="oeffnungszeiten"
              v-model="form.oeffnungszeiten"
              rows="3"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              placeholder="Mo-Fr: 9:00-18:00&#10;Sa: 10:00-14:00"
            />
          </div>
          <div>
            <Label for="vorteile">Vorteile / Besonderheiten</Label>
            <textarea
              id="vorteile"
              v-model="form.vorteile"
              rows="3"
              class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Standort -->
      <Card>
        <CardHeader>
          <CardTitle>Standort</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="lat">Latitude</Label>
              <Input id="lat" v-model.number="form.latitude" type="number" step="any" />
            </div>
            <div>
              <Label for="lng">Longitude</Label>
              <Input id="lng" v-model.number="form.longitude" type="number" step="any" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Kategorien -->
      <Card>
        <CardHeader>
          <CardTitle>Kategorien</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="kat in kategorien"
              :key="kat.id"
              class="flex items-center gap-2 px-3 py-1 border rounded-md cursor-pointer hover:bg-accent"
              :class="{ 'bg-primary text-primary-foreground': form.kategorien.includes(kat.id) }"
            >
              <input
                type="checkbox"
                :value="kat.id"
                v-model="form.kategorien"
                class="sr-only"
              />
              {{ kat.name }}
            </label>
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
              <input type="radio" v-model="form.status" value="DESIGN" />
              <span>Entwurf</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" v-model="form.status" value="PUBLISHED" />
              <span>Veröffentlicht</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div v-if="error" class="p-4 bg-destructive/10 text-destructive rounded-lg">
        {{ error }}
      </div>

      <div class="flex justify-between">
        <div>
          <Button
            v-if="!isNew"
            type="button"
            variant="destructive"
            @click="deleteZiel"
          >
            Löschen
          </Button>
        </div>
        <div class="flex gap-4">
          <NuxtLink to="/admin/ziele">
            <Button type="button" variant="outline">Abbrechen</Button>
          </NuxtLink>
          <Button type="submit" :loading="saving">Speichern</Button>
        </div>
      </div>
    </form>
  </div>
</template>