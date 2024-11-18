import { defineStore } from "pinia";
import { ref } from "vue";
import audioSource from "@/assets/audio/battle_stage.mp3";
import acid from "@/assets/audio/effects/acid.mp3";
import flame from "@/assets/audio/effects/flame.mp3";
import lightning from "@/assets/audio/effects/lightning.mp3";

export const useAudioEffectsStore = defineStore("audioEffects", () => {
  // Background audio element
  const battleAudio = new Audio(audioSource);

  // Array of effect audio elements
  const effects = [new Audio(acid), new Audio(flame), new Audio(lightning)];

  // Playing status
  const isPlaying = ref({
    battle: false,
    effect: false,
  });

  // Play the background audio
  function onPlayBattle() {
    battleAudio.currentTime = 0; // Reset playback to the start
    battleAudio.play();
    isPlaying.value.battle = true;
  }

  // Pause the background audio
  function onPauseBattle() {
    battleAudio.pause();
    isPlaying.value.battle = false;
  }

  // Play a random effect
  function playRandomEffect() {
    // Pause any currently playing effect
    stopEffect();

    // Select a random effect
    const randomIndex = Math.floor(Math.random() * effects.length);
    const randomEffect = effects[randomIndex];

    // Reset playback to the start and play the selected effect
    randomEffect.currentTime = 0;
    randomEffect.play();
    isPlaying.value.effect = true;

    // Automatically set `isPlaying.effect` to false when the audio ends
    randomEffect.onended = () => {
      isPlaying.value.effect = false;
    };
  }

  // Stop any playing effect
  function stopEffect() {
    effects.forEach((effect) => {
      effect.pause();
      effect.currentTime = 0; // Reset playback to the start
    });
    isPlaying.value.effect = false;
  }

  return {
    isPlaying,
    onPlayBattle,
    onPauseBattle,
    playRandomEffect,
    stopEffect,
  };
});
