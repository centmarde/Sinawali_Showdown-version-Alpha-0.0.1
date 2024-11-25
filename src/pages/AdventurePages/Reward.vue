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
        src="@/assets/background/dialog-bg.png"
        contain
      >
        <v-container
          class="d-flex adventure-results"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        >
          <v-row justify="center" align="center">
            <!-- Title -->
            <v-col cols="12" id="title" class="text-center">
              <h1 class="pb-4">Adventure Results</h1>
            </v-col>
  
            <!-- Gold Obtain -->
            <v-col cols="2" class="text-center">
              <img
                src="@/assets/adventure/Golds.png"
                alt="Gold Obtain"
                class="result-image-large"
              />
              <p class="mt-2">Gold Obtained: {{ goldObtained }}</p>
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
  
            <!-- Card Obtained -->
            <v-col cols="2" class="text-center">
              <img
                :src="card.img"
                alt="Card Obtained"
                class="result-image-large"
              />
              <p class="mt-2">Card Obtained: {{ card.name }}</p>
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
  import { supabase } from "@/lib/supabase";
  import router from "@/router";
  import { useAudioAdventure } from "@/stores/adventureAudio";

  
  export default {
    name: "StoryBase",
    components: { Map },
    data() {
      return {
        pointsRecovered: 0, // Holds the random health value displayed in UI
        goldObtained: 0,    // Holds the random gold value displayed in UI
        card: {
          id: null,         // Card ID
          img: "@/assets/default-card.png", // Default card image
          name: "Unknown",  // Card name
        },
      };
    },
    mounted() {
      // Generate random numbers on mount
      this.generateRandomValues();
      this.fetchRandomCard();
    },
    methods: {
      generateRandomValues() {
        // Generate random health (20 to 60) and gold (1 to 10)
        this.pointsRecovered = Math.floor(Math.random() * (60 - 20 + 1)) + 20;
        this.goldObtained = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      },
      async fetchRandomCard() {
        try {
          const { data, error } = await supabase
            .from("cards")
            .select("*")
            .in("rarity", ["common", "rare"]);
  
          if (error) {
            console.error("Error fetching cards:", error.message);
            return;
          }
  
          if (data.length > 0) {
            const randomCard = data[Math.floor(Math.random() * data.length)];
            this.card = {
              id: randomCard.id,
              img: randomCard.img || "@/assets/default-card.png", // Fallback to default if no image
              name: randomCard.name || "Unknown",
            };
          }
        } catch (error) {
          console.error("Error with fetchRandomCard:", error);
        }
      },
      async proceedAdventure() {
        const audioAdventure = useAudioAdventure();
        audioAdventure.playClick();
        const savedCharacterData = localStorage.getItem("characterData");
        const characterId = localStorage.getItem("character_id");
        const userId = localStorage.getItem("user_id");
  
        if (savedCharacterData) {
          const character = JSON.parse(savedCharacterData);
  
          try {
            // Update the character data in the database
            const { error: updateError } = await supabase
              .from("characters")
              .update({
                mana: character.mana,
                health: this.pointsRecovered,
                gold: this.goldObtained,
              })
              .eq("id", characterId);
  
            if (updateError) {
              console.error("Error updating character:", updateError.message);
            } else {
              console.log("Character updated successfully.");
            }
  
            // Insert the obtained card into the cards_owned table
            const { error: insertError } = await supabase
              .from("cards_owned")
              .insert([
                {
                  user_id: userId,
                  character_id: characterId,
                  card_id: this.card.id,
                },
              ]);
  
            if (insertError) {
              console.error("Error inserting card into cards_owned:", insertError.message);
            } else {
              console.log("Card inserted into cards_owned successfully.");
            }
  
            router.push("/story_base");
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
  