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
import NotFound from "@/pages/NotFound.vue";
import Test from "@/pages/Test.vue";
import CharacterSelection from "@/pages/CharacterSelection.vue";
import BattleArea from "@/pages/battle_area.vue";
import NextPhase from "@/components/battle_page/next_phase.vue";
import Victory from "@/pages/Victory.vue";
import Cards from "@/pages/CardsView.vue";
import Landing from "@/pages/Landing.vue";
import MultiPlayer from "@/pages/MultiPlayer.vue";

// Setup routes
const routes = setupLayouts([
  ...autoRoutes,
  { path: "/", component: Hero,name: "Hero" },
  { path: "/Test", component: Test },
  { path: "/:pathMatch(.*)*", component: NotFound },

  { path: "/landing", component: Landing, name: "landing", meta: { requiresAuth: true } },
  { path: "/select_character", component: CharacterSelection, meta: { requiresAuth: true } },
  { path: "/next_phase", component: NextPhase, meta: { requiresAuth: true }, name: "next_phase" },
  { path: "/battle_area", component: BattleArea, meta: { requiresAuth: true }, name: "battle_area" },
  { path: "/victory", component: Victory, meta: { requiresAuth: true }, name: "Victory", props: true },
  { path: "/cards", component: Cards, meta: { requiresAuth: true } },
  { path: "/multiplayer", component: MultiPlayer, meta: { requiresAuth: true } },
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;

  // Define public and protected pages
  const publicPages = ["/", "/Test"];
  const protectedPages = ["/select_character", "/next_phase", "/battle_area", "/Victory", "/cards", "/landing",
    "/multiplayer"
  ];

  // Redirect to login if accessing protected pages without authentication
  if (protectedPages.includes(to.path) && !isLoggedIn) {
    return next("/");
  }

  // Redirect to /cards if already logged in and accessing public pages
  if (publicPages.includes(to.path) && isLoggedIn) {
    return next("/landing");
  }

  // Default: proceed to the requested route
  next();
});

// Handle dynamic import errors (workaround for https://github.com/vitejs/vite/issues/11804)
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
