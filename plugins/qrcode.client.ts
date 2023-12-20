import QrcodeVue from "qrcode.vue";
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('qrcode', QrcodeVue);
});