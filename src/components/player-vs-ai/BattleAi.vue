<template>
  <health_bar class="hp" />
  <div class="floating-card-container">
    <v-container v-if="showCards">
      <v-row class="d-flex justify-center">
        <FloatingCards :cards="onHandCards" :openDialog="openDialog" />
</v-row>
      <!-- Separate section for the card with id = 91 -->
      <v-row class="d-flex justify-center" v-if="card91">
        <v-col cols="8" lg="4" sm="4" md="5" class="text-center skip ">
          <div @click="openDialog(card91)" style="cursor: pointer;">

            <img src="../../assets/images/charge.png" style="width: 80px;"></img>
            <span class="bar">charge Energy</span>

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

    <v-dialog v-model="dialog" max-width="500" style="z-index: 99999">
  <v-card :style="{ color: '#fff', position: 'relative', overflow: 'hidden' }">
    <!-- Indicators for Burn and Poison -->
    <div v-if="selectedCard" :style="{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }">
      <v-icon v-if="selectedCard.is_burn" color="red" :style="{ marginRight: '8px' }">mdi-fire</v-icon>
      <v-icon v-if="selectedCard.is_poison" color="green">mdi-skull-crossbones</v-icon>
    </div>

    <!-- Video Background -->
    <div v-if="selectedCard?.video_modal" :style="{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1
    }">
      <video autoplay loop muted playsinline :src="selectedCard.video_modal"
        :style="{ width: '100%', height: '100%', objectFit: 'cover' }" />
      <!-- Dark Overlay -->
      <div :style="{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 0
      }"></div>
    </div>

    <!-- Fallback for non-video background -->
    <div v-else :style="{
      backgroundImage: `url(${selectedCard?.modal_bg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100%',
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: -1
    }"></div>

    <!-- Text Content -->
    <v-card-title :style="{ position: 'relative', zIndex: 1 }">{{ selectedCard?.name }}</v-card-title>
    <v-card-subtitle :style="{ position: 'relative', zIndex: 1 }">Type: {{ selectedCard?.type }}</v-card-subtitle>
    <v-card-text :style="{ position: 'relative', zIndex: 1 }">
      <p>Power: {{ selectedCard?.power }}</p>
      <p>Mana Cost: {{ selectedCard?.mana_cost }}</p>
      <p>Description: {{ selectedCard?.description }}</p>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions :style="{ position: 'relative', zIndex: 1 }">
      <v-spacer></v-spacer>
      <v-btn text @click="closeDialog">Cancel</v-btn>
      <v-btn text color="primary" @click="confirmSelection">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


  </div>

  <v-dialog v-model="messageDialog" max-width="500" persistent style="z-index: 99999">
    <v-card>
      <v-card-text>
        <p>{{ messageText }}</p>
      </v-card-text>
    </v-card>
  </v-dialog>

  <div class="battleground">
    <div class="bg1">
      <p id="player1">.</p>
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

  <div v-if="videoStore.isPlaying" class="video-overlay">
    <video :src="videoStore.videoUrl" autoplay loop class="overlay-video"></video>
  </div>
</template>

<script>
import FloatingCards from "../battle_page/FloatingCards.vue";
import Player1 from "../Characters/Player1.vue";
import Player2 from "../Characters/Player2.vue";
import player2mirror from "../Characters/player2mirror.vue";
import player1mirror from "../Characters/player1mirror.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import router from "@/router";
import { useCardStore1 } from "../../stores/cardsPlayerVsAi";
import { useStore } from "../../stores/cardEffects";
import { useCharacterStatusStore } from "../../stores/characterStatus";
import { useAudioStore } from '@/stores/audioStore';
import { useToast } from "vue-toastification";
import { useVideoStore } from '@/stores/videoStore';
import { useAudioEffectsStore } from "@/stores/audioEffects";
import { usebuffStatusStore } from "@/stores/buffStatus";




export default {
  components: {
    FloatingCards,
    Player1,
    Player2,
    player2mirror,
    player1mirror,
  },
  setup() {
    const toast = useToast();
    const audioEffectsStore = useAudioEffectsStore();
    const buffStatusStore = usebuffStatusStore();
    const characterStatusStore = useCharacterStatusStore();
    const audioStore = useAudioStore();
    const videoStore = useVideoStore();
    const showCards = ref(true);
    const cardStore = useCardStore1();
    const { onHandCards, addCard, removeCardAndAddNew } = cardStore;

    const selectedCharacter = ref(
      Number(localStorage.getItem("selectedCharacter"))
    );

    const revertedCharacter = computed(() => {

      return selectedCharacter.value === 1 ? 2 : 1;
    });

    const dialog = ref(false);
    const messageDialog = ref(false);
    const messageText = ref("");
    const selectedCard = ref(null);
    const cards = ref([]);
    const handlePlay = ref(false);

    const card91 = ref(null);

    const player2Ref = ref(null);
    const player1Ref = ref(null);
    const player_variant2Ref = ref(null);
    const player_variant1Ref = ref(null);

    const fetchRandomCards = async () => {
      const { data: characterData, error: characterError } = await supabase
        .from("characters")
        .select("mana, health")
        .eq("id", selectedCharacter.value); // Adjust character ID as needed

      if (characterError) {
        console.error("Error fetching character data:", characterError);
        return;
      }

      const character = characterData?.[0];
      if (!character || character.health <= 0) {
        return;
      }

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

    onMounted(async () => {
      await fetchRandomCards();
    });


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

      showCards.value = false;
      const cardIndex = onHandCards.findIndex(
        (card) => card.id === selectedCard.value.id
      );

      if (cardIndex !== -1) {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .order("id", { ascending: false })
          .limit(1);

        if (!error) {
          removeCardAndAddNew(cardIndex, data[0]);
        }
      }

      dialog.value = false;
      // Trigger attack animation only if the selected card is of type "attack"
      if (selectedCard.value && selectedCard.value.type === "attack") {
        const { data: dataVideo, error: errorVideo } = await supabase
          .from('cards')
          .select('video_src') // Get the video_src column
          .eq('id', selectedCard.value.id) // Match the selected card's ID
          .single();

        if (errorVideo) {
          console.error('Error fetching video:', errorVideo); // Corrected error variable name
          return;
        }

        if (dataVideo && dataVideo.video_src) {
        const videoUrl = dataVideo.video_src;

        // Play the video preview before the attack animation
        videoStore.playVideo(videoUrl);

        // Play a random sound effect while the video is playing
        audioEffectsStore.playRandomEffect();

        // Wait for the video to finish (e.g., 5 seconds), then proceed
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Stop the video and any playing sound effect after the delay
        videoStore.stopVideo();
        audioEffectsStore.stopEffect();
      }
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
              router.push({ name: "next_phase_ai" });
            }, 1000); // 1000 milliseconds = 1 second
            return;
          }



          // Proceed with attack animation and audio
          player1Ref.value?.toggleAttack();
          player_variant1Ref.value?.toggleAttack();
          setTimeout(() => {
            audioStore.playPunch();
          }, 1000);

          // Deduct mana cost
          const { data: EnergyMinus, error: errorEnergyMinus } = await supabase
            .from("characters")
            .update({ mana: currentMana - selectedCard.value.mana_cost })
            .eq("id", selectedCharacter.value);

          if (errorEnergyMinus) {
            console.error("Error updating character mana:", errorEnergyMinus);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }

        // Fetch card effects from Supabase
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
          const characterStatusStore = useCharacterStatusStore();
          characterStatusStore.addEffect({
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
            await characterStatusStore.applyEffects(characterId);

            // Log the updated character stats
            const updatedCharacter = await characterStatusStore.fetchCharacter(
              characterId
            );


          }

          // Call gameTurn
          await gameTurn();

          // Store the array in Pinia
          const store = useStore();
          store.setCardEffects(cardEffectsArray);
        }

        // Trigger Player1's attack animations


        if (selectedCard.value.is_burn > 0) {
          showMessage("Burn effect triggered");
          setTimeout(() => {
            player_variant2Ref.value?.toggleHurtInjured();
            player2Ref.value?.toggleHurtInjured();
          }, 300);
        } else if (selectedCard.value.is_poison > 0) {
          showMessage("Poison effect triggered"); // Changed alert message for clarity
          setTimeout(() => {
            player_variant2Ref.value?.toggleHurtSkinDamage();
            player2Ref.value?.toggleHurtSkinDamage();
          }, 300);
        } else {
          player_variant2Ref.value?.toggleHurt();
          player2Ref.value?.toggleHurt();
        }


        // Close dialog immediately after triggering animations
        closeDialog();

        // Delay to allow the animation to play before updating health
        await new Promise((resolve) => setTimeout(resolve, 500)); // Adjust delay as needed

        // Get current health and stats of the targeted character (e.g., player2)
        const targetCharacterId = selectedCharacter.value === 1 ? 2 : 1;
        const { data, error } = await supabase
          .from("characters")
          .select("health, defense, agility, critical_rate") // Select relevant columns
          .eq("id", targetCharacterId)
          .single();

        // Handle errors in fetching character stats
        if (error) {
          console.error("Error fetching character stats:", error);
          return;
        }

        // Destructure the fetched stats into individual variables
        const { health, defense, agility, critical_rate } = data;

        // Calculate the chance to miss the attack based on agility
        const missChance = Math.random() * 100; // Random number between 0 and 100
        if (missChance < agility) {
          showMessage("Attack missed due to agility!");
          await new Promise((resolve) => setTimeout(resolve, 1000));
          closeDialog();
          router.push({ name: "next_phase_ai" });
          return; // Exit if the attack misses
        }

        // Calculate damage after defense reduction
        const defensePercentage = defense / 100; // Convert defense to a decimal
        const damageAfterDefense = Math.max(
          0,
          Math.floor(selectedCard.value.power * (1 - defensePercentage))
        ); // Apply percentage reduction and convert to integer



       
        const isCriticalHit = Math.random() * 100 < critical_rate;
        const finalDamage = isCriticalHit
          ? damageAfterDefense * 2
          : damageAfterDefense;

        if (isCriticalHit) {
          showMessage(`Critical Hit! You dealt ${finalDamage} damage!`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {

          showMessage(`You dealt ${finalDamage} damage.`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        closeDialog();
        // Wait before moving to the next phase
        router.push({ name: "next_phase_ai" });

        // Subtract final damage from target's health
        const newHealth = Math.max(0, health - finalDamage);

        // Update health in the database
        const { error: updateError } = await supabase
          .from("characters")
          .update({ health: newHealth })
          .eq("id", targetCharacterId);

        // Handle errors in updating character health
        if (updateError) {
          console.error("Error updating character health:", updateError);
        }
      }

      if (selectedCard.value && selectedCard.value.type === "buff") {
        const { data: EnergyChar1, error: errorEnergy } = await supabase
          .from("characters")
          .select("mana")
          .eq("id", selectedCharacter.value)
          .single();
        console.log(selectedCharacter.value); //caster
        console.log(revertedCharacter.value); //enemy
        if (errorEnergy) {
          console.error("Error fetching character mana details:", errorEnergy);
          return;
        }

        // Assuming card91 is the card being used and has an is_mana property
        if (card91.value && card91.value.is_mana) {

          // Calculate the new mana value
          const newMana = EnergyChar1.mana + card91.value.is_mana;

          // Update the character's mana in the database
          const { data: updateData, error: updateError } = await supabase
            .from("characters")
            .update({ mana: newMana })
            .eq("id", selectedCharacter.value);

          if (updateError) {
            console.error("Error updating character mana:", updateError);
            return;
          }

        }



        // Check if character's mana is sufficient
        const currentMana = EnergyChar1.mana;


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
            router.push({ name: "next_phase_ai" });
          }, 1000); // 1000 milliseconds = 1 second
          return;
        }
        player1Ref.value?.toggleBuff();
        player_variant1Ref.value?.toggleBuff();



        // Check if the mana cost is greater than 0 before proceeding
        if (selectedCard.value.mana_cost > 0) {
          const { data: EnergyMinus, error: errorEnergyMinus } = await supabase
            .from("characters")
            .update({ mana: currentMana - selectedCard.value.mana_cost })
            .eq("id", selectedCharacter.value);

          if (errorEnergyMinus) {
            console.error("Error updating character mana:", errorEnergyMinus);
          }
        }


        // Check if a character has won the battle


        const { data, error } = await supabase
          .from("characters")
          .select("*")
          .eq("id", selectedCharacter.value)
          .single();

        if (error) {
          console.error("Error fetching character stats:", error);
          return;
        }

        const { health, defense, agility, critical_rate } = data;


        // Fetch the card effects for the buff card
        const { data: dataChar, error: errorChar } = await supabase
          .from("cards")
          .select(
            "*"
          )
          .eq("id", selectedCard.value.id);

        // Handle errors in fetching card details
        if (errorChar) {
          console.error("Error fetching card details:", errorChar);
          return;
        }

        // Process fetched data if available
        if (dataChar && dataChar.length > 0) {
          // Convert the first result row into an array
          const cardEffectsArray = [
        
            dataChar[0].is_def_amp,
            dataChar[0].is_agil_amp,
            dataChar[0].is_crit_amp,
          ];

          // Add effects to the character status store
          const buffStatus = usebuffStatusStore();
         buffStatus.addEffect({
        
            is_def_amp: cardEffectsArray[0],
            is_agil_amp: cardEffectsArray[1],
            is_crit_amp: cardEffectsArray[2],
           
          });

          // Constant character ID
          const characterId = selectedCharacter.value;

          // Function to process game turn for the character
          async function gameTurn() {
            await buffStatus.applyEffects(characterId);

            // Log the updated character stats
            const updatedCharacter = await buffStatus.fetchCharacter(characterId);
            buffStatus.decrementTurnCounts();
          }
         
          // Call gameTurn
          await gameTurn();

          // Store the effects array in Pinia
          const store = useStore();
          store.setCardEffects(cardEffectsArray);
        }
      }

      async function handlePlay() {
      const dataVideo = { video_src: "path_to_your_video.mp4" }; // Replace with your video source data
      await playVideoWithEffect(dataVideo);
    }
      // Always navigate to the next phase
      closeDialog();

      router.push({ name: "next_phase_ai" });
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
      videoStore,
      handlePlay,
    
    };

  },methods: {
    
  setActiveCard(index) {
    this.activeCard = index;
  },
  setCardGlow(cardElement, card) {
    if (!cardElement) return;

    let size = 10;
    let growing = true;
    let animationFrame;

    const animateGlow = () => {
      if (card.is_burn || card.is_poison) {
        const color = card.is_burn ? 'rgba(255, 0, 0, 0.7)' : 'rgba(0, 255, 0, 0.7)';
        
        // Adjust the glow size smoothly
        size = growing ? size + 0.3 : size - 0.3;
        if (size >= 20) growing = false;
        if (size <= 10) growing = true;

        // Apply the dynamic shadow glow
        cardElement.style.boxShadow = `0 0 ${size}px ${size / 2}px ${color}`;

        // Continue animation
        animationFrame = requestAnimationFrame(animateGlow);
      } else {
        // Remove shadow and cancel animation if not burn or poison
        cardElement.style.boxShadow = 'none';
        cancelAnimationFrame(animationFrame);
      }
    };

    // Start the glow animation
    animateGlow();
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
  overflow-x: hidden;

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
  margin-top: -1.5rem;
}

.floating-card-container {
  position: fixed;
  z-index: 99;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  .bg1 {
    height: 100%;
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
  display: none;
}

.bar {
  position: absolute;
  left: 1.6rem;
  font-size: 15px;
  bottom: 2rem;
  font-family:  "Merienda", cursive;

}
@media (max-width: 1300px) {
.battleground{
  background-image: url("../../assets/background/bg-md.gif");
}
}
@media (max-width: 600px) {
  .skip {
    top: -15.5rem;
    position: fixed;
    left: 5.5rem;
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
  height: 225px;
  border-radius: 8px;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #151515;
  font-size: 10px;
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
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

#card_title {
  position: absolute;
  top: 13px;
}

.type {
  position: absolute;
  top: 70%;
  left: 15%;
}

.power {
  position: absolute;
  top: 75%;
  left: 15%;
}

.mana {
  position: absolute;
  top: 80%;
  left: 15%;
}

@media (max-width: 600px) {
  .power {
    display: none;
  }

  .mana {
    right: 8px;
  }

  #card_title {
    top: 7px;
    font-size: 10px;
  }

  .type {
    right: 8px;
  }
}

.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  /* Semi-transparent overlay background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
  /* Ensures content doesn’t overflow */
}

.overlay-video {
  width: 100%;
  height: auto;
  max-width: 90vw;
  /* Adjust max size to fit on smaller screens */
  max-height: 90vh;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 9998;
  /* Places video behind the GIF overlay */
}

.video-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/video/video-overlay.gif");
  /* Path to your GIF */
  background-size: cover;
  /* Ensures it covers the entire viewport */
  background-position: center;
  background-repeat: no-repeat;
  z-index: 99999;
  /* Ensures GIF is above the video */
}

/* Media query for smaller screens */
@media (max-width: 768px) {
  .overlay-video {
    max-width: 95vw;
    max-height: 95vh;
  }
}
#player1 {
  margin-top: 70px;
  color: #151515;
  margin-right: 18px;
}
@media (max-width: 400px) {
  #player1 {
  margin-right: 0px;
}
}
</style>

