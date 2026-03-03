<script setup lang="ts">
const config = useRuntimeConfig()

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  auszug: string
  bilder: { id: number; filename: string }[]
  rating: number
  favorits: number
}

interface Kategorie {
  id: number
  name: string
  beschreibung: string
}

const { data: featuredZiele, pending: zielePending } = await useApiGet<Ziel[]>('/ziele?limit=6')
const { data: kategorien, pending: kategorienPending } = await useApiGet<Kategorie[]>('/kategorien')
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div class="container relative z-10">
        <div class="max-w-3xl">
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Entdecke tolle
            <span class="text-primary">Ausflugsziele</span>
            für Kids!
          </h1>
          <p class="text-xl text-muted-foreground mb-8">
            Finde die besten Orte für deine Familie - von Abenteuerspielplätzen bis zu Museen und vielem mehr.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/ziele">
              <Button size="lg">
                Jetzt entdecken
                <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </NuxtLink>
            <NuxtLink to="/kategorien">
              <Button size="lg" variant="outline">Kategorien ansehen</Button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent" />
    </section>

    <!-- Search Section -->
    <section class="py-12">
      <Card>
        <CardContent class="p-6">
          <form class="flex flex-col md:flex-row gap-4" @submit.prevent>
            <Input
              placeholder="Wonach suchst du?"
              class="flex-1"
            />
            <Input
              placeholder="Stadt oder PLZ"
              class="md:w-48"
            />
            <Button type="submit">
              <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Suchen
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>

    <!-- Categories Section -->
    <section class="py-12">
      <h2 class="text-2xl font-bold mb-6">Kategorien</h2>
      <div v-if="kategorienPending" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-24 bg-muted rounded-lg animate-pulse" />
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="kat in kategorien"
          :key="kat.id"
          :to="`/ziele?kategorie=${encodeURIComponent(kat.name)}`"
        >
          <Card class="hover:border-primary transition-colors cursor-pointer h-full">
            <CardContent class="p-6 text-center">
              <h3 class="font-semibold">{{ kat.name }}</h3>
              <p v-if="kat.beschreibung" class="text-sm text-muted-foreground mt-1 line-clamp-2">
                {{ kat.beschreibung }}
              </p>
            </CardContent>
          </Card>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Ziele Section -->
    <section class="py-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Beliebte Ziele</h2>
        <NuxtLink to="/ziele">
          <Button variant="ghost">
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
              <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
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