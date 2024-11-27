<template>
  <div>
    <!-- Fixed Icons -->
    <v-img
      class="top-right-icon1"
      src="../assets/adventure/cards.png"
      @click="invokeChildOneMethod"
    >
      CARDS
    </v-img>
    <v-img
      class="top-right-icon2"
      src="../assets/adventure/book.png"
      @click="invokeChildTwoMethod"
    >
      MENU
    </v-img>
    <v-img
      class="top-right-icon3"
      src="../assets/adventure/wow.png"
      @click="invokeChildThreeMethod"
    >
      SHOP
    </v-img>
    <v-img class="top-right-icon4" src="../assets/adventure/Golds.png"></v-img>
    <h5 class="top-right-icon5">{{ gold }}</h5>

    <!-- Child Components -->
        <Map :key="mapKey" @pinClicked="handlePinClicked"/>
       <!-- StoryDialog in v-dialog wrapped with v-card -->
       <v-dialog v-model="dialogVisible" max-width="600" persistent style="font-family: 'Merienda', cursive;">
  <v-card>
    <v-card-title class="text-h6">Scenario</v-card-title>
    <v-card-text class="scrollable">
      <!-- StoryDialog content -->
      <StoryDialog :key="storyDialogKey" />
    </v-card-text>
  </v-card>
</v-dialog>

    <!-- Menu Dialog -->
    <v-dialog
      v-model="menuDialogVisible"
      max-width="700"
      persistent
      :overlay="true"
      :style="{ zIndex: 99999 }"
    >
      <v-img
        class="align-end text-white"
        src="../assets/background/main-menu.png"
        cover
      >
        <v-container
          class="d-flex game-pause"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        >
          <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">
              <h1 class="pb-2">Game Paused</h1>
              <div class="d-flex flex-column">
                <v-btn
                  class="merienda"
                  size="large"
                  variant="tonal"
                  color="#6f3433"
                  @click="resumeGame"
                >
                  Resume
                </v-btn>

                <v-btn
                  class="merienda"
                  size="large"
                  variant="tonal"
                  color="#6f3433"
                  @click="exitToMainMenu"
                >
                  Main Menu
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-dialog>

    <div class="circle-circle"></div>
  </div>
</template>
<script>
import Map from "@/components/StoryMode/Map.vue";
import StoryDialog from "@/components/StoryMode/StoryDialog.vue";
import router from "@/router";
import { supabase } from "@/lib/supabase";
import { useGameScenarioStore } from "@/stores/useGameScenarioStore";
import { useAudioAdventure } from "@/stores/adventureAudio";
import { onMounted } from "vue";
import { useAudioStore } from "@/stores/audioStore";

