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

const { data: result, pending, execute } = await useApiGet<{ data: any[] } | any[]>('/posts')

const posts = computed(() => {
  if (Array.isArray(result.value)) return result.value
  return result.value?.data || []
})
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Blog-Posts verwalten</h1>
        <p class="text-muted-foreground">Artikel und Neuigkeiten</p>
      </div>
      <NuxtLink to="/admin/posts/new">
        <Button>
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Neuer Post
        </Button>
      </NuxtLink>
    </div>

    <!-- List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!posts?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Posts gefunden</p>
    </div>

    <div v-else class="space-y-2">
      <Card v-for="post in posts" :key="post.id" class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ post.title }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ post.kategorie || 'Ohne Kategorie' }}
              <span v-if="post.published_at" class="ml-2">
                • {{ new Date(post.published_at).toLocaleDateString('de-DE') }}
              </span>
              <span v-if="post.status === 'published'" class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Veröffentlicht</span>
              <span v-else class="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Entwurf</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/admin/posts/${post.id}`">
              <Button variant="outline" size="sm">Bearbeiten</Button>
            </NuxtLink>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>