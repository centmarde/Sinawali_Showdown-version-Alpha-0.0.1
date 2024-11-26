<template>
  <div>
    <!-- Fixed Icons -->
    <v-img class="top-right-icon1" src="../assets/adventure/cards.png" @click="invokeChildOneMethod">CARDS</v-img>
    <v-img class="top-right-icon2" src="../assets/adventure/book.png" @click="invokeChildTwoMethod">MENU</v-img>
    <v-img class="top-right-icon3" src="../assets/adventure/book.png" @click="invokeChildTwoMethod">SHOP</v-img>
    <v-img class="top-right-icon4" src="../assets/adventure/Golds.png"></v-img>
    <h5 class="top-right-icon5">{{ gold }}</h5>

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
import { useAudioAdventure } from "@/stores/adventureAudio";
import { onMounted } from "vue";

export default {
  name: "StoryBase",
  components: { Map, StoryDialog },
  data() {
    return {
      dialogVisible: false, // Control dialog visibility
      mapKey: 0, // Unique key for the Map component
      storyDialogKey: 0, // Unique key for the StoryDialog component
      gold: 0, // Default gold value
    };
  },
  setup() {
    const audioStore = useAudioAdventure();

    // Play "village" audio when the component is mounted
    onMounted(() => {
      audioStore.playVillage();
      audioStore.playAdBg();
    });

    return {
      audioStore,
    };
  },
  methods: {
    async handlePinClicked(area) {
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
      router.push("/deck_build");
    },
    invokeChildTwoMethod() {
      console.log("invokeChildTwoMethod triggered");
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
  background-color: rgba(0, 0, 0, 0.397);
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
  </style>
  