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
    const punchSounds = [punch1, punch2, punch3];

    onMounted(() => {
        // Initialize audio player for background music
        if (!audioPlayer.value) {
            audioPlayer.value = new Audio(audioSource);
            audioPlayer.value.loop = true;
            audioPlayer.value.volume = 0.5;
        }

        // Initialize adal player
        adalPlayer.value = new Audio(adal);
        adalPlayer.value.volume = 0.7; // Set volume for adal audio
    });

    const playAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.play().catch(error => {
                console.error("Error playing background audio:", error);
            });
        }
    };

    const pauseAudio = () => {
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            audioPlayer.value.currentTime = 0;
        }
    };

    const playAdal = () => {
        if (adalPlayer.value) {
            adalPlayer.value.play().catch(error => {
                console.error("Error playing adal audio:", error);
            });
        }
    };

    const playPunch = () => {
        const randomPunch = punchSounds[Math.floor(Math.random() * punchSounds.length)];
        punchPlayer.value = new Audio(randomPunch);
        punchPlayer.value.volume = 0.7;
        punchPlayer.value.play().catch(error => {
            console.error("Error playing punch sound:", error);
        });
    };

    const pausePunch = () => {
        if (punchPlayer.value) {
            punchPlayer.value.pause();
            punchPlayer.value.currentTime = 0;
        }
    };

    return {
        audioPlayer,
        punchPlayer,
        playAudio,
        pauseAudio,
        playPunch,
        pausePunch,
        playAdal
    };
});
