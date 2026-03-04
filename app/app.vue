<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize auth on client-side only
const { initialized, initSession } = useAuth()

onMounted(async () => {
  if (!initialized.value) {
    await initSession()
  }
})
</script>