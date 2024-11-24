<template>
    <div>
      <!-- Loading Indicator -->
      <div v-if="IntroDay.loading">Loading...</div>
  
      <!-- Error Display -->
      <div v-if="IntroDay.error" class="error">{{ IntroDay.error }}</div>
  
      <!-- Scenario Content -->
      <div class="scenario-content" v-if="IntroDay.scenario">
        <!-- Render the scenario with <br> tags -->
        <p v-html="IntroDay.scenario"></p>
  
        <!-- Option Buttons -->
        <div>
          <v-btn @click="closeVDialog">Confirm</v-btn>
        </div>
      </div>
  
      <!-- Dialog for displaying the scenario -->
      <v-dialog v-model="dialogVisible" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h6">Fresh Start!</v-card-title>
          <v-card-text>
            <p v-html="IntroDay.scenario"></p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeVDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import { useIntroDay } from "@/stores/useIntroDay";
  import { supabase } from "@/lib/supabase";
import router from "@/router/index";
  
  const userId = localStorage.getItem("user_id");
  const adventureId = localStorage.getItem("adventure_id");
  
  const IntroDay = useIntroDay();
  
  // Dialog visibility control
  const dialogVisible = ref(true); // Set the dialog to be visible initially
  
  // Ensure Groq is initialized
  if (!IntroDay.groq) {
    IntroDay.initializeGroq("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");
  }
  
  onMounted(async () => {
    try {
      // Fetch adventure data
      const { data, error } = await supabase
        .from("adventures")
        .select("intro")
        .eq("id", adventureId)
        .single();
  
      if (error) throw error;
  
      const introContent = data.intro; // Store the raw intro content
  
      // Pass the raw intro content to the store
      await IntroDay.startScenario({ intro: introContent });
    } catch (fetchError) {
      console.error("Error fetching adventure data:", fetchError.message);
      IntroDay.error = "Failed to load adventure data.";
    }
  });
  
  // Method to close the dialog
  const closeVDialog = () => {
    dialogVisible.value = false; // Close the dialog by setting dialogVisible to false
    
  };
  </script>
  
  <style scoped>
  .scenario-content{
    z-index:9999;
  }
</style>