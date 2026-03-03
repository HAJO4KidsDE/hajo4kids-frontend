<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuth()

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  adresse: string
  webseite: string
  facebook: string
  telefonnummer: string
  auszug: string
  beschreibung: string
  oeffnungszeiten: string
  vorteile: string
  latitude: number
  longitude: number
  bilder: { id: number; filename: string }[]
  kategorien: { id: number; name: string }[]
  rating: number
  favorits: number
  favorit: boolean
}

const { data: ziel, error, pending } = await useApiGet<Ziel>(`/ziele/${route.params.id}`)

async function toggleFavorit() {
  if (!auth.isLoggedIn.value) {
    // Redirect to login
    return
  }
  // TODO: Implement favorit toggle
}
</script>

<template>
  <div v-if="pending" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
  
  <div v-else-if="error" class="text-center py-12">
    <h1 class="text-2xl font-bold mb-4">Ziel nicht gefunden</h1>
    <p class="text-muted-foreground mb-4">{{ error.message }}</p>
    <NuxtLink to="/ziele">
      <Button>Zurück zur Übersicht</Button>
    </NuxtLink>
  </div>
  
  <div v-else-if="ziel">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/ziele" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zur Übersicht
      </NuxtLink>
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ ziel.name }}</h1>
          <div class="flex items-center gap-4 text-muted-foreground">
            <span v-if="ziel.stadt" class="flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ ziel.stadt }}
            </span>
            <span v-if="ziel.rating" class="flex items-center gap-1">
              <svg class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {{ ziel.rating.toFixed(1) }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <Button
            :variant="ziel.favorit ? 'default' : 'outline'"
            @click="toggleFavorit"
          >
            {{ ziel.favorit ? '❤️ Favorit' : '🤍 Merken' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Gallery -->
    <div v-if="ziel.bilder?.length > 0" class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${ziel.bilder[0].id}`"
            :alt="ziel.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-if="ziel.bilder.length > 1" class="grid grid-cols-2 gap-4">
          <div
            v-for="bild in ziel.bilder.slice(1, 5)"
            :key="bild.id"
            class="aspect-square rounded-lg overflow-hidden bg-muted"
          >
            <img
              :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${bild.id}`"
              :alt="ziel.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <Card>
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="whitespace-pre-line">{{ ziel.beschreibung || ziel.auszug }}</p>
          </CardContent>
        </Card>

        <!-- Vorteile -->
        <Card v-if="ziel.vorteile">
          <CardHeader>
            <CardTitle>Besonders geeignet für</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="whitespace-pre-line">{{ ziel.vorteile }}</p>
          </CardContent>
        </Card>

        <!-- Kategorien -->
        <Card v-if="ziel.kategorien?.length > 0">
          <CardHeader>
            <CardTitle>Kategorien</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="kat in ziel.kategorien"
                :key="kat.id"
                :to="`/ziele?kategorie=${encodeURIComponent(kat.name)}`"
              >
                <Button variant="outline" size="sm">{{ kat.name }}</Button>
              </NuxtLink>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Contact Info -->
        <Card>
          <CardHeader>
            <CardTitle>Kontakt & Info</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="ziel.adresse" class="flex items-start gap-3">
              <svg class="h-5 w-5 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ ziel.adresse }}</span>
            </div>
            <div v-if="ziel.telefonnummer" class="flex items-center gap-3">
              <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a :href="`tel:${ziel.telefonnummer}`" class="text-primary hover:underline">
                {{ ziel.telefonnummer }}
              </a>
            </div>
            <div v-if="ziel.webseite" class="flex items-center gap-3">
              <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a :href="ziel.webseite" target="_blank" class="text-primary hover:underline">
                Webseite besuchen
              </a>
            </div>
            <div v-if="ziel.oeffnungszeiten" class="flex items-start gap-3">
              <svg class="h-5 w-5 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="whitespace-pre-line">{{ ziel.oeffnungszeiten }}</span>
            </div>
          </CardContent>
        </Card>

        <!-- Map placeholder -->
        <Card v-if="ziel.latitude && ziel.longitude">
          <CardHeader>
            <CardTitle>Karte</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Karte wird geladen...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>