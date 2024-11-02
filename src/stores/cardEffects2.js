import { defineStore } from "pinia";

export const useStore2 = defineStore("cardEffects2", {
  state: () => ({
    cardEffects: [],
  }),
  actions: {
    setCardEffects(effectsArray) {
      this.cardEffects = effectsArray;
    },
  },
});
