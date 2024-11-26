import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { ref } from "vue";
import { supabase } from "@/lib/supabase"; // Adjust this import to your project's structure

export const useEnergyPotionStore = defineStore("energyPotion", () => {
  const toast = useToast();
  const energyPotionValue = ref(null);

  // Function to randomly generate an energy potion value between 1 and 40
  const generateEnergyPotion = async () => {
    const randomChance = Math.random(); // Get a random number between 0 and 1
    if (randomChance <= 0.4) {
      // 30% chance to generate potion
      const randomValue = Math.floor(Math.random() * 40) + 1; // Value between 1 and 40
      energyPotionValue.value = randomValue;

      // Trigger toast with the generated energy potion value
      toast.success(
        `You receive a ${energyPotionValue.value} Energy Potion from an unknown stranger.`
      );

      // Fetch the current health value and update it
      await updateCharacterHealth(energyPotionValue.value);

      // Now, let's add a random gold chance
      const randomGoldChance = Math.random(); // 30% chance for gold
      if (randomGoldChance <= 0.2) {
        const randomGoldAmount = Math.floor(Math.random() * 10) + 1; // Random gold between 1 and 10
        toast.success(`You also receive ${randomGoldAmount} gold!`);
        await updateCharacterGold(randomGoldAmount);
      }
    } else {
      energyPotionValue.value = null;
    }
  };

  // Function to update character's health in the database
  const updateCharacterHealth = async (potionValue) => {
    const userId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    // Fetch current health value from the characters table
    const { data: currentData, error: fetchError } = await supabase
      .from("characters")
      .select("health")
      .eq("user_id", userId)
      .single(); // Fetch a single record

    if (fetchError) {
      console.error("Error fetching current health:", fetchError);
      return;
    }

    // Add the potion value to the current health
    const updatedHealth = currentData.health + potionValue;

    // Update the character's health in the database
    const { data, error } = await supabase
      .from("characters")
      .update({
        health: updatedHealth, // Set the updated health value
      })
      .eq("user_id", userId); // Filter by user_id

    if (error) {
      console.error("Error updating health:", error);
    } else {
      console.log("Health updated successfully:", data);
    }
  };

  // Function to update character's gold in the database
  const updateCharacterGold = async (goldAmount) => {
    const userId = localStorage.getItem("user_id"); // Retrieve user_id from localStorage
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    // Fetch current gold value from the characters table
    const { data: currentData, error: fetchError } = await supabase
      .from("characters")
      .select("gold")
      .eq("user_id", userId)
      .single(); // Fetch a single record

    if (fetchError) {
      console.error("Error fetching current gold:", fetchError);
      return;
    }

    // Add the gold amount to the current gold
    const updatedGold = currentData.gold + goldAmount;

    // Update the character's gold in the database
    const { data, error } = await supabase
      .from("characters")
      .update({
        gold: updatedGold, // Set the updated gold value
      })
      .eq("user_id", userId); // Filter by user_id

    if (error) {
      console.error("Error updating gold:", error);
    } else {
      console.log("Gold updated successfully:", data);
    }
  };

  return {
    energyPotionValue,
    generateEnergyPotion,
  };
});
