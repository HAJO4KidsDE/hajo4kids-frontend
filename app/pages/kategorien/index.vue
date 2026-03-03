<script setup lang="ts">
const { data: kategorien, pending } = await useApiGet<{ id: number; name: string; beschreibung: string }[]>('/kategorien')
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
      <div v-for="i in 6" :key="i" class="h-32 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="kat in kategorien"
        :key="kat.id"
        :to="`/ziele?kategorie=${encodeURIComponent(kat.name)}`"
      >
        <Card class="hover:border-primary transition-colors cursor-pointer h-full">
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>
              {{ kat.name }}
            </CardTitle>
          </CardHeader>
          <CardContent v-if="kat.beschreibung">
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ kat.beschreibung }}
            </p>
          </CardContent>
        </Card>
      </NuxtLink>
    </div>
  </div>
</template>