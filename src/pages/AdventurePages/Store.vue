<template>
    <v-container fluid class="background-container">
      <v-row class="mx-1 scrollable-content">
        <v-col cols="7">
          <h1 class="store-title">Store</h1>
          <span @click="goBack" class="storeBack">
            <v-icon>mdi-arrow-left</v-icon>go back
          </span>
        </v-col>
  
        <v-col cols="5">
          <v-row>
            <!-- Cards for Sale -->
            <v-col
              v-for="(card, index) in cardsForSale"
              :key="index"
              cols="12"
              class="my-4"
            >
              <div class="cards" :style="{ backgroundImage: `url(${card.img})` }">
                <div>
                  <h3 class="card-title">{{ card.name }}</h3>
                  <p class="card-price">Price: ${{ card.price }}</p>
                  <v-btn class="me-3" @click="openCardDescription(card)">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn color="primary" @click="purchaseCard(card)">
                    Buy Now
                  </v-btn>
                </div>
              </div>
            </v-col>
  
            <!-- Potions for Sale -->
            <v-col
              class="text-center mb-4"
              v-for="(potion, index) in potions"
              :key="index"
              cols="3"
            >
              <v-img src="../../assets/adventure/potion.png"></v-img>
              <v-card-subtitle class="text-center">
                Value: {{ potion.value }} Energy
              </v-card-subtitle>
              <v-card-subtitle class="text-center card-price">
                Price: ${{ potion.price }}
              </v-card-subtitle>
              <v-btn color="secondary" @click="purchasePotion(potion)">
                Buy Potion
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
  
      <!-- Card Description Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>{{ selectedCard.name }}</v-card-title>
          <v-card-text>{{ selectedCard.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  
  <script>
import { supabase } from "@/lib/supabase";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAudioAdventure } from "@/stores/adventureAudio";
import { useToast } from "vue-toastification"; // Import toast dependency

export default {
  setup() {
    const audioAdventure = useAudioAdventure();
    const cardsForSale = ref([]);
    const potions = ref([]);
    const dialog = ref(false);
    const selectedCard = ref({});
    const router = useRouter();
    const toast = useToast();

    const fetchCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .neq("id", 91)
        .in("rarity", ["common", "rare"]);

      if (error) {
        console.error("Error fetching cards:", error);
        return;
      }

      const shuffledCards = shuffleArray(data);
      const randomCards = shuffledCards.slice(0, 5);

      cardsForSale.value = randomCards.map((card) => ({
        ...card,
        price: card.rarity === "common" ? getRandomPrice(15, 40) : getRandomPrice(30, 60),
      }));

      fetchPotions();
      saveDataToLocalStorage();
    };

    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const getRandomPrice = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomValue = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const fetchPotions = () => {
      potions.value = Array.from({ length: 4 }).map(() => ({
        value: getRandomValue(20, 60),
        price: getRandomPrice(5, 45),
      }));
    };

    const saveDataToLocalStorage = () => {
      const dataToStore = {
        cardsForSale: cardsForSale.value,
        potions: potions.value,
        timestamp: Date.now(),
      };
      localStorage.setItem("shopData", JSON.stringify(dataToStore));
    };

    const loadDataFromLocalStorage = () => {
      const savedData = localStorage.getItem("shopData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const currentTime = Date.now();

        // Only use the saved data if it is not older than 30 seconds
        if (currentTime - parsedData.timestamp < 30000) {
          cardsForSale.value = parsedData.cardsForSale;
          potions.value = parsedData.potions;
        } else {
          fetchCards(); // Data is stale, fetch new data
        }
      } else {
        fetchCards(); // No saved data, fetch new data
      }
    };

    const startAutoRefresh = () => {
      setInterval(() => {
        fetchCards();
      }, 3600000); // Refresh every 1 hour
    };

    const openCardDescription = (card) => {
      selectedCard.value = card;
      dialog.value = true;
    };

    const purchasePotion = async (potion) => {
      audioAdventure.playClick();
      const userId = localStorage.getItem("user_id");
      const characterId = localStorage.getItem("character_id");

      if (!userId || !characterId) {
        toast.error("User or character data is missing.");
        return;
      }

      const { data: character, error } = await supabase
        .from("characters")
        .select("health, gold")
        .eq("id", characterId)
        .single();

      if (error || !character) {
        toast.error("Failed to retrieve character data.");
        return;
      }

      if (character.gold < potion.price) {
        toast.error("Not enough gold to purchase this potion.");
        return;
      }

      const updatedHealth = character.health + potion.value;
      const updatedGold = character.gold - potion.price;

      const { error: updateError } = await supabase
        .from("characters")
        .update({ health: updatedHealth, gold: updatedGold })
        .eq("id", characterId);

      if (updateError) {
        toast.error("Failed to update character data.");
        return;
      }

      toast.success(`Potion purchased! Health increased by ${potion.value}.`);
    };

    const purchaseCard = async (card) => {
        audioAdventure.playClick();
      const userId = localStorage.getItem("user_id");
      const characterId = localStorage.getItem("character_id");

      if (!userId || !characterId) {
        toast.error("User or character data is missing.");
        return;
      }

      const { data: character, error } = await supabase
        .from("characters")
        .select("gold")
        .eq("id", characterId)
        .single();

      if (error || !character) {
        toast.error("Failed to retrieve character data.");
        return;
      }

      if (character.gold < card.price) {
        toast.error("Not enough gold to purchase this card.");
        return;
      }

      const updatedGold = character.gold - card.price;

      const { error: goldUpdateError } = await supabase
        .from("characters")
        .update({ gold: updatedGold })
        .eq("id", characterId);

      if (goldUpdateError) {
        toast.error("Failed to update character's gold.");
        return;
      }

      const { error: cardInsertError } = await supabase
        .from("cards_owned")
        .insert({
          user_id: userId,
          character_id: characterId,
          card_id: card.id,
        });

      if (cardInsertError) {
        toast.error("Failed to purchase card.");
        return;
      }

      toast.success(`${card.name} purchased successfully!`);
    };

    const goBack = () => {
      audioAdventure.playClick();
      router.push("/story_base");
    };

    onMounted(() => {
      loadDataFromLocalStorage();
      startAutoRefresh();
      audioAdventure.playAdBg();
      audioAdventure.playVillage();
    });

    return {
      cardsForSale,
      potions,
      dialog,
      selectedCard,
      openCardDescription,
      purchasePotion,
      purchaseCard,
      goBack,
    };
  },
};
</script>

  
  <style scoped lang="scss">
  .background-container {
  position: relative; /* Establishes the container as a positioning context */
  width: 100%;
  height: 100vh; /* Full viewport height */
  background-image: url('../../assets/adventure/market.png');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
}
.scrollable-content {
  position: absolute; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto; 
  padding: 20px; 
  z-index: 1; 
}
  
  .cards {
    background-size: fill;
    background-position: center 30%;
    padding: 10px;
    border-radius: 4px;
  }
  
  .card-title {
    font-size: 18px;
    font-weight: bold;
  }
  
  .card-price {
    font-family: "Merienda", cursive;
    font-size: 1rem;
  }
  
  .card-description {
    font-size: 12px;
  }
  
  .v-btn {
    margin-top: 10px;
    border-radius: 4px;
  }
  
  .v-col {
    padding: 0;
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
  .store-title {
  position: fixed; 
  top: 20px; 
  left: 6%;
  transform: translateX(-50%); 
  font-family: "Merienda", cursive;
  font-weight: 100;
  font-style: normal;
  font-size: 3rem;
  color: #ffffff;
  text-align: center;
  z-index: 1000; 
}
.storeBack {
  position: fixed; 
  cursor: pointer;
  top: 5rem; 
  left: 4.5%;
  transform: translateX(-50%); 
  font-family: "Merienda", cursive;
  font-weight: 100;
  font-style: normal;
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
  z-index: 1000; 
}

  </style>
