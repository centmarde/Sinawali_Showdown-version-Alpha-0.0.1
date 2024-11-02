<template>
  <health_bar class="hp" />
  <div class="floating-card-container">
    <v-container v-if="showCards">
      <v-row class="d-flex justify-center">
        <v-col
         v-for="(card, index) in onHandCards"
         :key="card.id"
          cols="12"
          lg="2"
          sm="2"
          md="2"
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
          <p>Description: {{ selectedCard?.description }}</p>
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
import { useCardStore2 } from "../../stores/cardsPlayer2Onhand";
import { useStore2 } from "../../stores/cardEffects2";
import { useCharacterStatusStore2 } from "../../stores/characterStatus2";



export default {
  components: {
    Player1,
    Player2,
    player2mirror,
    player1mirror,
  },
  setup() {
    const characterStatusStore2 = useCharacterStatusStore2();

    const showCards = ref(true);
    const cardStore = useCardStore2();
    const { onHandCards, addCard, removeCardAndAddNew } = cardStore;
    
    const selectedCharacter = ref(
      Number(localStorage.getItem("selectedCharacter"))
    );
    const revertedCharacter = computed(() => {
  return selectedCharacter.value === 1 ? 1 : 2;
});
    const dialog = ref(false);
    const messageDialog = ref(false);
    const messageText = ref("");
    const selectedCard = ref(null);
    const cards = ref([]);
    const player2Ref = ref(null);
    const player1Ref = ref(null);
    const player_variant2Ref = ref(null);
    const player_variant1Ref = ref(null);

  

    const fetchRandomCards = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*");

      if (error) {
        console.error("Error fetching cards:", error);
      } else {
        const shuffledCards = data.sort(() => 0.5 - Math.random());
        cards.value = shuffledCards.slice(0, 5);
        
        if (onHandCards.length === 0) {
          onHandCards.push(...cards.value.slice(0, 5));
        }
      }
    };
    
    onMounted(async () => {
      await fetchRandomCards();
    });


     const openDialog = (card) => {
      selectedCard.value = card;
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
    };

    const closeMessageDialog = () => {
      messageDialog.value = false;
    };

    const showMessage = (text) => {
      messageText.value = text;
      messageDialog.value = true;
    };

    const confirmSelection = async () => {
      showCards.value = false;
      const cardIndex = onHandCards.findIndex(
        (card) => card.id === selectedCard.value.id
      );

      if (cardIndex !== -1) {
        const { data, error } = await supabase
          .from("cards")
          .select("id, name, power, mana_cost, type")
          .order("id", { ascending: false })
          .limit(1);

        if (!error) {
          removeCardAndAddNew(cardIndex, data[0]);
        }
      }

      dialog.value = false;

      if (selectedCard.value && selectedCard.value.type === "attack") {
        player2Ref.value?.toggleAttack();
        player_variant2Ref.value?.toggleAttack();

        const { data: dataChar, error: errorChar } = await supabase
          .from("cards")
          .select(
            "is_poison, is_burn, is_def_amp, is_crit_amp, is_agil_amp, is_def_debuff, is_agil_debuff, turn_count, is_stunned"
          )
          .eq("id", selectedCard.value.id); // Assuming selectedCard has an id

        // Handle errors in fetching card details
        if (errorChar) {
          console.error("Error fetching card details:", errorChar);
          return;
        }

        // Process fetched data if available
        if (dataChar && dataChar.length > 0) {
          // Convert the first result row into an array
          const cardEffectsArray = [
          dataChar[0].is_poison,
            dataChar[0].is_burn,
            dataChar[0].is_def_debuff,
            dataChar[0].is_agil_debuff,
            dataChar[0].turn_count,
            dataChar[0].is_stunned,
            dataChar[0].is_def_amp,
            dataChar[0].is_agil_amp,
            dataChar[0].is_crit_amp,
          ];

          // Assuming you want to add these effects to the character status store
          const characterStatusStore2 = useCharacterStatusStore2();
          characterStatusStore2.addEffect({
            is_poison: cardEffectsArray[0],
            is_burn: cardEffectsArray[1],
            is_def_debuff: cardEffectsArray[2],
            is_agil_debuff: cardEffectsArray[3],
            turn_count: cardEffectsArray[4],
            is_stunned: cardEffectsArray[5],
            is_def_amp: cardEffectsArray[6],
            is_agil_amp: cardEffectsArray[7],
            is_crit_amp: cardEffectsArray[8],
          });

        

          // Constant character ID
          const characterId = revertedCharacter.value;




          // Function to process game turn for the character
          async function gameTurn() {
            // Apply effects for the character with ID 2
            await characterStatusStore2.applyEffects(characterId);

            // Log the updated character stats
            const updatedCharacter = await characterStatusStore2.fetchCharacter(
              characterId
            );
            
          }

          // Call gameTurn
          await gameTurn();

    

          // Store the array in Pinia
          const store = useStore2();
          store.setCardEffects(cardEffectsArray);
        }

      

        setTimeout(() => {
          player_variant1Ref.value?.toggleHurt();
          player1Ref.value?.toggleHurt();
        }, 300);
       
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
          showMessage(`Critical Hit! You dealt ${finalDamage} damage!`);
          closeDialog();
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push({ name: "battle_area" });
        } else {
          showMessage(`You dealt ${finalDamage} damage.`);
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

      if (selectedCard.value && selectedCard.value.type === "buff") {
        player_variant2Ref.value?.toggleBuff();
        player2Ref.value?.toggleBuff();

        const { data: dataChar, error: errorChar } = await supabase
          .from("cards")
          .select(
            "is_poison, is_burn, is_def_amp, is_crit_amp, is_agil_amp, is_def_debuff, is_agil_debuff,  turn_count, is_stunned"
          )
          .eq("id", selectedCard.value.id); // Assuming selectedCard has an id

        // Handle errors in fetching card details
        if (errorChar) {
          console.error("Error fetching card details:", errorChar);
          return;
        }

        // Process fetched data if available
        if (dataChar && dataChar.length > 0) {
          // Convert the first result row into an array
          const cardEffectsArray = [
          dataChar[0].is_poison,
            dataChar[0].is_burn,
            dataChar[0].is_def_debuff,
            dataChar[0].is_agil_debuff,
            dataChar[0].turn_count,
            dataChar[0].is_stunned,
            dataChar[0].is_def_amp,
            dataChar[0].is_agil_amp,
            dataChar[0].is_crit_amp,
          ];

          // Assuming you want to add these effects to the character status store
          const characterStatusStore2 = useCharacterStatusStore2();
          characterStatusStore2.addEffect({
            is_poison: cardEffectsArray[0],
            is_burn: cardEffectsArray[1],
            is_def_debuff: cardEffectsArray[2],
            is_agil_debuff: cardEffectsArray[3],
            turn_count: cardEffectsArray[4],
            is_stunned: cardEffectsArray[5],
            is_def_amp: cardEffectsArray[6],
            is_agil_amp: cardEffectsArray[7],
            is_crit_amp: cardEffectsArray[8],
          });

          // Constant character ID
        const characterId = revertedCharacter.value;




          // Function to process game turn for the character
          async function gameTurn() {
            // Apply effects for the character with ID 2
            await characterStatusStore2.applyEffects(characterId);

            // Log the updated character stats
            const updatedCharacter = await characterStatusStore2.fetchCharacter(
              characterId
            );
            
          }

          // Call gameTurn
          await gameTurn();

         
          // Store the array in Pinia
          const store = useStore2();
          store.setCardEffects(cardEffectsArray);
        }
      }

      closeDialog();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push({ name: "battle_area" });
    };

    return {
      showCards,
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
      onHandCards,
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
  background-image: url("../../assets/background/bg.png");
  background-size: cover;
  background-position: bottom;
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
  top: 10%;
  left: 0;
  width: 100vw;
  height: 100vh;
  transform: none;
  transition: all 0.3s ease;
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