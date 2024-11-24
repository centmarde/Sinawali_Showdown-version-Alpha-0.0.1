<template>
  <div>
    <!-- Loading Indicator -->
    <div v-if="gameScenarioStore.loading">Loading...</div>

    <!-- Error Display -->
    <div v-if="gameScenarioStore.error" class="error">{{ gameScenarioStore.error }}</div>

    <!-- Scenario Content -->
    <div v-if="gameScenarioStore.scenario">
      <!-- Use v-html to render the scenario with <br> tags -->
      <p v-html="gameScenarioStore.scenario"></p>

      <!-- Option Buttons -->
      <div>
        <button v-for="option in ['A', 'B', 'C', 'D']" :key="option" @click="handleButtonClick(option)"
          :class="{ selected: selectedAnswer === option }" :disabled="gameScenarioStore.loading">
          {{ option }}
        </button>
      </div>

      <!-- Confirm Button -->
      <div>
        <button @click="confirmAnswer" :disabled="!selectedAnswer || gameScenarioStore.loading">
          Confirm Answer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGameScenarioStore } from "@/stores/useGameScenarioStore";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase.js"; // Supabase client

const router = useRouter();

// Initialize the store
const gameScenarioStore = useGameScenarioStore();

// Ref to store the selected answer
const selectedAnswer = ref(null);

// Initialize Groq with the API key when the component is set up
gameScenarioStore.initializeGroq("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");

onMounted(async () => {
  try {
   
    const savedAnswer = localStorage.getItem("selectedAnswer");
    if (savedAnswer) {
      selectedAnswer.value = savedAnswer;
    }
  } catch (error) {
    console.error("Failed to start the scenario:", error);
  }
});

// Handle button click to store and style the selected option
const handleButtonClick = (option) => {
  selectedAnswer.value = option;
  localStorage.setItem("selectedAnswer", option); // Save the selection to localStorage
};

// Confirm the user's choice
const confirmAnswer = async () => {
  if (selectedAnswer.value) {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID is not found in localStorage.");
      return;
    }

    try {
      // Fetch the previous scene from the 'adventures' table
      const adventureId = localStorage.getItem("adventure_id"); // Retrieve the adventure ID from localStorage

      if (!adventureId) {
        throw new Error("Adventure ID not found in localStorage.");
      }

      const { data: adventures, error: fetchError } = await supabase
        .from("adventures")
        .select("intro")
        .eq("id", adventureId)
        .single();

      if (fetchError) throw fetchError;

      const prevScene = adventures?.intro;

      // Insert the selected data into the 'scenarios' table
      const { error: insertError } = await supabase
        .from("scenarios")
        .insert({
          scene: gameScenarioStore.scenario,
          prev_scene: prevScene,
          user_id: userId,
          choice: selectedAnswer.value,
          adventure_id: adventureId,
        });

      if (insertError) throw insertError;

      console.log("Data successfully inserted into Supabase!");

      if (selectedAnswer.value.toUpperCase() === "B") {
        const randomNumber = Math.floor(Math.random() * (6 - 4 + 1)) + 4; // Random number between 4 and 6
        console.log(randomNumber);

        localStorage.setItem("enemy_id", randomNumber);
        router.push("/ad_battle");
      } else {
        alert(`You selected option ${selectedAnswer.value}.`);
      }

      // Reset after confirmation
      selectedAnswer.value = null;
      localStorage.removeItem("selectedAnswer"); // Clear the saved answer
    } catch (error) {
      console.error("Failed to insert data or fetch adventures:", error);
      alert("An error occurred. Please try again later.");
    }
  } else {
    alert("Please select an option before confirming.");
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