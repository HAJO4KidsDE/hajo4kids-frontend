<script setup lang="ts">
const config = useRuntimeConfig()

interface Veranstaltung {
  id: number
  title: string
  beschreibung: string
  start_datum: string
  end_datum?: string
  ort: string
  ziel_id?: number
  ziel?: { id: number; name: string }
}

const { data: events, pending } = await useApiGet<Veranstaltung[]>('/veranstaltungen?upcoming=true')
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Veranstaltungen</h1>
      <p class="text-muted-foreground">Aktuelle Events und Termine</p>
    </div>

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!events?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine anstehenden Veranstaltungen</p>
    </div>

    <div v-else class="space-y-4">
      <Card
        v-for="event in events"
        :key="event.id"
        class="overflow-hidden"
      >
        <div class="flex flex-col md:flex-row">
          <div class="md:w-32 bg-primary/10 flex items-center justify-center p-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary">
                {{ new Date(event.start_datum).getDate() }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ new Date(event.start_datum).toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }) }}
              </div>
            </div>
          </div>
          <div class="flex-1 p-4">
            <h2 class="text-xl font-semibold mb-2">{{ event.title }}</h2>
            <p v-if="event.beschreibung" class="text-muted-foreground mb-2 line-clamp-2">
              {{ event.beschreibung }}
            </p>
            <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span v-if="event.ort" class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {{ event.ort }}
              </span>
              <span v-if="event.end_datum" class="flex items-center gap-1">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                bis {{ new Date(event.end_datum).toLocaleDateString('de-DE') }}
              </span>
            </div>
            <div v-if="event.ziel" class="mt-2">
              <NuxtLink :to="`/ziele/${event.ziel.id}`" class="text-primary text-sm hover:underline">
                → {{ event.ziel.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>