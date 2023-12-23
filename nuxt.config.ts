// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Épicerie',
    },
    pageTransition: {
      name: 'fade-slide',
      mode: 'out-in' // default
    },
  },
  runtimeConfig: {
    LISTS_JSON_FILE: process.env.LISTS_JSON_FILE,
  },
  modules: [
    'nuxt-icon',
    '@vite-pwa/nuxt'
  ],
})
