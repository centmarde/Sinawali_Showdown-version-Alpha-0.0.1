<template>
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
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useResultStatus } from "@/stores/useBusted";
  import { supabase } from "@/lib/supabase";
  
  const ResultStatus = useResultStatus();
  const dialogVisible = ref(true); // Dialog initially visible
  const router = useRouter();
  
  // Ensure Groq is initialized
  if (!ResultStatus.groq) {
    ResultStatus.initializeGroq("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");
  }
  
  onMounted(async () => {
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
      console.log("Resetting enemy stats...");
      // Reset enemy stats in the database
      const updates = [
        { id: 4, health: 60, mana: 60, agility: 5, defense: 0, critical_rate: 5 },
        { id: 5, health: 40, mana: 100, agility: 20, defense: 0, critical_rate: 5 },
        { id: 6, health: 50, mana: 50, agility: 10, defense: 50, critical_rate: 5 },
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
  
    // Close dialog and navigate to /story_base
    dialogVisible.value = false;
    router.push("/story_base");
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
