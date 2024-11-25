<template>
    <div>
      <!-- Fixed Icons -->
      <v-icon class="top-right-icon1" @click="invokeChildOneMethod">mdi-cards</v-icon>
      <v-icon class="top-right-icon2" @click="invokeChildTwoMethod">mdi-menu</v-icon>
  
      <!-- Child Components -->
      <Map @pinClicked="handlePinClicked" />
  
      <Introduction style="display: none; z-index: 5;" />
      
      <!-- Persistent Dialog with a Close Button -->
      <v-dialog style="z-index: 3;" v-model="dialogVisibleIntro" max-width="600" persistent>
        <v-card>
          <v-card-title class="text-h6">
            Greetings!
            <!-- Close Button -->
            <v-spacer />
            <v-btn icon @click="closeDialog" class="close-btn">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="scrollable">
            Welcome to the Sinawali Showdown! Explore the map by clicking on the pins.
            The path of <strong>{{ characterName }}</strong> is in your hands.
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  
  
  <script>
  import Map from "@/components/StoryMode/Map.vue";
  import StoryDialog from "@/components/StoryMode/StoryDialog.vue";
  import Introduction from "@/components/StoryMode/Introduction.vue";
  import { supabase } from "@/lib/supabase";
  import { useRouter } from 'vue-router';
  import { useAudioAdventure } from "@/stores/adventureAudio";
  import { useToast } from "vue-toastification";
  
  export default {
    name: "StoryBase",
    components: { Map, StoryDialog, Introduction },
    data() {
      return {
        dialogVisible: false,         // Control visibility of the StoryDialog
        dialogVisibleIntro: true,     // Control visibility of the Introduction dialog
        characterName: '',           // Character name defined here
      };
    },
  
    mounted() {
      // Fetch character data when the component is mounted
      this.fetchCharacterData();
    },
  
    methods: {
      
      async fetchCharacterData() {
        try {
          const adventureId = localStorage.getItem("adventure_id");
          const { data, error } = await supabase
            .from("characters")
            .select("name")
            .eq("adventure_id", adventureId) // Assuming you want to fetch the character by the user_id
            .single();
  
          if (error) {
            console.error("Error fetching character data:", error.message);
            this.characterName = "Kidlat";  // Default name if fetch fails
            return;
          }
  
          // Store the character's name or fallback to "Kidlat"
          this.characterName = data.name || "Kidlat";
          console.log("Character Name:", this.characterName);
        } catch (error) {
          console.error("Error fetching character data:", error.message);
          this.characterName = "Kidlat";  // Default name on error
        }
      },
  
      // Method to close the dialog and navigate to /deck_build
      async closeDialog() {
        const toast = useToast();
        useAudioAdventure().playClick();
        const userId = localStorage.getItem("user_id");
        const characterId = localStorage.getItem("character_id");
        
        try {
          // Check if the card already exists
          const { data: existingCard, error: checkError } = await supabase
            .from("cards_owned")
            .select("*")
            .eq("user_id", userId)
            .eq("card_id", 73);
  
          if (checkError) throw checkError;
  
          if (existingCard.length > 0) {
            toast("You already own this card!");
            this.$router.push("/deck_build");
            return;
          }
  
          // Fetch card details
          const { data: cardData, error: fetchError } = await supabase
            .from("cards")
            .select("*")
            .eq("id", 73)
            .single();
  
          if (fetchError) throw fetchError;
          console.log(characterId);
  
          // Insert the new card into `cards_owned`
          const { error: insertError } = await supabase.from("cards_owned").insert([
            {
              character_id: characterId,
              user_id: userId,
              card_id: 73,
            },
          ]);
  
          if (insertError) throw insertError;
  
          console.log("Card inserted into 'cards_owned' successfully!");
  
          // Close the introduction dialog and navigate to /deck_build
          this.dialogVisibleIntro = false;
          this.$router.push('/deck_build');
          
        } catch (error) {
          console.error("Error in closeDialog:", error.message);
        }
      },
    },
  };
  </script>
  

<style scoped>
.close-btn {
  position: absolute;
  top: 10px;      /* Adjust this value if needed */
  right: 10px;    /* Adjust this value if needed */
  z-index: 10;
}
</style>

  
  
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
    