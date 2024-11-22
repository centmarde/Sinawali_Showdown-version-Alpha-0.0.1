<template>
  <div id="ygar" @keydown="handleKeydown" tabindex="0">
    <v-container fluid class="centered-container">
      <v-row justify="center mt-4">
        <v-col cols="auto"></v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
          sm="6"
          class="d-flex justify-center align-center"
        >
          <v-img cover src="@/assets/logo.png"></v-img>
        </v-col>
        <v-col cols="auto"></v-col>
      </v-row>
      <v-row justify="center m-0 p-0">
        <v-col cols="auto"></v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
          sm="6"
          class="d-flex justify-center align-center"
        >
          <!-- MENU  -->
          <v-card variant="text" class="text-center">
            <v-img
              class="align-center"
              height="300"
              width="400"
              src="../../assets/background/main-menu.png"
              cover
            >
              <div class="">
                <v-card-actions class="d-flex flex-column">
                  <v-btn
                    :class="{ 'selected-menu': selectedMenu === 0 }"
                    @click="handleNavigation('/select_character_ai')"
                    class="font-weight-bold menu-text"
                    width="200"
                  >
                    Player vs. Computer
                  </v-btn>
                  <v-btn
                    :class="{ 'selected-menu': selectedMenu === 1 }"
                    @click="handleNavigation('/select_character')"
                    class="font-weight-bold menu-text"
                    width="200"
                  >
                    Local Competitive
                  </v-btn>
                   <v-btn
                :class="{ 'selected-menu': selectedMenu === 2 }"
                @click="handleNavigation('/story')"
                class="font-weight-bold menu-text"

              >
                Adventure
              </v-btn>
                  <v-btn
                    :class="{ 'selected-menu': selectedMenu === 2 }"
                    @click="handleNavigation('/cards')"
                    class="font-weight-bold menu-text"
                    width="200"
                  >
                    Cards
                  </v-btn>
                  <!-- <v-btn
                :class="{ 'selected-menu': selectedMenu === 4 }"
                @click="doLogout()"
                class="font-weight-bold"

              >
                Logout
              </v-btn> -->
                </v-card-actions>
              </div>
            </v-img>
          </v-card>
        </v-col>
        <v-col cols="auto"></v-col>
      </v-row>
    </v-container>
    <!-- Audio Player Component -->
    <AudioPlayer
      ref="audioPlayerRef"
      :audioSrc="audioSrc"
      audioType="audio/mp3"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AudioPlayer from "../buttonSounds/buttonAudio.vue"; // Adjust the path if necessary
import { doLogout } from "@/lib/supabase";
import { useAudioStore } from "@/stores/audioStore";
import { supabase } from "@/lib/supabase";

const audioStore = useAudioStore();
const router = useRouter();
const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
const audioPlayerRef = ref(null);
const selectedMenu = ref(0);

// Play background audio when the component mounts
onMounted(() => {
  audioStore.playAdal();
  document.addEventListener("keydown", handleKeydown);
});

// Method to play audio and navigate after a delay
const handleNavigation = async (route) => {
  // Reset characters before proceeding
  await resetCharacters();

  // Play audio and pause all other audio
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
    audioStore.allPause();
  }

  // Delay and navigate
  setTimeout(() => {
    router.push(route);
  }, 500); // 500 ms delay before navigation
};

const resetCharacters = async () => {
  const { error: error1 } = await supabase
    .from("characters")
    .update({
      health: 100,
      mana: 100,
      agility: 10,
      defense: 0,
      critical_rate: 30,
    })
    .eq("id", 1);

  if (error1) {
    console.error("Failed to update character 1:", error1);
    return;
  }

  const { error: error2 } = await supabase
    .from("characters")
    .update({
      health: 100,
      mana: 100,
      agility: 30,
      defense: 0,
      critical_rate: 10,
    })
    .eq("id", 2);

  if (error2) {
    console.error("Failed to update character 2:", error2);
    return;
  }
};

// Method to handle keyboard navigation
const handleKeydown = (event) => {
  const menuItems = 3; // Update this to the number of menu items
  if (event.key === "ArrowDown") {
    selectedMenu.value = (selectedMenu.value + 1) % menuItems;
  } else if (event.key === "ArrowUp") {
    selectedMenu.value = (selectedMenu.value - 1 + menuItems) % menuItems;
  } else if (event.key === "Enter") {
    if (selectedMenu.value === 0) handleNavigation("/select_character_ai");
    else if (selectedMenu.value === 1) handleNavigation("/select_character");
    // else if (selectedMenu.value === 2) handleNavigation("/multiplayer");
    else if (selectedMenu.value === 2) handleNavigation("/cards");
    /*    else if (selectedMenu.value === 4) doLogout(); */
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap");

.rock-salt-regular {
  font-family: "Rock Salt", cursive;
  font-weight: 900;
  font-style: normal;
}

.v-card {
  max-width: 400px;
  object-fit: cover;
}

.router-link {
  text-decoration: none;
}

.menu-text {
  color: #6f3433;
}

.custom-card {
  background-color: rgba(0, 0, 0, 0.591);
}

.selected-menu {
  background-color: #6f34332b;
}

.centered-container {
  z-index: 9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
