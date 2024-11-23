<template>
    <div>
      <!-- Fixed Icons -->
      <v-icon class="top-right-icon1" @click="invokeChildOneMethod">mdi-cards</v-icon>
      <v-icon class="top-right-icon2" @click="invokeChildTwoMethod">mdi-menu</v-icon>
  
      <!-- Child Components -->
      <Map @pinClicked="handlePinClicked" />
  
      <!-- StoryDialog in v-dialog wrapped with v-card -->
      <v-dialog v-model="dialogVisible" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h6">Scenario</v-card-title>
          <v-card-text class="scrollable">
            <!-- StoryDialog content -->
            <StoryDialog />
          </v-card-text>
         
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
import Map from "@/components/StoryMode/Map.vue";
import StoryDialog from "@/components/StoryMode/StoryDialog.vue";
import { useGameScenarioStore } from "@/stores/useGameScenarioStore";

export default {
  name: "StoryBase",
  components: { Map, StoryDialog },
  data() {
    return {
      dialogVisible: false, // Control dialog visibility
    };
  },
  methods: {
    
    handlePinClicked(area) {
      const gameScenarioStore = useGameScenarioStore();
      gameScenarioStore.initializeGroq("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");

      gameScenarioStore.startScenario(area); // Pass the area to startScenario
      this.dialogVisible = true; // Open the StoryDialog
    },
    invokeChildOneMethod() {
      // Implement the functionality for the first icon
      console.log('invokeChildOneMethod triggered');
    },
    invokeChildTwoMethod() {
      // Implement the functionality for the second icon
      console.log('invokeChildTwoMethod triggered');
    },
  },
};
</script>

  
  <style scoped>
  .top-right-icon1 {
    position: fixed;
    top: 2rem;
    right: 7rem;
    margin-left: 15px;
    cursor: pointer;
    font-size: 50px;
    z-index: 2;
  }
  .top-right-icon2 {
    position: fixed;
    top: 2rem;
    right: 2rem;
    margin-left: 15px;
    cursor: pointer;
    font-size: 50px;
    z-index: 2;
  }
  .scrollable {
    max-height: 400px; /* Adjust the height as needed */
    overflow-y: auto;
  }
  </style>
  