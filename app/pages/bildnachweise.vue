<script setup lang="ts">
const config = useRuntimeConfig()

interface Bild {
  id: number
  filename: string
  original_name: string
  autor: string
  beschreibung: string
}

interface BilderResponse {
  data: Bild[]
  meta?: { total: number; page: number; per_page: number; last_page: number }
}

const searchQuery = ref('')
const { data: result, pending } = await useApiGet<BilderResponse>('/bilder?with_author=true&per_page=200')

// Extract bilder array from response
const bilder = computed(() => {
  if (!result.value) return []
  // Handle both paginated response ({ data: [...], meta }) and direct array
  if (Array.isArray(result.value)) return result.value
  return result.value.data || []
})

// Filter and group by author
const filteredBilder = computed(() => {
  const search = searchQuery.value.toLowerCase()
  return bilder.value.filter(b => 
    b.autor && (
      b.autor.toLowerCase().includes(search) ||
      (b.beschreibung || '').toLowerCase().includes(search) ||
      (b.original_name || '').toLowerCase().includes(search)
    )
  )
})

const authors = computed(() => {
  const authorSet = new Set<string>()
  filteredBilder.value.forEach(b => {
    if (b.autor) authorSet.add(b.autor)
  })
  return Array.from(authorSet).sort()
})

const bilderByAuthor = computed(() => {
  const grouped: Record<string, Bild[]> = {}
  authors.value.forEach(author => {
    grouped[author] = filteredBilder.value.filter(b => b.autor === author)
  })
  return grouped
})
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Bildnachweise</h1>
      <p class="text-muted-foreground">Ehre, wem Ehre gebührt</p>
    </div>

    <Card class="mb-6">
      <CardContent class="pt-6">
        <p class="text-muted-foreground mb-4">
          Da eine Vielzahl unserer gezeigten Bilder nicht durch unsere Kameras entstand, haben wir hier eine 
          Liste der Autoren angelegt.
        </p>
        <p class="text-muted-foreground mb-6">
          Sollte trotz sorgfältiger Pflege eins fehlen, schreibt uns doch bitte einen kurzen Hinweis über 
          unser <NuxtLink to="/kontakt" class="text-primary hover:underline">Kontaktformular</NuxtLink>.
        </p>
        <Input
          v-model="searchQuery"
          placeholder="Nach Autoren oder Bildern suchen..."
          class="max-w-md"
        />
      </CardContent>
    </Card>

    <div v-if="pending" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>

    <div v-else-if="authors.length === 0" class="text-center py-12">
      <p class="text-muted-foreground">Keine Bildnachweise gefunden</p>
    </div>

    <div v-else class="space-y-6">
      <Card v-for="author in authors" :key="author">
        <CardHeader>
          <CardTitle class="text-lg">{{ author }}</CardTitle>
          <CardDescription>{{ bilderByAuthor[author].length }} Bild{{ bilderByAuthor[author].length !== 1 ? 'er' : '' }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="bild in bilderByAuthor[author]"
              :key="bild.id"
              class="aspect-square rounded-lg overflow-hidden bg-muted group relative"
            >
              <img
                :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${bild.id}`"
                :alt="bild.original_name || bild.beschreibung || 'Bild'"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div 
                v-if="bild.beschreibung || bild.original_name"
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2"
              >
                <p class="text-white text-xs text-center line-clamp-3">
                  {{ bild.beschreibung || bild.original_name }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="mt-8">
      <CardContent class="pt-6">
        <p class="text-muted-foreground">
          Du bist Fotograf und hast Dich auf Fotos mit und für Kinder spezialisiert? Dann 
          <NuxtLink to="/kontakt" class="text-primary hover:underline">melde Dich</NuxtLink>! 
          Wir präsentieren Dich gerne auf unserer Seite.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>