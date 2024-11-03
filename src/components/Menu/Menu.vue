<template>
  <div>
    <br /><br /><br />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="8" lg="8"> </v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-card class="pa-4" elevation="3">
            <v-card-title class="text-h5">Menu</v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="d-flex flex-column">
              <v-btn
                @click="handleNavigation('/select_character')"
                class="my-2"
                color="primary"
                block
              >
                Quickstart
              </v-btn>
              <v-btn
                @click="handleNavigation('/multiplier')"
                class="my-2"
                color="primary"
                block
              >
                Multiplayer
              </v-btn>
              <v-btn
                @click="handleNavigation('/cards')"
                class="my-2"
                color="primary"
                block
              >
                Cards
              </v-btn>
              <v-btn
                @click="handleNavigation('/info')"
                class="my-2"
                color="primary"
                block
              >
                Info
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import AudioPlayer from "../buttonSounds/buttonAudio.vue"; // Adjust the path if necessary

const router = useRouter();
const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
const audioPlayerRef = ref(null);

// Method to play audio and navigate after a delay
const handleNavigation = (route) => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
  }
  setTimeout(() => {
    router.push(route);
  }, 500); // 500 ms delay before navigation
};
</script>

<style scoped>
.v-card {
  max-width: 400px;
}

router-link {
  text-decoration: none;
}
</style>
