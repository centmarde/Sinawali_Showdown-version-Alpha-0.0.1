<template>
  <div>
    <!-- Loading Indicator -->
    <div v-if="IntroDay.loading">Loading...</div>

    <!-- Error Display -->
    <div v-if="IntroDay.error" class="error">{{ IntroDay.error }}</div>

    <!-- Scenario Content -->
    <div class="scenario-content" v-if="IntroDay.scenario">
      <p v-html="IntroDay.scenario" ></p>

      <!-- Option Buttons -->
      <div>
        <v-btn @click="handleConfirm" style="font-family: 'Merienda', cursive">Confirm</v-btn>
      </div>
    </div>

    <!-- Dialog for displaying the scenario -->
    <v-dialog v-model="dialogVisible" max-width="500" persistent>
      <v-img class="align-center"
              height="600"
              width="900"
              src="../../assets/images/freshstart.png"
              cover
            >
        <v-card-title class="text-h6" style="font-family: 'Merienda', cursive">Fresh Start!</v-card-title>
        <v-card-text>
          <p v-html="IntroDay.scenario"></p>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog" style="font-family: 'Merienda', cursive">Close</v-btn>
        </v-card-actions>
      </v-img>
    </v-dialog>
  </div>
</template>

  
<script setup>
import { onMounted, ref } from "vue";
import { useIntroDay } from "@/stores/useIntroDay";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAudioAdventure } from "@/stores/adventureAudio";

const userId = localStorage.getItem("user_id");
const adventureId = localStorage.getItem("adventure_id");
const toast = useToast();
const router = useRouter();
const audioAdventure = useAudioAdventure();
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
  audioAdventure.playClick();
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
 console.log("CSU game Dev");
};
</script>

  
  
  <style scoped>
  .scenario-content{
    z-index:9999;
  }
</style>