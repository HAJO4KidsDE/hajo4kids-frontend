<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border border-border/60 bg-card/85 text-card-foreground shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>