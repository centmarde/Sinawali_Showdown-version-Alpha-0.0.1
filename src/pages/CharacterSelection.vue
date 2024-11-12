<template>
  <div>
    <CharacterDisplay />

    <!-- Background audio element -->
    <audio ref="audioPlayer" hidden loop>
      <source src="@/assets/audio/character_select.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script>
import CharacterDisplay from "@/components/CharacterDisplay.vue";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const audioPlayer = ref(null);

    onMounted(() => {
      // Play the audio when the component is mounted
      if (audioPlayer.value) {
        audioPlayer.value.volume = 0.3; // Set volume (0.0 to 1.0)
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
