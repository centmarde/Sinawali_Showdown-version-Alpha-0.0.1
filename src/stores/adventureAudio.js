import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import ad_bg from "@/assets/audio/adventure/ad_bg.mp3";
import battle from "@/assets/audio/adventure/battle.mp3";
import defeat from "@/assets/audio/adventure/defeat.mp3";
import notif from "@/assets/audio/adventure/notif.mp3";
import victory from "@/assets/audio/adventure/victory.mp3";
import village from "@/assets/audio/adventure/village.mp3";
import click from "@/assets/audio/click.mp3";

export const useAudioAdventure = defineStore("audioAdventure", () => {
  // Initialize refs for each audio player
  const adBgPlayer = ref(null);
  const battlePlayer = ref(null);
  const defeatPlayer = ref(null);
  const notifPlayer = ref(null);
  const victoryPlayer = ref(null);
  const villagePlayer = ref(null);
  const clickPlayer = ref(null);

  // Initialize onMounted to load each audio file
  onMounted(() => {
    adBgPlayer.value = new Audio(ad_bg);
    adBgPlayer.value.loop = true; // Loop background music
    adBgPlayer.value.volume = 0.5;

    battlePlayer.value = new Audio(battle);
    battlePlayer.value.volume = 0.5;

    defeatPlayer.value = new Audio(defeat);
    defeatPlayer.value.volume = 0.5;

    notifPlayer.value = new Audio(notif);
    notifPlayer.value.volume = 0.5;

    victoryPlayer.value = new Audio(victory);
    victoryPlayer.value.volume = 0.5;

    villagePlayer.value = new Audio(village);
    villagePlayer.value.volume = 0.5;

    clickPlayer.value = new Audio(click);
    clickPlayer.value.volume = 0.5;
  });

  // Play and pause methods for each track
  const playAdBg = () => {
    if (adBgPlayer.value) {
      adBgPlayer.value.loop = true;
      adBgPlayer.value.play().catch(() => {}); // Play ad_bg track
    }
  };

  const pauseAdBg = () => {
    if (adBgPlayer.value) {
      adBgPlayer.value.pause();
    }
  };

  const playBattle = () => {
    if (battlePlayer.value) {
      battlePlayer.value.volume = 1.0; // Set to maximum volume
      battlePlayer.value.play().catch(() => {}); // Play battle track
    }
  };

  const pauseBattle = () => {
    if (battlePlayer.value) {
      battlePlayer.value.pause();
      battlePlayer.value.currentTime = 0; // Reset to start
    }
  };

  const playDefeat = () => {
    if (defeatPlayer.value) {
      defeatPlayer.value.volume = 1.0; // Set to maximum volume
      defeatPlayer.value.play().catch(() => {}); // Play defeat track
    }
  };

  const pauseDefeat = () => {
    if (defeatPlayer.value) {
      defeatPlayer.value.pause();
      defeatPlayer.value.currentTime = 0; // Reset to start
    }
  };

  const playNotif = () => {
    if (notifPlayer.value) {
      notifPlayer.value.volume = 1.0; // Set to maximum volume
      notifPlayer.value.play().catch(() => {}); // Play notif track
    }
  };

  const pauseNotif = () => {
    if (notifPlayer.value) {
      notifPlayer.value.pause();
      notifPlayer.value.currentTime = 0; // Reset to start
    }
  };

  const playVictory = () => {
    if (victoryPlayer.value) {
      victoryPlayer.value.volume = 1.0; // Set to maximum volume
      victoryPlayer.value.play().catch(() => {}); // Play victory track
    }
  };

  const pauseVictory = () => {
    if (victoryPlayer.value) {
      victoryPlayer.value.pause();
      victoryPlayer.value.currentTime = 0; // Reset to start
    }
  };

  const playVillage = () => {
    if (villagePlayer.value) {
      villagePlayer.value.loop = true;
      villagePlayer.value.play().catch(() => {}); // Play village track
    }
  };

  const pauseVillage = () => {
    if (villagePlayer.value) {
      villagePlayer.value.pause();
      villagePlayer.value.currentTime = 0; // Reset to start
    }
  };

  const playClick = () => {
    if (clickPlayer.value) {
      clickPlayer.value.play().catch(() => {}); // Play click track
    }
  };

  const pauseClick = () => {
    if (clickPlayer.value) {
      clickPlayer.value.pause();
      clickPlayer.value.currentTime = 0; // Reset to start
    }
  };

  // Return methods to control each track
  return {
    playAdBg,
    pauseAdBg,
    playBattle,
    pauseBattle,
    playDefeat,
    pauseDefeat,
    playNotif,
    pauseNotif,
    playVictory,
    pauseVictory,
    playVillage,
    pauseVillage,
    playClick,
    pauseClick,
  };
});
