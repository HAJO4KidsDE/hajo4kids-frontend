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

const { data: result, pending, execute } = await useApiGet<{ data: any[] } | any[]>('/veranstaltungen')

const veranstaltungen = computed(() => {
  if (Array.isArray(result.value)) return result.value
  return result.value?.data || []
})
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Veranstaltungen verwalten</h1>
        <p class="text-muted-foreground">Events und Veranstaltungen erstellen und bearbeiten</p>
      </div>
      <NuxtLink to="/admin/veranstaltungen/new">
        <Button>
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Neue Veranstaltung
        </Button>
      </NuxtLink>
    </div>

    <!-- List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!veranstaltungen?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Veranstaltungen gefunden</p>
    </div>

    <div v-else class="space-y-2">
      <Card v-for="v in veranstaltungen" :key="v.id" class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ v.title }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ v.ort || 'Kein Ort' }}
              <span v-if="v.start_datum" class="ml-2">
                • {{ new Date(v.start_datum).toLocaleDateString('de-DE') }}
              </span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/admin/veranstaltungen/${v.id}`">
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </NuxtLink>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>