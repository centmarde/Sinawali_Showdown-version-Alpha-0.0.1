<template>
  <v-container>
    <!-- Flex container to divide the screen into 2 equal parts -->
    <v-row class="d-flex">
      <!-- Cards Display Section -->
      <v-col cols="12" sm="6">
        <v-container>
          <v-row>
            <v-col v-for="card in cards" :key="card.id" cols="6" sm="6" md="6">
              <v-card
                class="pa-2"
                @click="selectCard(card)"
                :data-card-id="card.id"
                :style="{
                  backgroundImage: 'url(' + card.img + ')',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height:
                    '340px' /* Adjust height to resemble a playing card */,
                  width: '275px' /* Adjust width to resemble a playing card */,
                  borderRadius:
                    '8px' /* Optional: add rounded corners for a card-like look */,
                  position:
                    'relative' /* Ensure the title is positioned relative to the card */,
                }"
              >
                <v-card-title
                  style="
                    color: #151515;
                    position: absolute;
                    font-size: 15px;
                    top: 10;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                  "
                >
                  {{ card.name }}
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <v-col cols="12" sm="6">
  <!-- Floating Deck Area Section -->
  <v-container
    class="d-flex justify-center align-center"
    style="min-height: 200px; border: 2px dashed #1976d2; position: fixed; top: 50%; left: 75%; transform: translate(-50%, -50%); z-index: 10; max-width: 400px; width: 100%;"
  >
    <div class="text-center" v-if="deck.length === 0">
      No cards selected
    </div>
    <v-row v-if="deck.length > 0">
      <v-col
        v-for="(card, index) in deck"
        :key="index"
        cols="6"
        sm="6"
        md="6"
      >
        <v-card class="pa-2">
          <v-img :src="card.image_url" :alt="card.name"></v-img>
          <v-card-title>{{ card.name }}</v-card-title>
          <v-btn icon @click="removeCard(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Floating Back button -->
  <v-btn
      color="secondary"
      @click="goBack"
      style="position: fixed; left: 20px; bottom: 20px; z-index: 20;"
    >
      Back
    </v-btn>
  <!-- Floating Confirmation button -->
  <v-btn
      v-if="deck.length > 0"
      color="primary"
      @click="confirmDeck"
      :disabled="loading || deck.length < 1 || deck.length > 10"
      style="position: fixed; right: 20px; bottom: 20px; z-index: 20;"
    >
      <!-- Display "Loading..." when loading is true, otherwise "Confirm Deck" -->
      <span v-if="loading">Loading...</span>
      <span v-else>Confirm Deck</span>
    </v-btn>
</v-col>

    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase"; // Make sure to set up supabase client
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export default {
  methods: {
    // Method to navigate back to the previous route
    goBack() {
      this.$router.go(-1);  // Navigates back to the previous page
    },
  },
  name: "DeckBuilder",
  setup() {
    const cards = ref([]);
    const deck = ref([]);
    const selectedCards = ref(new Set()); // Track selected cards
    const toast = useToast();
    const router = useRouter(); 
    const loading = ref(false); 

    // Fetch cards from the Supabase `cards` table
    onMounted(async () => {
      const { data, error } = await supabase.from("cards").select("*");
      if (error) {
        console.error("Error fetching cards:", error);
      } else {
        cards.value = data;
      }
    });

    // Handle card selection manually
    const selectCard = (card) => {
   // Create a toast instance

  if (selectedCards.value.has(card.id)) {
    selectedCards.value.delete(card.id); // Deselect if already selected
  } else {
    if (deck.value.length < 7 && !deck.value.includes(card)) {
      deck.value.push(card); // Add card to deck if less than 7 cards
    } else if (deck.value.length >= 7) {
      // Show toast if the deck exceeds 7 cards
      toast.error("You exceeded the maximum of 7 cards in your deck.");
    }
  }
};

    // Remove card from deck
    const removeCard = (index) => {
      deck.value.splice(index, 1);
    };

    // Confirm the deck and insert into `deck_builds` table
    const confirmDeck = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        alert("User is not logged in.");
        return;
      }
      loading.value = true;
      try {
        for (const card of deck.value) {
          const { error } = await supabase.from("deck_builds").insert([
            {
              user_id: userId,
              card_id: card.id,
            },
          ]);

          if (error) {
            console.error("Error inserting deck:", error);
          }
        }

        toast("Deck has been confirmed!");
        router.push("/battle_area_ai");
      } finally {
        loading.value = false; // Set loading to false once done
      }
    };

    return {
      cards,
      deck,
      selectCard,
      removeCard,
      confirmDeck,
      loading,
    };
    
  },
};
</script>

<style scoped>
.card-container {
  max-height: 200px;
  overflow-y: auto;
}
</style>
