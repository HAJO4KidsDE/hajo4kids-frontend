<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

// Check permissions
onMounted(() => {
  if (!auth.hasRole(['admin', 'reporter'])) {
    router.push('/')
  }
})

const showMyTrips = ref(false)
const { data: result, pending, execute } = await useApiGet<{ data: any[] } | any[]>(
  `/trips${showMyTrips.value ? '?my=true' : ''}`
)

const trips = computed(() => {
  if (Array.isArray(result.value)) return result.value
  return result.value?.data || []
})
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Trips verwalten</h1>
        <p class="text-muted-foreground">Reiseberichte und Abenteuer</p>
      </div>
      <div class="flex gap-2">
        <Button
          :variant="!showMyTrips ? 'default' : 'outline'"
          @click="showMyTrips = false; execute()"
        >
          Alle Trips
        </Button>
        <Button
          :variant="showMyTrips ? 'default' : 'outline'"
          @click="showMyTrips = true; execute()"
        >
          Meine Trips
        </Button>
      </div>
    </div>

    <!-- List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!trips?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Trips gefunden</p>
    </div>

    <div v-else class="space-y-2">
      <Card v-for="trip in trips" :key="trip.id" class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ trip.title }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ trip.ziele?.length || 0 }} Ziele
              <span v-if="trip.is_public" class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Öffentlich</span>
              <span v-else class="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Privat</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/admin/trips/${trip.id}`">
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </NuxtLink>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>