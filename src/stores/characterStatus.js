// store/characterStatus.js
import { defineStore } from "pinia";
import { supabase } from "../lib/supabase"; // Adjust the import path as necessary

export const useCharacterStatusStore = defineStore("characterStatus", {
  state: () => ({
    effects: [], // Array to hold active effects
    appliedEffects: {}, // Track applied effects per turn
    originalStats: {}, // Store original stats for resetting debuffs/buffs
    effectValues: {}, // Track debuff/buff values per effect
  }),
  actions: {
    // Method to add a status effect
    addEffect(effect) {
      this.effects.push(effect);
      this.appliedEffects[effect.id] = false; // Initialize as not applied
      this.effectValues[effect.id] = {
        is_def_debuff: effect.is_def_debuff || 0,
        is_agil_debuff: effect.is_agil_debuff || 0,
      };
    },

    // Method to apply effects and update character stats
    async applyEffects(characterId) {
      const character = await this.fetchCharacter(characterId);

      // Store original stats if not already stored
      if (!this.originalStats[characterId]) {
        this.originalStats[characterId] = {
          mana: character.mana,
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        };
      }

      // Reset character stats to original values
      character.mana = this.originalStats[characterId].mana;
      character.defense = this.originalStats[characterId].defense;
      character.agility = this.originalStats[characterId].agility;
      character.critical_rate = this.originalStats[characterId].critical_rate;

      // Initialize cumulative debuff/buff values
      let cumulativeDefDebuff = 0;
      let cumulativeAgilDebuff = 0;
      let cumulativeCritAmp = 0;
      let cumulativeAgilAmp = 0;
      let cumulativeDefAmp = 0;

      // Apply effects
      this.effects.forEach((effect) => {
        if (!this.appliedEffects[effect.id]) {
          // Apply debuffs and buffs
          if (effect.is_def_amp) cumulativeDefAmp += effect.is_def_amp;
          if (effect.is_agil_amp) cumulativeAgilAmp += effect.is_agil_amp;
          if (effect.is_crit_amp) cumulativeCritAmp += effect.is_crit_amp;
          if (effect.is_def_debuff) cumulativeDefDebuff += effect.is_def_debuff;
          if (effect.is_agil_debuff)
            cumulativeAgilDebuff += effect.is_agil_debuff;

          // Mark this effect as applied for the current turn
          this.appliedEffects[effect.id] = true;
        }

        // Decrement turn count and remove expired effects
        effect.turn_count -= 1;
        if (effect.turn_count <= 0) {
          console.log(
            `Effect with ID ${effect.id} has expired and will be removed.`
          );
          this.removeEffect(effect);
        }
      });

      // Apply cumulative buffs and debuffs to character stats
      character.defense += cumulativeDefAmp - cumulativeDefDebuff;
      character.agility += cumulativeAgilAmp - cumulativeAgilDebuff;
      character.critical_rate += cumulativeCritAmp;
      // Update character stats in the database
      await this.updateCharacter(characterId, character);
    },

    // Fetch character data from Supabase
    async fetchCharacter(characterId) {
      const { data, error } = await supabase
        .from("characters")
        .select("mana, defense, agility, critical_rate")
        .eq("id", characterId)
        .single();

      if (error) {
        console.error("Error fetching character:", error);
        return null;
      }

      return data;
    },

    // Update character data in Supabase
    async updateCharacter(characterId, character) {
      const { error } = await supabase
        .from("characters")
        .update({
          mana: character.mana,
          defense: character.defense,
          agility: character.agility,
          critical_rate: character.critical_rate,
        })
        .eq("id", characterId);

      if (error) {
        console.error("Error updating character:", error);
      }
    },

    // Remove an effect from the effects array
    removeEffect(effect) {
      this.effects = this.effects.filter((e) => e !== effect);
      delete this.appliedEffects[effect.id];
      delete this.effectValues[effect.id];
    },
  },
});
