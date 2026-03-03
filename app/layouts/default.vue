<script setup lang="ts">
const auth = useAuth()
const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Ziele', to: '/ziele' },
  { name: 'Kategorien', to: '/kategorien' },
  { name: 'Veranstaltungen', to: '/veranstaltungen' },
  { name: 'Trips', to: '/trips' },
  { name: 'Blog', to: '/posts' },
  { name: 'Shop', to: '/shop' },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary">HAJO4Kids</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            active-class="text-primary"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>

        <!-- Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="auth.isLoggedIn.value">
            <NuxtLink to="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </NuxtLink>
            <Button variant="outline" @click="auth.logout">Abmelden</Button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login">
              <Button variant="ghost">Anmelden</Button>
            </NuxtLink>
            <NuxtLink to="/auth/register">
              <Button>Registrieren</Button>
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t">
        <div class="container py-4 space-y-4">
          <nav class="flex flex-col space-y-2">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
              @click="mobileMenuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
          <div class="flex flex-col space-y-2 pt-2 border-t">
            <template v-if="auth.isLoggedIn.value">
              <NuxtLink to="/dashboard" @click="mobileMenuOpen = false">
                <Button class="w-full" variant="outline">Dashboard</Button>
              </NuxtLink>
              <Button class="w-full" variant="outline" @click="auth.logout">Abmelden</Button>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" @click="mobileMenuOpen = false">
                <Button class="w-full" variant="outline">Anmelden</Button>
              </NuxtLink>
              <NuxtLink to="/auth/register" @click="mobileMenuOpen = false">
                <Button class="w-full">Registrieren</Button>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t py-8 mt-auto">
      <div class="container">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-muted-foreground">
            © 2026 HAJO4Kids. Alle Rechte vorbehalten.
          </div>
          <div class="flex items-center space-x-6 text-sm">
            <NuxtLink to="/kontakt" class="text-muted-foreground hover:text-primary">Kontakt</NuxtLink>
            <NuxtLink to="/impressum" class="text-muted-foreground hover:text-primary">Impressum</NuxtLink>
            <NuxtLink to="/datenschutz" class="text-muted-foreground hover:text-primary">Datenschutz</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>