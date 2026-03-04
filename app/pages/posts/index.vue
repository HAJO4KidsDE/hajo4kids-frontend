<script setup lang="ts">
const config = useRuntimeConfig()

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  bild: string
  kategorie: string
  view_count: number
  published_at: string
  autor?: { id: number; username: string }
}

const selectedKategorie = ref('')
const searchQuery = ref('')

const api_url = computed(() => {
  const params = new URLSearchParams()
  if (selectedKategorie.value) params.append('kategorie', selectedKategorie.value)
  if (searchQuery.value) params.append('q', searchQuery.value)
  const queryString = params.toString()
  return queryString ? `/posts?${queryString}` : '/posts'
})

const { data: posts, pending, execute } = await useApiGet<Post[]>(api_url.value)

// Re-fetch when filters change
watch([searchQuery, selectedKategorie], () => {
  execute()
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Blog</h1>
      <p class="text-muted-foreground">Neuigkeiten, Tipps und Geschichten</p>
    </div>

    <!-- Filter -->
    <Card class="mb-6">
      <CardContent class="p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <Input
            v-model="searchQuery"
            placeholder="Artikel suchen..."
            class="flex-1"
            @keyup.enter="execute"
          />
          <Button @click="execute">
            <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Suchen
          </Button>
        </div>
      </CardContent>
    </Card>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-72 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!posts?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Artikel gefunden</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/posts/${post.slug || post.id}`"
      >
        <Card class="overflow-hidden h-full hover:shadow-lg transition-shadow">
          <div class="aspect-video bg-muted relative">
            <img
              v-if="post.bild"
              :src="post.bild"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
              <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div v-if="post.kategorie" class="absolute top-2 left-2">
              <span class="px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded-full">
                {{ post.kategorie }}
              </span>
            </div>
          </div>
          <CardHeader>
            <CardTitle class="line-clamp-2">{{ post.title }}</CardTitle>
            <CardDescription v-if="post.published_at" class="flex items-center gap-2">
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ new Date(post.published_at).toLocaleDateString('de-DE') }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p v-if="post.excerpt" class="text-sm text-muted-foreground line-clamp-2">
              {{ post.excerpt }}
            </p>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>