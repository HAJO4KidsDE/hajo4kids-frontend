<script setup lang="ts">
const config = useRuntimeConfig()

const streamingProviders = [
  { name: 'Spotify', icon: 'spotify', url: 'https://open.spotify.com/album/7zLYbpzeTyLU5KBRlQlxXB' },
  { name: 'Apple Music', icon: 'apple', url: 'https://itunes.apple.com/de/album/hajo-hajo-hajo-es-gibt-so-viel-zu-erleben-hier-auf/1406454378' },
  { name: 'Amazon Music', icon: 'amazon', url: 'https://www.amazon.de/dp/B07F6MZMVZ' },
  { name: 'Deezer', icon: 'music', url: 'https://www.deezer.com/album/67358702' }
]

const members = [
  { name: 'David Fachinger', task: 'Komponist/Klavier und Sänger', image: 212 },
  { name: 'Janis Heftrich', task: 'Trommel', image: 214 },
  { name: 'Björn Diefenbach', task: 'Gitarre', image: 211 },
  { name: 'Ralf Schohl', task: 'Kontrabass', image: 216 },
  { name: 'Michael Born', task: 'Tonstudio in Limburg', image: 215 },
  { name: 'Evelyn Hannappel mit ihrem Kinderchor', task: 'Chor', image: 213 },
  { name: 'Peter Jeuck', task: 'Idee/Umsetzung und Koordination', image: 210 }
]
</script>

<template>
  <div class="animate-fade-in">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">HAJO Song</h1>
      <p class="text-muted-foreground">Unsere Hymne für Familienausflüge</p>
    </div>

    <!-- Musikvideos -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Musikvideos</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div>
          <h3 class="font-semibold mb-3">Offizielles Video - Die finale Version</h3>
          <div class="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/AoQm1KCh79A?rel=0" 
              frameborder="0" 
              allow="autoplay; encrypted-media" 
              allowfullscreen
              class="w-full h-full"
            />
          </div>
        </div>
        <div>
          <h3 class="font-semibold mb-3">Preview: Das Making Of</h3>
          <div class="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/VD5FGHDRnv4" 
              frameborder="0" 
              allow="autoplay; encrypted-media" 
              allowfullscreen
              class="w-full h-full"
            />
          </div>
        </div>
        <p class="text-sm text-muted-foreground">
          Auf unserem 
          <a href="https://www.youtube.com/playlist?list=PLmTymG0ci2h_WTGyruT_96bgQgLfY_3CS" target="_blank" class="text-primary hover:underline">
            Youtube-Channel
          </a> 
          findest Du alle unsere Video Beiträge.
        </p>
      </CardContent>
    </Card>

    <!-- Streamingportale -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Streamingportale</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="mb-4">Der Song ist in den gängigsten Streamingportalen verfügbar:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            v-for="provider in streamingProviders" 
            :key="provider.name"
            :href="provider.url" 
            target="_blank"
            class="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
          >
            <div class="text-4xl">
              <span v-if="provider.icon === 'spotify'">🎵</span>
              <span v-else-if="provider.icon === 'apple'">🍎</span>
              <span v-else-if="provider.icon === 'amazon'">📦</span>
              <span v-else>🎶</span>
            </div>
            <span class="font-medium text-sm">{{ provider.name }}</span>
          </a>
        </div>
      </CardContent>
    </Card>

    <!-- Lyrics -->
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Songtext</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="prose prose-sm dark:prose-invert max-w-none space-y-4">
          <div>
            <h4 class="font-semibold text-primary">Vers 1</h4>
            <p class="whitespace-pre-line">Schau' mal, ein neuer Tag fängt an,
an dem man viel erleben kann.
Was steht denn heute auf dem Plan?
Egal, Hauptsache du mit mir,
egal Hauptsache ich mit dir,
mach' aus dem „Du und Ich" ein „Wir".</p>
          </div>

          <div>
            <h4 class="font-semibold text-primary">Pre-Chorus</h4>
            <p class="whitespace-pre-line">Uns're Zeit zusammen ist unwiederbringlich begrenzt
für die nächsten Milliarden Jahre.
Und das schönste, dass wir teilen könn'n sind Emotionen,
darum hört uns zu, wenn wir Euch sagen:</p>
          </div>

          <div>
            <h4 class="font-semibold text-primary">Chorus</h4>
            <p class="whitespace-pre-line font-medium">Hajo, Hajo, Hajo - es gibt so viel zu erleben hier auf dieser Welt.
Hajo, Hajo, Hajo - was kann es schöneres geben, als wenn dir was gefällt.
Und das einzige, dass wirklich bleibt, sind die Erinnerung'n an die gemeinsame Zeit.
Hajo, Hajo, Hajo - es gibt so viel zu erleben hier auf dieser Welt.</p>
          </div>

          <div>
            <h4 class="font-semibold text-primary">Vers 2</h4>
            <p class="whitespace-pre-line">Ja das was Kinderaugen seh'n
ist meistens tausend mal so schön
und könn'n Erwachs'ne nicht versteh'n.
Drum nehmt uns Alten an die Hand,
führt uns ins Abenteuerland,
das ist uns gänzlich unbekannt.</p>
          </div>

          <div>
            <h4 class="font-semibold text-primary">Pre-Chorus</h4>
            <p class="whitespace-pre-line">Uns're Zeit zusammen ist unwiederbringlich begrenzt
für die nächsten Milliarden Jahre.
Und das schönste, dass wir teilen könn'n sind Emotionen,
darum hört uns zu, wenn wir Euch sagen:</p>
          </div>

          <div>
            <h4 class="font-semibold text-primary">Chorus</h4>
            <p class="whitespace-pre-line font-medium">Hajo, Hajo, Hajo - es gibt so viel zu erleben hier auf dieser Welt.
Hajo, Hajo, Hajo - was kann es schöneres geben, als wenn dir was gefällt.
Und das einzige, dass wirklich bleibt, sind die Erinnerung'n an die gemeinsame Zeit.
Hajo, Hajo, Hajo - es gibt so viel zu erleben hier auf dieser Welt.</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Beteiligte -->
    <Card>
      <CardHeader>
        <CardTitle>Beteiligte</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="member in members" 
            :key="member.name"
            class="flex flex-col items-center text-center p-4 rounded-lg border"
          >
            <div class="w-24 h-24 rounded-full overflow-hidden bg-muted mb-3">
              <img
                :src="`${config.public.apiBase.replace('/api/v1', '')}/media/bilder/${member.image}`"
                :alt="member.name"
                class="w-full h-full object-cover"
              />
            </div>
            <p class="font-medium">{{ member.name }}</p>
            <p class="text-sm text-muted-foreground">{{ member.task }}</p>
          </div>
        </div>
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