<script setup lang="ts">
interface Comment {
  id: number
  post_id: number
  user_id?: number
  name: string
  email: string
  inhalt: string
  approved: boolean
  created_at: string
  post?: { id: number; title: string }
}

const { data: comments, pending, execute } = await useApiGet<Comment[]>('/admin/comments?approved=false')

async function approveComment(id: number) {
  try {
    await fetch(`/api/v1/admin/comments/${id}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
    execute()
  } catch (e) {
    console.error('Failed to approve comment', e)
  }
}

async function deleteComment(id: number) {
  if (!confirm('Kommentar wirklich löschen?')) return
  try {
    await fetch(`/api/v1/admin/comments/${id}`, {
      method: 'DELETE',
    })
    execute()
  } catch (e) {
    console.error('Failed to delete comment', e)
  }
}
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle>Kommentare moderieren</CardTitle>
        <CardDescription>{{ comments?.filter(c => !c.approved).length || 0 }} awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="pending" class="space-y-2">
          <div v-for="i in 3" :key="i" class="h-20 bg-muted rounded animate-pulse" />
        </div>
        <div v-else-if="!comments?.length" class="text-center py-8 text-muted-foreground">
          Keine Kommentare zu moderieren
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="comment in comments"
            :key="comment.id"
            :class="[
              'p-4 border rounded-lg',
              comment.approved ? 'bg-background' : 'bg-orange-50 border-orange-200'
            ]"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">{{ comment.name }}</div>
                <div class="text-sm text-muted-foreground">{{ comment.email }}</div>
              </div>
              <div v-if="!comment.approved" class="flex gap-2">
                <Button size="sm" variant="outline" @click="approveComment(comment.id)">
                  Genehmigen
                </Button>
                <Button size="sm" variant="destructive" @click="deleteComment(comment.id)">
                  Löschen
                </Button>
              </div>
            </div>
            <p class="text-sm mt-2 whitespace-pre-line">{{ comment.inhalt }}</p>
            <div class="mt-2 text-xs text-muted-foreground">
              {{ new Date(comment.created_at).toLocaleString('de-DE') }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>