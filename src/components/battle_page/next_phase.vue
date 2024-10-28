<template>
  <health_bar class="hp" />
  <div class="floating-card-container">
    <v-container>
      <v-row class="d-flex justify-center">
        <v-col
        v-col
          v-for="card in onhandCards"
          :key="card.id" 
         
          cols="8"
          lg="4"
          sm="4"
          md="5"
          class="text-center"
        >
          <v-card class="hoverable-card" @click="openDialog(card)">
            <v-card-title>{{ card.name }}</v-card-title>
            <v-card-subtitle>Type: {{ card.type }}</v-card-subtitle>
            <v-card-subtitle>Power: {{ card.power }}</v-card-subtitle>
            <v-card-subtitle>Mana Cost: {{ card.mana_cost }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" max-width="500" style="z-index: 99999">
      <v-card>
        <v-card-title>{{ selectedCard?.name }}</v-card-title>
        <v-card-subtitle>Type: {{ selectedCard?.type }}</v-card-subtitle>
        <v-card-text>
          <p>Power: {{ selectedCard?.power }}</p>
          <p>Mana Cost: {{ selectedCard?.mana_cost }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text color="primary" @click="confirmSelection">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New dialog for messages -->
    <v-dialog
      v-model="messageDialog"
      max-width="500"
      persistent
      style="z-index: 99999"
    >
      <v-card>
        <v-card-text>
          <p>{{ messageText }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>

  <div class="battleground">
    <div class="bg1">
      <v-row class="fill-height">
        <v-col cols="6">
          <div class="char1">
            <Player1 v-if="selectedCharacter === 1" ref="player1Ref" />
            <player2mirror
              v-if="selectedCharacter === 2"
              ref="player_variant1Ref"
            />
          </div>
        </v-col>
        <v-col cols="6">
          <div class="char2">
           
            <Player2 v-if="selectedCharacter === 1" ref="player2Ref" />
            <player1mirror
              v-if="selectedCharacter === 2"
              ref="player_variant2Ref"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Player1 from "../Characters/Player1.vue";
import Player2 from "../Characters/Player2.vue";
import player2mirror from "../Characters/player2mirror.vue";
import player1mirror from "../Characters/player1mirror.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import router from "@/router";

export default {
  components: {
    Player1,
    Player2,
    player2mirror,
    player1mirror,
  },
  setup() {
    const selectedCharacter = ref(
      Number(localStorage.getItem("selectedCharacter"))
    );
    const onhandCards = ref([]);
    const dialog = ref(false);
    const messageDialog = ref(false); // Dialog for messages
    const messageText = ref(""); // Text to display in message dialog
    const selectedCard = ref(null);
    const cards = ref([]);
    const player2Ref = ref(null);
    const player1Ref = ref(null);
    const player_variant2Ref = ref(null);
    const player_variant1Ref = ref(null);
  

    const fetchRandomCards = async () => {
  const { data, error } = await supabase
    .from("cards")
    .select("id");

  if (error) {
    console.error("Error fetching cards:", error);
    return [];
  }

  // Shuffle the array and limit to 5
  const shuffledCards = data.sort(() => 0.5 - Math.random()).slice(0, 5);
  return shuffledCards.map(card => card.id);
};



    // Function to insert cards into onhand_cards
    const insertCardsToOnHand = async (cardIds) => {
      const { error } = await supabase
        .from("onhand_cards")
        .insert(cardIds.map(cardId => ({ card_id: cardId, character_id: 1 })))
        .select();
      
      if (error) {
        console.error("Error inserting cards to onhand:", error);
      }
    };

    const fetchOnHandCards = async () => {
  const { data, error } = await supabase
    .from("onhand_cards")
    .select("*");

  if (error) {
    console.error("Error fetching onhand cards:", error);
    return;
  }

  const cardIds = data.map(card => card.card_id);
  fetchCardDetails(cardIds); // Fetch card details using the IDs
};

const fetchCardDetails = async (cardIds) => {
  const { data, error } = await supabase
    .from("cards")
    .select("id, name, type, power, mana_cost")
    .in("id", cardIds);

  if (error) {
    console.error("Error fetching card details:", error);
    return;
  }

  // Merge the card details with onhand cards
  onhandCards.value = data.map(card => ({
    id: card.id,
    name: card.name,
    type: card.type,
    power: card.power,
    mana_cost: card.mana_cost,
    // Additional properties as necessary
  }));
};




    const manageCards = async () => {
      const { count, error } = await supabase
        .from("onhand_cards")
        .select("id", { count: "exact" });

      if (error) {
        console.error("Error counting onhand cards:", error);
        return;
        
      }else{
        console.log("counting");
       
      }

      // If there are less than 5 cards in onhand_cards, fetch and insert
      if (count < 5) {
        const existingCardIds = onhandCards.value.map(card => card.card_id);
        const randomCardIds = await fetchRandomCards();
        const newCardIds = randomCardIds.filter(cardId => !existingCardIds.includes(cardId));

        // Limit to 5 cards in total, ensuring no duplicates
        const cardsToInsert = newCardIds.slice(0, 5 - existingCardIds.length);

        if (cardsToInsert.length > 0) {
          await insertCardsToOnHand(cardsToInsert);
        }
      }

      // Fetch the updated onhand cards
      await fetchOnHandCards();
    };
    
    const selectCard = async (selectedCardId) => {
      const { error } = await supabase
        .from("onhand_cards")
        .delete()
        .eq("card_id", selectedCardId);

      if (error) {
        console.error("Error removing selected card:", error);
        return;
      }else{
        console.log("succes deleting choosen card");
      }

      // Fetch new random card and insert it
      const randomCardIds = await fetchRandomCards();
      const existingCardIds = onhandCards.value.map(card => card.card_id);
      const newCardIds = randomCardIds.filter(cardId => !existingCardIds.includes(cardId));

      // Insert a new card if there's space
      if (newCardIds.length > 0) {
        await insertCardsToOnHand(newCardIds.slice(0, 1)); // Insert only one new card
      }

      // Fetch the updated onhand cards
      await fetchOnHandCards();
    };

    onMounted(() => {
      manageCards();
    });

    const openDialog = (card) => {
      selectedCard.value = card;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
      // selectedCard.value = null;
    };

    const closeMessageDialog = () => {
      messageDialog.value = false;
    };

    const showMessage = (text) => {
      messageText.value = text;
      messageDialog.value = true;
    };

    const confirmSelection = async () => {
      if (selectedCard.value && selectedCard.value.type === "attack") {
        player2Ref.value?.toggleAttack();
        
        setTimeout(() => {
          player_variant1Ref.value?.toggleHurt();
          player1Ref.value?.toggleHurt();
    }, 300);
        await selectCard(selectedCard.value.id);
        player_variant2Ref.value?.toggleAttack();
        closeDialog();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const targetCharacterId = selectedCharacter.value === 2 ? 2 : 1;
        const { data, error } = await supabase
          .from("characters")
          .select("health, defense, agility, critical_rate")
          .eq("id", targetCharacterId)
          .single();

        if (error) {
          console.error("Error fetching character stats:", error);
          return;
        }
        console.log(selectedCard);
       

        const { health, defense, agility, critical_rate } = data;
        const missChance = Math.random() * 100;
        if (missChance < agility) {
          showMessage("Attack missed due to agility!");
          closeDialog();
          await new Promise((resolve) => setTimeout(resolve, 1500));
         
          router.push({ name: "battle_area" });
          return;
        }

        const defensePercentage = defense / 100;
        const damageAfterDefense = Math.max(
          0,
          Math.floor(selectedCard.value.power * (1 - defensePercentage))
        );

        const isCriticalHit = Math.random() * 100 < critical_rate;
        const finalDamage = isCriticalHit
          ? damageAfterDefense * 2
          : damageAfterDefense;

        if (isCriticalHit) {
          showMessage(`
           Critical Hit! You dealt ${finalDamage} damage!`);
          closeDialog();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push({ name: "battle_area" });
        } else {
          showMessage(`
          You dealt ${finalDamage} damage.`);
          closeDialog();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push({ name: "battle_area" });
        }

        const newHealth = Math.max(0, health - finalDamage);
        const { error: updateError } = await supabase
          .from("characters")
          .update({ health: newHealth })
          .eq("id", targetCharacterId);

        if (updateError) {
          console.error("Error updating character health:", updateError);
        }
      }

      if(selectedCard.value && selectedCard.value.type === "buff"){
        player_variant2Ref.value?.toggleBuff(); 
        player2Ref.value?.toggleBuff(); 

        await selectCard(selectedCard.value.id);
      }

      closeDialog();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({ name: "battle_area" });
    };

    return {
      onhandCards,
      selectCard,
      cards,
      dialog,
      selectedCard,
      openDialog,
      closeDialog,
      player1Ref,
      confirmSelection,
      selectedCharacter,
      player2Ref,
      player_variant2Ref,
      messageDialog,
      messageText,
      player1Ref,
      showMessage,
      closeMessageDialog,
      player_variant1Ref,
    };
  },
};
</script>

<style lang="scss" scoped>
.battleground {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-image: url("https://img.freepik.com/premium-photo/pixel-art-dungeon-background-8-bit-games_334978-2385.jpg?w=826");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg1 {
  position: relative;
  z-index: 2;
  color: white;
}

.fill-height {
  height: 100%;
}

.char1,
.char2 {
  margin-top: 5rem;
}

.floating-card-container {
  position: fixed;
  z-index: 99;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  width: auto;
}

.v-card {
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.hoverable-card:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.v-col {
  display: flex;
  justify-content: center;
}

@media (max-width: 600px) {
  .floating-card-container {
    top: 50%;
  }
}

.hp {
  position: fixed;
  top: 30px;
  z-index: 99;
}
</style>
