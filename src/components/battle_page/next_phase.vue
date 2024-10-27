<template>
    <health_bar class="hp"/>
    <div class="floating-card-container">
      <v-container>
        <v-row class="d-flex justify-center">
          <v-col
            v-for="(card, index) in cards"
            :key="card.id"
            cols="8"
            lg="4"
            sm="4"
            md="5"
            class="text-center"
          >
            <v-card
              class="hoverable-card"
              @click="openDialog(card)"
            >
              <v-card-title>{{ card.name }}</v-card-title>
              <v-card-subtitle>Type: {{ card.type }}</v-card-subtitle>
              <v-card-subtitle>Power: {{ card.power }}</v-card-subtitle>
              <v-card-subtitle>Mana Cost: {{ card.mana_cost }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <v-dialog v-model="dialog" max-width="500" style="z-index: 99999;">
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
              <player1mirror v-if="selectedCharacter === 2" ref="player_variant2Ref" />
              <Player2 v-if="selectedCharacter === 1" ref="player2Ref" />
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </template>
  
  <script>
  import Player1 from '../Characters/Player1.vue';
  import Player2 from '../Characters/Player2.vue';
  import player2mirror from '../Characters/player2mirror.vue';
  import player1mirror from '../Characters/player1mirror.vue';
  import { ref, onMounted } from 'vue';
  import { supabase } from "../../lib/supabase";
  import router from '@/router';
  
  export default {
    components: {
      Player1,
      Player2,
      player2mirror,
      player1mirror,
    },
    setup() {
      const selectedCharacter = ref(Number(localStorage.getItem('selectedCharacter')));
      const dialog = ref(false);
      const selectedCard = ref(null);
      const cards = ref([]);
      const player2Ref = ref(null); 
      const player_variant1Ref = ref(null); 
  
      const fetchRandomCards = async () => {
        const { data, error } = await supabase
          .from('cards')
          .select('id, name, power, mana_cost, type');
  
        if (error) {
          console.error('Error fetching cards:', error);
        } else {
          // Shuffle and select 5 random cards
          const shuffledCards = data.sort(() => 0.5 - Math.random());
          cards.value = shuffledCards.slice(0, 5);
        }
      };
  
      onMounted(() => {
        fetchRandomCards();
      });
  
      const openDialog = (card) => {
        selectedCard.value = card;
        dialog.value = true;
      };
  
      const closeDialog = () => {
        dialog.value = false;
        selectedCard.value = null;
      };
  
      const confirmSelection = async () => {
  // Trigger attack animation only if the selected card is of type "attack"
  if (selectedCard.value && selectedCard.value.type === "attack") {
    // Trigger Player1's attack animation
   
    // Trigger Player2's attack animation
    player2Ref.value?.toggleAnimation();

    // Delay to allow the animation to play before updating health
    await new Promise(resolve => setTimeout(resolve, 500)); // Adjust delay as needed

    // Get current health of the targeted character (e.g., player2)
    const targetCharacterId = selectedCharacter.value === 2 ? 2 : 1;
    const { data, error } = await supabase
      .from('characters')
      .select('health')
      .eq('id', targetCharacterId)
      .single();

    if (error) {
      console.error('Error fetching character health:', error);
      return;
    }

    // Subtract card power from target's health
    const newHealth = Math.max(0, data.health - selectedCard.value.power);

    // Update health in the database
    const { error: updateError } = await supabase
      .from('characters')
      .update({ health: newHealth })
      .eq('id', targetCharacterId);

    if (updateError) {
      console.error('Error updating character health:', updateError);
      return; // Return early on error
    }

   

  closeDialog(); // Close the dialog regardless of card type
  await new Promise(resolve => setTimeout(resolve, 2000));
    router.go(-1); // Navigate back to the previous route
  }
};

  
      return { 
        cards, 
        dialog, 
        selectedCard, 
        openDialog, 
        closeDialog, 
        confirmSelection, 
        selectedCharacter, 
        player2Ref,
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
     background-image: url('https://img.freepik.com/premium-photo/pixel-art-dungeon-background-8-bit-games_334978-2385.jpg?w=826'); 
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
  
  .char1, .char2 {
    margin-top: 5rem;
  }
  
  .floating-card-container {
    position: fixed;
    z-index: 9999;
    top: 35%;
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
  