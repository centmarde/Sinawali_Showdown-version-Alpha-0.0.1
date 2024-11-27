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
    <Map :key="mapKey" @pinClicked="handlePinClicked" />
    <!-- StoryDialog in v-dialog wrapped with v-card -->
    <v-dialog
      v-model="dialogVisible"
      max-width="600"
      persistent
      style="font-family: 'Merienda', cursive"
    >
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
                  class="merienda mb-5"
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
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useAudioStore } from "@/stores/audioStore";
import { useManor } from "@/stores/useManor";

export default {
  name: "StoryBase",
  components: { Map, StoryDialog },
  data() {
    return {
      dialogVisible: false, // Control dialog visibility
      mapKey: 0, // Unique key for the Map component
      storyDialogKey: 0, // Unique key for the StoryDialog component
      gold: ref(0), // Default gold value
      menuDialogVisible: false,
      goldChannel: null, // Store the channel for real-time updates
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
      try {
        const useManorStore = useManor();
        const gameScenarioStore = useGameScenarioStore();

        // Save selected area to localStorage
        localStorage.setItem("locationName", area);
        console.log("Area clicked:", area);

        // Play click sound
        this.audioStore.playClick();

        // Handle specific area actions
        switch (area) {
          case "manor":
            console.log("Generate energy potion");
            useManorStore.generateReward();
            break;
          case "tribe":
            console.log("Handle tribe area logic here");
            // Add any logic specific to "tribe"
            break;
          case "woods":
            console.log("Handle woods area logic here");
            // Add any logic specific to "woods"
            break;
          case "remnants":
            console.log("Handle remnants area logic here");
            // Add any logic specific to "remnants"
            break;
          case "river":
            console.log("Handle river area logic here");
            // Add any logic specific to "river"
            break;
          case "village":
            console.log("Handle village area logic here");
            // Add any logic specific to "village"
            break;
          default:
            console.warn(`Unhandled area: ${area}`);
        }

        // Initialize game scenario with the given API key
        gameScenarioStore.initializeGroq(
          "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"
        );

        // Fetch adventure intro and use it as bio
        const bio = await this.fetchAdventureIntro();

        // Start the scenario with the area and bio
        gameScenarioStore.startScenario(area, bio);

        // Show the StoryDialog
        this.dialogVisible = true;

        // Fetch and save character data
        /*  await this.fetchAndSaveCharacterData(); */

        // Reload StoryDialog
        this.reloadStoryDialog();
      } catch (error) {
        console.error("Error in handlePinClicked:", error);
      }
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
    async fetchGold() {
      try {
        const characterId = localStorage.getItem("character_id");
        if (!characterId) {
          console.warn("No character ID found in localStorage.");
          return;
        }

        const { data: characterData, error } = await supabase
          .from("characters")
          .select("gold")
          .eq("id", characterId)
          .single();

        if (error) {
          console.error("Error fetching gold data:", error.message);
          return;
        }

        this.gold = characterData.gold ?? 0; // Default to 0 if gold is null/undefined
        console.log("Fetched gold:", this.gold);
      } catch (error) {
        console.error("Error in fetchGold:", error.message);
      }
    },

    setupRealtimeUpdates() {
      const characterId = localStorage.getItem("character_id");
      if (!characterId) {
        console.warn("No character ID found in localStorage.");
        return;
      }

      this.goldChannel = supabase
        .channel("custom-update-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "characters",
            filter: `id=eq.${characterId}`, // Listen only for updates to this character
          },
          (payload) => {
            console.log("Change received!", payload);
            if (payload.new.gold !== undefined) {
              this.gold = payload.new.gold;
              console.log("Updated gold:", this.gold);
            }
          }
        )
        .subscribe();
    },

    teardownRealtimeUpdates() {
      if (this.goldChannel) {
        this.goldChannel.unsubscribe();
        console.log("Unsubscribed from real-time updates.");
      }
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
  },
  mounted() {
    // Fetch gold when the component is mounted
    this.fetchGold();

    // Start listening for real-time updates on gold changes
    this.setupRealtimeUpdates();
  },
  beforeUnmount() {
    // Cleanup: stop listening for real-time updates when the component is destroyed
    this.teardownRealtimeUpdates();
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
