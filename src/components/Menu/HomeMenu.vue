<template>
  <div>
    <v-container fluid style="z-index: 2; position: absolute; top: 2.5rem">
      <v-row justify="center">
        <v-col cols="12" sm="6" md="8" lg="8"></v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-card variant="text" class="text-center">
            <v-img
              class="align-center"
              height="450"
              src="../../assets/background/menu.gif"
              cover
            >
              <div class="pa-16 me-3">
                <v-card-title class="text-h5 text-black-50 rock-salt-regular"
                  >Kali Unleashed
                </v-card-title>
                <v-divider
                  :thickness="3"
                  color="black-50"
                  class="mt-0 mb-1"
                ></v-divider>
                <v-card-actions class="d-flex flex-column">
                  <v-btn
                    @click="handleNavigation('/select_character')"
                    class="my-2 font-weight-bold"
                    color="black-50"
                    block
                  >
                    Quickstart
                  </v-btn>
                  <v-btn
                    @click="handleNavigation('/multiplier')"
                    class="my-2 font-weight-bold"
                    color="black-50"
                    block
                  >
                    Multiplayer
                  </v-btn>
                  <v-btn
                    @click="handleNavigation('/cards')"
                    class="my-2 font-weight-bold"
                    color="black-50"
                    block
                  >
                    Cards
                  </v-btn>
                </v-card-actions>
              </div>
            </v-img>
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

router-link {
  text-decoration: none;
}
</style>
