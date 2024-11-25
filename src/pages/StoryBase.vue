<template>
  <div>
    <!-- Fixed Icons -->
    <v-icon class="top-right-icon1" @click="invokeChildOneMethod">mdi-cards</v-icon>
    <v-icon class="top-right-icon2" @click="invokeChildTwoMethod">mdi-menu</v-icon>

    <!-- Child Components -->
    <Map :key="mapKey" @pinClicked="handlePinClicked" />

    <!-- StoryDialog in v-dialog wrapped with v-card -->
    <v-dialog v-model="dialogVisible" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h6">Scenario</v-card-title>
        <v-card-text class="scrollable">
          <!-- StoryDialog content -->
          <StoryDialog :key="storyDialogKey" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Map from "@/components/StoryMode/Map.vue";
import StoryDialog from "@/components/StoryMode/StoryDialog.vue";
import router from "@/router";
import { supabase } from "@/lib/supabase";
import { useGameScenarioStore } from "@/stores/useGameScenarioStore";

export default {
  name: "StoryBase",
  components: { Map, StoryDialog },
  data() {
    return {
      dialogVisible: false, // Control dialog visibility
      mapKey: 0, // Unique key for the Map component
      storyDialogKey: 0, // Unique key for the StoryDialog component
    };
  },
  methods: {
    async handlePinClicked(area) {
      const gameScenarioStore = useGameScenarioStore();
      gameScenarioStore.initializeGroq("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");

      gameScenarioStore.startScenario(area); // Pass the area to startScenario
      this.dialogVisible = true; // Open the StoryDialog

      // Fetch character data and save to localStorage
      await this.fetchAndSaveCharacterData();

      this.reloadStoryDialog();
    },
    invokeChildOneMethod() {
      router.push("/deck_build");
    },
    invokeChildTwoMethod() {
      console.log("invokeChildTwoMethod triggered");
    },
    reloadMap() {
      this.mapKey += 1; // Update the key to trigger remount of Map
    },
    reloadStoryDialog() {
      this.storyDialogKey += 1; // Update the key to trigger remount of StoryDialog
    },
    async fetchAndSaveCharacterData() {
      try {
        const characterId = localStorage.getItem("character_id");
        if (!characterId) {
          console.warn("No character ID found in localStorage.");
          return;
        }

        // Fetch character data from the database
        const { data: characterData, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", characterId)
          .single();

        if (error) {
          console.error("Error fetching character data:", error.message);
          return;
        }

        // Save character data to `localStorage` as a JSON string
        localStorage.setItem("characterData", JSON.stringify(characterData));
        console.log("Character data saved to localStorage:", characterData);
      } catch (error) {
        console.error("Error in fetchAndSaveCharacterData:", error.message);
      }
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
  