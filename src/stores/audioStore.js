import { defineStore } from "pinia";
import { ref } from "vue";
import audioSource from "@/assets/audio/battle_stage.mp3";
import punch1 from "@/assets/audio/punch1.wav";
import punch2 from "@/assets/audio/punch2.wav";
import punch3 from "@/assets/audio/punch3.wav";
import adal from "@/assets/audio/adal.mp3";
import cardSound from "@/assets/audio/card_sound.mp3";

export const useAudioStore = defineStore("audio", () => {
  const audioPlayer = ref(null);
  const punchPlayer = ref(null);
  const adalPlayer = ref(null);
  const cardPlayer = ref(null);
  const punchSounds = [punch1, punch2, punch3]; // Array of punch sounds

  const initializeAudioPlayer = () => {
    if (!audioPlayer.value) {
      audioPlayer.value = new Audio(audioSource);
      audioPlayer.value.loop = true;
      audioPlayer.value.volume = 0.5;
    }
  };

  const initializeAdalPlayer = () => {
    if (!adalPlayer.value) {
      adalPlayer.value = new Audio(adal);
      adalPlayer.value.loop = true;
      adalPlayer.value.volume = 0.5;
    }
  };

  const initializeCardPlayer = () => {
    if (!cardPlayer.value) {
      cardPlayer.value = new Audio(cardSound);
      cardPlayer.value.volume = 1.0; // Set maximum volume
    }
  };

  const playAudio = () => {
    initializeAudioPlayer();
    audioPlayer.value?.play().catch(() => {}); // Suppress error
  };

  const pauseAudio = () => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value.currentTime = 0;
    }
  };

  const playAdal = () => {
    initializeAdalPlayer();
    adalPlayer.value?.play().catch(() => {}); // Suppress error
  };

  const playPunch = () => {
    const randomPunch =
      punchSounds[Math.floor(Math.random() * punchSounds.length)];
    punchPlayer.value = new Audio(randomPunch);
    punchPlayer.value.volume = 0.7;
    punchPlayer.value.play().catch(() => {}); // Suppress error
  };

  const pausePunch = () => {
    if (punchPlayer.value) {
      punchPlayer.value.pause();
      punchPlayer.value.currentTime = 0;
    }
  };

  const playCardSound = () => {
    initializeCardPlayer();
    cardPlayer.value.pause(); // Stop any ongoing playback
    cardPlayer.value.currentTime = 0; // Reset to the start
    cardPlayer.value.volume = 1.0; // Ensure maximum volume
    cardPlayer.value.play().catch(() => {}); // Suppress error
  };

  const pauseCardSound = () => {
    if (cardPlayer.value) {
      cardPlayer.value.pause();
      cardPlayer.value.currentTime = 0;
    }
  };

  const allPause = () => {
    pauseAudio();
    if (adalPlayer.value) {
      adalPlayer.value.pause();
      adalPlayer.value.currentTime = 0;
    }
    if (punchPlayer.value) {
      punchPlayer.value.pause();
      punchPlayer.value.currentTime = 0;
    }
    pauseCardSound();
  };

  return {
    audioPlayer,
    punchPlayer,
    adalPlayer,
    cardPlayer,
    playAudio,
    pauseAudio,
    playPunch,
    pausePunch,
    playAdal,
    playCardSound,
    pauseCardSound,
    allPause,
  };
});
