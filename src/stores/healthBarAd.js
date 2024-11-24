// stores/healthbar.js
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => {
    // Fetching dynamic values from localStorage
    const characterId = localStorage.getItem("character_id");
    const enemyId = localStorage.getItem("enemy_id");

    return {
      player1: { health: 100, mana: 100, id: characterId }, // Set player1 ID from localStorage
      player2: { health: 100, mana: 100, id: enemyId }, // Set player2 ID from localStorage
    };
  },
  actions: {
    updatePlayerMana(playerId, mana) {
      if (playerId === this.player1.id) {
        this.player1.mana = mana;
      } else if (playerId === this.player2.id) {
        this.player2.mana = mana;
      }
    },
    updatePlayerHealth(playerId, health) {
      if (playerId === this.player1.id) {
        this.player1.health = health;
      } else if (playerId === this.player2.id) {
        this.player2.health = health;
      }
    },
  },
});
