// store/characterStatus.js
import { defineStore } from 'pinia';
import { supabase } from '../lib/supabase'; // Adjust the import path as necessary

export const useCharacterStatusStore = defineStore('characterStatus', {
    state: () => ({
        effects: [], // Array to hold active effects
        appliedEffects: {} // Object to track applied effects per turn
    }),
    actions: {
        // Method to add a status effect
        addEffect(effect) {
            this.effects.push(effect);
            this.appliedEffects[effect.id] = false; // Initialize as not applied for this effect
        },
        // Method to apply effects and update character stats
        async applyEffects(characterId) {
            const character = await this.fetchCharacter(characterId);
            this.effects.forEach(effect => {
                // Check if the effect has already been applied this turn
                if (!this.appliedEffects[effect.id]) {
                    if (effect.is_poison) {
                        character.health -= effect.is_poison; // Subtract poison damage
                    }
                    if (effect.is_burn) {
                        character.health -= effect.is_burn; // Subtract burn damage
                    }
                    if (effect.is_def_debuff) {
                        character.defense -= effect.is_def_debuff; // Subtract defense debuff
                    }
                    if (effect.is_agil_debuff) {
                        character.agility -= effect.is_agil_debuff; // Subtract agility debuff
                    }

                    // Mark this effect as applied for the current turn
                    this.appliedEffects[effect.id] = true;
                }

                // Decrement turn_count and log it
                effect.turn_count -= 1;
                console.log(`Current Turn Count for effect: ${effect.turn_count}`); // Log current turn count

                // Check if the turn count has finished
                if (effect.turn_count <= 0) {
                    console.log("Effect has finished, removing it."); // Log when the effect is removed
                    this.removeEffect(effect);
                }
            });

            // Update the character in the database
            await this.updateCharacter(characterId, character);
        },
        // Method to fetch character data from Supabase
        async fetchCharacter(characterId) {
            const { data, error } = await supabase
                .from('characters')
                .select('health, defense, agility')
                .eq('id', characterId)
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
                .from('characters')
                .update({
                    health: character.health,
                    defense: character.defense,
                    agility: character.agility,
                })
                .eq('id', characterId);

            if (error) {
                console.error("Error updating character:", error);
            }
        },
        // Method to remove an effect from the effects array
        removeEffect(effect) {
            this.effects = this.effects.filter(e => e !== effect);
            delete this.appliedEffects[effect.id]; // Remove effect tracking on removal
        }
    }
});
