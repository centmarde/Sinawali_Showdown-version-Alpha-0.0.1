<template>
  <v-app>
    <v-main>
      <div v-if="isLoading" class="loading-screen">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading...</p>
      </div>
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

// Simulate a loading process
onMounted(() => {
  // Simulating an asynchronous operation
  setTimeout(() => {
    isLoading.value = false; // Set loading to false after loading is complete
  }, 2000); // Adjust the duration as needed
});
</script>

<style>
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e6d011;
  position: absolute;
  width: 100%;
  z-index: 999; /* Ensure the loading screen is above other elements */
}
</style>
