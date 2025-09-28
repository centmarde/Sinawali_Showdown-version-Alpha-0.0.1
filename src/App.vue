<template>
  <v-app class="zoomed">
    <v-main>
      <div v-if="isLoading" class="loading-screen">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <p>Loading...</p>
      </div>
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Rock+Salt&display=swap");

.merienda {
  font-family: "Merienda", cursive;
}

.zoomed {
  transform: scale(1); /* Set default zoom to 125% */
  transform-origin: top left; /* Ensure the zoom starts from the top left */
  overflow: hidden;
}

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
