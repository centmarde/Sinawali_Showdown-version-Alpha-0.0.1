<template>
    <div>
      <OnlineCharacterSelect />
      
      <!-- Background audio element -->
      <audio ref="audioPlayer" hidden loop autoplay>
        <source src="@/assets/audio/character_select.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </template>
  
  <script>
  import OnlineCharacterSelect from "@/components/MultiPlayer/OnlineCharacterSelect.vue";
  import { ref, onMounted } from "vue";
  
  export default {
    setup() {
      const audioPlayer = ref(null);
  
      onMounted(() => {
        // Try playing the audio on mount
        if (audioPlayer.value) {
          const playAudio = audioPlayer.value.play();
          // Handle the promise to ensure it's played
          if (playAudio) {
            playAudio.catch(() => {
              console.error("Audio play failed, might be blocked by browser settings.");
            });
          }
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
  