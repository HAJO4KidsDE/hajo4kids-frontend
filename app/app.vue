<template>
  <div v-if="!auth.initialized.value" class="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)] mx-auto"></div>
      <p class="mt-4 text-[var(--text-secondary)]">Wird geladen...</p>
    </div>
  </div>
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const auth = useAuth()

// Initialize auth on client-side
onMounted(async () => {
  if (!auth.initialized.value) {
    await auth.initSession()
  }
})
</script>