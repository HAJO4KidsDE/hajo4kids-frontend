<script setup lang="ts">
const config = useRuntimeConfig()
const auth = useAuth()

interface ShopItem {
  id: number
  name: string
  slug: string
  beschreibung: string
  preis: number
  preis_alt?: number
  bild: string
  lagerbestand: number
  verfuegbar: boolean
  status: string
  kategorie_id?: number
}

const { data: itemsRaw, pending, refresh } = await useApiGet<{data: ShopItem[], meta?: {total: number}} | ShopItem[]>('/shop/items')

// Handle both paginated and array responses
const items = computed<ShopItem[]>(() => {
  const raw = itemsRaw.value
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  const paginated = raw as {data: ShopItem[], meta?: {total: number}}
  if (paginated.data && Array.isArray(paginated.data)) {
    return paginated.data
  }
  return []
})

const editingItem = ref<ShopItem | null>(null)
const isSaving = ref(false)

async function saveItem() {
  if (!editingItem.value) return
  isSaving.value = true
  
  try {
    if (editingItem.value.id) {
      await $fetch(`${config.public.apiBase}/shop/items/${editingItem.value.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${useCookie('auth_token').value}` },
        body: editingItem.value
      })
    } else {
      await $fetch(`${config.public.apiBase}/shop/items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${useCookie('auth_token').value}` },
        body: editingItem.value
      })
    }
    editingItem.value = null
    refresh()
  } catch (e) {
    console.error('Error saving item:', e)
  } finally {
    isSaving.value = false
  }
}

async function deleteItem(id: number) {
  if (!confirm('Artikel wirklich löschen?')) return
  
  try {
    await $fetch(`${config.public.apiBase}/shop/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${useCookie('auth_token').value}` }
    })
    refresh()
  } catch (e) {
    console.error('Error deleting item:', e)
  }
}

function editItem(item: ShopItem) {
  editingItem.value = { ...item }
}

function newItem() {
  editingItem.value = {
    id: 0,
    name: '',
    slug: '',
    beschreibung: '',
    preis: 0,
    bild: '',
    lagerbestand: 100,
    verfuegbar: true,
    status: 'DESIGN'
  }
}

function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',') + '€'
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Shop-Artikel verwalten</h1>
      <Button @click="newItem">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Neuer Artikel
      </Button>
    </div>

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 4" :key="i" class="h-20 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="items.length === 0" class="text-center py-12">
      <p class="text-muted-foreground">Keine Artikel vorhanden</p>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="item in items" :key="item.id">
        <CardContent class="p-4">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded bg-muted flex-shrink-0 overflow-hidden">
              <img
                v-if="item.bild"
                :src="item.bild.match(/^\d+$/) ? `${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${item.bild}` : item.bild"
                :alt="item.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-semibold truncate">{{ item.name }}</h3>
                <span 
                  :class="[
                    'px-2 py-0.5 text-xs rounded',
                    item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">{{ formatPrice(item.preis) }}</p>
              <p class="text-xs text-muted-foreground">Lager: {{ item.lagerbestand }}</p>
            </div>
            <div class="flex gap-2">
              <Button size="sm" variant="outline" @click="editItem(item)">
                Bearbeiten
              </Button>
              <Button size="sm" variant="destructive" @click="deleteItem(item.id)">
                Löschen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Edit Modal -->
    <div 
      v-if="editingItem" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="editingItem = null"
    >
      <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{{ editingItem.id ? 'Artikel bearbeiten' : 'Neuer Artikel' }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <Label>Name</Label>
            <Input v-model="editingItem.name" class="mt-1" />
          </div>
          <div>
            <Label>Beschreibung</Label>
            <Textarea v-model="editingItem.beschreibung" rows="3" class="mt-1" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Preis (€)</Label>
              <Input v-model.number="editingItem.preis" type="number" step="0.01" class="mt-1" />
            </div>
            <div>
              <Label>Alter Preis (€)</Label>
              <Input v-model.number="editingItem.preis_alt" type="number" step="0.01" class="mt-1" />
            </div>
          </div>
          <div>
            <Label>Bild-ID oder URL</Label>
            <Input v-model="editingItem.bild" placeholder="z.B. 240 oder https://..." class="mt-1" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Lagerbestand</Label>
              <Input v-model.number="editingItem.lagerbestand" type="number" class="mt-1" />
            </div>
            <div>
              <Label>Status</Label>
              <select v-model="editingItem.status" class="w-full mt-1 px-3 py-2 rounded-md border border-input bg-background">
                <option value="DESIGN">Entwurf</option>
                <option value="published">Veröffentlicht</option>
                <option value="ARCHIVED">Archiviert</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="editingItem.verfuegbar" id="verfuegbar" class="rounded" />
            <Label for="verfuegbar" class="cursor-pointer">Verfügbar</Label>
          </div>
        </CardContent>
        <CardFooter class="flex justify-end gap-2">
          <Button variant="outline" @click="editingItem = null">
            Abbrechen
          </Button>
          <Button :disabled="isSaving" @click="saveItem">
            <span v-if="isSaving" class="animate-spin mr-2">⏳</span>
            Speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>