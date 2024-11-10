<template>
    <div>
     <CharacterDisplayAi/>
  
      <!-- Background audio element -->
      <audio ref="audioPlayer" hidden loop>
        <source src="@/assets/audio/character_select.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </template>
  
  <script>
  
  import CharacterDisplayAi from "@/components/CharacterDisplayAi.vue";
import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const audioPlayer = ref(null);
  
      onMounted(() => {
        // Play the audio when the component is mounted
        if (audioPlayer.value) {
          audioPlayer.value.play();
        }
      });
  
      return {
        audioPlayer,
      };
    },
  };
  </script>
  
  <style lang="scss" scoped>
  /* Add any additional styling here */
  </style>
  