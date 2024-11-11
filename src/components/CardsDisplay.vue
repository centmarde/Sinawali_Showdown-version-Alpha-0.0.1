<template>
  <div class="display">
    <SecBtn class="top-right-button" @click="navigateWithSound('/')" />
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
          <swiper
            :effect="'cards'"
            :grabCursor="true"
            :modules="modules"
            class="mySwiper"
            @slideChange="onSlideChange"
          >
            <swiper-slide v-for="(card, index) in cards" :key="card.id">
              <img :src="card.img" alt="Card Image" class="card-image" />
            </swiper-slide>
          </swiper>
        </v-col>
        <v-col cols="12" lg="6">
          <div v-if="activeCard" class="p-5">
            <v-row>
              <v-col cols="2">
                <v-avatar
                  :image="avatarImage"
                  size="90"
                  class="bg-white"
                  variant="elevated"
                ></v-avatar>
              </v-col>

              <v-col>
                <div class="ms-6">
                  <h2 class="mt-1">{{ activeCard.name }}</h2>
                  <v-card :class="[' d-inline-block me-4', cardRarityClass]">
                    <v-card-text
                      class="py-1 px-4 text-uppercase font-weight-medium text-body-2"
                    >
                      {{ activeCard.rarity }}
                    </v-card-text>
                  </v-card>
                  <v-card :class="[' d-inline-block ', cardTypeClass]">
                    <v-card-text
                      class="py-1 px-4 text-uppercase font-weight-medium text-body-2"
                    >
                      {{ activeCard.type }}
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>

            <!-- Card Stats -->
            <div class="me-16 pe-4 mt-5">
              <small class="text-uppercase font-weight-medium">Power</small>
              <v-progress-linear
                class="mt-2 mb-4 text-button font-weight-bold animated-progress"
                :model-value="activeCard.power"
                max="30"
                :color="rarityColor"
                height="18"
                rounded
                :style="[
                  {
                    '--progress-shadow-color': `rgba(255, 216, 43, ${
                      activeCard.power / 30
                    })`,
                  },
                  rarityStyles,
                ]"
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium">Energy</small>
              <v-progress-linear
                class="mt-2 mb-4 text-button font-weight-bold animated-progress"
                :model-value="activeCard.mana_cost"
                max="50"
                :color="rarityColor"
                height="18"
                rounded
                :style="[
                  {
                    '--progress-shadow-color': `rgba(255, 216, 43, ${
                      activeCard.mana_cost / 50
                    })`,
                  },
                  rarityStyles,
                ]"
              >
              </v-progress-linear>

              <small class="text-uppercase font-weight-medium"
                >Draw Chance</small
              >
              <v-progress-linear
                class="mt-2 mb-4 text-button font-weight-bold animated-progress"
                :model-value="activeCard.draw_chance"
                max="100"
                :color="rarityColor"
                height="18"
                rounded
                :style="[
                  {
                    '--progress-shadow-color': `rgba(255, 216, 43, ${
                      activeCard.draw_chance / 100
                    })`,
                  },
                  rarityStyles,
                ]"
              >
              </v-progress-linear>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <AudioPlayer
      ref="audioPlayerRef"
      :audioSrc="audioSrc"
      audioType="audio/mp3"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { supabase } from "../lib/supabase";
import SecBtn from "./buttons/SecBtn.vue";
import AudioPlayer from "./buttonSounds/buttonAudio.vue";
const router = useRouter();

const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
const audioPlayerRef = ref(null);

// Swiper modules
const modules = [EffectCards];

// Reactive references for cards data and active slide index
const cards = ref([]);
const activeIndex = ref(0);

// Function to fetch cards data from Supabase
const fetchCards = async () => {
  const { data, error } = await supabase.from("cards").select("*");

  if (error) {
    console.error(error);
  } else {
    cards.value = data;
  }
};

// Function to handle slide change event
const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};

// Computed property to get the active card based on the active slide index
const activeCard = computed(() => cards.value[activeIndex.value]);

// Computed property to get the CSS class for the card type
const cardTypeClass = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.type) {
    case "attack":
      return "attack_bg";
    case "defense":
      return "defense_bg";
    case "buff":
      return "buff_bg";
    default:
      return "";
  }
});

// Computed property to get the CSS class for the card rarity
const cardRarityClass = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.rarity) {
    case "commun":
      return "common_bg";
    case "rare":
      return "rare_bg";
    case "special":
      return "special_bg";
    default:
      return "";
  }
});

// Computed property to get the color based on the card rarity
const rarityColor = computed(() => {
  if (!activeCard.value) return "#ffd82b"; // Default color
  switch (activeCard.value.rarity) {
    case "commun":
      return "#307605";
    case "rare":
      return "#772011";
    case "special":
      return "#936529";
    default:
      return "#ffd82b";
  }
});

// Computed property to get the styles based on the card rarity
const rarityStyles = computed(() => {
  if (!activeCard.value) return {};
  switch (activeCard.value.rarity) {
    case "commun":
      return {
        boxShadow: "none",
      };
    case "rare":
      return {
        boxShadow: "0 0 4px #c96013",
      };
    case "special":
      return {
        boxShadow: "0 0 20px #936529",
        animation: "fadeInOut 2s infinite",
      };
    default:
      return {};
  }
});

// Computed property to get the avatar image URL based on the card type
const avatarImage = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.type) {
    case "attack":
      return new URL("./../assets/icon/sticks.png", import.meta.url).href;
    case "defense":
      return new URL("./../assets/icon/defense.png", import.meta.url).href;
    case "buff":
      return new URL("./../assets/icon/buff.png", import.meta.url).href;
    default:
      return "";
  }
});

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

// Fetch cards data when the component is mounted
onMounted(() => {
  fetchCards();
});
</script>

<style scoped>
.display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Temporary BG */
  background-image: url("./../assets/background/bg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.mySwiper {
  width: 400px;
  height: 500px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  background: none; /* temporary */
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 18px;
}

.top-right-button {
  position: absolute;
  top: 40px;
  right: 50px;
}

/* Add styles for card rarity classes */
.common_bg {
  background-color: #307605;
}

.rare_bg {
  background-color: #772011;
  box-shadow: 0 0 20px #c96013;
}

.special_bg {
  background-color: #936529;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px #936529;
  animation: fadeInOut 2s infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    box-shadow: 0 0 15px #936529;
    background-color: #936529;
  }
  50% {
    box-shadow: 0 0 40px #ddb75a;
    background-color: #ddb75a; /* Slightly lighter shade for emphasis */
  }
}
</style>
