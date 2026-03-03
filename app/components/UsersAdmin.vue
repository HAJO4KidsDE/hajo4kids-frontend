<script setup lang="ts">
interface User {
  id: number
  username: string
  email: string
  role: string
  active: boolean
  created_at: string
}

const { data: users, pending, execute } = await useApiGet<User[]>('/admin/users')
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Benutzer verwalten</CardTitle>
        <CardDescription>{{ users?.length || 0 }} Benutzer registriert</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="pending" class="space-y-2">
          <div v-for="i in 5" :key="i" class="h-12 bg-muted rounded animate-pulse" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2">Benutzername</th>
                <th class="text-left py-2">E-Mail</th>
                <th class="text-left py-2">Rolle</th>
                <th class="text-left py-2">Status</th>
                <th class="text-left py-2">Erstellt</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="border-b hover:bg-muted/50">
                <td class="py-2">{{ user.username }}</td>
                <td class="py-2">{{ user.email }}</td>
                <td class="py-2">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'reporter' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-2">
                  <span :class="user.active ? 'text-green-600' : 'text-red-600'">
                    {{ user.active ? 'Aktiv' : 'Inaktiv' }}
                  </span>
                </td>
                <td class="py-2 text-muted-foreground">
                  {{ new Date(user.created_at).toLocaleDateString('de-DE') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>