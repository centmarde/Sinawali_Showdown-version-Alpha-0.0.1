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
import { useResultStatus } from "@/stores/useResultStatus";
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

// Close the dialog and redirect to /story_base
const closeDialog = () => {
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
