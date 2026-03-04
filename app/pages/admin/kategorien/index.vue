<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()

// Check permissions
onMounted(() => {
  if (!auth.hasRole(['admin', 'reporter'])) {
    router.push('/')
  }
})

const { data: kategorien, pending, execute } = await useApiGet<any[]>('/kategorien')

// New category form
const showNewForm = ref(false)
const newCategory = ref({ name: '', beschreibung: '' })
const editingCategory = ref<any>(null)
const saving = ref(false)

async function createCategory() {
  if (!newCategory.value.name) return
  saving.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/kategorien`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify(newCategory.value)
    })
    if (!response.ok) throw new Error('Fehler beim Erstellen')
    showNewForm.value = false
    newCategory.value = { name: '', beschreibung: '' }
    execute()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function updateCategory() {
  if (!editingCategory.value) return
  saving.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/kategorien/${editingCategory.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token.value}`
      },
      body: JSON.stringify({
        name: editingCategory.value.name,
        beschreibung: editingCategory.value.beschreibung
      })
    })
    if (!response.ok) throw new Error('Fehler beim Speichern')
    editingCategory.value = null
    execute()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function deleteCategory(id: number) {
  if (!confirm('Kategorie wirklich löschen?')) return
  try {
    const response = await fetch(`${config.public.apiBase}/kategorien/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token.value}`
      }
    })
    if (!response.ok) throw new Error('Fehler beim Löschen')
    execute()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="mb-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold">Kategorien verwalten</h1>
        <p class="text-muted-foreground">Kategorien für Ausflugsziele organisieren</p>
      </div>
      <Button @click="showNewForm = true">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Neue Kategorie
      </Button>
    </div>

    <!-- New Category Form -->
    <Card v-if="showNewForm" class="mb-6">
      <CardHeader>
        <CardTitle>Neue Kategorie erstellen</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="new-name">Name</Label>
          <Input id="new-name" v-model="newCategory.name" placeholder="Kategoriename" />
        </div>
        <div>
          <Label for="new-desc">Beschreibung</Label>
          <textarea
            id="new-desc"
            v-model="newCategory.beschreibung"
            class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            rows="2"
            placeholder="Optionale Beschreibung"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="showNewForm = false">Abbrechen</Button>
          <Button :loading="saving" @click="createCategory">Erstellen</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Edit Category Form -->
    <Card v-if="editingCategory" class="mb-6">
      <CardHeader>
        <CardTitle>Kategorie bearbeiten</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <Label for="edit-name">Name</Label>
          <Input id="edit-name" v-model="editingCategory.name" />
        </div>
        <div>
          <Label for="edit-desc">Beschreibung</Label>
          <textarea
            id="edit-desc"
            v-model="editingCategory.beschreibung"
            class="w-full mt-1 px-3 py-2 border rounded-md bg-background"
            rows="2"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" @click="editingCategory = null">Abbrechen</Button>
          <Button :loading="saving" @click="updateCategory">Speichern</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Categories List -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-16 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!kategorien?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Kategorien vorhanden</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="kat in kategorien" :key="kat.id" class="p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ kat.name }}</h3>
            <p v-if="kat.beschreibung" class="text-sm text-muted-foreground mt-1">
              {{ kat.beschreibung }}
            </p>
          </div>
          <div class="flex gap-1">
            <Button variant="ghost" size="sm" @click="editingCategory = { ...kat }">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive" @click="deleteCategory(kat.id)">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>