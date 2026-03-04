<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const auth = useAuth()

const images = ref<any[]>([])
const loading = ref(true)
const saving = ref<number | null>(null)
const searchQuery = ref('')

const editingImage = ref<any | null>(null)
const editDialogOpen = ref(false)

// Filter images by author
const filteredImages = computed(() => {
  if (!searchQuery.value) return images.value
  const query = searchQuery.value.toLowerCase()
  return images.value.filter(img => 
    (img.autor?.toLowerCase().includes(query)) ||
    (img.beschreibung?.toLowerCase().includes(query)) ||
    (img.original_name?.toLowerCase().includes(query))
  )
})

// Group by author
const groupedByAuthor = computed(() => {
  const groups: Record<string, any[]> = {}
  filteredImages.value.forEach(img => {
    const author = img.autor || 'Unbekannt'
    if (!groups[author]) groups[author] = []
    groups[author].push(img)
  })
  return groups
})

// Load images
async function loadImages() {
  loading.value = true
  try {
    const response = await fetch(`${config.public.apiBase}/bilder?per_page=500`, {
      headers: {
        'Authorization': `Bearer ${auth.token.value}`
      }
    })
    const data = await response.json()
    images.value = data.data || data
  } catch (e) {
    console.error('Failed to load images', e)
  } finally {
    loading.value = false
  }
}

// Open edit dialog
function openEditDialog(image: any) {
  editingImage.value = { ...image }
  editDialogOpen.value = true
}

// Save image metadata
async function saveImage() {
  if (!editingImage.value) return
  
  saving.value = editingImage.value.id
  try {
    const response = await fetch(`${config.public.apiBase}/bilder/${editingImage.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${auth.token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        autor: editingImage.value.autor || '',
        beschreibung: editingImage.value.beschreibung || '',
        alt: editingImage.value.alt || '',
        is_primary: editingImage.value.is_primary || false
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to save')
    }
    
    // Update in list
    const index = images.value.findIndex(img => img.id === editingImage.value!.id)
    if (index !== -1) {
      images.value[index] = { ...editingImage.value }
    }
    
    editDialogOpen.value = false
    editingImage.value = null
  } catch (e) {
    console.error('Failed to save image', e)
  } finally {
    saving.value = null
  }
}

// Get image URL
function getImageUrl(image: any) {
  const baseUrl = config.public.apiBase.replace('/api/v1', '')
  return `${baseUrl}/media/bilder/${image.id}`
}

onMounted(loadImages)
</script>

<template>
  <div class="animate-fade-in">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">Bildverwaltung</h1>
        <p class="text-muted-foreground">Autor und Beschreibung für Bildnachweise bearbeiten</p>
      </div>
      <NuxtLink to="/admin">
        <Button variant="outline">← Zurück zum Admin</Button>
      </NuxtLink>
    </div>

    <!-- Search -->
    <Card class="mb-6">
      <CardContent class="pt-6">
        <Input
          v-model="searchQuery"
          placeholder="Nach Autor oder Bild suchen..."
          class="max-w-md"
        />
      </CardContent>
    </Card>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>

    <!-- Grouped by Author -->
    <div v-else class="space-y-6">
      <Card v-for="(imgs, author) in groupedByAuthor" :key="author">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>{{ author }}</span>
            <span class="text-sm font-normal text-muted-foreground">
              {{ imgs.length }} Bild{{ imgs.length !== 1 ? 'er' : '' }}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div 
              v-for="image in imgs" 
              :key="image.id"
              class="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
              @click="openEditDialog(image)"
            >
              <img
                :src="getImageUrl(image)"
                :alt="image.alt || image.original_name || 'Bild'"
                class="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
              <div 
                class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2"
              >
                <p 
                  v-if="image.beschreibung" 
                  class="text-white text-xs text-center line-clamp-2 mb-2"
                >
                  {{ image.beschreibung }}
                </p>
                <span class="text-white text-xs underline">Bearbeiten</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Edit Dialog -->
    <div 
      v-if="editDialogOpen && editingImage" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="editDialogOpen = false"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bild bearbeiten</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="aspect-video rounded-lg overflow-hidden bg-muted mb-4">
            <img
              :src="getImageUrl(editingImage)"
              :alt="editingImage.alt || 'Bild'"
              class="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <label class="text-sm font-medium">Autor</label>
            <Input
              v-model="editingImage.autor"
              placeholder="Name des Fotografen"
              class="mt-1"
            />
          </div>
          
          <div>
            <label class="text-sm font-medium">Beschreibung</label>
            <Textarea
              v-model="editingImage.beschreibung"
              placeholder="Beschreibung des Bildes"
              rows="3"
              class="mt-1"
            />
          </div>
          
          <div>
            <label class="text-sm font-medium">Alt-Text</label>
            <Input
              v-model="editingImage.alt"
              placeholder="Barrierefreier Alternativtext"
              class="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter class="flex justify-end gap-2">
          <Button variant="outline" @click="editDialogOpen = false">
            Abbrechen
          </Button>
          <Button 
            :disabled="saving === editingImage.id" 
            @click="saveImage"
          >
            <span v-if="saving === editingImage.id" class="animate-spin mr-2">⏳</span>
            Speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>