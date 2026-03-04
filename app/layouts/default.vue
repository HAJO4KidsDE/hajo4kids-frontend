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
  <div class="min-h-screen bg-background text-foreground">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 w-full bg-[#d1212b] text-white shadow-md"
    >
      <div class="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-extrabold tracking-tight">
            <span>HAJO</span><span class="opacity-90">4Kids</span>
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            active-class="bg-white/20 text-white"
          >
            {{ item.name }}
          </NuxtLink>
          <NuxtLink
            v-if="auth.hasRole(['admin', 'reporter'])"
            to="/admin"
            class="rounded-full px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/15 hover:text-white"
            active-class="bg-white/20 text-white"
          >
            Admin
          </NuxtLink>
        </nav>

        <!-- Auth Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="auth.isLoggedIn.value">
            <NuxtLink to="/dashboard">
              <Button
                variant="ghost"
                class="text-white hover:bg-white/15 hover:text-white"
              >
                Dashboard
              </Button>
            </NuxtLink>
            <Button
              variant="outline"
              class="border-white/50 bg-white text-[#d1212b] hover:bg-white/90"
              @click="auth.logout"
            >
              Abmelden
            </Button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login">
              <Button
                variant="ghost"
                class="text-white hover:bg-white/15 hover:text-white"
              >
                Anmelden
              </Button>
            </NuxtLink>
            <NuxtLink to="/auth/register">
              <Button
                variant="outline"
                class="border-white/50 bg-white text-[#d1212b] hover:bg-white/90"
              >
                Registrieren
              </Button>
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden rounded-lg p-2 text-white hover:bg-white/15"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/20 bg-[#d1212b] text-white">
        <div class="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 space-y-4">
          <nav class="flex flex-col space-y-2">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              class="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white"
              @click="mobileMenuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
            <NuxtLink
              v-if="auth.hasRole(['admin', 'reporter'])"
              to="/admin"
              class="rounded-lg px-3 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 hover:text-white"
              @click="mobileMenuOpen = false"
            >
              Admin
            </NuxtLink>
          </nav>
          <div class="flex flex-col space-y-2 pt-2 border-t border-white/20">
            <template v-if="auth.isLoggedIn.value">
              <NuxtLink to="/dashboard" @click="mobileMenuOpen = false">
                <Button
                  class="w-full border-white/50 bg-white text-[#d1212b] hover:bg-white/90"
                  variant="outline"
                >
                  Dashboard
                </Button>
              </NuxtLink>
              <Button
                class="w-full border-white/50 bg-white text-[#d1212b] hover:bg-white/90"
                variant="outline"
                @click="auth.logout"
              >
                Abmelden
              </Button>
            </template>
            <template v-else>
              <NuxtLink to="/auth/login" @click="mobileMenuOpen = false">
                <Button
                  class="w-full text-white hover:bg-white/15 hover:text-white"
                  variant="ghost"
                >
                  Anmelden
                </Button>
              </NuxtLink>
              <NuxtLink to="/auth/register" @click="mobileMenuOpen = false">
                <Button
                  class="w-full border-white/50 bg-white text-[#d1212b] hover:bg-white/90"
                  variant="outline"
                >
                  Registrieren
                </Button>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-border/60 py-10 mt-auto">
      <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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