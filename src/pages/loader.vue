<template>
    <div class="loader-container" v-if="!loaded">
      <div class="loading">Loading...</div>
  
      <v-img
        v-if="showLogo"
        class="logo fade"
        :class="{ 'fade-out': !showLogo }"
        src="../assets/images/charge.png"
        width="200"
        alt="Logo"
      >
    </v-img>
  
      <v-container>
        <v-row>
          <v-col>
            <div v-if="showText" class="centered-text fade" :class="{ 'fade-out': !showText }">
              <b>GAME TITLE</b> A CSU GAME DEV. PROJECT
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div
              v-if="showSecondText"
              class="centered-text2 fade"
              :class="{ 'fade-out': !showSecondText }"
            >
             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta, quibusdam. Molestias temporibus alias adipisci maiores pariatur commodi laborum laudantium nihil ab similique distinctio labore doloribus, sed facere earum cupiditate dignissimos.
            </div>
          </v-col>
        </v-row>
      </v-container>
  
      <div v-if="showLoader" class="bottom-loader fade" :class="{ 'fade-out': !showLoader }">
        <div v-if="showThirdText" class="third-text fade mb-2" :class="{ 'fade-out': !showThirdText }">
          "C: Game Development Team"<br />
          - Caraga State University
        </div>
        <v-progress-linear indeterminate color="dark"></v-progress-linear>
       
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted } from 'vue';


const showLogo = ref(false);
const showText = ref(false);
const showSecondText = ref(false);
const showLoader = ref(false);
const showThirdText = ref(false); // New variable for third text
const loaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    showLogo.value = true;
    setTimeout(() => {
      showLogo.value = false; // Logo fades out
      showText.value = true;  // Text fades in
      setTimeout(() => {
        showSecondText.value = true; // Second text fades in
        setTimeout(() => {
          showLoader.value = true; // Loader fades in
          setTimeout(() => {
            showThirdText.value = true; // Third text fades in
            setTimeout(() => {
              loaded.value = true; // All elements fade out
            }, 5000); 
          }, 0); // Delay before showing third text
        }, 1500); // Delay before loader shows
      }, 1500); // Delay before second text shows
    }, 2500); 
  }, 100); // Initial delay before starting (500ms)
});
</script>

<style scoped>
.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #FDD835;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  max-width: 200px;
}

.loading {
  position: fixed; /* Fixed position for loading text */
  bottom: 20px;    /* Distance from the bottom */
  left: 20px;      /* Distance from the left */
  color: #151515;
  font-size: 18px; /* Adjust size */
  z-index: 1000;   /* Ensure it's on top of other elements */
}

@media (max-width: 768px) {
  .loading {
    position: fixed;    /* Fixed position for loading text */
    bottom: 12%;        /* Distance from the bottom */
    left: 50%;          /* Start from the center horizontally */
    transform: translateX(-50%); /* Shift left by 50% of its width to center it */
    color: #151515;
    font-size: 18px;    /* Adjust size */
    z-index: 1000;      /* Ensure it's on top of other elements */
  }
}


.centered-text {
  font-size: 20px;
  text-align: center;
  color: #151515;
  margin-top: 20px;
}

.centered-text2 {
  font-size: 10px;
  padding: 10px;
  text-align: center;
  color: #151515;
  margin-top: 20px;
}

.bottom-loader {
  position: absolute;
  bottom: 20px;
  width: 80%;
}

.third-text {
  text-align: center;
  color: #151515;
  font-size: 12px; /* Adjust size */
  margin-top: 10px; /* Space from the loading bar */
}

.fade {
  opacity: 1;
  transition: opacity 2.5s ease-in-out;
}

.fade-out {
  opacity: 0;
  transition: opacity 2.5s ease-in-out;
}
</style>
