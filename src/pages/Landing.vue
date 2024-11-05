<template>
  <div @click="handleUserInteraction" @touchstart="handleUserInteraction">
    <!-- Background should always be visible -->
    <Background />

    <HomeMenu />
    
    <!-- Loader conditionally displayed (if needed) -->
    <div v-if="isLoading" class="loading-indicator">
      Loading...
      <!-- Optionally, you can add an animated spinner or similar here -->
    </div>

    <!-- Correctly defined audio for the skip button -->
    <audio ref="skipAudio">
      <source src="../assets/audio/click.mp3" type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>

    <!-- Hidden audio player -->
    <audio ref="audioPlayer" hidden loop>
      <source src="../assets/audio/adal.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import Background from "@/components/landingpage/Background.vue";
import HomeMenu from "@/components/Menu/HomeMenu.vue";
import { useAudioStore } from "@/stores/audioStore";


const audioStore = useAudioStore();
const isLoading = ref(true);
const audioPlayer = ref(null);
const skipAudio = ref(null); // Reference for the skip audio
const hasPlayedAudio = ref(false);

onMounted(() => {
  audioStore.playAdal();
})


const handleUserInteraction = () => {
  // Play background audio only once upon the first interaction
  if (audioPlayer.value && !hasPlayedAudio.value) {
    audioPlayer.value
      .play()
      .then(() => {
        hasPlayedAudio.value = true; // Prevents replay on future interactions
      })
      .catch((error) => {
        console.error("Error playing audio:", error);
      });
  }
};


</script>

<style scoped>
#ygar {
  background-color: #151515;
  position: relative;
}

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

.skip-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>

