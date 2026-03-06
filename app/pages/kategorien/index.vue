<script setup lang="ts">
const config = useRuntimeConfig()

interface Bild {
  id: number
  filename: string
  path?: string
  thumbnail?: string
}

interface Kategorie {
  id: number
  name: string
  beschreibung: string
  bild?: string
  bild_id?: number
  bild_data?: Bild
  sort_order?: number
}

const { data: kategorien, pending } = await useApiGet<Kategorie[]>('/kategorien')

// Get image URL for a category
function getCategoryImage(kat: Kategorie): string | null {
  if (kat.bild_data?.id) {
    return `${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${kat.bild_data.id}`
  }
  if (kat.bild) {
    return kat.bild
  }
  return null
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Kategorien</h1>
      <p class="text-muted-foreground">
        Durchstöbere Ausflugsziele nach Kategorie
      </p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-48 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="(kat, index) in kategorien"
        :key="kat.id"
        :to="`/ziele?kategorie=${encodeURIComponent(kat.name)}`"
        class="animate-fade-in-up"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <Card class="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
          <!-- Image -->
          <div class="aspect-[4/3] bg-muted relative">
            <img
              v-if="getCategoryImage(kat)"
              :src="getCategoryImage(kat)!"
              :alt="kat.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <!-- Title on Image -->
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <h3 class="text-xl font-bold text-white drop-shadow-lg">{{ kat.name }}</h3>
            </div>
          </div>
          <!-- Description -->
          <CardContent v-if="kat.beschreibung" class="pt-4">
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ kat.beschreibung }}
            </p>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out both;
}
</style>