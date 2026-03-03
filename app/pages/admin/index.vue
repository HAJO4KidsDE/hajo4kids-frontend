<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

// Check admin role
onMounted(() => {
  if (!auth.hasRole('admin')) {
    router.push('/')
  }
})

const activeTab = ref('overview')

const { data: stats, execute: loadStats } = await useApiGet('/admin/statistics')
</script>

<template>
  <div v-if="!auth.hasRole('admin')" class="text-center py-12">
    <p class="text-muted-foreground">Kein Zugriff - Admin Bereich</p>
    <NuxtLink to="/">
      <Button class="mt-4">Zurück zur Startseite</Button>
    </NuxtLink>
  </div>

  <div v-else>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Admin Dashboard</h1>
      <p class="text-muted-foreground">Verwalte Benutzer, Inhalte und Einstellungen</p>
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap border-b mb-6 gap-1">
      <button
        v-for="tab in ['overview', 'users', 'contact', 'comments']"
        :key="tab"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors',
          activeTab === tab
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-primary'
        ]"
        @click="activeTab = tab"
      >
        {{ { overview: 'Übersicht', users: 'Benutzer', contact: 'Kontakt', comments: 'Kommentare' }[tab] }}
      </button>
    </div>

    <!-- Overview Tab -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Ziele</CardDescription>
            <CardTitle class="text-3xl">{{ stats?.ziele_total || 0 }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Veröffentlicht</CardDescription>
            <CardTitle class="text-3xl">{{ stats?.ziele_published || 0 }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Benutzer</CardDescription>
            <CardTitle class="text-3xl">{{ stats?.users_total || 0 }}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription>Trips</CardDescription>
            <CardTitle class="text-3xl">{{ stats?.trips_count || 0 }}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-wrap gap-2">
          <NuxtLink to="/admin/users">
            <Button variant="outline">Benutzer verwalten</Button>
          </NuxtLink>
          <NuxtLink to="/admin/contact">
            <Button variant="outline">Kontaktanfragen</Button>
          </NuxtLink>
          <NuxtLink to="/ziele/new">
            <Button>Neues Ziel erstellen</Button>
          </NuxtLink>
        </CardContent>
      </Card>
    </div>

    <!-- Users Tab -->
    <UsersAdmin v-if="activeTab === 'users'" />
    
    <!-- Contact Tab -->
    <ContactAdmin v-if="activeTab === 'contact'" />
    
    <!-- Comments Tab -->
    <CommentsAdmin v-if="activeTab === 'comments'" />
  </div>
</template>