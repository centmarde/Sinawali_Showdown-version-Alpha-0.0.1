<template>
  <v-container>
    <v-dialog v-model="dialogVisible" persistent max-width="600px">
      <template v-slot:default>
        <!-- Dialog Content -->
        <v-card>
          <v-card-title>Scenario</v-card-title>
          <v-card-text>
            <!-- Loading Indicator -->
            <div v-if="ResultStatus.loading">Loading...</div>
  
            <!-- Error Display -->
            <div v-if="ResultStatus.error" class="error">{{ ResultStatus.error }}</div>
  
            <!-- Scenario Content -->
            <div class="scenario-content" v-if="ResultStatus.scenario">
              <p v-html="ResultStatus.scenario"></p>
            </div>
          </v-card-text>
  
          <!-- Dialog Actions -->
          <v-card-actions>
            <v-btn color="primary" @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-container>
    
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useResultStatus } from "@/stores/useBusted";
  import { supabase } from "@/lib/supabase";
  import { useAudioAdventure } from "@/stores/adventureAudio";
  
  const ResultStatus = useResultStatus();
  const dialogVisible = ref(true); // Dialog initially visible
  const router = useRouter();
  const characterId = localStorage.getItem("character_id");
  const audioStore = useAudioAdventure();
  // Ensure Groq is initialized
  if (!ResultStatus.groq) {
    ResultStatus.initializeGroq(
      "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"
    );
  }
  
  onMounted(async () => {
    audioStore.playDefeat();
    try {
      // Fetch the latest scenarios row from the Supabase database
      const { data, error } = await supabase
        .from("scenarios")
        .select("scene")
        .order("id", { ascending: false }) // Order by latest
        .limit(1) // Get only the latest row
        .single();
  
      if (error) throw error;
  
      console.log(data);
      const introContent = data.scene;
  
      // Pass the fetched `intro` content to the `resultVictory` action in the store
      await ResultStatus.resultVictory({ cont: introContent });
    } catch (fetchError) {
      console.error("Error fetching adventure data:", fetchError.message);
      ResultStatus.error = "Failed to load adventure data.";
    }
  });
  
  // Function to close the dialog and reset enemy stats
  const closeDialog = async () => {
    try {
      // Retrieve character data from localStorage
      const savedCharacterData = localStorage.getItem("characterData");
      if (savedCharacterData) {
        const character = JSON.parse(savedCharacterData);
  
        // Update the characters table
        const { error: characterUpdateError } = await supabase
          .from("characters")
          .update({
            mana: character.mana,
            agility: character.agility,
            defense: character.defense,
            critical_rate: character.critical_rate,
           
          })
          .eq("id", characterId); // Use the appropriate character ID from localStorage
  
        if (characterUpdateError) {
          console.error("Error updating character:", characterUpdateError.message);
        } else {
          console.log("Character updated successfully.");
        }
      } else {
        console.warn("No character data found in localStorage.");
      }
  
      console.log("Resetting enemy stats...");
      // Reset enemy stats in the database
      const updates = [
        { id: characterId, health: 40, mana: 40, agility: 5, defense: 0, critical_rate: 5 },
      ];
  
      // Perform updates for each enemy ID
      for (const update of updates) {
        const { error } = await supabase
          .from("enemies")
          .update({
            health: update.health,
            mana: update.mana,
            agility: update.agility,
            defense: update.defense,
            critical_rate: update.critical_rate,
          })
          .eq("id", update.id);
  
        if (error) {
          console.error(`Error updating enemy with ID ${update.id}:`, error.message);
          continue; // Skip to the next update in case of an error
        }
      }
  
      console.log("Enemy stats reset successfully.");
    } catch (error) {
      console.error("Error during closeDialog execution:", error.message);
    }
  
    try {
      console.log("Resetting additional enemy stats...");
      // Reset additional enemy stats in the database
      const updates = [
        { id: 4, health: 60, mana: 60, agility: 5, defense: 0, critical_rate: 5 },
        { id: 5, health: 40, mana: 100, agility: 20, defense: 0, critical_rate: 5 },
        { id: 6, health: 50, mana: 50, agility: 10, defense: 50, critical_rate: 5 },
      ];
  
      for (const update of updates) {
        const { error } = await supabase
          .from("enemies")
          .update({
            health: update.health,
            mana: update.mana,
            agility: update.agility,
            defense: update.defense,
            critical_rate: update.critical_rate,
          })
          .eq("id", update.id);
  
        if (error) {
          console.error(`Error updating enemy with ID ${update.id}:`, error.message);
          continue;
        }
      }
  
      console.log("Additional enemy stats reset successfully.");
    } catch (error) {
      console.error("Error during additional enemy reset:", error.message);
    }
  
    // Close dialog and navigate to /story_base
    dialogVisible.value = false;
    router.push("/jail");
  };
  </script>
  
  

<style scoped>
.scenario-content {
  white-space: pre-wrap;
}
.error {
  color: red;
  font-weight: bold;
}
</style>
