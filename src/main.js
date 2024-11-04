/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";
import router from "./router/index";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // Import Toastification CSS

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { createPinia } from "pinia"; // Import Pinia

const app = createApp(App);

const pinia = createPinia(); // Create Pinia instance

// Register plugins
registerPlugins(app);

// Register Toast plugin with default options
app.use(Toast, {
  // Add any custom options here if desired, e.g., timeout, position, etc.
});


app.mount("#app");
