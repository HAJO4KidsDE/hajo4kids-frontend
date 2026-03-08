<script setup lang="ts">
interface Props {
  images: { src: string; alt: string }[]
  initialIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0
})

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex)
const isLoading = ref(true)

// Compute current image
const currentImage = computed(() => props.images[currentIndex.value])

// Navigation
function nextImage() {
  isLoading.value = true
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prevImage() {
  isLoading.value = true
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Keyboard navigation
onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

function onImageLoad() {
  isLoading.value = false
}

// Close on backdrop click
function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        @click="onBackdropClick"
      >
        <!-- Close button -->
        <button
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          @click="$emit('close')"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Previous button -->
        <button
          v-if="images.length > 1"
          class="absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          @click.stop="prevImage"
        >
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Image container -->
        <div class="relative max-w-full max-h-full">
          <!-- Loading spinner -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>

          <!-- Image -->
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl transition-opacity duration-200"
            :class="{ 'opacity-0': isLoading }"
            @load="onImageLoad"
          />
        </div>

        <!-- Next button -->
        <button
          v-if="images.length > 1"
          class="absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          @click.stop="nextImage"
        >
          <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image counter -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-full text-white text-sm"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Thumbnail strip for multiple images -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2"
        >
          <button
            v-for="(image, index) in images"
            :key="index"
            class="shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all"
            :class="index === currentIndex ? 'border-primary scale-110' : 'border-transparent opacity-60 hover:opacity-100'"
            @click.stop="currentIndex = index; isLoading = true"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>