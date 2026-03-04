<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

// Redirect if not logged in
onMounted(() => {
  if (!auth.isLoggedIn.value) {
    router.push('/auth/login')
  }
})

const activeTab = ref('favorites')

interface Ziel {
  id: number
  name: string
  slugname: string
  stadt: string
  bilder: { id: number; filename: string }[]
  kategorien: { id: number; name: string; bild: string }[]
}

interface Favorit {
  id: number
  ziel: Ziel
}

const { data: favorites, pending: favoritesPending } = await useApiGet<Favorit[]>('/favoriten')

// Extract zieles from favorites
const favoriteZiele = computed(() => {
  if (!favorites.value) return []
  return favorites.value.map(f => f.ziel).filter(z => z)
})
</script>

<template>
  <div v-if="!auth.isLoggedIn.value" class="text-center py-12">
    <p class="text-muted-foreground">Bitte anmelden, um das Dashboard zu sehen.</p>
    <NuxtLink to="/auth/login">
      <Button class="mt-4">Anmelden</Button>
    </NuxtLink>
  </div>

  <div v-else>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Willkommen, {{ auth.user.value?.username }}!</h1>
      <p class="text-muted-foreground">Verwalte deine Favoriten und Einstellungen</p>
    </div>

    <!-- Tabs -->
    <div class="flex border-b mb-6">
      <button
        v-for="tab in ['favorites', 'settings']"
        :key="tab"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-primary'
        ]"
        @click="activeTab = tab"
      >
        {{ tab === 'favorites' ? 'Favoriten' : 'Einstellungen' }}
      </button>
    </div>

    <!-- Favorites Tab -->
    <div v-if="activeTab === 'favorites'">
      <div v-if="favoritesPending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-48 bg-muted rounded-lg animate-pulse" />
      </div>
      <div v-else-if="!favoriteZiele?.length" class="text-center py-12">
        <p class="text-muted-foreground mb-4">Noch keine Favoriten gespeichert</p>
        <NuxtLink to="/ziele">
          <Button>Ziele entdecken</Button>
        </NuxtLink>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="ziel in favoriteZiele"
          :key="ziel.id"
          :to="`/ziele/${ziel.slugname || ziel.id}`"
        >
          <Card class="hover:shadow-lg transition-shadow overflow-hidden group">
            <div class="aspect-video bg-muted relative">
              <img
                v-if="ziel.bilder?.length"
                :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${ziel.bilder[0].id}`"
                :alt="ziel.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <img
                v-else-if="ziel.kategorien?.length && ziel.kategorien[0].bild"
                :src="ziel.kategorien[0].bild"
                :alt="ziel.kategorien[0].name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <CardHeader>
              <CardTitle class="line-clamp-1">{{ ziel.name }}</CardTitle>
              <CardDescription v-if="ziel.stadt">{{ ziel.stadt }}</CardDescription>
            </CardHeader>
          </Card>
        </NuxtLink>
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Benutzername</Label>
              <Input :model-value="auth.user.value?.username" disabled />
            </div>
            <div>
              <Label>E-Mail</Label>
              <Input :model-value="auth.user.value?.email" disabled />
            </div>
          </div>
          <div>
            <Label>Rolle</Label>
            <Input :model-value="auth.user.value?.role" disabled />
          </div>
          <Button
            variant="outline"
            class="border-primary text-primary hover:bg-primary/10"
            @click="auth.logout"
          >
            Abmelden
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>