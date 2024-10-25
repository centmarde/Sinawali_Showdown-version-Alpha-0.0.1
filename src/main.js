/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router/index";
// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia"; // Import Pinia

const app = createApp(App);

const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // Use Pinia
app.use(router);

registerPlugins(app);

app.mount("#app");
