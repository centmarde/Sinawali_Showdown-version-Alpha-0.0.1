<template>
  <div>
    <!-- Loading Indicator -->
    <div v-if="gameScenarioStore.loading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading...</p>
    </div>

    <!-- Error Display -->
    <div v-if="gameScenarioStore.error" class="error text-center text-danger my-4">
      {{ gameScenarioStore.error }}
    </div>

    <!-- Scenario Content -->
    <div v-if="isScenarioVisible && gameScenarioStore.scenario">
      <!-- Render the main scenario -->
      <p v-html="gameScenarioStore.scenario" class="text-body-1"></p>

      <!-- Option Buttons -->
      <div class="d-flex justify-center my-4">
        <v-btn v-for="option in ['A', 'B', 'C']" :key="option" @click="handleButtonClick(option)"
          :color="selectedAnswer === option ? 'primary' : 'secondary'"
          :variant="selectedAnswer === option ? 'contained' : 'outlined'" :disabled="gameScenarioStore.loading"
          class="mx-2">
          {{ option }}
        </v-btn>
      </div>

      <!-- Confirm Button -->
      <div class="text-center my-4">
        <v-btn @click="confirmAnswer" :disabled="!selectedAnswer || gameScenarioStore.loading" color="primary" large>
          Confirm Answer
        </v-btn>
      </div>
    </div>

    <!-- Help Scenario Dialog -->
    <v-dialog v-model="isHelpDialogOpen" max-width="600">
      <v-card>
        <v-card-title class="text-h5 py-3">
          Scenario
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- Loading State -->
          <div v-if="continueStatusStore.loading" class="text-center my-4">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <p>Generating new scenario...</p>
          </div>

          <!-- Error State -->
          <div v-if="continueStatusStore.error" class="error text-center text-danger my-4">
            {{ continueStatusStore.error }}
          </div>

          <!-- Scenario Display -->
          <div v-if="continueStatusStore.scenario">
            <div class="my-4">
              <p v-html="continueStatusStore.scenario" class="text-body-1"></p>
            </div>

            <!-- Options -->
            <div class="d-flex justify-start mt-4">
              <v-btn v-for="option in ['A', 'B', 'C']" :key="option"
                :color="selectedHelpAnswer === option ? 'primary' : 'secondary'"
                :variant="selectedHelpAnswer === option ? 'contained' : 'outlined'"
                @click="handleHelpOptionClick(option)" class="mx-2">
                {{ option }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end">
          <div class="text-center">
            <v-btn @click="confirmAnswer" :disabled="!selectedHelpAnswer || continueStatusStore.loading" color="primary"
              large>
              Confirm Answer
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useGameScenarioStore } from "@/stores/useGameScenarioStore";
import { useContinueStatus } from "@/stores/useContinueStory";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase.js";
import { useToast } from "vue-toastification";
import { useAudioAdventure } from "@/stores/adventureAudio";

const router = useRouter();
const toast = useToast();
const isScenarioVisible = ref(true);
const audioAdventure = useAudioAdventure();
// Initialize the main game scenario store
const gameScenarioStore = useGameScenarioStore();

// Initialize the continue status store for help scenarios
const continueStatusStore = useContinueStatus();

// State for the help dialog
const isHelpDialogOpen = ref(false);
const selectedAnswer = ref(null);
const selectedHelpAnswer = ref(null);

// Initialize Groq with the API key when the component is set up
gameScenarioStore.initializeGroq("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");

onMounted(async () => {
  const savedAnswer = localStorage.getItem("selectedAnswer");
  if (savedAnswer) {
    selectedAnswer.value = savedAnswer;

  }
});

// Handle main option button click
const handleButtonClick = (option) => {
  audioAdventure.playClick();
  selectedAnswer.value = option;
  localStorage.setItem("selectedAnswer", option);
};

// Handle the help scenario option click
const handleHelpOptionClick = (option) => {
  audioAdventure.playClick();
  selectedHelpAnswer.value = option;
};

