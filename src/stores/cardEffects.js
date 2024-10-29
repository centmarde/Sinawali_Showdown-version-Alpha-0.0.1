import { defineStore } from 'pinia';

export const useStore = defineStore('cardEffects', {
    state: () => ({
        cardEffects: [],
    }),
    actions: {
        setCardEffects(effectsArray) {
            this.cardEffects = effectsArray;
        },
    },
});
