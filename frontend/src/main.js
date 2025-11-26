// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');

// ⚠️ NADA de loadMachines() aqui.
// Só instalamos stores, não chamamos APIs neste ficheiro.
