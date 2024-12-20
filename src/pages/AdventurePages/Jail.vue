<template>
    <div>
      <!-- Fixed Icons -->
      <v-icon class="top-right-icon1" @click="invokeChildOneMethod">
        mdi-cards
      </v-icon>
      <v-icon class="top-right-icon2" @click="invokeChildTwoMethod">
        mdi-menu
      </v-icon>
  
      <!-- Map Background -->
      <Map />
  
      <v-img
        class="adventure-dialog"
        src="@/assets/background/sungo.png"
        contain
      >
        <v-container
          class="d-flex adventure-results"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        >
          <v-row justify="center" align="center">
            <!-- Title -->
            <v-col cols="12" id="title" class="text-center">
              <h1 class="pb-4">Busted</h1>
            </v-col>
  
            <!-- Gold Stolen -->
            <v-col cols="2" class="text-center">
              <img
                src="@/assets/adventure/Golds.png"
                alt="Gold Stolen"
                class="result-image-large"
              />
              <p class="mt-2">Gold Stolen: {{ goldObtained }}</p>
            </v-col>
  
            <!-- Points Recovered -->
            <v-col cols="2" class="text-center">
              <img
                src="@/assets/adventure/potion.png"
                alt="Points Recovered"
                class="result-image-large"
              />
              <p class="mt-2">Points Recovered: {{ pointsRecovered }}</p>
            </v-col>
  
            <!-- Stolen Card Display -->
            <v-col cols="2" class="text-center" v-if="stolenCard">
            
              <v-img
                :src="stolenCard.img"
                alt="Stolen Card"
                class="result-image-large"
              />
              <p class="mt-2">Stolen Card:{{ stolenCard.name }}</p>
            </v-col>
  
            <!-- Button -->
            <v-col cols="12" id="button" class="text-center">
              <v-btn
                class="merienda"
                size="large"
                variant="tonal"
                color="#EEEEEE"
                @click="proceedAdventure"
              >
                Proceed Adventure
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </div>
  </template>
  
  <script>
  import Map from "@/components/StoryMode/Map.vue";
  import { supabase } from "@/lib/supabase";  // Correctly import supabase
  import router from "@/router";
  import { useAudioAdventure } from "@/stores/adventureAudio";
  export default {
    name: "Jail",
    components: { Map },
    data() {
      return {
        pointsRecovered: 0, // Holds the random health value displayed in UI
        goldObtained: 0,    // Holds the random gold value displayed in UI
        stolenCard: null,   // Holds the details of the stolen card (image, name)
        cardToDeleteId: null,  // Holds the ID of the card to be deleted later
      };
    },
    mounted() {
      // Generate random numbers on mount
      this.generateRandomValues();
      this.fetchCardToBeDeleted();
    },
    methods: {
      generateRandomValues() {
        // Stolen gold is negative and points recovered is a random number
        this.pointsRecovered = Math.floor(Math.random() * (20 + 1));  // Random points recovered
        this.goldObtained = (Math.floor(Math.random() * (10 - 1 + 1)) + 1); // Negative gold stolen
      },
  
      async fetchCardToBeDeleted() {
        const userId = localStorage.getItem("user_id");
  
        try {
          // Fetch cards owned by the user, excluding the card with ID 73
          const { data, error } = await supabase
            .from("cards_owned")
            .select("card_id")
            .eq("user_id", userId)
            .neq("card_id", 73);  // Exclude card ID 73
  
          if (error) {
            console.error("Error fetching owned cards:", error.message);
            return;
          }
  
          if (data.length > 0) {
            // Randomly select a card to delete
            const randomCard = data[Math.floor(Math.random() * data.length)];
  
            // Fetch card details from the 'cards' table
            const { data: cardDetails, error: fetchError } = await supabase
              .from("cards")
              .select("name, img")
              .eq("id", randomCard.card_id)
              .single(); // Only one result expected
  
            if (fetchError) {
              console.error("Error fetching card details:", fetchError.message);
              return;
            }
  
            // Store the stolen card's details and ID to be deleted later
            this.stolenCard = cardDetails;
            this.cardToDeleteId = randomCard.card_id;
          } else {
            console.log("No cards available to delete.");
          }
        } catch (error) {
          console.error("Error with fetchCardToBeDeleted:", error);
        }
      },
  
      async proceedAdventure() {
        const audioAdventure = useAudioAdventure();
        audioAdventure.playClick();
        const savedCharacterData = localStorage.getItem("characterData");
        const characterId = localStorage.getItem("character_id");
        
        
        if (savedCharacterData) {
          const character = JSON.parse(savedCharacterData);
          character.gold -= this.goldObtained;
          try {
            // Update character data in the database
            const { error: updateError } = await supabase
              .from("characters")
              .update({
                mana: character.mana,
                health: this.pointsRecovered,
                gold: character.gold,
              })
              .eq("id", characterId);
  
            if (updateError) {
              console.error("Error updating character:", updateError.message);
            } else {
              console.log("Character updated successfully.");
            }
  
            // Proceed to delete the stolen card from cards_owned table
            if (this.cardToDeleteId) {
              const { error: deleteError } = await supabase
                .from("cards_owned")
                .delete()
                .eq("user_id", localStorage.getItem("user_id"))
                .eq("card_id", this.cardToDeleteId);
  
              if (deleteError) {
                console.error("Error deleting card from cards_owned:", deleteError.message);
              } else {
                console.log("Card deleted from cards_owned table successfully.");
              }
  
              // Also delete the card from deck_builds table
              const { error: deckDeleteError } = await supabase
                .from("deck_builds")
                .delete()
                .eq("card_id", this.cardToDeleteId);
  
              if (deckDeleteError) {
                console.error("Error deleting card from deck_builds:", deckDeleteError.message);
              } else {
                console.log("Card deleted from deck_builds table successfully.");
              }
            }
  
            router.push("/story_base"); // Navigate to another page after adventure
          } catch (error) {
            console.error("Error with proceedAdventure:", error);
          }
        } else {
          console.warn("No character data found in localStorage.");
        }
      },
  
      invokeChildOneMethod() {
        console.log("Invoke method one!");
      },
  
      invokeChildTwoMethod() {
        console.log("Invoke method two!");
      },
    },
  };
  </script>
  
  
  
  <style scoped>

  /* Adventure Dialog */
  .adventure-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%; /* Make the image smaller */
    height: auto; /* Maintain aspect ratio */
    box-shadow:none;
    overflow: hidden;
  }
  #title{
    position: relative;
    top: 15%;
  }
  #button{
    position: relative;
    bottom: 15%;
  }
  /* Background image styling is handled by v-img */
  .adventure-results {
    flex-direction: column; /* Ensure content stacks vertically */
    color:rgba(111, 52, 51, 0.9);
    text-shadow: 0px 0px 5px rgba(37, 18, 17, 0.9);
  }
  
  /* Result Image */
  .result-image-large {
    width: 100px;
    height: auto;
    z-index: 1;
  }
  
  /* Button Styles */
  .merienda {
    font-family: "Merienda", cursive;
    color: #fff;
    background-color: rgba(111, 52, 51, 0.9);
    border-radius: 8px;
  }
  
  /* Fixed Icon Positions */
  .top-right-icon1,
  .top-right-icon2 {
    position: fixed;
    top: 2rem;
    font-size: 50px;
    z-index: 2;
    cursor: pointer;
  }
  
  .top-right-icon1 {
    right: 7rem;
  }
  
  .top-right-icon2 {
    right: 2rem;
  }
  </style>
  