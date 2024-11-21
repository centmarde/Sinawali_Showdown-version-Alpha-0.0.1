import { defineStore } from "pinia";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary
import { useToast } from "vue-toastification"; // Import toast

const toast = useToast(); // Initialize toast

export const usebuffStatusStore2 = defineStore("buffStatus2", {
  state: () => ({
    effects: [], // Array to hold active effects (buffs only)
    appliedEffects: {}, // Object to track applied effects per turn
    originalStats: {}, // Object to store original stats of characters
    effectValues: {}, // Track buff values per effect
    turnCounts: {}, // Track the turn count for each effect
  }),
  actions: {
    addEffect(effect) {
      this.effects.push(effect);
      this.appliedEffects[effect.id] = false;
      this.effectValues[effect.id] = {
        is_def_amp: effect.is_def_amp || 0,
        is_agil_amp: effect.is_agil_amp || 0,
        is_crit_amp: effect.is_crit_amp || 0,
      };
      this.turnCounts[effect.id] = effect.turns || 3; // Default to 3 turns if not specified
    },

    async applyEffects(characterId) {
      const character = await this.fetchCharacter(characterId);
      if (!character) return;

      if (!this.originalStats[characterId]) {
        this.originalStats[characterId] = {
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        };
      }

      character.defense = this.originalStats[characterId].defense;
      character.agility = this.originalStats[characterId].agility;
      character.critical_rate = this.originalStats[characterId].critical_rate;

      let cumulativeDefBuff = 0;
      let cumulativeAgilBuff = 0;
      let cumulativeCritBuff = 0;

      this.effects.forEach((effect) => {
        if (this.turnCounts[effect.id] > 0) {
          if (effect.is_def_amp) cumulativeDefBuff += effect.is_def_amp;
          if (effect.is_agil_amp) cumulativeAgilBuff += effect.is_agil_amp;
          if (effect.is_crit_amp) cumulativeCritBuff += effect.is_crit_amp;
        }
      });

      character.defense += cumulativeDefBuff;
      character.agility += cumulativeAgilBuff;
      character.critical_rate += cumulativeCritBuff;

      await this.updateCharacter(characterId, character);
    },

    async fetchCharacter(characterId) {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error) return null;
      return data;
    },

    async updateCharacter(characterId, character) {
      const { error } = await supabase
        .from("characters")
        .update({
          health: character.health,
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        })
        .eq("id", characterId);
    },

    decrementTurnCounts() {
      this.effects.forEach((effect) => {
        if (this.turnCounts[effect.id] > 0) {
          this.turnCounts[effect.id] -= 1;
          if (this.turnCounts[effect.id] === 0) {
            this.removeEffect({ id: effect.id });
          }
        }
      });
    },

    removeEffect(effect) {
      this.effects = this.effects.filter((e) => e.id !== effect.id);
      delete this.appliedEffects[effect.id];
      delete this.effectValues[effect.id];
      delete this.turnCounts[effect.id];
    },

    subscribeToCharacterChanges() {
      const channels = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "characters" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              this.addEffect(payload.new);
            }
            if (payload.eventType === "UPDATE") {
              this.updateBuffEffect(payload.new);
            }
            if (payload.eventType === "DELETE") {
              this.removeEffect(payload.old);
            }
          }
        )
        .subscribe();
    },

    updateBuffEffect(updatedEffect) {
      const effectIndex = this.effects.findIndex(
        (e) => e.id === updatedEffect.id
      );
      if (effectIndex !== -1) {
        this.effects[effectIndex] = updatedEffect;
      }
    },
  },

  persist: true,
});
