<script setup lang="ts">
const router = useRouter()
const config = useRuntimeConfig()

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  auszug: string
  bilder: { id: number; filename: string }[]
  kategorien: { id: number; name: string; bild: string }[]
  rating: number
  favorits: number
}

interface Kategorie {
  id: number
  name: string
  beschreibung: string
  bild: string
}

const searchQuery = ref('')
const searchStadt = ref('')

const { data: featuredZieleRaw, pending: zielePending } = await useApiGet<{ data: Ziel[] } | Ziel[]>('/ziele?limit=6')
const { data: kategorien, pending: kategorienPending } = await useApiGet<Kategorie[]>('/kategorien')

// Handle both paginated response (with meta) and direct array response
const featuredZiele = computed(() => {
  if (Array.isArray(featuredZieleRaw.value)) {
    return featuredZieleRaw.value
  }
  return (featuredZieleRaw.value as { data: Ziel[] })?.data || []
})

function doSearch() {
  const query: Record<string, string> = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (searchStadt.value) query.stadt = searchStadt.value
  router.push({ path: '/ziele', query })
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/14 via-background to-secondary/70 px-6 py-12 shadow-sm sm:px-10 md:py-16">
      <div class="relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-accent/60 px-3 py-1 text-xs font-semibold text-accent-foreground ring-1 ring-border/50">
            <span class="h-1.5 w-1.5 rounded-full bg-primary" />
            Ideen für euren nächsten Familienausflug
          </div>
          <h1 class="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Entdecke tolle <span class="text-primary">Ausflugsziele</span> für Kids!
          </h1>
          <p class="mt-5 text-lg text-muted-foreground sm:text-xl">
            Finde die besten Orte für deine Familie – von Abenteuerspielplätzen bis zu Museen und vielem mehr.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <NuxtLink to="/ziele">
              <Button size="lg" class="w-full sm:w-auto">
                Jetzt entdecken
                <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </NuxtLink>
            <NuxtLink to="/kategorien">
              <Button
                size="lg"
                variant="outline"
                class="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
              >
                Kategorien ansehen
              </Button>
            </NuxtLink>
          </div>

          <div class="mt-8 flex flex-wrap gap-2 text-sm">
            <span class="rounded-full bg-background/60 px-3 py-1 font-semibold text-muted-foreground ring-1 ring-border/60">Indoor & Outdoor</span>
            <span class="rounded-full bg-background/60 px-3 py-1 font-semibold text-muted-foreground ring-1 ring-border/60">Für jedes Alter</span>
            <span class="rounded-full bg-background/60 px-3 py-1 font-semibold text-muted-foreground ring-1 ring-border/60">In deiner Nähe</span>
          </div>
        </div>

        <div class="hidden lg:block">
          <div class="relative rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold">Beliebte Ideen</div>
              <div class="text-xs text-muted-foreground">Schnell startklar</div>
            </div>
            <div class="mt-4 space-y-3">
              <div class="flex items-center gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/60">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/60 text-accent-foreground">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21s-7-4.438-7-11a7 7 0 1114 0c0 6.562-7 11-7 11z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold leading-5">Ausflugsziele in deiner Stadt</div>
                  <div class="text-sm text-muted-foreground">Spielplätze, Parks, Tiere & mehr</div>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/60">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
                    <path stroke-linecap="round" join="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold leading-5">Neue Orte entdecken</div>
                  <div class="text-sm text-muted-foreground">Für Wochenenden & Ferien</div>
                </div>
              </div>
              <div class="flex items-center gap-3 rounded-xl bg-background/60 p-3 ring-1 ring-border/60">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/60 text-secondary-foreground">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <div class="font-semibold leading-5">Für Eltern gemacht</div>
                  <div class="text-sm text-muted-foreground">Übersichtlich & schnell</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
      <div class="pointer-events-none absolute right-16 top-16 h-56 w-56 rounded-full bg-accent/30 blur-3xl" />
      <div class="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/6 to-transparent" />
    </section>

    <!-- Search + Categories Combined -->
    <section class="py-8">
      <Card>
        <CardContent class="p-4 md:p-6">
          <form class="flex flex-col gap-4" @submit.prevent="doSearch">
            <!-- Search Row -->
            <div class="flex flex-col md:flex-row gap-3">
              <Input
                v-model="searchQuery"
                placeholder="Wonach suchst du?"
                class="flex-1"
              />
              <Input
                v-model="searchStadt"
                placeholder="Stadt oder PLZ"
                class="md:w-48"
              />
              <Button type="submit" class="md:w-auto">
                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Suchen
              </Button>
            </div>
            
            <!-- Categories as horizontal scrollable chips -->
            <div v-if="!kategorienPending && kategorien?.length" class="flex items-center gap-2 overflow-x-auto pb-1 -mb-1">
              <span class="text-sm text-muted-foreground whitespace-nowrap">Kategorien:</span>
              <NuxtLink
                to="/ziele"
                class="whitespace-nowrap px-3 py-1 text-sm rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                Alle
              </NuxtLink>
              <NuxtLink
                v-for="kat in kategorien"
                :key="kat.id"
                :to="`/ziele?kategorie=${encodeURIComponent(kat.name)}`"
                class="whitespace-nowrap px-3 py-1 text-sm rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
              >
                {{ kat.name }}
              </NuxtLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>

    <!-- Featured Ziele Section -->
    <section class="py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Beliebte Ziele</h2>
        <NuxtLink to="/ziele">
          <Button variant="ghost" class="text-primary hover:bg-primary/10">
            Alle ansehen
            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </NuxtLink>
      </div>
      <div v-if="zielePending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="ziel in featuredZiele"
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
              <img
                v-else-if="ziel.kategorien?.length > 0 && ziel.kategorien[0].bild"
                :src="ziel.kategorien[0].bild"
                :alt="ziel.kategorien[0].name"
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
              <p v-if="ziel.auszug" class="text-sm text-muted-foreground line-clamp-2">
                {{ ziel.auszug }}
              </p>
              <div class="flex items-center gap-4 mt-4 text-sm">
                <span v-if="ziel.rating" class="flex items-center gap-1">
                  <svg class="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {{ ziel.rating.toFixed(1) }}
                </span>
                <span v-if="ziel.favorits" class="text-muted-foreground">
                  {{ ziel.favorits }} Favoriten
                </span>
              </div>
            </CardContent>
          </Card>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>