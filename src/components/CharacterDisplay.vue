<template>
  <div class="display">
    <v-container class="mb-6">
      <v-row class="mt-2 align-items-center">
        <!-- Character Selection -->
        <v-col cols="12" lg="4" md="4" sm="6">
          <v-card class="tilt-card bg-card">
            <h2
              class="pt-1 text-uppercase font-weight-bold text-light text-center"
            >
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
                  src="./../assets/anim/red.jpg"
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
                  src="./../assets/anim/yellow.jpg"
                  alt="Character 2"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
            </v-row>
            <v-row no-gutters class="flex-grow-1">
              <v-col cols="6" class="p-2">
                <v-img
                  src="./../assets/anim/lock1.png"
                  alt="Character 3"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
              <v-col cols="6" class="p-2">
                <v-img
                  src="./../assets/anim/lock2.png"
                  alt="Character 4"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Character Viewer -->
        <v-col
          cols="12"
          lg="5"
          md="5"
          class="d-sm-none d-md-flex d-flex justify-content-center character-viewer"
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
        <v-col
          cols="12"
          lg="3"
          md="3"
          sm="6"
          class="details p-lg-0 p-md-0 p-sm-5"
        >
          <div>
            <h2 class="text-uppercase text-center merienda">
              {{ character.name }}
            </h2>
            <h6
              class="text-center text-medium-emphasis font-weight-regular merienda"
            >
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
                  character.agility / 100
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
                  character.critical_rate / 100
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
                  character.defense / 100
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
          max-width="600"
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <v-img
            class="align-end text-white"
            src="../assets/background/dialog-bg.png"
            cover
          >
            <v-container
              class="d-flex game-dialog"
              style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
            >
              <v-row justify="center" align="center">
                <v-col cols="12" class="text-center">
                  <h5 class="text-h5 text-black pb-8">
                    Are you sure you want to proceed with
                    <strong>{{ character.name }}</strong
                    >?
                  </h5>

                  <v-btn
                    color="red darken-4 merienda-btn"
                    size="large"
                    variant="text"
                    @click="dialog = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="blue darken-4 merienda-btn"
                    size="large"
                    variant="text"
                    @click="confirmChoice"
                    >Sure</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-img>
        </v-dialog>
      </v-row>

      <!-- Navigation button for play and back -->
      <div class="btn-wrapper d-flex text-center">
        <SecBtn @click="navigateWithSound('/')" />
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

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import PrimeBtn from "./buttons/PrimBtn.vue";
import SecBtn from "./buttons/SecBtn.vue";
import AudioPlayer from "./buttonSounds/buttonAudio.vue";
import { useToast } from "vue-toastification";
import { useSpeechStore } from "@/stores/characterSpeech";

export default {
  components: {
    PrimeBtn,
    SecBtn,
    AudioPlayer,
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const speechStore = useSpeechStore();

    const selectedCharacter = ref(
      Number(localStorage.getItem("selectedCharacter")) || 1
    );
    const dialog = ref(false);
    const character = ref({});
    const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
    const audioPlayerRef = ref(null);
    const userId = localStorage.getItem("user_id");

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

    const selectCharacter = (characterId) => {
      selectedCharacter.value = characterId;

      // Ensure speechStore is initialized and methods exist
      if (
        speechStore &&
        typeof speechStore.stopAlon === "function" &&
        typeof speechStore.stopKidlat === "function"
      ) {
        // Stop Alon audio if character 1 is selected
        if (characterId === 1) {
          speechStore.stopAlon();
          speechStore.playKidlat();
        }

        // Stop Kidlat audio if character 2 is selected
        if (characterId === 2) {
          speechStore.stopKidlat();
          speechStore.playAlon();
          console.log("speech 2");
        }
      } else {
        console.error("speechStore or its methods are not available");
      }
    };

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
      const firstAttacker = Math.random() < 0.5 ? "Player 1" : "Player 2";

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

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        selectedCharacter.value = Math.max(1, selectedCharacter.value - 1);
      } else if (event.key === "ArrowRight") {
        selectedCharacter.value = Math.min(2, selectedCharacter.value + 1);
      }
    };

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

    // Watch for changes to selectedCharacter
    watch(selectedCharacter, (newCharacterId) => {
      fetchCharacterDetails(newCharacterId);
    });

    // Lifecycle hooks
    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
      fetchCharacterDetails(selectedCharacter.value); // Fetch initial character details
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });

    return {
      selectedCharacter,
      dialog,
      character,
      audioSrc,
      audioPlayerRef,
      userId,
      playAudio,
      navigateWithSound,
      selectCharacter,
      openDialog,
      confirmChoice,
      handleKeyDown,
      fetchCharacterDetails,
      playAlon: speechStore.playAlon,
      playKidlat: speechStore.playKidlat,
      stopAlon: speechStore.stopAlon,
      stopKidlat: speechStore.stopKidlat,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Rock+Salt&display=swap");

.merienda-btn {
  font-family: "Merienda", cursive;
  font-weight: 700;
  font-style: normal;
  animation: fadeIn 2s ease-out;
}

.display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative; /* Ensure the display container is relative */

  /* Temporary BG */
  background-image: url("./../assets/background/bg2.png");
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
  background-color: rgba(0, 0, 0, 0.313);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3.4px);
  border: 1px solid rgba(0, 0, 0, 0.06);
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

.game-dialog {
  width: 300px;
}

.game-dialog h5 {
  font-family: "Merienda", cursive;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  animation: fadeIn 2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.custom-canvas :deep(#canvas) {
  width: 27rem; /* Adjust the width as needed */
  height: auto; /* Maintain aspect ratio */
  margin-top: 8rem;
  margin-right: 5rem;
}

.animated-progress {
  animation: brighten 2s infinite;
  box-shadow: 0 0 15px var(--progress-shadow-color);
}

.btn-wrapper {
  position: absolute; /* Change from relative to absolute */
  bottom: 20px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 1000; /* Ensure it stays on top */
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

@media (min-width: 768px) and (max-width: 992px) {
  .details h2 {
    font-size: 22px; /* Adjust font size for medium screens */
  }

  .details h6 {
    font-size: 16px; /* Adjust font size for medium screens */
  }

  .btn-wrapper {
    bottom: 30px; /* Adjust button position for medium screens */
  }

  .custom-canvas :deep(#canvas) {
    width: 20rem; /* Adjust the width as needed */
    height: auto; /* Maintain aspect ratio */
    margin-top: 6rem;
  }
}

@media (max-width: 768px) {
  .character-viewer {
    position: relative;
    gap: 0;
    left: 2.5rem;
    padding: 0;
    background-position: 50%;
    width: 100%;
  }
  .display {
    height: 100%;
    background-image: url("./../assets/background/small_screen.png");
  }
  .details {
    position: relative;
    z-index: 1;
    font-size: 0.8rem;
  }

  .btn-wrapper {
    position: fixed; /* Change from relative to absolute */
    bottom: 60rem; /* Adjust as needed */
    left: 11.3rem;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1000; /* Ensure it stays on top */
  }

  .tilt-card {
    transform: none;
    transition: transform 0.3s ease-in-out;
    background-color: #00000048;
    z-index: 999;
  }
}
</style>
