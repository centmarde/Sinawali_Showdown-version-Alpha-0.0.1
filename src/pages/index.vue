<template>
      <div @click="handleUserInteraction" @touchstart="handleUserInteraction">
        <!-- Background should always be visible -->
        <Background />
    
        <!-- Loader overlay with conditional display -->
        <div v-if="isLoading" class="loader-overlay" :class="{ 'fade-out': !isLoading }">
          <IntroLoader />
          <PrimBtn class="skip-btn" @click="skipLoader"></PrimBtn>
        </div>
    
        <!-- Hidden audio player -->
        <audio ref="audioPlayer" hidden loop>
          <source src="../assets/audio/adal.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    import Background from '@/components/landingpage/Background.vue';
    import IntroLoader from '@/pages/loader.vue';
    import PrimBtn from '@/components/button/PrimBtn.vue';
    
    const isLoading = ref(true);
    const audioPlayer = ref(null);
    const hasPlayedAudio = ref(false);
    
    const skipLoader = () => {
      isLoading.value = false; // Hide loader immediately when skipping
    };
    
    const handleUserInteraction = () => {
      // Play audio only once upon the first interaction
      if (audioPlayer.value && !hasPlayedAudio.value) {
        audioPlayer.value.play().then(() => {
          hasPlayedAudio.value = true; // Prevents replay on future interactions
        }).catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    };
    
    onMounted(() => {
      // Keep IntroLoader visible for 10 seconds before hiding
      setTimeout(() => {
        isLoading.value = false; // Hide loader after 10 seconds
      }, 10000); // 10 seconds loader duration
    });
    </script>
    
    <style scoped>
    #ygar {
      background-color: #151515;
      position: relative;
    }
    
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(21, 21, 21, 0.9); /* Dark semi-transparent overlay */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000; /* Ensure it's on top of all content */
      transition: opacity 0.5s ease-in-out;
    }
    
    .loader-overlay.fade-out {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.5s ease-in-out, visibility 0s 0.5s; /* Visibility hidden after fade-out */
    }
    
    .skip-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;

    }
    </style>
    