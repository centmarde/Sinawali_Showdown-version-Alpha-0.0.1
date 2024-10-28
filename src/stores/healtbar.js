// stores/players.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePlayerStore = defineStore("playerStore", () => {
  const player1 = ref({ name: "", health: 100 });
  const player2 = ref({ name: "", health: 100 });

  return { player1, player2 };
});
