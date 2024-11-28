import { defineStore } from "pinia";

export const useSessionStore = defineStore("session", {
  state: () => ({
    cardsForSale: [],
    potions: [], // Add potions state here
    sessionTimestamp: localStorage.getItem("session_timestamp") || Date.now(), // Track session timestamp
    error: null, // To store error messages
  }),

  actions: {
    // Set cards fetched from the server
    setCards(cards) {
      this.cardsForSale = cards;
    },

    // Set potions fetched from the server
    setPotions(potions) {
      this.potions = potions;
    },

    // Set session timestamp
    setSessionTimestamp() {
      const currentTimestamp = Date.now();
      this.sessionTimestamp = currentTimestamp;
      localStorage.setItem("session_timestamp", currentTimestamp); // Save session start time
      console.log("Session started at:", new Date(currentTimestamp));
    },

    // Shuffle cards if more than 1 minute has passed
    checkAndShuffle() {
      const elapsedTime = Date.now() - this.sessionTimestamp;
      if (elapsedTime >= 1000) {
        return true; // Time to shuffle
      }
      return false;
    },
  },
});
