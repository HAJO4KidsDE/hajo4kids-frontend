<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuth()

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  auszug: string
  bilder: { id: number; filename: string }[]
}

interface Trip {
  id: number
  title: string
  beschreibung: string
  is_public: boolean
  user_id: number
  created_at: string
  ziele?: Ziel[]
}

const { data: trip, error, pending } = await useApiGet<Trip>(`/trips/${route.params.id}`)
</script>

<template>
  <div v-if="pending" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>

  <div v-else-if="error" class="text-center py-12">
    <h1 class="text-2xl font-bold mb-4">Trip nicht gefunden</h1>
    <p class="text-muted-foreground mb-4">{{ error.message }}</p>
    <NuxtLink to="/trips">
      <Button>Zurück zu den Trips</Button>
    </NuxtLink>
  </div>

  <div v-else-if="trip">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/trips" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zu den Trips
      </NuxtLink>
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ trip.title }}</h1>
          <p class="text-muted-foreground">
            Erstellt am {{ new Date(trip.created_at).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}
          </p>
        </div>
        <div v-if="auth.isLoggedIn.value" class="flex gap-2">
          <Button variant="outline">
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bearbeiten
          </Button>
        </div>
      </div>
    </div>

    <!-- Description -->
    <Card v-if="trip.beschreibung" class="mb-8">
      <CardHeader>
        <CardTitle>Beschreibung</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="prose prose-sm dark:prose-invert max-w-none" v-html="trip.beschreibung" />
      </CardContent>
    </Card>

    <!-- Ziele List -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Ausflugsziele in diesem Trip</h2>

      <div v-if="!trip.ziele?.length" class="text-center py-8 text-muted-foreground">
        <p>Dieser Trip enthält noch keine Ausflugsziele.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="ziel in trip.ziele"
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
            </CardContent>
          </Card>
        </NuxtLink>
      </div>
    </div>

    <!-- Back Link -->
    <div class="flex justify-center">
      <NuxtLink to="/trips">
        <Button variant="outline">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Alle Trips anzeigen
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>