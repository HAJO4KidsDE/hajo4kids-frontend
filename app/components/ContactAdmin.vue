<script setup lang="ts">
interface ContactMessage {
  id: number
  name: string
  email: string
  betreff: string
  nachricht: string
  read: boolean
  created_at: string
}

const { data: messages, pending, execute } = await useApiGet<ContactMessage[]>('/admin/kontakt')

const selected = ref<ContactMessage | null>(null)
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Kontaktanfragen</CardTitle>
        <CardDescription>{{ messages?.filter(m => !m.read).length || 0 }} ungelesen</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="pending" class="space-y-2">
          <div v-for="i in 3" :key="i" class="h-16 bg-muted rounded animate-pulse" />
        </div>
        <div v-else-if="!messages?.length" class="text-center py-8 text-muted-foreground">
          Keine Kontaktanfragen
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'p-4 border rounded-lg cursor-pointer transition-colors',
              msg.read ? 'bg-background' : 'bg-primary/5 border-primary/30',
              selected?.id === msg.id ? 'ring-2 ring-primary' : ''
            ]"
            @click="selected = msg"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">{{ msg.name }}</div>
                <div class="text-sm text-muted-foreground">{{ msg.email }}</div>
              </div>
              <div class="text-xs text-muted-foreground">
                {{ new Date(msg.created_at).toLocaleDateString('de-DE') }}
              </div>
            </div>
            <div v-if="msg.betreff" class="text-sm font-medium mt-1">{{ msg.betreff }}</div>
            <div class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ msg.nachricht }}</div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Detail Dialog -->
    <div v-if="selected" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="selected = null">
      <Card class="max-w-lg w-full mx-4" @click.stop>
        <CardHeader>
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>{{ selected.betreff || 'Nachricht' }}</CardTitle>
              <CardDescription>
                Von {{ selected.name }} ({{ selected.email }})
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" @click="selected = null">✕</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p class="whitespace-pre-line">{{ selected.nachricht }}</p>
          <div class="mt-4 text-xs text-muted-foreground">
            {{ new Date(selected.created_at).toLocaleString('de-DE') }}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>