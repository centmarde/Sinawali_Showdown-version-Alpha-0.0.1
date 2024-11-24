<template>
  <div class="display">
    <v-container>
      <v-row class="d-flex">
        <!-- Cards Display Section -->
        <v-col cols="8" class="position-relative">
          <!-- Previous Arrow Button -->
          <v-btn
            v-if="currentPage > 1"
            icon
            class="arrow-button left-arrow"
            @click="prevPage"
          >
            <v-icon>mdi-menu-left</v-icon>
          </v-btn>

          <v-container class="cards-display">
            <v-row>
              <v-col v-for="card in paginatedCards" :key="card.id" cols="3">
                <v-card
                  class="pa-2 cards"
                  @click="selectCard(card)"
                  :data-card-id="card.id"
                  :style="cardDisplay(card.img)"
                  variant="text"
                >
                  <v-card-title class="card-title">
                    {{ card.name }}
                  </v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <!-- Next Arrow Button -->
          <v-btn
            v-if="currentPage < totalPages"
            icon
            class="arrow-button right-arrow"
            @click="nextPage"
          >
            <v-icon>mdi-menu-right</v-icon>
          </v-btn>
        </v-col>

        <!-- Selected Deck Cards Section -->
        <v-col cols="4">
          <v-card class="sc-container" elevation="10">
            <v-card-title class="text-center m-0 p-0">Deck Build</v-card-title>
            <div class="text-center text-caption pb-3 text-white-50">
              {{ selectedCount }}/7 selected cards
            </div>

            <v-card
              v-for="(card, index) in deck"
              :key="index"
              class="sc-item pa-3"
            >
              <v-img :src="card.img" :alt="card.name" cover>
                <div class="color-overlay"></div>
              </v-img>

              <div class="sc-icon">
                <v-avatar
                  class="bg-white"
                  variant="elevated"
                  image="./../assets/icon/sticks.png"
                  size="60"
                ></v-avatar>
              </div>

              <div class="sc-info">
                <div class="font-weight-bold text-uppercase c-name">
                  {{ card.name }}
                </div>
                <div class="text-capitalize font-italic c-rarity">
                  {{ card.rarity }}
                </div>
              </div>

              <div class="btn-container">
                <!-- View Button -->
                <v-btn icon @click="openDialog(card)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <!-- Remove Button -->
                <v-btn icon small @click="removeCard(index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </v-card>

            <v-btn
              color="secondary"
              @click="goBack"
              style="position: fixed; left: 20px; bottom: 20px; z-index: 20"
            >
              Back
            </v-btn>
            <!-- Floating Confirmation button -->
            <v-btn
              v-if="deck.length > 0"
              color="primary"
              @click="confirmDeck"
              :disabled="loading || deck.length < 1 || deck.length > 10"
              style="position: fixed; right: 20px; bottom: 20px; z-index: 20"
            >
              <!-- Display "Loading..." when loading is true, otherwise "Confirm Deck" -->
              <span v-if="loading">Loading...</span>
              <span v-else>Confirm Deck</span>
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog for Viewing Card -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-img :src="selectedCard.img" :alt="selectedCard.name" cover></v-img>
        <v-card-title>{{ selectedCard.name }}</v-card-title>
        <v-card-text>{{ selectedCard.description }}</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase"; // Make sure to set up supabase client
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const cards = ref([]);
const deck = ref([]);
const toast = useToast();
const router = useRouter();
const loading = ref(false);

// Pagination state
const currentPage = ref(1);
const cardsPerPage = 8;

// Dialog state
const dialog = ref(false);
const selectedCard = ref({});

// Fetch cards from the Supabase `cards` table
onMounted(async () => {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .neq("id", 91); // Fetch data without randomizing in the query

  if (error) {
    console.error("Error fetching cards:", error);
  } else if (data) {
    // Shuffle the data using Fisher-Yates Shuffle
    cards.value = shuffleArray(data);
  }
});

// Fisher-Yates Shuffle Function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Handle card selection manually
const selectCard = (card) => {
  if (deck.value.length < 7 && !deck.value.includes(card)) {
    deck.value.push(card); // Add card to deck if less than 7 cards
  } else if (deck.value.length >= 7) {
    // Show toast if the deck exceeds 7 cards
    toast.error("You exceeded the maximum of 7 cards in your deck.");
  }
};

// Remove card from deck
const removeCard = (index) => {
  deck.value.splice(index, 1);
};

// Open dialog to view card details
const openDialog = (card) => {
  selectedCard.value = card;
  dialog.value = true;
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

const cardDisplay = (img) => ({
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "210px",
  width: "170px",
  borderRadius: "8px",
  position: "relative",
});

// Computed property to get the number of selected cards
const selectedCount = computed(() => deck.value.length);

// Pagination logic
const totalPages = computed(() => Math.ceil(cards.value.length / cardsPerPage));

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  return cards.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goBack = () => {
  router.go(-1); // Navigates back to the previous page
};
</script>

<style scoped>
.display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Temporary BG */
  background-image: url("./../assets/background/bg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.cards-display {
  max-height: 90vh; /* Adjust the height as needed */
  overflow-y: auto;
}

.card-title {
  color: #151515;
  position: absolute;
  font-size: 15px;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}

.left-arrow {
  left: -30px; /* Adjust as needed */
}

.right-arrow {
  right: -30px; /* Adjust as needed */
}

.sc-container {
  position: absolute;
  right: 0;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  width: 420px;
  padding: 10px;
  background-color: #151515;
}

.sc-item {
  margin-bottom: 10px;
  height: 100px;
  position: relative;
}

.color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 1) 20%,
    rgba(0, 0, 0, 0.742734593837535) 60%,
    rgba(0, 0, 0, 0.4906337535014006) 80%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}

.btn-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  position: absolute;
  bottom: 25px;
  right: 10px;
  z-index: 3;
  opacity: 0;
  transition: opacity 0.3s;
}

.sc-info {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 30px;
  left: 90px;
  z-index: 2;
}

.sc-icon {
  display: flex;
  position: absolute;
  bottom: 20px;
  left: 18px;
  z-index: 2;
}

.sc-item:hover .btn-container,
.sc-item:focus .btn-container {
  opacity: 1;
}

.sc-item:hover v-img,
.sc-item:focus v-img,
.sc-item:hover .sc-icon,
.sc-item:focus .sc-icon,
.sc-item:hover .sc-info,
.sc-item:focus .sc-info {
  filter: blur(2px);
}

.c-name {
  font-size: 14px;
}

.c-rarity {
  font-size: 12px;
}
</style>
