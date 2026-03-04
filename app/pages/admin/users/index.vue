<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

// Check admin role
onMounted(() => {
  if (!auth.hasRole('admin')) {
    router.push('/')
  }
}

const { data: result, pending, execute } = await useApiGet<{ data: any[] } | any[]>('/admin/users')

const users = computed(() => {
  if (Array.isArray(result.value)) return result.value
  return result.value?.data || []
})

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  reporter: 'Reporter',
  user: 'Benutzer',
  guest: 'Gast'
}

async function updateRole(userId: number, newRole: string) {
  try {
    await fetch(`${config.public.apiBase}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify({ role: newRole })
    })
    execute()
  } catch (e) {
    console.error('Failed to update role', e)
  }
}
</script>

<template>
  <div class="mb-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">Benutzer verwalten</h1>
      <p class="text-muted-foreground">Rollen und Berechtigungen zuweisen</p>
    </div>

    <!-- List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!users?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Benutzer gefunden</p>
    </div>

    <div v-else class="space-y-2">
      <Card v-for="user in users" :key="user.id" class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold">{{ user.username || user.email }}</h3>
            <p class="text-sm text-muted-foreground">{{ user.email }}</p>
          </div>
          <div class="flex items-center gap-4">
            <select
              :value="user.role"
              class="px-3 py-1 border rounded-md bg-background"
              @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="guest">Gast</option>
              <option value="user">Benutzer</option>
              <option value="reporter">Reporter</option>
              <option value="admin">Admin</option>
            </select>
            <span
              :class="[
                'px-2 py-0.5 text-xs rounded-full',
                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.role === 'reporter' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ roleLabels[user.role] || user.role }}
            </span>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>