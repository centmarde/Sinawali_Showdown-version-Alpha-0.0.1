/**
 * router/index.ts
 *
 * Combined automatic routes for `./src/pages/*.vue` with role-based authentication guards
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes as autoRoutes } from 'vue-router/auto-routes'


import Hero from '../pages/index.vue'



const routes = setupLayouts([
  ...autoRoutes,
  { path: '/', component: Hero },


]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const userRole = JSON.parse(localStorage.getItem("Role")); // Parse the boolean stored as a string
  const hasVisitedDashboard = JSON.parse(localStorage.getItem("hasVisitedDashboard")) || false; // Track dashboard visit

  console.log('User Role:', userRole); // Debugging role

  // Pages that don't require authentication
  const publicPages = ['/', '/login','/Register'];

  // Pages that require authentication
  const protectedPages = [];

  
  if (protectedPages.includes(to.path) && !isLoggedIn) {
    return next('/');
  }

  
  if (isLoggedIn && userRole === true && !hasVisitedDashboard) {
    localStorage.setItem("hasVisitedDashboard", true); 
    return next('/Dashboard');
  }

  
  if (publicPages.includes(to.path) && isLoggedIn) {
    return next('/Home');
  }

  // Restrict non-admin users from accessing the dashboard
  if (to.path.startsWith('/Dashboard') && userRole !== true) {
    alert('You do not have permission to access this page.');
    return next('/Home');
  }

  // Default behavior: proceed to the requested route
  next();
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;