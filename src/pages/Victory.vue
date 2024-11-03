<template>
  <div class="victory-screen">
    <h1>Victory!</h1>
    <p>{{ winnerName }} has won the battle!</p>
    <button @click="goToBattleArea">Back to main Menu</button>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabase"; // Adjust path if needed

export default {
  name: "Victory",
  data() {
    return {
      winnerName: localStorage.getItem("winner") || "Unknown",
    };
  },
  methods: {
    async goToBattleArea() {
      // Retrieve the battleId from localStorage
      const battleId = localStorage.getItem("battleId");

      if (battleId) {
        // Delete the battle record with the specified battleId
        const { error } = await supabase
          .from("battles")
          .delete()
          .eq("id", battleId);

        if (error) {
          console.error("Failed to delete battle record:", error);
          return;
        }

        // Clear `battleId` from localStorage
        localStorage.removeItem("battleId");
      }

      // Reset character stats
      await this.resetCharacters();

      // Clear all other data in localStorage
      localStorage.clear();

      // Navigate to the home route
      this.$router.push({ path: "/" });
    },

    async resetCharacters() {
      // Reset stats for character with ID 1
      const { error: error1 } = await supabase
        .from("characters")
        .update({
          health: 100,
          mana: 100,
          agility: 5,
          defense: 0,
          critical_rate: 0,
        })
        .eq("id", 1);

      if (error1) {
        console.error("Failed to update character 1:", error1);
        return;
      }

      // Reset stats for character with ID 2
      const { error: error2 } = await supabase
        .from("characters")
        .update({
          health: 100,
          mana: 100,
          agility: 0,
          defense: 0,
          critical_rate: 5,
        })
        .eq("id", 2);

      if (error2) {
        console.error("Failed to update character 2:", error2);
        return;
      }
    },
  },
};
</script>

<style scoped>
/* Your existing styles */
</style>


<style scoped>
.victory-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #151515;
}

h1 {
  font-size: 2.5rem;
  color: #28a745;
}

p {
  font-size: 1.5rem;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
