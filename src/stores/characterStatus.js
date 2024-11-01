// store/characterStatus.js
import { defineStore } from "pinia";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary

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
      // Fetch character data
      const character = await this.fetchCharacter(characterId);

      // Store original stats if not already stored
      if (!this.originalStats[characterId]) {
        this.originalStats[characterId] = {
          defense: character.defense,
          agility: character.agility,
        };
      }

      // Reset character stats to original values
      character.defense = this.originalStats[characterId].defense;
      character.agility = this.originalStats[characterId].agility;

      // Calculate cumulative debuff for this turn
      let cumulativeDefDebuff = 0;
      let cumulativeAgilDebuff = 0;

      // Loop through each effect to apply debuffs and decrement turn count
      this.effects.forEach((effect) => {
        if (!this.appliedEffects[effect.id]) {
          if (effect.is_poison) {
            character.health -= effect.is_poison; // Subtract poison damage
          }
          if (effect.is_burn) {
            character.health -= effect.is_burn; // Subtract burn damage
          }

          // Accumulate debuff values only for active effects
          if (effect.is_def_debuff) {
            cumulativeDefDebuff += effect.is_def_debuff;
          }
          if (effect.is_agil_debuff) {
            cumulativeAgilDebuff += effect.is_agil_debuff;
          }

          // Mark this effect as applied for the current turn
          this.appliedEffects[effect.id] = true;
        }

        // Decrement turn count for each effect and remove expired ones
        effect.turn_count -= 1;
        if (effect.turn_count <= 0) {
          console.log(
            `Effect with ID ${effect.id} has finished and will be removed.`
          );
          this.removeEffect(effect); // Remove expired effects
        }
      });

      // Apply the cumulative debuffs to character stats
      character.defense -= cumulativeDefDebuff;
      character.agility -= cumulativeAgilDebuff;

      console.log("Final applied debuffs for this turn:", {
        defenseDebuff: cumulativeDefDebuff,
        agilityDebuff: cumulativeAgilDebuff,
      });

      // Update character stats in the database
      await this.updateCharacter(characterId, character);
    },

    // Method to fetch character data from Supabase
    async fetchCharacter(characterId) {
      const { data, error } = await supabase
        .from("characters")
        .select("health, defense, agility")
        .eq("id", characterId)
        .single();

      if (error) {
        console.error("Error fetching character:", error);
        return null; // Return null or handle the error as needed
      }

      return data; // Return character data
    },

    // Method to update character data in Supabase
    async updateCharacter(characterId, character) {
      const { error } = await supabase
        .from("characters")
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

    // Method to remove an effect from the effects array
    removeEffect(effect) {
      this.effects = this.effects.filter((e) => e !== effect);
      delete this.appliedEffects[effect.id];
      delete this.effectValues[effect.id]; // Remove effect tracking on removal
    },
  },
});