// Confirm the main answer
const confirmAnswer = async () => {
  audioAdventure.playClick();

  // Check if either selectedAnswer or selectedHelpAnswer is set
  if (selectedAnswer.value || selectedHelpAnswer.value) {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID is not found in localStorage.");
      return;
    }

    try {
      // Fetch the adventure ID from localStorage
      const adventureId = localStorage.getItem("adventure_id");
      if (!adventureId) {
        throw new Error("Adventure ID not found in localStorage.");
      }

      // Fetch the previous scene from the 'adventures' table
      const { data: adventures, error: fetchError } = await supabase
        .from("adventures")
        .select("*")
        .eq("id", adventureId)
        .single();

      if (fetchError) throw fetchError;

      const prevScene = adventures?.prev_scene;
      const selectedChoice = `${gameScenarioStore.scenario} ${selectedAnswer.value || selectedHelpAnswer.value}`;

      // Ensure selectedChoice is only used once
      const sceneToInsert = localStorage.getItem("usedSelectedChoice")
        ? continueStatusStore.scenario
        : selectedChoice;

      // Insert into the scenarios table
      const { error: insertError } = await supabase.from("scenarios").insert({
        scene: sceneToInsert && selectedChoice,
        prev_scene: prevScene,
        user_id: userId,
        choice: selectedAnswer.value || selectedHelpAnswer.value,
        adventure_id: adventureId,
      });

      if (!localStorage.getItem("usedSelectedChoice")) {
        localStorage.setItem("usedSelectedChoice", "true");
      }

      if (insertError) throw insertError;

      console.log("Data successfully inserted into Supabase!");

      // Check selected options for "A", "B", or "C"
      const selectedOption = selectedAnswer.value || selectedHelpAnswer.value;

      if (selectedOption.toUpperCase() === "A") {
        audioAdventure.playNotif();
        continueStatusStore.initializeGroq(
          "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"
        );
        isScenarioVisible.value = false;
        await loadHelpScenario();
        isHelpDialogOpen.value = true;
      } else if (selectedOption.toUpperCase() === "B") {
        audioAdventure.playBattle();
        const randomEnemyId = Math.floor(Math.random() * 3) + 4; // Random number between 4 and 6
        console.log("Random Enemy ID:", randomEnemyId);
        localStorage.setItem("enemy_id", randomEnemyId);

        if (Math.random() < 0.3) {
          continueStatusStore.initializeGroq(
            "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"
          );
          isScenarioVisible.value = false;
          isHelpDialogOpen.value = true;
          await loadHelpScenario();
        } else {
          toast("To battle!");
          router.push("/ad_battle");
        }
      } else if (selectedOption.toUpperCase() === "C") {
        if (Math.random() < 0.8) {
          isHelpDialogOpen.value = false;
          isScenarioVisible.value = false;
          toast("You decided to take a break and reflect.");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          toast("The locals seem uncomfortable with your presence.");
          continueStatusStore.initializeGroq(
            "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"
          );
          isScenarioVisible.value = false;
          isHelpDialogOpen.value = true;
          await loadHelpScenario();
        }
      } else {
        alert("Please select a valid option.");
      }

      // Reset after confirmation
      selectedAnswer.value = null;
      selectedHelpAnswer.value = null;
      localStorage.removeItem("selectedAnswer");
      localStorage.removeItem("selectedHelpAnswer");
    } catch (error) {
      console.error("Failed to insert data or fetch adventures:", error);
      alert("An error occurred. Please try again later.");
    }
  } else {
    alert("Please select an option before confirming.");
  }
};




// Load the help scenario
const loadHelpScenario = async () => {
  try {
    isHelpDialogOpen.value = true;
    const previousContent = gameScenarioStore.scenario;
    
    await continueStatusStore.resultVictory({ cont: previousContent });
  } catch (error) {
    console.error("Error loading help scenario:", error);
  }
};

// Generate a random choice (1 or 2) and save it to localStorage
const randomChoice = Math.random() < 0.5 ? 1 : 2;
localStorage.setItem("randomChoice", randomChoice);
console.log("Random Choice:", randomChoice);
</script>


<style scoped>
/* Optional Styling */
button {
  margin: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  color: #151515;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover:not(:disabled) {
  background-color: #4caf50;
}

button.selected {
  background-color: #151515;
  color: #EEEEEE;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.error {
  color: red;
}
</style>