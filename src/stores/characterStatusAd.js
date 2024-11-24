// store/characterStatus.js
import { defineStore } from "pinia";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary
import { useToast } from "vue-toastification"; // Import toast

const toast = useToast(); // Initialize toast

export const useCharacterStatusStore = defineStore("characterStatus", {
  state: () => ({
    effects: [], // Array to hold active effects
    appliedEffects: {}, // Object to track applied effects per turn
    originalStats: {}, // Object to store original stats of characters
    accumulatedEffects: {
      is_def_debuff: 0,
      is_agil_debuff: 0,
    }, // Object to hold accumulated debuff values
    effectValues: {}, // Track debuff values per effect
  }),
  actions: {
    // Method to add a status effect
    addEffect(effect) {
      this.effects.push(effect);
      this.appliedEffects[effect.id] = false; // Initialize as not applied for this effect
      this.effectValues[effect.id] = {
        is_def_debuff: effect.is_def_debuff || 0,
        is_agil_debuff: effect.is_agil_debuff || 0,
      };
    },

    // Method to apply effects and update character stats
    async applyEffects(characterId) {
      const character = await this.fetchCharacter(characterId);

      if (!this.originalStats[characterId]) {
        this.originalStats[characterId] = {
          defense: character.defense,
          agility: character.agility,
        };
      }

      character.defense = this.originalStats[characterId].defense;
      character.agility = this.originalStats[characterId].agility;

      let cumulativeDefDebuff = 0;
      let cumulativeAgilDebuff = 0;

      this.effects.forEach((effect) => {
        if (!this.appliedEffects[effect.id]) {
          if (effect.is_poison) {
            character.health -= effect.is_poison;
            toast.info(
              `Poison: -${effect.is_poison} HP (Turns left: ${effect.turn_count})`,
              {
                position: "top-right",
                timeout: 5000,
              }
            );
          }
          if (effect.is_burn) {
            character.health -= effect.is_burn;
            toast.info(
              `Burn: -${effect.is_burn} HP (Turns left: ${effect.turn_count})`,
              {
                position: "top-right",
                timeout: 5000,
              }
            );
          }

          if (effect.is_def_debuff) {
            cumulativeDefDebuff += effect.is_def_debuff;
          }
          if (effect.is_agil_debuff) {
            cumulativeAgilDebuff += effect.is_agil_debuff;
          }

          this.appliedEffects[effect.id] = true;
        }

        effect.turn_count -= 1;
        if (effect.turn_count <= 0) {
          this.removeEffect(effect);
        }
      });

      character.defense -= cumulativeDefDebuff;
      character.agility -= cumulativeAgilDebuff;

      await this.updateCharacter(characterId, character);
    },

    async fetchCharacter(characterId) {
      const { data, error } = await supabase
        .from("enemies")
        .select("health, defense, agility")
        .eq("id", characterId)
        .single();

      if (error) {
        console.error("Error fetching character:", error);
        return null;
      }
      return data;
    },

    async updateCharacter(characterId, character) {
      const { error } = await supabase
        .from("enemies")
        .update({
          health: character.health,
          defense: character.defense,
          agility: character.agility,
        })
        .eq("id", characterId);

      if (error) {
        console.error("Error updating character:", error);
      }
    },

    removeEffect(effect) {
      this.effects = this.effects.filter((e) => e !== effect);
      delete this.appliedEffects[effect.id];
      delete this.effectValues[effect.id];
    },
  },
});
