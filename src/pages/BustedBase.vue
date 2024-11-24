<template>
    <div>
      <!-- Fixed Icons -->
      <v-icon class="top-right-icon1" @click="invokeChildOneMethod">
        mdi-cards
      </v-icon>
      <v-icon class="top-right-icon2" @click="invokeChildTwoMethod">
        mdi-menu
      </v-icon>
  
      <!-- Child Components -->
      <Map @pinClicked="handlePinClicked" />
  
      <!-- Result Component -->
      <Defeated
        v-if="showResult"
        style="display: block; z-index: 5;"
        @closeDialog="handleResultClose"
      />
    </div>
  </template>
  
  <script>
  import Map from "@/components/StoryMode/Map.vue";
  import Defeated from "@/components/StoryMode/Defeated.vue";
  import { supabase } from "@/lib/supabase";
  
  export default {
    name: "StoryBase",
    components: { Map, Defeated },
    data() {
      return {
        dialogVisibleIntro: true, // Intro dialog visibility
        characterName: "Kidlat", // Default character name
        showResult: true, // Controls Result component visibility
      };
    },
    mounted() {
      this.fetchCharacterData();
    },
    methods: {
      async fetchCharacterData() {
        try {
          const adventureId = localStorage.getItem("adventure_id");
          const { data, error } = await supabase
            .from("characters")
            .select("name")
            .eq("adventure_id", adventureId)
            .single();
  
          if (error) {
            console.error("Error fetching character data:", error.message);
            this.characterName = "Kidlat"; // Default name if fetch fails
            return;
          }
  
          // Store the character's name or fallback to "Kidlat"
          this.characterName = data.name || "Kidlat";
          console.log("Character Name:", this.characterName);
        } catch (error) {
          console.error("Error fetching character data:", error.message);
          this.characterName = "Kidlat"; // Default name on error
        }
      },
  
      // Show the Result component
      invokeChildOneMethod() {
        this.showResult = true;
      },
  
      // Placeholder for a second method to show Result
      invokeChildTwoMethod() {
        this.showResult = true;
      },
  
      // Handle closing the Result component
      handleResultClose() {
        this.showResult = false;
      },
  
    
    }
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
  