<template>
    <audio ref="audioElement" @canplay="onCanPlay">
      <source :src="audioSrc" :type="audioType" />
      Your browser does not support the audio element.
    </audio>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    audioSrc: {
      type: String,
      required: true,
    },
    audioType: {
      type: String,
      default: 'audio/mp3',
    },
  });
  
  const audioElement = ref(null);
  
  const onCanPlay = () => {
    // Optional: Any logic you want to execute when the audio is ready to play
   /*  console.log("Audio is ready to play"); */
  };
  
  // Optionally, you can provide a method to play the audio externally
  const playAudio = () => {
    if (audioElement.value) {
      audioElement.value.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };
  
  // Watch for changes to the audioSrc if you want to play different audios dynamically
  watch(() => props.audioSrc, (newSrc) => {
    if (audioElement.value) {
      audioElement.value.load(); // Reload the audio element with the new source
    }
  });
  
  // Expose the playAudio method for external calls
  defineExpose({ playAudio });
  </script>
  
  <style scoped>
  /* Add any styles if needed */
  </style>
  