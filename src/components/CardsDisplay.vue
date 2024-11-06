<template>
  <div class="display">
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
                  <v-card :class="['d-inline-block ', cardTypeClass]">
                    <v-card-text
                      class="py-1 px-4 text-uppercase text-black font-weight-medium text-body-2"
                    >
                      {{ activeCard.type }}
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>
            </v-row>

            <v-row class="d-flex flex-row mb-6">
              <v-col cols="6">
                <span>Power: {{ activeCard.power }}</span>
              </v-col>
              <v-col cols="6">
                <span>Mana Cost: {{ activeCard.mana_cost }}</span>
              </v-col>
              <v-col cols="6">
                <span>Draw Chance: {{ activeCard.draw_chance }}</span>
              </v-col>
              <v-col cols="6">
                <span>Poison: {{ activeCard.is_poison }}</span>
              </v-col>
            </v-row>

            <p class="text-body-2">{{ activeCard.description }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { supabase } from "../lib/supabase";

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

// Computed property to get the avatar image URL based on the card type
const avatarImage = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.type) {
    case "attack":
      return new URL("./../assets/icon/attack.png", import.meta.url).href;
    case "defense":
      return new URL("./../assets/icon/defense.png", import.meta.url).href;
    case "buff":
      return new URL("./../assets/icon/buff.png", import.meta.url).href;
    default:
      return "";
  }
});

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
  background-image: url("./../assets/background/csbg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.mySwiper {
  width: 400px;
  height: 446px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  background: #fcd20e; /* temporary */
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 18px;
}

.attack_bg {
  background-color: #fe0c4c;
}

.defense_bg {
  background-color: #0055ff;
}

.buff_bg {
  background-color: #fcd20e;
}
</style>
