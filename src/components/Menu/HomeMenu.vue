<template>
  <div id="ygar" @keydown="handleKeydown" tabindex="0">
    <v-container fluid class="centered-container">
      <v-row justify="center">
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
      <v-row justify="center">
        <v-col cols="auto"></v-col>
        <v-col
          cols="12"
          lg="4"
          md="4"
          sm="6"
          class="d-flex justify-center align-center"
        >
          <!-- MENU  -->
          <v-card class="custom-card mx-3" elevation="8" style="width: 100%">
            <v-card-actions class="d-flex flex-column">
              <v-btn
                :class="{ 'selected-menu': selectedMenu === 0 }"
                @click="handleNavigation('/select_character_ai')"
                class="my-1 font-weight-bold"
                block
              >
                Player vs. Computer
              </v-btn>
              <v-btn
                :class="{ 'selected-menu': selectedMenu === 1 }"
                @click="handleNavigation('/select_character')"
                class="my-1 font-weight-bold"
                block
              >
                Local Competitive
              </v-btn>
              <v-btn
                :class="{ 'selected-menu': selectedMenu === 2 }"
                @click="handleNavigation('/multiplayer')"
                class="my-1 font-weight-bold"
                block
              >
                Online
              </v-btn>
              <v-btn
                :class="{ 'selected-menu': selectedMenu === 3 }"
                @click="handleNavigation('/cards')"
                class="my-1 font-weight-bold"
                block
              >
                Cards
              </v-btn>
              <v-btn
                :class="{ 'selected-menu': selectedMenu === 4 }"
                @click="doLogout()"
                class="my-1 font-weight-bold"
                block
              >
                Logout
              </v-btn>
            </v-card-actions>
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
const handleNavigation = (route) => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
    audioStore.allPause();
  }
  setTimeout(() => {
    router.push(route);
  }, 500); // 500 ms delay before navigation
};

// Method to handle keyboard navigation
const handleKeydown = (event) => {
  if (event.key === "ArrowDown") {
    selectedMenu.value = (selectedMenu.value + 1) % 5;
  } else if (event.key === "ArrowUp") {
    selectedMenu.value = (selectedMenu.value - 1 + 5) % 5;
  } else if (event.key === "Enter") {
    if (selectedMenu.value === 0) handleNavigation("/select_character_ai");
    else if (selectedMenu.value === 1) handleNavigation("/select_character");
    else if (selectedMenu.value === 2) handleNavigation("/multiplayer");
    else if (selectedMenu.value === 3) handleNavigation("/cards");
    else if (selectedMenu.value === 4) doLogout();
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

.custom-card {
  background-color: rgba(0, 0, 0, 0.591);
}

.selected-menu {
  background-color: rgba(255, 255, 255, 0.2);
}

.centered-container {
  z-index: 9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