export default {
  name: "StoryBase",
  components: { Map, StoryDialog },
  data() {
    return {
      dialogVisible: false, // Control dialog visibility
      mapKey: 0, // Unique key for the Map component
      storyDialogKey: 0, // Unique key for the StoryDialog component
      gold: 0, // Default gold value
      menuDialogVisible: false,
    };
  },
  setup() {
    const audioStore = useAudioAdventure();
    const audioStore2 = useAudioStore();

    const fetchAndSaveCharacterData = async () => {
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
    };

    // Call the method during the `onMounted` lifecycle
    onMounted(fetchAndSaveCharacterData);

    // Play "village" audio when the component is mounted
    onMounted(() => {
      audioStore.playVillage();
      audioStore.playAdBg();
    });

    return {
      audioStore,
      audioStore2,
    };
  },
  methods: {
    async handlePinClicked(area) {
      localStorage.setItem('locationName', area);
      console.log("Area clicked:", area);
      this.audioStore.playClick(); // Play click sound
      const gameScenarioStore = useGameScenarioStore();
      gameScenarioStore.initializeGroq(
        "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"
      );

      // Fetch adventure intro and pass it as bio parameter
      const bio = await this.fetchAdventureIntro();

      gameScenarioStore.startScenario(area, bio); // Pass the area and bio to startScenario
      this.dialogVisible = true; // Open the StoryDialog

      // Fetch character data and save to localStorage
      await this.fetchAndSaveCharacterData();

      this.reloadStoryDialog();
    },

    invokeChildOneMethod() {
      this.audioStore.playClick();
      router.push("/deck_build");
    },
    invokeChildThreeMethod() {
      this.audioStore.playClick();
      router.push("/store");
    },
    resumeGame() {
      this.audioStore.playClick();
      // Close the menu dialog
      this.menuDialogVisible = false;
    },
    reloadMap() {
      this.mapKey += 1; // Update the key to trigger remount of Map
    },
    reloadStoryDialog() {
      this.storyDialogKey += 1; // Update the key to trigger remount of StoryDialog
    },
    exitToMainMenu() {
      this.audioStore.playClick();
      this.audioStore.pauseAdBg();
      this.audioStore.pauseVillage();
      this.audioStore2.allPause();
      // Logic to navigate to the main menu
      console.log("Exiting to main menu...");
      this.$router.push("/landing");
    },
    invokeChildTwoMethod() {
      this.audioStore.playClick();
      // Open the menu dialog
      this.menuDialogVisible = true;
    },

    async fetchAdventureIntro() {
      try {
        const adventureId = localStorage.getItem("adventure_id"); // Get adventure ID from localStorage
        if (!adventureId) {
          console.warn("No adventure ID found in localStorage.");
          return null;
        }

        // Fetch adventure data from the database
        const { data: adventureData, error } = await supabase
          .from("adventures")
          .select("intro")
          .eq("id", adventureId)
          .single();

        if (error) {
          console.error("Error fetching adventure data:", error.message);
          return null;
        }

        // Return the intro as the bio parameter
        return adventureData.intro;
      } catch (error) {
        console.error("Error in fetchAdventureIntro:", error.message);
        return null;
      }
    },
    async fetchGold() {
      try {
        const characterId = localStorage.getItem("character_id");
        if (!characterId) {
          console.warn("No character ID found in localStorage.");
          return;
        }

        // Fetch the gold value from the database
        const { data: characterData, error } = await supabase
          .from("characters")
          .select("gold")
          .eq("id", characterId)
          .single();

        if (error) {
          console.error("Error fetching gold data:", error.message);
          return;
        }

        // Update the gold property dynamically
        this.gold = characterData.gold ?? 0; // If gold is null or undefined, set to 0
        console.log("Fetched gold:", this.gold);
      } catch (error) {
        console.error("Error in fetchGold:", error.message);
      }
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
  mounted() {
    // Fetch gold when the component is mounted
    this.fetchGold();
  },
};
</script>


<style scoped>
.top-right-icon1 {
  position: fixed;
  top: 2rem;
  right: 8rem;
  margin-left: 15px;
  cursor: pointer;
  font-size: 15px;
  z-index: 2;
  width: 80px;
  font-family: "Merienda", cursive;
}
.top-right-icon2 {
  position: fixed;
  top: 2rem;
  right: 2rem;
  margin-left: 15px;
  cursor: pointer;
  font-size: 15px;
  z-index: 2;
  width: 80px;
  font-family: "Merienda", cursive;
}
.top-right-icon3 {
  position: fixed;
  top: 2rem;
  right: 13.8rem;
  margin-left: 15px;
  cursor: pointer;
  font-size: 15px;
  z-index: 2;
  width: 80px;
  font-family: "Merienda", cursive;
}
.top-right-icon4 {
  position: fixed;
  top: 2rem;
  right: 19.5rem;
  margin-left: 15px;
  cursor: pointer;
  font-size: 15px;
  z-index: 2;
  cursor: default;
  pointer-events: none;
  width: 80px;
  font-family: "Merienda", cursive;
}
.top-right-icon5 {
  position: fixed;
  top: 3.4rem;
  right: 22rem;
  margin-left: 15px;
  cursor: default;
  pointer-events: none;
  font-size: 20px;
  z-index: 1;
  width: 120px;
  font-family: "Merienda", cursive;
  background: rgba(0, 0, 0, 0.56);
  backdrop-filter: blur(3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(3px);
  text-align: start;
  padding-left: 15px;
  line-height: 40px;
  border-radius: 30px;
  height: 40px;
}

.scrollable {
  max-height: 400px; /* Adjust the height as needed */
  overflow-y: auto;
}

.pause_btn {
  position: absolute;
  top: 75px; /* Adjust this value to position the timer slightly away from the top */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: transparent !important;
  box-shadow: none !important;
  color: inherit;
}

.game-pause {
  width: 300px;
}

.game-pause h1 {
  font-family: "Merienda", cursive;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  animation: fadeIn 2s ease-out;
  color: #6f3433;
}

.game-pause-btn {
  width: 300px;
}

.game-pause .v-btn {
  font-weight: 800 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.circle-circle {
  position: absolute;
  top: -150px;
  right: -50px;
  width: 600px;
  height: 300px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.309);
  backdrop-filter: blur(3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(3px);
}
</style>
