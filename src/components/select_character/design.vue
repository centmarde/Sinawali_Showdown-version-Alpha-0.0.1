<template>
  <div class="csbackground">
    <v-container>
      <v-row class="my-2">
        <v-col cols="12" lg="12">
          <h2 class="text-uppercase font-weight-bold text-grey-darken-4">
            Select Your Character
          </h2>
        </v-col>
      </v-row>

      <v-row class="mt-2 align-items-center">
        <!-- Character Selection -->
        <v-col cols="12" lg="4" md="6">
          <v-card class="tilt-card">
            <v-row no-gutters class="flex-grow-1">
              <v-col
                cols="6"
                class="p-2"
                :class="{ 'zoom-effect': selectedCharacter === 1 }"
                outlined
                @click="selectCharacter(1)"
              >
                <v-img
                  src="https://via.placeholder.com/150"
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
                  src="https://via.placeholder.com/150"
                  alt="Character 2"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
            </v-row>
            <v-row no-gutters class="flex-grow-1">
              <v-col cols="6" class="p-2">
                <v-img
                  src="https://via.placeholder.com/150"
                  alt="Character 3"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
              <v-col cols="6" class="p-2">
                <v-img
                  src="https://via.placeholder.com/150"
                  alt="Character 4"
                  class="character-image"
                  contain
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Character Display -->
        <v-col cols="12" lg="5" class="d-none d-lg-flex"></v-col>

        <!-- Character Stats -->
        <v-col cols="12" lg="3" md="6">
          <div>
            <h2 class="text-uppercase text-center">{{ character.name }}</h2>
            <h6 class="text-center text-medium-emphasis font-weight-regular">
              {{ character.role }}
            </h6>

            <div>
              <small class="text-uppercase font-weight-medium">Health</small>
              <v-progress-linear
                class="mt-2 mb-4"
                :model-value="character.health"
                max="100"
                color="#ffd82b"
                height="10"
                rounded
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium">Mana</small>
              <v-progress-linear
                class="mt-2 mb-4"
                :model-value="character.mana"
                max="100"
                color="#ffd82b"
                height="10"
                rounded
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium">Agility</small>
              <v-progress-linear
                class="mt-2 mb-4"
                :model-value="character.agility"
                max="15"
                color="#ffd82b"
                height="10"
                rounded
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium">Defense</small>
              <v-progress-linear
                class="mt-2 mb-4"
                :model-value="character.defense"
                max="100"
                color="#ffd82b"
                height="10"
                rounded
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium"
                >Critical Rate</small
              >
              <v-progress-linear
                class="mt-2 mb-4"
                :model-value="parseFloat(character.critical_rate)"
                max="150"
                color="#ffd82b"
                height="10"
                rounded
              >
              </v-progress-linear>
            </div>

            <div class="mt-4">
              <small class="text-caption">
                In a world where ancient clans wield elemental powers to protect
                their land, warriors known as the Guardians of Valor must unite
                to stop a ruthless warlord from plunging everything into eternal
                darkness.</small
              >
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
              <v-spacer></v-spacer>
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

      <v-row>
        <v-col class="">
          <SecBtn to="/" />
          <PrimeBtn @click="openDialog" class="ml-4" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";
import PrimeBtn from "../button/PrimBtn.vue";
import SecBtn from "../button/SecBtn.vue";

// Track the selected character
const selectedCharacter = ref(1);
const dialog = ref(false);
const character = ref({});
const router = useRouter();

// Function to change character on mouse click
const selectCharacter = (characterId) => {
  selectedCharacter.value = characterId;
};

// Function to open confirmation dialog
const openDialog = () => {
  dialog.value = true;
};

// Function to confirm choice and redirect to 'battle_loading'
// Function to confirm choice and redirect to 'battle_loading'
const confirmChoice = async () => {
  localStorage.setItem("selectedCharacter", selectedCharacter.value);
  console.log(localStorage.getItem("selectedCharacter"));
  
  // Insert a new battle row into the battles table
  const { data: battleData, error: battleError } = await supabase
    .from("battles")
    .insert({
      player1_character_id: selectedCharacter.value,
      player2_character_id: selectedCharacter.value === 1 ? 2 : 1, // Assume player 2 is always the opposite
      turn_number: 1 // Initialize turn number, can be adjusted later
    })
    .select(); // Use .select() to return the inserted row

  if (battleError) {
    console.error("Error inserting battle:", battleError);
    return;
  }

  const battleId = battleData[0].id; // Retrieve the generated battle ID
  localStorage.setItem("battleId", battleId); // Save the battle ID to localStorage
  console.log("Battle ID:", battleId);

  dialog.value = false;
  router.push({ name: "/battle_area" });
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
    .select("name, role, health, mana, agility, defense, critical_rate")
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
.csbackground {
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
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
</style>
