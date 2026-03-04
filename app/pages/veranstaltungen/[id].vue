<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

interface Veranstaltung {
  id: number
  title: string
  beschreibung: string
  start_datum: string
  end_datum: string
  ort: string
  ziel_id: number
  ziel?: { id: number; name: string; stadt: string }
}

const { data: veranstaltung, error, pending } = await useApiGet<Veranstaltung>(`/veranstaltungen/${route.params.id}`)
</script>

<template>
  <div v-if="pending" class="flex justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>

  <div v-else-if="error" class="text-center py-12">
    <h1 class="text-2xl font-bold mb-4">Veranstaltung nicht gefunden</h1>
    <p class="text-muted-foreground mb-4">{{ error.message }}</p>
    <NuxtLink to="/veranstaltungen">
      <Button>Zurück zur Übersicht</Button>
    </NuxtLink>
  </div>

  <div v-else-if="veranstaltung">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink to="/veranstaltungen" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Zurück zu den Veranstaltungen
      </NuxtLink>
      <h1 class="text-3xl font-bold mb-2">{{ veranstaltung.title }}</h1>
      <div class="flex items-center gap-4 text-muted-foreground">
        <span v-if="veranstaltung.start_datum" class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ new Date(veranstaltung.start_datum).toLocaleDateString('de-DE') }}
          <span v-if="veranstaltung.end_datum">
            - {{ new Date(veranstaltung.end_datum).toLocaleDateString('de-DE') }}
          </span>
        </span>
        <span v-if="veranstaltung.ort" class="flex items-center gap-1">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ veranstaltung.ort }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <Card>
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="veranstaltung.beschreibung" class="prose prose-sm dark:prose-invert max-w-none" v-html="veranstaltung.beschreibung" />
            <p v-else class="text-muted-foreground">Keine Beschreibung verfügbar.</p>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Details -->
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="veranstaltung.start_datum" class="flex items-start gap-3">
              <svg class="h-5 w-5 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="font-medium">Datum</p>
                <p class="text-sm text-muted-foreground">
                  {{ new Date(veranstaltung.start_datum).toLocaleDateString('de-DE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) }}
                  <span v-if="veranstaltung.end_datum && veranstaltung.end_datum !== veranstaltung.start_datum">
                    <br>bis {{ new Date(veranstaltung.end_datum).toLocaleDateString('de-DE', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) }}
                  </span>
                </p>
              </div>
            </div>
            <div v-if="veranstaltung.ort" class="flex items-start gap-3">
              <svg class="h-5 w-5 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="font-medium">Ort</p>
                <p class="text-sm text-muted-foreground">{{ veranstaltung.ort }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Related Ziel -->
        <Card v-if="veranstaltung.ziel">
          <CardHeader>
            <CardTitle>Ausflugsziel</CardTitle>
          </CardHeader>
          <CardContent>
            <NuxtLink :to="`/ziele/${veranstaltung.ziel.id}`">
              <Button variant="outline" class="w-full">
                {{ veranstaltung.ziel.name }}
                <svg class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </NuxtLink>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>