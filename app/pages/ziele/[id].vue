<script setup lang="ts">
const route = useRoute()
const router = useRouter()
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
  kategorien: { id: number; name: string; bild: string }[]
  rating: number
  favorits: number
  favorit: boolean
}

const { data: ziel, error, pending } = await useApiGet<Ziel>(`/ziele/${route.params.id}`)

// Optimistic favorite toggle
const favoritLoading = ref(false)

async function toggleFavorit() {
  if (!auth.isLoggedIn.value) {
    router.push('/auth/login')
    return
  }
  
  if (!ziel.value || favoritLoading.value) return
  
  favoritLoading.value = true
  const wasFavorit = ziel.value.favorit
  
  // Optimistic update
  ziel.value.favorit = !wasFavorit
  ziel.value.favorits = (ziel.value.favorits || 0) + (wasFavorit ? -1 : 1)
  
  try {
    if (wasFavorit) {
      await fetch(`${config.public.apiBase}/favoriten/${ziel.value.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token.value}`
        }
      })
    } else {
      await fetch(`${config.public.apiBase}/favoriten/${ziel.value.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token.value}`
        }
      })
    }
  } catch (e) {
    // Revert on error
    ziel.value.favorit = wasFavorit
    ziel.value.favorits = (ziel.value.favorits || 0) + (wasFavorit ? 1 : -1)
    console.error('Failed to toggle favorit', e)
  } finally {
    favoritLoading.value = false
  }
}

// Parse opening hours string into structured data
function parseOeffnungszeiten(text: string): { day: string; hours: string }[] {
  if (!text) return []
  
  // Split by common delimiters (comma, newline, <br>)
  const lines = text.split(/[,\n]|<br\s*\/?>/i)
    .map(l => l.trim())
    .filter(l => l.length > 0)
  
  const result: { day: string; hours: string }[] = []
  
  for (const line of lines) {
    // Match patterns like "Montag: 09:00–17:00 Uhr" or "Montag: 24 Stunden geöffnet"
    const match = line.match(/^(\w+):\s*(.+)$/i)
    if (match) {
      result.push({
        day: match[1],
        hours: match[2].trim()
      })
    }
  }
  
  return result
}

// Check if a day name matches today
function isToday(dayName: string): boolean {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
  const today = days[new Date().getDay()]
  return dayName === today
}

// Format hours for display
function formatHours(hours: string): string {
  // Clean up and format
  return hours
    .replace(/Uhr$/i, '')
    .replace(/(\d{2}):(\d{2})\s*–\s*(\d{2}):(\d{2})/, '$1:$2 – $3:$4')
    .trim()
}

// Check if currently open based on hours string
function isCurrentlyOpen(hours: string): boolean {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  // Handle 24 hours
  if (hours.includes('24 Stunden') || hours === '00:00–23:59') {
    return true
  }
  
  // Parse time range like "09:00–17:00"
  const match = hours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/)
  if (match) {
    const openHour = parseInt(match[1], 10)
    const openMin = parseInt(match[2], 10)
    const closeHour = parseInt(match[3], 10)
    const closeMin = parseInt(match[4], 10)
    
    const openTime = openHour * 60 + openMin
    const closeTime = closeHour * 60 + closeMin
    
    return currentTime >= openTime && currentTime <= closeTime
  }
  
  return false
}

// Check if open today
function isOpenToday(text: string): boolean {
  if (!text) return false
  const hours = parseOeffnungszeiten(text)
  const todayEntry = hours.find(h => isToday(h.day))
  if (!todayEntry) return false
  return isCurrentlyOpen(todayEntry.hours)
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
  
  <article v-else-if="ziel" class="animate-fade-in">
    <!-- Header -->
    <div class="mb-8 animate-slide-up" style="animation-delay: 0ms">
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
            :disabled="favoritLoading"
            @click="toggleFavorit"
            class="transition-all duration-300"
            :class="{ 'scale-105': ziel.favorit }"
          >
            <span class="inline-flex items-center gap-2">
              <svg 
                v-if="favoritLoading" 
                class="animate-spin h-4 w-4" 
                fill="none" viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-else class="text-lg">{{ ziel.favorit ? '❤️' : '🤍' }}</span>
              <span>{{ ziel.favorit ? 'Favorit' : 'Merken' }}</span>
            </span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Gallery -->
    <div class="mb-8 animate-slide-up" style="animation-delay: 100ms">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 aspect-video rounded-lg overflow-hidden bg-muted group">
          <img
            v-if="ziel.bilder?.length > 0"
            :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${ziel.bilder[0].id}`"
            :alt="ziel.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <img
            v-else-if="ziel.kategorien?.length > 0 && ziel.kategorien[0].bild"
            :src="ziel.kategorien[0].bild"
            :alt="ziel.kategorien[0].name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div v-if="ziel.bilder?.length > 1" class="grid grid-cols-2 gap-4">
          <div
            v-for="(bild, index) in ziel.bilder.slice(1, 5)"
            :key="bild.id"
            class="aspect-square rounded-lg overflow-hidden bg-muted group"
            :style="{ animationDelay: `${150 + index * 50}ms` }"
          >
            <img
              :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${bild.id}`"
              :alt="ziel.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up" style="animation-delay: 200ms">
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <Card>
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="ziel.beschreibung" class="prose prose-sm dark:prose-invert max-w-none" v-html="ziel.beschreibung" />
            <p v-else class="text-muted-foreground">{{ ziel.auszug }}</p>
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
        <!-- Opening Hours -->
        <Card v-if="ziel.oeffnungszeiten && parseOeffnungszeiten(ziel.oeffnungszeiten).length > 0">
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2">
              <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Öffnungszeiten
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-0">
            <div class="space-y-1.5 text-sm">
              <div
                v-for="(line, idx) in parseOeffnungszeiten(ziel.oeffnungszeiten)"
                :key="idx"
                class="flex justify-between items-center py-1 border-b border-border/50 last:border-0"
                :class="{ 'bg-primary/5 -mx-2 px-2 rounded': isToday(line.day) }"
              >
                <span :class="{ 'font-semibold': isToday(line.day) }">{{ line.day }}</span>
                <span
                  class="text-right"
                  :class="{
                    'font-semibold text-primary': isToday(line.day),
                    'text-green-600 dark:text-green-400': isCurrentlyOpen(line.hours) && isToday(line.day)
                  }"
                >
                  {{ formatHours(line.hours) }}
                </span>
              </div>
            </div>
            <div v-if="isOpenToday(ziel.oeffnungszeiten)" class="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Jetzt geöffnet
            </div>
          </CardContent>
        </Card>

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
  </article>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.4s ease-out both;
}
</style>