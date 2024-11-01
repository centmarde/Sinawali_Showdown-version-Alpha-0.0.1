<template>
  <v-container>
    <v-row class="my-16 py-10">
      <v-col cols="12" lg="4">
        <v-card class="tilt-card">
          <v-row no-gutters class="flex-grow-1">
            <v-col
              cols="6"
              class="p-1"
              :class="{ 'highlight-border': selectedCharacter === 1 }"
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
              class="p-1"
              :class="{ 'highlight-border': selectedCharacter === 2 }"
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
            <v-col cols="6" class="p-1">
              <v-img
                src="https://via.placeholder.com/150"
                alt="Character 3"
                class="character-image"
                contain
              ></v-img>
            </v-col>
            <v-col cols="6" class="p-1">
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

      <v-col cols="12" lg="5"> </v-col>

      <v-col cols="12" lg="3">
        <!-- character details fetch from supabase db -->
        <h1>{{ character.name }}</h1>
        <v-progress-linear
          :model-value="character.health"
          max="100"
          color="red"
          height="20"
        >
          <strong>{{ character.health }}</strong>
        </v-progress-linear>
        <v-progress-linear
          :model-value="character.mana"
          max="100"
          color="blue"
          height="20"
        >
          <strong>{{ character.mana }}</strong>
        </v-progress-linear>
        <v-progress-linear
          :model-value="character.agility"
          max="15"
          color="green"
          height="20"
        >
          <strong>{{ character.agility }}</strong>
        </v-progress-linear>
        <v-progress-linear
          :model-value="character.defense"
          max="100"
          color="orange"
          height="20"
        >
          <strong>{{ character.defense }}</strong>
        </v-progress-linear>
        <v-progress-linear
          :model-value="parseFloat(character.critical_rate)"
          max="150"
          color="purple"
          height="20"
        >
          <strong>{{ character.critical_rate }}</strong>
        </v-progress-linear>
      </v-col>

      <!-- Confirmation Dialog -->
      <v-dialog
        v-model="dialog"
        max-width="400"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <v-card>
          <v-card-title class="headline" id="dialog-title"
            >Confirm Your Choice</v-card-title
          >
          <v-card-text id="dialog-description">
            Are you sure you want to proceed with Character
            {{ selectedCharacter }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" text @click="confirmChoice">Sure</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row class="d-flex justify-center align-center">
      <v-btn color="grey" to="/">Back</v-btn>
      <v-btn color="primary" @click="openDialog" class="ml-4">Play</v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";

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
const confirmChoice = () => {
  localStorage.setItem("selectedCharacter", selectedCharacter.value);
  console.log(localStorage.getItem("selectedCharacter"));
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
    .select("name, health, mana, agility, defense, critical_rate")
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
.tilt-card {
  transform: perspective(1000px) rotateY(10deg); /* Adjust the degree as needed */
  transition: transform 0.3s ease-in-out;
}

.character-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the available space */
}

/* Canvas-like border styling for selected card */
.highlight-border {
  border: 4px solid #ff9d00;
  transition: border-color 0.3s;
}

/* Dialog styling */
.v-dialog {
  transition: opacity 0.3s ease-in-out;
}
</style>
