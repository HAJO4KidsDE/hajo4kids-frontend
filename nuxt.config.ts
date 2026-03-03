// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  css: ['~/assets/css/tailwind.css'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  
  imports: {
    dirs: ['composables', 'utils', 'lib'],
  },
  
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      pathPrefix: true,
    },
  ],
  
  app: {
    head: {
      title: 'HAJO4Kids',
      meta: [
        { name: 'description', content: 'Entdecke tolle Ausflugsziele für Kids!' },
      ],
    },
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api/v1',
    },
  },
})