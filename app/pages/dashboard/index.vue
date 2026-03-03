<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

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
}

const { data: favorites, pending: favoritesPending, execute: loadFavorites } = await useApiGet<Ziel[]>('/favoriten')
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
      <div v-else-if="!favorites?.length" class="text-center py-12">
        <p class="text-muted-foreground mb-4">Noch keine Favoriten gespeichert</p>
        <NuxtLink to="/ziele">
          <Button>Ziele entdecken</Button>
        </NuxtLink>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="ziel in favorites"
          :key="ziel.id"
          :to="`/ziele/${ziel.slugname || ziel.id}`"
        >
          <Card class="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle class="line-clamp-1">{{ ziel.name }}</CardTitle>
              <CardDescription v-if="ziel.stadt">{{ ziel.stadt }}</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  v-if="ziel.bilder?.length"
                  :src="`/media/bilder/${ziel.bilder[0].id}`"
                  :alt="ziel.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </CardContent>
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
          <Button variant="outline" @click="auth.logout">
            Abmelden
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>