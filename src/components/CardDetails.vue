<template>
  <div id="info" v-if="activeCard" class="p-5">
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
        <div id="info2" class="ms-6">
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
        :color="progressColor"
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
        :color="progressColor"
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

      <small class="text-uppercase font-weight-medium">Draw Chance</small>
      <v-progress-linear
        class="mt-2 mb-4 text-button font-weight-bold animated-progress"
        :model-value="activeCard.draw_chance"
        max="100"
        :color="progressColor"
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
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  activeCard: Object,
  avatarImage: String,
  cardRarityClass: String,
  cardTypeClass: String,
  rarityColor: String,
  rarityStyles: Object,
  typeColor: String,
});

const progressColor = computed(() => {
  return props.typeColor || props.rarityColor;
});
</script>

<style scoped>
/* Add styles for card type classes */
.attack_bg {
  background-color: #121212;
}

.defense_bg {
  background-color: #550981;
}

.buff_bg {
  background-color: #0e4059;
}

.energy_bg {
  background-color: #880c39;
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

@media (max-width: 1300px) {
  #cards {
    position: relative;
    top: 10rem;
  }

  #info {
    position: relative;
    margin-top: 10rem;
    left: 2.5rem;
  }
  #info2 {
    position: relative;
    left: 5rem;
  }
  .display {
    height: 100%;
  }
}
@media (max-width: 360px) {
  #cards {
    top: 4rem;
    max-width: 100%; /* Adjust further if needed for smaller screens */
  }
  .mySwiper {
    width: 100%;
  }

  #info {
    position: relative;
    margin-top: 0;
    left: 0;
  }
  .display {
    height: 100%;
  }
  #back_btn {
    position: absolute;
    left: 8.5rem;
  }
}
</style>
