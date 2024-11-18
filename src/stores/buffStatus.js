import { defineStore } from "pinia";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary
import { useToast } from "vue-toastification"; // Import toast

const toast = useToast(); // Initialize toast

export const usebuffStatusStore = defineStore("buffStatus", {
  state: () => ({
    effects: [], // Array to hold active effects (buffs only)
    appliedEffects: {}, // Object to track applied effects per turn
    originalStats: {}, // Object to store original stats of characters
    effectValues: {}, // Track buff values per effect
    turnCounts: {}, // Track the turn count for each effect
  }),
  actions: {
    // Method to add a buff effect
    addEffect(effect) {
      console.log("Adding buff effect:", effect);
      this.effects.push(effect);
      this.appliedEffects[effect.id] = false; // Initialize as not applied for this effect
      this.effectValues[effect.id] = {
        is_def_amp: effect.is_def_amp || 0,
        is_agil_amp: effect.is_agil_amp || 0,
        is_crit_amp: effect.is_crit_amp || 0,
      };
      // Add turn count tracking (for example, buff lasts 3 turns)
      this.turnCounts[effect.id] = effect.turns || 3; // Default to 3 turns if not specified
      console.log("Current buff effects:", this.effects);
      console.log("Applied Effects:", this.appliedEffects);
      console.log("Effect Values:", this.effectValues);
    },

    // Method to apply buff effects and update character stats
    async applyEffects(characterId) {
      console.log("Applying buff effects for characterId:", characterId);

      const character = await this.fetchCharacter(characterId);
      if (!character) {
        console.error("Character not found!");
        return;
      }

      console.log("Fetched character:", character);

      // Check if original stats have been stored
      if (!this.originalStats[characterId]) {
        console.log("Storing original stats for characterId:", characterId);
        this.originalStats[characterId] = {
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        };
      }

      // Restore original stats
      console.log("Restoring original stats for characterId:", characterId);
      character.defense = this.originalStats[characterId].defense;
      character.agility = this.originalStats[characterId].agility;
      character.critical_rate = this.originalStats[characterId].critical_rate;

      // Apply buff effects if still active (i.e., within the turn count)
      let cumulativeDefBuff = 0;
      let cumulativeAgilBuff = 0;
      let cumulativeCritBuff = 0;

      // Loop through the effects and apply the buffs
      this.effects.forEach((effect) => {
        if (this.turnCounts[effect.id] > 0) {
          // Check if buff is still active
          console.log("Applying buff effect:", effect);
          if (effect.is_def_amp) cumulativeDefBuff += effect.is_def_amp;
          if (effect.is_agil_amp) cumulativeAgilBuff += effect.is_agil_amp;
          if (effect.is_crit_amp) cumulativeCritBuff += effect.is_crit_amp;
        }
      });

      console.log("Cumulative Buffs:", {
        cumulativeDefBuff,
        cumulativeAgilBuff,
        cumulativeCritBuff,
      });

      // Apply accumulated buffs to character stats
      character.defense += cumulativeDefBuff;
      character.agility += cumulativeAgilBuff;
      character.critical_rate += cumulativeCritBuff;

      // Log the updated character stats
      console.log("Updated character stats after applying buffs:", character);

      // Update character in the database
      await this.updateCharacter(characterId, character);
    },

    // Fetch character data from the database
    async fetchCharacter(characterId) {
      console.log(
        "Fetching character from database for characterId:",
        characterId
      );
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", characterId)
        .single();

      if (error) {
        console.error("Error fetching character:", error);
        return null;
      }
      console.log("Character fetched successfully:", data);
      return data;
    },

    // Update character stats in the database
    async updateCharacter(characterId, character) {
      console.log(
        "Updating character in database for characterId:",
        characterId
      );
      const { error } = await supabase
        .from("characters")
        .update({
          health: character.health,
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        })
        .eq("id", characterId);

      if (error) {
        console.error("Error updating character:", error);
      } else {
        console.log("Character updated successfully.");
      }
    },

    // Method to remove a buff effect
    decrementTurnCounts() {
      console.log("Decrementing turn counts for all buffs");

      this.effects.forEach((effect) => {
        if (this.turnCounts[effect.id] > 0) {
          this.turnCounts[effect.id] -= 1; // Decrease turn count by 1

          // Check if the effect has expired
          if (this.turnCounts[effect.id] === 0) {
            console.log(`Buff for effect ${effect.id} has expired`);
            // Reset stats if buff expires
            this.removeEffect({ id: effect.id });
          }
        }
      });
    },

    removeEffect(effect) {
      console.log("Removing buff effect:", effect);
      this.effects = this.effects.filter((e) => e.id !== effect.id);
      delete this.appliedEffects[effect.id];
      delete this.effectValues[effect.id];
      delete this.turnCounts[effect.id]; // Remove turn count
      console.log("Current buff effects after removal:", this.effects);
    },
  },
});
