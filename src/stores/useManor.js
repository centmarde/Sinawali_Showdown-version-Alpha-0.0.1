import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

export const useManor = defineStore("Manor", () => {
  const toast = useToast();
  const energyPotionValue = ref(null);

  const potionChance = 0.09; // 20% chance for a potion
  const goldChance = 0.5; // 30% chance for gold
  const noRewardChance = 1 - (potionChance + goldChance); // Remaining chance for no reward

  const generateReward = async () => {
    console.log("Generate reward reached");

    const randomRewardChance = Math.random(); // Random number between 0 and 1
    console.log("Random reward chance:", randomRewardChance);

    if (randomRewardChance <= potionChance) {
      const randomPotionValue = Math.floor(Math.random() * 40) + 1; // Value between 1 and 40
      energyPotionValue.value = randomPotionValue;

      toast.success(
        `You receive a ${energyPotionValue.value} Energy Potion from an unknown stranger.`
      );

      await updateCharacterHealth(energyPotionValue.value);
    } else if (randomRewardChance <= potionChance + goldChance) {
      const randomGoldAmount = Math.floor(Math.random() * 10) + 1; // Value between 1 and 10

      toast.success(`You receive ${randomGoldAmount} gold!`);

      await updateCharacterGold(randomGoldAmount);
    } else {
      console.log("No reward this time.");
    }
  };

  const updateCharacterHealth = async (potionValue) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    const { data: currentData, error: fetchError } = await supabase
      .from("characters")
      .select("health")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching current health:", fetchError);
      return;
    }

    const updatedHealth = currentData.health + potionValue;

    const { data, error } = await supabase
      .from("characters")
      .update({
        health: updatedHealth,
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating health:", error);
    } else {
      console.log("Health updated successfully:", data);
    }
  };

  const updateCharacterGold = async (goldAmount) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      console.error("User ID not found in localStorage.");
      return;
    }

    const { data: currentData, error: fetchError } = await supabase
      .from("characters")
      .select("gold")
      .eq("user_id", userId)
      .single();

    if (fetchError) {
      console.error("Error fetching current gold:", fetchError);
      return;
    }

    const updatedGold = currentData.gold + goldAmount;

    const { data, error } = await supabase
      .from("characters")
      .update({
        gold: updatedGold,
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating gold:", error);
    } else {
      console.log("Gold updated successfully:", data);
    }
  };

  return {
    energyPotionValue,
    generateReward,
  };
});
