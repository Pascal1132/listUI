// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Épicerie',
    }
  },
  runtimeConfig: {
    LISTS_JSON_FILE: process.env.LISTS_JSON_FILE,
  },
  modules: [
    'nuxt-icon',
  ],
})
