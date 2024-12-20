<template>
    <div class="display">
      <v-container class="mb-6">
        <v-row class="mt-2 align-items-center">
          <!-- Character Selection -->
          <v-col cols="12" lg="4" md="6">
            <v-card class="tilt-card">
              <h2 class="text-uppercase font-weight-bold text-light text-center">
                Select Your Character
              </h2>
              <v-row no-gutters class="flex-grow-1">
                <v-col
                  cols="6"
                  class="p-2"
                  :class="{ 'zoom-effect': selectedCharacter === 1 }"
                  outlined
                  @click="selectCharacter(1)"
                >
                  <v-img
                    src="../../assets/anim/red.jpg"
                    alt="Character 1"
                    class="character-image"
                    contain
                  ></v-img>
                </v-col>
                <v-col
                  cols="6"
                  class="p-2"
                  :class="{ 'zoom-effect': selectedCharacter === 2 }"
                  outlined
                  @click="selectCharacter(2)"
                >
                  <v-img
                    src="../../assets/anim/yellow.jpg"
                    alt="Character 2"
                    class="character-image"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
              <v-row no-gutters class="flex-grow-1">
                <v-col cols="6" class="p-2">
                  <v-img
                    src="../../assets/anim/lock1.png"
                    alt="Character 3"
                    class="character-image"
                    contain
                  ></v-img>
                </v-col>
                <v-col cols="6" class="p-2">
                  <v-img
                    src="../../assets/anim/lock2.png"
                    alt="Character 4"
                    class="character-image"
                    contain
                  ></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
  
          <v-col
            cols="12"
            lg="5"
            class="d-none d-lg-flex d-flex justify-content-center character-viewer"
          >
            <template v-if="selectedCharacter === 1">
              <player1 class="custom-canvas" />
            </template>
            <template v-else-if="selectedCharacter === 2">
              <player2mirror class="custom-canvas" />
            </template>
            <template v-else>
              <!-- Show nothing or an empty element -->
              <div></div>
            </template>
          </v-col>
  
          <!-- Character Stats -->
          <v-col cols="12" lg="3" md="6" class="details">
            <div>
              <h2 class="text-uppercase text-center">{{ character.name }}</h2>
              <h6 class="text-center text-medium-emphasis font-weight-regular">
                {{ character.tagline }}
              </h6>
  
              <div>
                <small class="text-uppercase font-weight-medium">Energy</small>
                <v-progress-linear
                  class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
                  :model-value="character.mana"
                  max="100"
                  color="#ffd82b"
                  height="14"
                  rounded
                  :style="`--progress-shadow-color: rgba(255, 216, 43, ${
                    character.mana / 100
                  });`"
                >
                </v-progress-linear>
  
                <small class="text-uppercase font-weight-medium">Agility</small>
                <v-progress-linear
                  class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
                  :model-value="character.agility"
                  max="100"
                  color="#ffd82b"
                  height="14"
                  rounded
                  :style="`--progress-shadow-color: rgba(255, 216, 43, ${
                    character.agility / 10
                  });`"
                >
                </v-progress-linear>
  
                <small class="text-uppercase font-weight-medium">Defense</small>
                <v-progress-linear
                  class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
                  :model-value="character.defense"
                  max="100"
                  color="#ffd82b"
                  height="14"
                  rounded
                  :style="`--progress-shadow-color: rgba(255, 216, 43, ${
                    character.defense / 10
                  });`"
                >
                </v-progress-linear>
  
                <small class="text-uppercase font-weight-medium"
                  >Critical Rate</small
                >
                <v-progress-linear
                  class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
                  :model-value="parseFloat(character.critical_rate)"
                  max="100"
                  color="#ffd82b"
                  height="14"
                  rounded
                  :style="`--progress-shadow-color: rgba(255, 216, 43, ${
                    character.critical_rate / 10
                  });`"
                >
                </v-progress-linear>
              </div>
  
              <div class="mt-5">
                <small class="text-caption">{{ character.lore }}</small>
              </div>
            </div>
          </v-col>
  
          <!-- Confirmation Dialog -->
          <v-dialog
            v-model="dialog"
            max-width="400"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
          >
            <v-card class="game-dialog">
              <!-- <v-card-title class="headline game-dialog-title" id="dialog-title">
                Confirm Your Choice
              </v-card-title> -->
              <v-card-text class="game-dialog-text" id="dialog-description">
                Are you sure you want to proceed with
                <strong>{{ character.name }}</strong
                >?
              </v-card-text>
              <v-card-actions class="game-dialog-actions">
                <v-btn color="red darken-2" text @click="dialog = false"
                  >Cancel</v-btn
                >
                <v-btn color="yellow darken-4" text @click="confirmChoice"
                  >Sure</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
  
        <!-- Navigation button for play and back -->
        <div class="btn-wrapper text-center">
          <SecBtn @click="navigateWithSound('/multiplayer')" />
          <PrimeBtn @click="openDialog" class="ml-4" />
        </div>
      </v-container>
  
      <AudioPlayer
        ref="audioPlayerRef"
        :audioSrc="audioSrc"
        audioType="audio/mp3"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/lib/supabase";
  import PrimeBtn from "../buttons/PrimBtn.vue";
  import SecBtn from "../buttons/SecBtn.vue";
  import AudioPlayer from "../buttonSounds/buttonAudio.vue";
  import { useToast } from "vue-toastification";
  
  // Track the selected character
  const toast = useToast();
  const selectedCharacter = ref(Number(localStorage.getItem("selectedCharacter")) || 1); // Ensure it's a number
  const dialog = ref(false);
  const character = ref({});
  const router = useRouter();
  const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
  const audioPlayerRef = ref(null);
  const userId = localStorage.getItem("user_id");
  
  console.log(userId);
  
  const playAudio = () => {
    if (audioPlayerRef.value) {
      audioPlayerRef.value.playAudio();
    }
  };
  
  const navigateWithSound = (route) => {
    playAudio();
    setTimeout(() => {
      router.push(route);
    }, 500); // 500 ms delay before navigation
  };
  
  // Function to change character on mouse click
  const selectCharacter = (characterId) => {
    selectedCharacter.value = characterId;
  };
  
  // Function to open confirmation dialog
  const openDialog = () => {
    if (audioPlayerRef.value) {
      audioPlayerRef.value.playAudio();
    }
    dialog.value = true;
  };
  
  const confirmChoice = async () => {
  // Save the selected character to local storage
  localStorage.setItem("selectedCharacter", selectedCharacter.value);
  console.log(localStorage.getItem("selectedCharacter"));

  // Retrieve player IDs from local storage
  const player1Id = localStorage.getItem("player1");
  const player2Id = localStorage.getItem("player2");

  // Decide first attacker based on player IDs (customize this logic as needed)
  const firstAttacker = player1Id ? "Player 1" : "Player 2"; 

  // Show alert for who attacks first
  toast(`${firstAttacker} attacks first!`);

  // Close the dialog
  dialog.value = false;

  // Navigate based on who attacks first
  if (firstAttacker === "Player 1") {
    navigateWithSound("/battle_area"); // Navigate to /battle for Player 1
  } else {
    navigateWithSound("/next_phase"); // Navigate to /nextphase for Player 2
  }
};

  
  
  // Function to handle keyboard arrow keys
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      selectedCharacter.value = Math.max(1, selectedCharacter.value - 1);
    } else if (event.key === "ArrowRight") {
      selectedCharacter.value = Math.min(2, selectedCharacter.value + 1);
    }
  };
  
  // Fetch character details from Supabase
  const fetchCharacterDetails = async (characterId) => {
    const { data, error } = await supabase
      .from("characters")
  
      .select("*")
  
      .eq("id", characterId)
      .single();
  
    if (error) {
      console.error("Error fetching character details:", error);
    } else {
      character.value = data;
    }
  };
  
  // Watch for changes in selectedCharacter and fetch details
  watch(selectedCharacter, (newCharacterId) => {
    fetchCharacterDetails(newCharacterId);
  });
  
  // Mount and cleanup event listeners
  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
    fetchCharacterDetails(selectedCharacter.value); // Fetch initial character details
  });
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
  </script>
  
  
  <style scoped>
  .display {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative; /* Ensure the display container is relative */
  
    /* Temporary BG */
    background-image: url("../../assets/background/csbg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .tilt-card {
    transform: perspective(1000px) rotateY(18deg); /* Adjust the degree as needed */
    transition: transform 0.3s ease-in-out;
    background-color: #00000025;
    z-index: 999;
  }
  
  .character-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the available space */
  }
  
  /* Zoom effect for selected character */
  .zoom-effect {
    transform: scale(1.1);
    transition: transform 0.5s ease-in-out;
  }
  
  /* Dialog styling */
  .v-dialog {
    transition: opacity 0.3s ease-in-out;
  }
  
  .tempcolor {
    background-color: #00000025 !important;
  }
  
  .game-dialog {
    /* background-image: url("/path/to/your/background-image.png"); */
    background-size: cover;
    border-radius: 10px;
    color: #fff;
  }
  
  .game-dialog-actions {
    justify-content: center;
  }
  
  .custom-canvas :deep(#canvas) {
    width: 27rem; /* Adjust the width as needed */
    height: auto; /* Maintain aspect ratio */
  }
  
  /* Animation for progress bars */
  @keyframes brighten {
    0%,
    100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.5);
    }
  }
  
  .animated-progress {
    animation: brighten 2s infinite;
    box-shadow: 0 0 10px var(--progress-shadow-color);
  }
  
  .btn-wrapper {
    position: absolute; /* Change from relative to absolute */
    bottom: 20px; /* Adjust as needed */
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1000; /* Ensure it stays on top */
  }
  
  @media (max-width: 768px) {
    .character-viewer {
      position: absolute;
      bottom: 60px;
      background-image: url("./../assets/background/csbg.png");
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  
    .details {
      position: relative;
      z-index: 1;
      top: 18rem;
      font-size: 0.8rem;
      background-color: #151515;
    }
  
    .btn-wrapper {
      position: absolute; /* Change from relative to absolute */
      bottom: 20px; /* Adjust as needed */
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      z-index: 1000; /* Ensure it stays on top */
    }
  }
  </style>
  