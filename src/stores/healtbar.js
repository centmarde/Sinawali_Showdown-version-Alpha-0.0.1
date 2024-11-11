// stores/healtbar.js
import { defineStore } from "pinia";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    player1: { name: "Kidlat", health: 100, mana: 100 },
    player2: { name: "Alon", health: 100, mana: 100 },
  }),
  actions: {
    updatePlayerMana(playerId, mana) {
      if (playerId === 1) {
        this.player1.mana = mana;
      } else if (playerId === 2) {
        this.player2.mana = mana;
      }
    },
    updatePlayerHealth(playerId, health) {
      if (playerId === 1) {
        this.player1.health = health;
      } else if (playerId === 2) {
        this.player2.health = health;
      }
    },
  },
});
