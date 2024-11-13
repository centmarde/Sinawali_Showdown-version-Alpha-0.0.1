// stores/useAudioStore.js
import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import audioSource from "@/assets/audio/battle_stage.mp3";
import punch1 from "@/assets/audio/punch1.wav";
import punch2 from "@/assets/audio/punch2.wav";
import punch3 from "@/assets/audio/punch3.wav";
import adal from "@/assets/audio/adal.mp3";

export const useAudioStore = defineStore("audio", () => {
  const audioPlayer = ref(null);
  const punchPlayer = ref(null);
  const adalPlayer = ref(null);
  const punchSounds = [punch1, punch2, punch3]; // Array of punch sounds

  onMounted(() => {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio(audioSource);
      audioPlayer.value.loop = true;
      audioPlayer.value.volume = 0.5;
    }

    if (!adalPlayer.value) {
      adalPlayer.value = new Audio(adal);
      adalPlayer.value.loop = true;
      adalPlayer.value.volume = 0.5;
      adalPlayer.value.play().catch((error) => {});
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
      audioPlayer.value.currentTime = 0;
    }
  };

  const playAdal = () => {
    if (adalPlayer.value) {
      adalPlayer.value.play();
    }
  };

  const playPunch = () => {
    const randomPunch =
      punchSounds[Math.floor(Math.random() * punchSounds.length)];
    punchPlayer.value = new Audio(randomPunch);
    punchPlayer.value.volume = 0.7;
    punchPlayer.value.play();
  };

  const pausePunch = () => {
    if (punchPlayer.value) {
      punchPlayer.value.pause();
      punchPlayer.value.currentTime = 0;
    }
  };

  const allPause = () => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
    }
    if (adalPlayer.value) {
      adalPlayer.value.pause();
      adalPlayer.value.currentTime = 0;
    }
    if (punchPlayer.value) {
      punchPlayer.value.pause();
      punchPlayer.value.currentTime = 0;
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
    playAdal,
    allPause,
  };
});
