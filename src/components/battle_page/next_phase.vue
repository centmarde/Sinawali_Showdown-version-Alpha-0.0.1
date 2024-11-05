<template>
  <health_bar class="hp" />
  <div class="floating-card-container">
    <v-container v-if="showCards">
      <v-row class="d-flex justify-center">
        <div class="container" id="container">
          <div v-for="(card, index) in onHandCards" :key="card.id" class="card" tabindex="0"
            :style="`--i: ${index - Math.floor(onHandCards.length / 2)}; background-image: url(${card.img}); background-size: cover; background-position: center;`"
            @click="openDialog(card)">
            <div style="position: absolute; top: 9px;">{{ card.name }}</div>

            <div class="power">{{ card.power }}</div>
            <div class="mana">{{ card.mana_cost }}</div>
          </div>
        </div>
      </v-row>


      <!-- Separate section for the card with id = 91 -->
      <v-row class="d-flex justify-center" v-if="card91">
        <v-col cols="8" lg="4" sm="4" md="5" class="text-center skip ">
          <div @click="openDialog(card91)" style="cursor: pointer;">

            <img src="../../assets/images/charge.png" style="width: 50px;"></img>
            <span class="bar">charge mana</span>

          </div>
        </v-col>
        <v-col cols="8" lg="4" sm="4" md="5" class="text-center bag">
          <div @click="openDialog(card91)" style="cursor: pointer;">

            <img src="../../assets/images/bag.png" style="width: 50px;"></img>
            <span class="bar">Iventory</span>

          </div>
        </v-col>

      </v-row>
    </v-container>
    <v-dialog v-model="messageDialog" max-width="500" persistent style="z-index: 99999">
      <v-card>
        <v-card-text>
          <p>{{ messageText }}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500" style="z-index: 99999">
      <v-card
        :style="{ backgroundImage: `url(${selectedCard?.modal_bg})`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff' }">
        <v-card-title>{{ selectedCard?.name }}</v-card-title>
        <v-card-subtitle>Type: {{ selectedCard?.type }}</v-card-subtitle>
        <v-card-text>
          <p>Power: {{ selectedCard?.power }}</p>
          <p>Description: {{ selectedCard?.description }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn text color="primary" @click="confirmSelection">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>

  <div class="battleground">
    <div class="bg1">
      <v-row class="fill-height">
        <v-col cols="6">
          <div class="char1">
            <Player1 v-if="selectedCharacter === 1" ref="player1Ref" />
            <player2mirror v-if="selectedCharacter === 2" ref="player_variant1Ref" />
          </div>
        </v-col>
        <v-col cols="6">
          <div class="char2">

            <Player2 v-if="selectedCharacter === 1" ref="player2Ref" />
            <player1mirror v-if="selectedCharacter === 2" ref="player_variant2Ref" />
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
import { useAudioStore } from '@/stores/audioStore';
import { useToast } from "vue-toastification";




export default {
  components: {
    Player1,
    Player2,
    player2mirror,
    player1mirror,
  },
  setup() {
    const characterStatusStore2 = useCharacterStatusStore2();
    const toast = useToast();

    const showCards = ref(true);
    const cardStore = useCardStore2();
    const { onHandCards, addCard, removeCardAndAddNew } = cardStore;
    const audioStore = useAudioStore();
    const selectedCharacter = ref(
      Number(localStorage.getItem("selectedCharacter"))
    );
    const revertedCharacter = computed(() => {
      return selectedCharacter.value === 2 ? 1 : 2;
    });

    /* console.log(selectedCharacter.value);
    console.log(revertedCharacter.value); */
    const dialog = ref(false);
    const messageDialog = ref(false);
    const messageText = ref("");
    const selectedCard = ref(null);
    const cards = ref([]);
    const card91 = ref(null);
    const player2Ref = ref(null);
    const player1Ref = ref(null);
    const player_variant2Ref = ref(null);
    const player_variant1Ref = ref(null);

    onMounted(() => {
      audioStore.playAudio();
    });

    const fetchRandomCards = async () => {


      const { data, error } = await supabase.from("cards").select("*");

      if (error) {
        console.error("Error fetching cards:", error);
      } else {
        // Filter out the card with ID 91
        const filteredCards = data.filter((card) => card.id !== 91);

        // Create a pool of cards based on their draw_chance
        const weightedCards = [];
        filteredCards.forEach((card) => {
          const drawCount = Math.floor(card.draw_chance / 10); // Adjust based on scale (e.g., 80 means 8 instances)
          for (let i = 0; i < drawCount; i++) {
            weightedCards.push(card);
          }
        });

        // Shuffle the weighted cards and select 5
        const shuffledCards = weightedCards.sort(() => 0.5 - Math.random());
        cards.value = shuffledCards.slice(0, 5);

        // Populate onHandCards if empty
        if (onHandCards.length === 0) {
          onHandCards.push(...cards.value.slice(0, 5));
        }
      }
    };

    const fetchCard91 = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("id", 91)
        .single(); // Use single to fetch only one card

      if (error) {
        console.error("Error fetching card 91:", error);
      } else {
        card91.value = data; // Set card91 with the fetched card data
      }
    };

    const filteredOnHandCards = computed(() => {
      return onHandCards.filter((card) => card.id !== 91);
    });

    onMounted(async () => {
      await fetchRandomCards();
      await fetchCard91(); // Fetch card 91 separately
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
        try {
          // Fetch the character's mana
          const { data: EnergyChar, error: errorEnergy } = await supabase
            .from("characters")
            .select("mana")
            .eq("id", selectedCharacter.value)
            .single();

          if (errorEnergy) {
            console.error("Error fetching character mana details:", errorEnergy);
            return;
          }

          // Check if character's mana is sufficient
          const currentMana = EnergyChar.mana;
          if (currentMana <= 0) {
            toast(`You're out of energy!`, {
              type: 'error',
              position: 'top-right',
              timeout: 3000,
              closeOnClick: true,
            });

            toast(`You've missed your chance to make a move!`, {
              type: 'warning',
              position: 'top-right',
              timeout: 3000,
              closeOnClick: true,
            });

            setTimeout(() => {
              router.push({ name: "battle_area" });
            }, 1000); // 1000 milliseconds = 1 second
            return;
          }

          // Check if the character has enough mana for the selected card
          if (selectedCard.value.mana_cost > currentMana) {
            toast(`Not enough mana!`, {
              type: 'error',
              position: 'top-right',
              timeout: 3000,
              closeOnClick: true,
            });

            toast(`You've missed your chance to make a move!`, {
              type: 'warning',
              position: 'top-right',
              timeout: 3000,
              closeOnClick: true,
            });

            setTimeout(() => {
              router.push({ name: "battle_area" });
            }, 1000); // 1000 milliseconds = 1 second
            return;
          }
          player2Ref.value?.toggleAttack();
          player_variant2Ref.value?.toggleAttack();
          setTimeout(() => {
            audioStore.playPunch();
          }, 1000);

          const { data: EnergyMinus, error: errorEnergyMinus } = await supabase
            .from("characters")
            .update({ mana: currentMana - selectedCard.value.mana_cost })
            .eq("id", revertedCharacter.value);

          if (errorEnergyMinus) {
            console.error("Error updating character mana:", errorEnergyMinus);
          } else {
            console.log("Mana deducted");
          }
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


        } catch (error) {
          console.error("Unexpected error:", error);
        }
        if (selectedCard.value.is_burn > 0) {
          showMessage("Burn effect triggered");
          setTimeout(() => {
            player_variant1Ref.value?.toggleHurtInjured();
            player1Ref.value?.toggleHurtInjured();
          }, 300);
        } else if (selectedCard.value.is_poison > 0) {
          showMessage("Poison effect triggered"); // Changed alert message for clarity
          setTimeout(() => {
            player_variant1Ref.value?.toggleHurtSkinDamage();
            player1Ref.value?.toggleHurtSkinDamage();
          }, 300);
        } else {
          player_variant1Ref.value?.toggleHurt();
          player1Ref.value?.toggleHurt();
        }
        /*  setTimeout(() => {
           player_variant1Ref.value?.toggleHurt();
           player1Ref.value?.toggleHurt();
         }, 300); */

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
        } else {

          showMessage(`You dealt ${finalDamage} damage.`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
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
        const { data: EnergyChar, error: errorEnergy } = await supabase
          .from("characters")
          .select("mana")
          .eq("id", selectedCharacter.value)
          .single();

          console.log(selectedCharacter.value);
          console.log(revertedCharacter.value);
        if (errorEnergy) {
          console.error("Error fetching character mana details:", errorEnergy);
          return;
        }

        if (card91.value && card91.value.is_mana) {

          // Calculate the new mana value
          const newMana = EnergyChar.mana + card91.value.is_mana;

          // Update the character's mana in the database
          const { data: updateData, error: updateError } = await supabase
            .from("characters")
            .update({ mana: newMana })
            .eq("id", revertedCharacter.value);

          if (updateError) {
            console.error("Error updating character mana:", updateError);
            return;
          }

        }

        // Check if character's mana is sufficient
        const currentMana = EnergyChar.mana;
        if (currentMana <= 0) {
          toast(`You're out of energy!`, {
            type: 'error',
            position: 'top-left',
            timeout: 3000,
            closeOnClick: true,
          });

          toast(`You've missed your chance to make a move!`, {
            type: 'warning',
            position: 'top-left',
            timeout: 3000,
            closeOnClick: true,
          });

          setTimeout(() => {
            router.push({ name: "battle_area" });
          }, 1000); // 1000 milliseconds = 1 second
          return;
        }

        // Check if the character has enough mana for the selected card
        if (selectedCard.value.mana_cost > currentMana) {
          toast(`Not enough Energy!`, {
            type: 'error',
            position: 'top-left',
            timeout: 3000,
            closeOnClick: true,
          });

          toast(`You've missed your chance to make a move!`, {
            type: 'warning',
            position: 'top-left',
            timeout: 3000,
            closeOnClick: true,
          });

          setTimeout(() => {
            router.push({ name: "next_phase" });
          }, 1000); // 1000 milliseconds = 1 second
          return;
        }
        player_variant2Ref.value?.toggleBuff();
        player2Ref.value?.toggleBuff();


        // Check if the mana cost is greater than 0 before proceeding
        if (selectedCard.value.mana_cost > 0) {
          const { data: EnergyMinus, error: errorEnergyMinus } = await supabase
            .from("characters")
            .update({ mana: currentMana - selectedCard.value.mana_cost })
            .eq("id", revertedCharacter.value);

          if (errorEnergyMinus) {
            console.error("Error updating character mana:", errorEnergyMinus);
          }
        }



        const { data: dataChar, error: errorChar } = await supabase
          .from("cards")
          .select(
            "*"
          )
          .eq("id", selectedCard.value.id); // Assuming selectedCard has an id

        // Handle errors in fetching card details
        if (errorChar) {
          console.error("Error fetching card details:", errorChar);
          return;
        }
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
      await new Promise((resolve) => setTimeout(resolve, 200));
      router.push({ name: "battle_area" });
    };

    return {
      card91,
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
      activeCard: null,
      filteredOnHandCards,
      audioStore,
    };
  }, methods: {
    setActiveCard(index) {
      this.activeCard = index;
    },
    resetCards() {
      this.activeCard = null;
    },
  }
};
</script>


<style lang="scss" scoped>
.battleground {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-image: url("../../assets/background/bg.gif");
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
}

.bg1 {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-image: url("../../assets/background/sr.gif");
  background-size: cover;
  background-position: bottom;
  background-repeat: no-repeat;
  z-index: 9;
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

.skip {
  top: 18.3rem;
  position: fixed;
  left: 35rem;
}

.bag {
  top: 18.3rem;
  position: fixed;
  left: 39rem;
}

.bar {
  position: absolute;
  left: 1rem;
  font-size: 10px;

}

@media (max-width: 600px) {
  .skip {
    top: -15.5rem;
    position: fixed;
    left: 7.2rem;
  }

  .bag {
    top: -19rem;
    position: fixed;
    left: 7.2rem;
  }

  .bar {
    display: none;
  }
}

//for cards CSS

.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
}

.container .card {
  position: absolute;
  top: 14.5rem;
  width: 180px;
  height: 200px;
  border-radius: 8px;
  background: #e6d011;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #EEEEEE;
  border: 5px solid #D9A959;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  transform: rotate(calc(var(--i) * 3deg)) translate(calc(var(--i) * 150px), -50px);
}

@media (max-width: 600px) {
  .container {
    height: 25%;
    /* Adjust the height of the container */
  }

  .container .card {
    width: 120px;
    /* Reduce width of cards */
    height: 150px;
    /* Reduce height of cards */
    top: 15rem;
    /* Adjust position for smaller screens */
    font-size: 0.8em;
    /* Optional: reduce font size for smaller cards */
    transform: rotate(calc(var(--i) * 3deg)) translate(calc(var(--i) * 50px), -50px);
  }

  .container .card:hover {
    transform: rotate(calc(var(--i) * 3deg)) translate(calc(var(--i) * 50px), -100px);
    /* Elevate the card */
    z-index: 1;
  }
}

.card.inactive {
  background-color: #333;
}

.card.inactive:hover {
  background-color: #444;
}

.card.active {
  transform: scale(1.5);
  background: #5e5cfc;
  z-index: 1;
}


// .container:hover .card {
//     color: #EEEEEE;
//     box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
// }

/* Adjust individual cards to lift up further on hover */
.container .card:hover {
  transform: rotate(calc(var(--i) * 3deg)) translate(calc(var(--i) * 150px), -80px);
}

.power {
  position: absolute;
  bottom: 30px;
  left: 16px;
}

.mana {
  position: absolute;
  bottom: 30px;
  right: 21px;
}

@media (max-width: 600px) {
  .power {
    bottom: 16px;
    left: 4px;
  }

  .mana {
    bottom: 16px;
    right: 8px;
  }

}
</style>
