<template>
  <div id="ygar" @click="handleUserInteraction" @touchstart="handleUserInteraction">
    <!-- Background should always be visible -->
    <Background />
    
    <!-- HomeMenu Component -->
    <HomeMenu />
    
    <!-- Loader conditionally displayed (if needed) -->
    <div v-if="isLoading" class="loading-indicator">
      Loading...
    </div>

    <!-- Logout Link in the top right corner -->
    <a href="#" style="position: fixed; top: 10px; right: 15px; z-index: 9999; font-size: 10px;" @click.prevent="logout" class="logout-link">Logout</a>
    
    <!-- Correctly defined audio for the skip button -->
    <audio ref="skipAudio">
      <source src="../assets/audio/click.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Background from "@/components/landingpage/Background.vue";
import HomeMenu from "@/components/Menu/HomeMenu.vue";
import { useAudioStore } from "@/stores/audioStore";
import { doLogout } from "@/lib/supabase"; // Import the doLogout function

const audioStore = useAudioStore();
const isLoading = ref(true);
const router = useRouter(); // For redirecting after logout

// Define the logout method that will be triggered when the link is clicked
const logout = () => {
  // Call the doLogout function when the user clicks logout
  doLogout();
};
</script>

<style scoped>
/* Styles for loading indicator */
.loading-indicator {
  position: absolute;
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust position */
  color: white; /* Text color */
  font-size: 24px; /* Font size */
  /* Optionally, you can add a spinner or other loading visuals */
}

.logout-link {
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 18px;
  text-decoration: none;
  cursor: pointer;
}

.logout-link:hover {
  color: #ff0000; /* Change color on hover */
}

.skip-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
