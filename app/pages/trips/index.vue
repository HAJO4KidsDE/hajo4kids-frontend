<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuth()

interface Trip {
  id: number
  title: string
  beschreibung: string
  is_public: boolean
  user_id: number
  created_at: string
  ziele?: { id: number; name: string; stadt: string }[]
}

const showMyTrips = ref(false)

const { data: trips, pending, execute } = await useApiGet<Trip[]>(`/trips${showMyTrips.value ? '?my=true' : ''}`)
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold">Trips & Stories</h1>
        <p class="text-muted-foreground">Entdecke Reiseberichte und Erlebnisse</p>
      </div>
      <div class="flex gap-2">
        <Button
          :variant="!showMyTrips ? 'default' : 'outline'"
          @click="showMyTrips = false; execute()"
        >
          Alle Trips
        </Button>
        <Button
          v-if="auth.isLoggedIn.value"
          :variant="showMyTrips ? 'default' : 'outline'"
          @click="showMyTrips = true; execute()"
        >
          Meine Trips
        </Button>
      </div>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-64 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!trips?.length" class="text-center py-12">
      <p class="text-muted-foreground mb-4">
        {{ showMyTrips ? 'Du hast noch keine Trips erstellt' : 'Keine öffentlichen Trips vorhanden' }}
      </p>
      <NuxtLink v-if="auth.isLoggedIn.value" to="/trips/new">
        <Button>Neuen Trip erstellen</Button>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="trip in trips"
        :key="trip.id"
        :to="`/trips/${trip.id}`"
      >
        <Card class="h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="line-clamp-1">{{ trip.title }}</CardTitle>
            <CardDescription class="flex items-center gap-2">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(trip.created_at).toLocaleDateString('de-DE') }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p v-if="trip.beschreibung" class="text-sm text-muted-foreground line-clamp-3 mb-4">
              {{ trip.beschreibung }}
            </p>
            <div v-if="trip.ziele?.length" class="flex flex-wrap gap-1">
              <span
                v-for="ziel in trip.ziele.slice(0, 3)"
                :key="ziel.id"
                class="px-2 py-1 bg-muted text-xs rounded-full"
              >
                {{ ziel.name }}
              </span>
              <span v-if="trip.ziele.length > 3" class="px-2 py-1 text-xs text-muted-foreground">
                +{{ trip.ziele.length - 3 }} mehr
              </span>
            </div>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>