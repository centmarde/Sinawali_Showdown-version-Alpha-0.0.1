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
          <button
            v-for="option in ['A', 'B', 'C', 'D']"
            :key="option"
            @click="handleButtonClick(option)" 
            :class="{ selected: selectedAnswer === option }"
            :disabled="gameScenarioStore.loading"
          >
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
  
  const gameScenarioStore = useGameScenarioStore();
  const selectedAnswer = ref(null);
  
  gameScenarioStore.initializeGroq("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");
  
  onMounted(async () => {
    try {
      await gameScenarioStore.startScenario(); // Trigger the start of the scenario when the component mounts
      const savedAnswer = localStorage.getItem('selectedAnswer');
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
  };
  
  // Confirm the user's choice
  const confirmAnswer = () => {
    if (selectedAnswer.value) {
      // Log the selected answer
      console.log(`Confirmed answer: ${selectedAnswer.value}`);
  
      // Optionally show an alert
      alert(`You selected option ${selectedAnswer.value}.`);
  
      // Reset after confirmation
      selectedAnswer.value = null;
    } else {
      alert("Please select an option before confirming.");
    }
  };
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
  