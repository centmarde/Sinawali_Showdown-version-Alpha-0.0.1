// stores/useAudioStore.js
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import audioSource from '@/assets/audio/battle_stage.mp3';
import punch1 from '@/assets/audio/punch1.wav';

export const useAudioStore = defineStore('audio', () => {
    const audioPlayer = ref(null);
    const punchPlayer = ref(null);

    onMounted(() => {
        // Initialize audio player for background music
        if (!audioPlayer.value) {
            audioPlayer.value = new Audio(audioSource);
            audioPlayer.value.loop = true;
            audioPlayer.value.volume = 0.5; // Set default volume for background music
        }
        
        // Initialize audio player for punch sound
        if (!punchPlayer.value) {
            punchPlayer.value = new Audio(punch1);
            punchPlayer.value.volume = 0.7; // Set default volume for punch sound
        }
    });

    const playAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.play();
        }
    };

    const pauseAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            audioPlayer.value.currentTime = 0; // Reset playback position to the start
        }
    };

    const playPunch = () => {
        if (punchPlayer.value) {
            punchPlayer.value.currentTime = 0; // Reset to the start for replaying
            punchPlayer.value.play();
        }
    };

    const pausePunch = () => {
        if (punchPlayer.value) {
            punchPlayer.value.pause();
            punchPlayer.value.currentTime = 0; // Reset playback position to the start
        }
    };

    // Set volume for background music
   

    return {
        audioPlayer,
        punchPlayer,
        playAudio,
        pauseAudio,
        playPunch,
        pausePunch,
      
    };
});
