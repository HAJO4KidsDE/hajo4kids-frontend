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

const searchQuery = ref('')
const statusFilter = ref('')

const api_url = computed(() => {
  let url = '/ziele?page=1&per_page=100'
  if (statusFilter.value) url += `&status=${statusFilter.value}`
  if (searchQuery.value) url += `&filter=${encodeURIComponent(searchQuery.value)}`
  return url
})

const { data: result, pending, execute } = await useApiGet<{ data: any[]; meta: any }>(
  api_url.value
)

// Re-fetch when filters change
watch([searchQuery, statusFilter], () => {
  execute()
})

const ziele = computed(() => {
  if (Array.isArray(result.value)) return result.value
  return result.value?.data || []
})

async function toggleStatus(ziel: any) {
  const newStatus = ziel.status === 'PUBLISHED' ? 'DESIGN' : 'PUBLISHED'
  try {
    await fetch(`/api/v1/ziele/${ziel.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    execute()
  } catch (e) {
    console.error('Failed to update status', e)
  }
}
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Ziele verwalten</h1>
        <p class="text-muted-foreground">Ausflugsziele erstellen und bearbeiten</p>
      </div>
      <NuxtLink to="/admin/ziele/new">
        <Button>
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Neues Ziel
        </Button>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Suchen..."
            class="flex-1"
          />
          <select
            v-model="statusFilter"
            class="px-3 py-2 border rounded-md bg-background"
            @change="execute"
          >
            <option value="">Alle Status</option>
            <option value="PUBLISHED">Veröffentlicht</option>
            <option value="DESIGN">Entwurf</option>
          </select>
        </div>
      </CardContent>
    </Card>

    <!-- List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!ziele?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Ziele gefunden</p>
    </div>

    <div v-else class="space-y-2">
      <Card v-for="ziel in ziele" :key="ziel.id" class="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-muted rounded-lg overflow-hidden">
              <img
                v-if="ziel.bilder?.length"
                :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${ziel.bilder[0].id}`"
                :alt="ziel.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 class="font-semibold">{{ ziel.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ ziel.stadt }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="px-2 py-0.5 text-xs rounded-full"
                  :class="ziel.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ ziel.status === 'PUBLISHED' ? 'Veröffentlicht' : 'Entwurf' }}
                </span>
                <span v-if="ziel.kategorien?.length" class="text-xs text-muted-foreground">
                  {{ ziel.kategorien.map((k: any) => k.name).join(', ') }}
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/admin/ziele/${ziel.id}`">
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </NuxtLink>
            <NuxtLink :to="`/ziele/${ziel.slugname || ziel.id}`" target="_blank">
              <Button variant="ghost" size="sm">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Button>
            </NuxtLink>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>