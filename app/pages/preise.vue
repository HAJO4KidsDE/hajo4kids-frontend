<script setup lang="ts">
const bundles = [
  {
    name: 'STANDARD',
    price: 0,
    features: [
      'Aufnahme in unsere HAJO4KIDS-Liste',
      'Anzeigen von Standardbildern',
      'Anzeigen von Webseiten',
      'Anzeigen in Geo-Karte'
    ],
    ranking: 1,
    tags: 0
  },
  {
    name: 'EINSTEIGER',
    price: 9.99,
    features: [
      'Aufnahme in unsere HAJO4KIDS-Liste',
      'Anzeigen von Standardbildern',
      'Anzeigen von Webseiten',
      'Anzeigen in Geo-Karte',
      'Anzeigen von Öffnungszeiten',
      'Eigenes Standardbild',
      'Eigene Beschreibung (reiner Text)',
      'Statistiken'
    ],
    ranking: 2,
    tags: 0
  },
  {
    name: 'PREMIUM',
    price: 24.99,
    features: [
      'Aufnahme in unsere HAJO4KIDS-Liste',
      'Anzeigen von Standardbildern',
      'Anzeigen von Webseiten',
      'Anzeigen in Geo-Karte',
      'Anzeigen von Öffnungszeiten',
      'Eigenes Standardbild',
      'Eigene Beschreibung (reiner Text)',
      'Eigene Bildserie (max. 4 Bilder)',
      'Eigene Veranstaltung (max. 2)',
      'Statistiken'
    ],
    ranking: 3,
    tags: 5
  },
  {
    name: 'ULTIMATE',
    price: 49.99,
    features: [
      'Aufnahme in unsere HAJO4KIDS-Liste',
      'Anzeigen von Standardbildern',
      'Anzeigen von Webseiten',
      'Anzeigen in Geo-Karte',
      'Anzeigen von Öffnungszeiten',
      'Eigenes Standardbild',
      'Eigene Beschreibung (HTML)',
      'Eigene Bildserie (max. 20 Bilder)',
      'Eigene Veranstaltungen (max. 8)',
      'Statistiken'
    ],
    ranking: 4,
    tags: 20
  }
]

function formatPrice(price: number): string {
  return price === 0 ? 'Kostenlos' : `${price.toFixed(2)} €`
}

function isPaid(bundle: typeof bundles[0]): boolean {
  return bundle.price > 0
}
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Pakete & Preise</h1>
      <p class="text-muted-foreground">Präsentiere dein Ziel mit mehr Informationen</p>
    </div>

    <Card class="mb-8">
      <CardContent class="pt-6">
        <p class="text-muted-foreground">
          Dein eigenes Ziel kannst Du natürlich auch mit weiteren Informationen präsentieren. 
          Dazu kannst Du Dir gerne eines unserer Pakete anschauen. Natürlich bieten wir Dein Ziel 
          gerne auch in der kostenlosen Variante an.
        </p>
        <p class="mt-4 text-muted-foreground">
          Sollte etwas für Dich dabei sein, melde Dich einfach. Wir richten Dir im Handumdrehen 
          einen entsprechenden Zugang ein.
        </p>
      </CardContent>
    </Card>

    <!-- Pricing Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        v-for="bundle in bundles" 
        :key="bundle.name"
        class="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        :class="{ 'border-primary': bundle.price > 0 }"
      >
        <div 
          v-if="bundle.name === 'PREMIUM'" 
          class="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg"
        >
          Beliebt
        </div>
        <CardHeader class="text-center pb-2">
          <CardTitle>{{ bundle.name }}</CardTitle>
          <div class="mt-4">
            <span class="text-4xl font-bold">{{ formatPrice(bundle.price) }}</span>
            <span v-if="bundle.price > 0" class="text-muted-foreground"> / Monat</span>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <ul class="space-y-2">
            <li 
              v-for="(feature, index) in bundle.features" 
              :key="index"
              class="flex items-start gap-2 text-sm"
            >
              <svg class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
          <div class="pt-4 border-t text-sm">
            <p class="text-muted-foreground">Rankingfaktor: <strong class="text-foreground">{{ bundle.ranking }}</strong></p>
            <p v-if="bundle.tags > 0" class="text-muted-foreground">Schlagwörter: <strong class="text-foreground">{{ bundle.tags }}</strong></p>
          </div>
          <a 
            href="mailto:buero@hajo4kids.de?subject=Paketanfrage: {{ bundle.name }}"
            class="block"
          >
            <Button 
              class="w-full" 
              :variant="bundle.name === 'PREMIUM' ? 'default' : 'outline'"
            >
              Anfragen
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>

    <!-- Werbung -->
    <Card>
      <CardHeader>
        <CardTitle>Werbung schalten</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground">
          Gerne kannst Du auf unserer Seite auch Werbung schalten. Dabei ist allerdings das Thema 
          Kinder zwingend erforderlich. 
          <a href="mailto:buero@hajo4kids.de?subject=Werbung" class="text-primary hover:underline">
            Melde Dich einfach!
          </a>
        </p>
      </CardContent>
    </Card>
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