<template>
  <div>
    <!-- Loading Indicator -->
    <div v-if="IntroDay.loading">Loading...</div>

    <!-- Error Display -->
    <div v-if="IntroDay.error" class="error">{{ IntroDay.error }}</div>

    <!-- Scenario Content -->
    <div class="scenario-content" v-if="IntroDay.scenario">
      <p v-html="IntroDay.scenario"></p>

      <!-- Option Buttons -->
      <div>
        <v-btn @click="handleConfirm">Confirm</v-btn>
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
          <v-btn @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

  
<script setup>
import { onMounted, ref } from "vue";
import { useIntroDay } from "@/stores/useIntroDay";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const userId = localStorage.getItem("user_id");
const adventureId = localStorage.getItem("adventure_id");
const toast = useToast();
const router = useRouter();

const IntroDay = useIntroDay();
const dialogVisible = ref(true);

if (!IntroDay.groq) {
  IntroDay.initializeGroq("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");
}

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("adventures")
      .select("intro")
      .eq("id", adventureId)
      .single();

    if (error) throw error;

    const introContent = data.intro;
    await IntroDay.startScenario({ intro: introContent });
  } catch (fetchError) {
    console.error("Error fetching adventure data:", fetchError.message);
    IntroDay.error = "Failed to load adventure data.";
  }
});

const closeDialog = () => {
  dialogVisible.value = false;
 
};

const handleConfirm = async () => {
  try {
    await updateOrInsertCard(); // Call the separate function for Supabase operations
    toast("Build your deck first.");
    router.push("/deck_build");
  } catch (error) {
    console.error("Error during confirm action:", error.message);
  }
};

const updateOrInsertCard = async () => {
  const characterId = localStorage.getItem("character_id");
  
  try {
    // Check if the card already exists
    const { data: existingCard, error: checkError } = await supabase
      .from("cards_owned")
      .select("*")
      .eq("user_id", userId)
      .eq("card_id", 73);

    if (checkError) throw checkError;

    if (existingCard.length > 0) {
      toast("You already own this card!");
      router.push("/deck_build");
      return;
    }

    // Fetch card details
    const { data: cardData, error: fetchError } = await supabase
      .from("cards")
      .select("*")
      .eq("id", 73)
      .single();

    if (fetchError) throw fetchError;
    console.log(characterId);
    // Insert the new card into `cards_owned`
    const { error: insertError } = await supabase.from("cards_owned").insert([
      {
        character_id: characterId,
        user_id: userId,
        card_id: 73,
      },
    ]);

    if (insertError) throw insertError;

    console.log("Card inserted into 'cards_owned' successfully!");
    
  } catch (error) {
    throw new Error("Error updating or inserting card: " + error.message);
  }
};
</script>

  
  
  <style scoped>
  .scenario-content{
    z-index:9999;
  }
</style>