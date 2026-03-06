<script setup lang="ts">
const config = useRuntimeConfig()

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
  kategorie?: { id: number; name: string }
}

function getShopImageUrl(bild: string): string {
  if (!bild) return ''
  // If it's a numeric ID, use the media endpoint
  if (/^\d+$/.test(bild)) {
    return `${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${bild}`
  }
  return bild
}

const { data: items, pending } = await useApiGet<ShopItem[]>('/shop/items?verfuegbar=true')
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Shop</h1>
      <p class="text-muted-foreground">Produkte und Merchandise</p>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="h-72 bg-muted rounded-lg animate-pulse" />
    </div>

    <div v-else-if="!items?.length" class="text-center py-12">
      <p class="text-muted-foreground">Keine Produkte verfügbar</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        v-for="item in items"
        :key="item.id"
        class="overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="aspect-square bg-muted relative">
          <img
            v-if="item.bild"
            :src="getShopImageUrl(item.bild)"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div v-if="!item.verfuegbar" class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span class="text-white font-medium">Ausverkauft</span>
          </div>
          <div v-if="item.preis_alt && item.preis < item.preis_alt" class="absolute top-2 right-2">
            <span class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              -{{ Math.round((1 - item.preis / item.preis_alt) * 100) }}%
            </span>
          </div>
        </div>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg line-clamp-1">{{ item.name }}</CardTitle>
          <CardDescription v-if="item.kategorie" class="text-xs">
            {{ item.kategorie.name }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p v-if="item.beschreibung" class="text-sm text-muted-foreground line-clamp-2 mb-3">
            {{ item.beschreibung }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <span class="text-xl font-bold">
                {{ item.preis.toFixed(2).replace('.', ',') }}€
              </span>
              <span v-if="item.preis_alt" class="text-sm text-muted-foreground line-through">
                {{ item.preis_alt.toFixed(2).replace('.', ',') }}€
              </span>
            </div>
            <Button
              size="sm"
              :disabled="!item.verfuegbar || item.lagerbestand < 1"
            >
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Kaufen
            </Button>
          </div>
          <div v-if="item.lagerbestand < 5 && item.lagerbestand > 0" class="mt-2 text-xs text-orange-600">
            Nur noch {{ item.lagerbestand }} verfügbar
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>