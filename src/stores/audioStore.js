// stores/useAudioStore.js
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import audioSource from '@/assets/audio/battle_stage.mp3';

export const useAudioStore = defineStore('audio', () => {
    const audioPlayer = ref(null);

    onMounted(() => {
        // Initialize audio player with the imported source only once
        if (!audioPlayer.value) {
            audioPlayer.value = new Audio(audioSource);
            audioPlayer.value.loop = true;
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

    return {
        audioPlayer,
        playAudio,
        pauseAudio,
    };
});
