// stores/useAudioStore.js
import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';
import audioSource from '@/assets/audio/battle_stage.mp3';
import punch1 from '@/assets/audio/punch1.wav';
import punch2 from '@/assets/audio/punch2.wav';
import punch3 from '@/assets/audio/punch3.wav';
import adal from '@/assets/audio/adal.mp3';

export const useAudioStore = defineStore('audio', () => {
    const audioPlayer = ref(null);
    const punchPlayer = ref(null);
    const adalPlayer = ref(null);
    const punchSounds = [punch1, punch2, punch3]; // Array of punch sounds

    onMounted(() => {
        // Initialize audio player for background music
        if (!audioPlayer.value) {
            audioPlayer.value = new Audio(audioSource);
            audioPlayer.value.loop = true;
            audioPlayer.value.volume = 0.5; // Set default volume for background music
        }

        // Initialize adal player for looping sound
        if (!adalPlayer.value) {
            adalPlayer.value = new Audio(adal);
            adalPlayer.value.loop = true; // Enable looping
            adalPlayer.value.volume = 0.5; // Set desired volume for adal sound
            adalPlayer.value.play().catch(error => {
                console.error("Error playing adal audio:", error);
            });
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

   const playAdal = () => {
    if (adalPlayer.value) {
        adalPlayer.value.play();
    }
   };

    const playPunch = () => {
        // Randomly select one of the punch sounds
        const randomPunch = punchSounds[Math.floor(Math.random() * punchSounds.length)];
        
        // Initialize a new audio player with the selected sound
        punchPlayer.value = new Audio(randomPunch);
        punchPlayer.value.volume = 0.7; // Set desired volume for punch sound
        punchPlayer.value.play();
    };

    const pausePunch = () => {
        if (punchPlayer.value) {
            punchPlayer.value.pause();
            punchPlayer.value.currentTime = 0; // Reset playback position to the start
        }
    };

    return {
        audioPlayer,
        punchPlayer,
        adalPlayer,
        playAudio,
        pauseAudio,
        playPunch,
        pausePunch,
        playAdal
    };
});
