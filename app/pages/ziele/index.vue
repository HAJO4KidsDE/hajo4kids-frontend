<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  adresse: string
  auszug: string
  beschreibung: string
  latitude: number
  longitude: number
  bilder: { id: number; filename: string }[]
  kategorien: { id: number; name: string }[]
  rating: number
  favorits: number
  favorit: boolean
}

interface Meta {
  total: number
  page: number
  per_page: number
  last_page: number
}

const searchQuery = ref(route.query.q as string || '')
const selectedStadt = ref(route.query.stadt as string || '')
const selectedKategorie = ref(route.query.kategorie as string || '')

const { data: kategorien } = await useApiGet<{ id: number; name: string }[]>('/kategorien')

const query = computed(() => {
  const params = new URLSearchParams()
  if (searchQuery.value) params.append('q', searchQuery.value)
  if (selectedStadt.value) params.append('stadt', selectedStadt.value)
  if (selectedKategorie.value) params.append('kategorie', selectedKategorie.value)
  return params.toString()
})

const { data: result, pending, execute } = await useApiGet<{ data: Ziel[]; meta: Meta }>(
  `/ziele?limit=12${query.value ? '&' + query.value : ''}`
)

// Handle both paginated response (with meta) and direct array response
const ziele = computed(() => {
  if (Array.isArray(result.value)) {
    return result.value
  }
  return result.value?.data || []
})
const meta = computed(() => {
  if (Array.isArray(result.value)) {
    return undefined
  }
  return result.value?.meta
})

watch([searchQuery, selectedStadt, selectedKategorie], () => {
  execute()
})
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold">Ausflugsziele</h1>
        <p class="text-muted-foreground">
          Entdecke tolle Orte für deine Familie
        </p>
      </div>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <Input
              v-model="searchQuery"
              placeholder="Suchen..."
            />
          </div>
          <Input
            v-model="selectedStadt"
            placeholder="Stadt"
            class="md:w-48"
          />
          <select
            v-model="selectedKategorie"
            class="flex h-10 w-full md:w-48 rounded-lg border border-input bg-background/70 px-3 py-2 text-sm shadow-sm backdrop-blur-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2"
          >
            <option value="">Alle Kategorien</option>
            <option v-for="kat in kategorien" :key="kat.id" :value="kat.name">
              {{ kat.name }}
            </option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- Results -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-80 bg-muted rounded-lg animate-pulse" />
    </div>
    
    <div v-else-if="ziele.length === 0" class="text-center py-12">
      <p class="text-muted-foreground">Keine Ziele gefunden</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="ziel in ziele"
        :key="ziel.id"
        :to="`/ziele/${ziel.slugname || ziel.id}`"
      >
        <Card class="overflow-hidden hover:shadow-lg transition-shadow h-full">
          <div class="aspect-video bg-muted relative">
            <img
              v-if="ziel.bilder?.length > 0"
              :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${ziel.bilder[0].id}`"
              :alt="ziel.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div v-if="ziel.kategorien?.length > 0" class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                {{ ziel.kategorien[0].name }}
              </span>
            </div>
          </div>
          <CardHeader>
            <CardTitle class="line-clamp-1">{{ ziel.name }}</CardTitle>
            <CardDescription v-if="ziel.stadt" class="flex items-center gap-1">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ ziel.stadt }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p v-if="ziel.auszug" class="text-sm text-muted-foreground line-clamp-2 mb-4">
              {{ ziel.auszug }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 text-sm">
                <span v-if="ziel.rating" class="flex items-center gap-1">
                  <svg class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ ziel.rating.toFixed(1) }}
                </span>
              </div>
              <span v-if="ziel.favorit" class="text-sm text-primary">
                ❤️ Favorit
              </span>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.last_page > 1" class="mt-8 flex justify-center gap-2">
      <Button
        variant="outline"
        :disabled="meta.page <= 1"
        @click="execute()"
      >
        Zurück
      </Button>
      <span class="flex items-center px-4 text-sm text-muted-foreground">
        Seite {{ meta.page }} von {{ meta.last_page }}
      </span>
      <Button
        variant="outline"
        :disabled="meta.page >= meta.last_page"
        @click="execute()"
      >
        Weiter
      </Button>
    </div>
  </div>
</template>