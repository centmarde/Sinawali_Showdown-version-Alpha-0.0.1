/**
 * router/index.ts
 *
 * Combined automatic routes for `./src/pages/*.vue` with role-based authentication guards
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";

import Hero from "../pages/index.vue";
import Notfound from "@/pages/not_found.vue";
import Test from "@/pages/Test.vue";
import select_character from "@/pages/select_character.vue";
import battle_area from "@/pages/battle_area.vue";
import next_phase from "@/components/battle_page/next_phase.vue";
import Victory from "@/pages/Victory.vue"; // Import Victory component

const routes = setupLayouts([
  ...autoRoutes,
  { path: "/", component: Hero },
  { path: "/Test", component: Test },
  { path: "/select_character", component: select_character },
  { path: "/:pathMatch(.*)*", component: Notfound },
  { path: "/next_phase", component: next_phase, name: "next_phase" },
  { path: "/battle_area", component: battle_area, name: "battle_area" },
  { path: "/victory", component: Victory, name: "Victory", props: true },
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
