import { defineStore } from "pinia";
import { ref } from "vue";

import Kidlat1 from "@/assets/audio/Kidlat/1.wav";
import Kidlat2 from "@/assets/audio/Kidlat/2.wav";
import Kidlat3 from "@/assets/audio/Kidlat/3.wav";
import Kidlat4 from "@/assets/audio/Kidlat/4.wav";

import Alon1 from "@/assets/audio/Alon/1.wav";
import Alon2 from "@/assets/audio/Alon/2.wav";
import Alon3 from "@/assets/audio/Alon/3.wav";

export const useSpeechStore = defineStore("speechStore", () => {
  // Create arrays of audio instances
  const kidlatAudios = [
    new Audio(Kidlat1),
    new Audio(Kidlat2),
    new Audio(Kidlat3),
    new Audio(Kidlat4),
  ];
  const alonAudios = [new Audio(Alon1), new Audio(Alon2), new Audio(Alon3)];

  // Function to play a random Kidlat sound at max volume
  function playKidlat() {
    // Stop Alon audio if it's playing
    stopAlon();

    const randomIndex = Math.floor(Math.random() * kidlatAudios.length);
    const selectedAudio = kidlatAudios[randomIndex];
    selectedAudio.volume = 1.0; // Set volume to maximum
    selectedAudio.play();
  }

  // Function to play a random Alon sound at max volume
  function playAlon() {
    // Stop Kidlat audio if it's playing
    stopKidlat();

    const randomIndex = Math.floor(Math.random() * alonAudios.length);
    const selectedAudio = alonAudios[randomIndex];
    selectedAudio.volume = 1.0; // Set volume to maximum
    selectedAudio.play();
  }

  // Function to stop all Kidlat audio
  function stopKidlat() {
    kidlatAudios.forEach((audio) => audio.pause());
  }

  // Function to stop all Alon audio
  function stopAlon() {
    alonAudios.forEach((audio) => audio.pause());
  }

  return { playKidlat, playAlon, stopKidlat, stopAlon };
});
