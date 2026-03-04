<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuth()

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  inhalt: string
  kategorie: string
  tags: string
  status: string
  view_count: number
  created_at: string
  autor?: { id: number; name: string }
  comments?: { id: number; name: string; inhalt: string; created_at: string }[]
}

const { data: post, error, pending } = await useApiGet<Post>(`/posts/${route.params.id}`)
</script>

<template>
  <div v-if="pending" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>

  <div v-else-if="error" class="text-center py-12">
    <h1 class="text-2xl font-bold mb-4">Beitrag nicht gefunden</h1>
    <p class="text-muted-foreground mb-4">{{ error.message }}</p>
    <NuxtLink to="/posts">
      <Button>Zurück zum Blog</Button>
    </NuxtLink>
  </div>

  <div v-else-if="post">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/posts" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zum Blog
      </NuxtLink>
      <h1 class="text-3xl font-bold mb-2">{{ post.title }}</h1>
      <div class="flex flex-wrap items-center gap-4 text-muted-foreground">
        <span v-if="post.autor" class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ post.autor.name }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ new Date(post.created_at).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) }}
        </span>
        <span class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ post.view_count || 0 }} Aufrufe
        </span>
      </div>
    </div>

    <!-- Excerpt -->
    <div v-if="post.excerpt" class="mb-8">
      <p class="text-lg text-muted-foreground italic">{{ post.excerpt }}</p>
    </div>

    <!-- Content -->
    <Card class="mb-8">
      <CardContent class="pt-6">
        <div class="prose prose-neutral dark:prose-invert max-w-none">
          <p class="whitespace-pre-line">{{ post.inhalt }}</p>
        </div>
      </CardContent>
    </Card>

    <!-- Tags -->
    <div v-if="post.tags" class="mb-8">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.split(',')"
          :key="tag"
          class="px-3 py-1 bg-muted text-sm rounded-full"
        >
          #{{ tag.trim() }}
        </span>
      </div>
    </div>

    <!-- Comments -->
    <Card>
      <CardHeader>
        <CardTitle>Kommentare</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="!post.comments?.length" class="text-center py-8 text-muted-foreground">
          <p>Noch keine Kommentare vorhanden.</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="border-b pb-4 last:border-0"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="font-medium">{{ comment.name }}</span>
              <span class="text-sm text-muted-foreground">
                {{ new Date(comment.created_at).toLocaleDateString('de-DE') }}
              </span>
            </div>
            <p class="text-sm">{{ comment.inhalt }}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>