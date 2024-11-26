<template>
  <div id="info" v-if="activeCard" class="pt-6">
    <v-row class="align-center">
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
          <h2 class="mt-1 merienda">{{ activeCard.name }}</h2>
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
    <div class="mt-5 me-10">
      <div class="d-flex justify-content-between">
        <small class="text-uppercase font-weight-medium">Power</small>
        <small class="text-uppercase font-weight-medium"
          >{{ activeCard.power }}%</small
        >
      </div>
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

      <div class="d-flex justify-content-between">
        <small class="text-uppercase font-weight-medium">Energy Cost</small>
        <small class="text-uppercase font-weight-medium"
          >{{ activeCard.mana_cost }}%</small
        >
      </div>
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

      <div class="d-flex justify-content-between">
        <small class="text-uppercase font-weight-medium">Draw Chance</small>
        <small class="text-uppercase font-weight-medium"
          >{{ activeCard.draw_chance }}%</small
        >
      </div>
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

      <div>
        <!-- Special effect cards -->
        <!-- Burn Effect -->
        <v-card v-if="activeCard.is_burn" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-fire" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Burns the enemy by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_burn }}%</strong
                >
                of their health, causing continuous damage until the effect
                wears off.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Poison Effect -->
        <v-card v-if="activeCard.is_poison" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon
                  icon="mdi-skull-crossbones"
                  :color="rarityColor"
                ></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Poisons the enemy, dealing
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_poison }}%</strong
                >
                of their health as damage over time, weakening them gradually.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Increases Critical Rate Effect -->
        <v-card v-if="activeCard.is_crit_amp" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon
                  icon="mdi-lightning-bolt-outline"
                  :color="rarityColor"
                ></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Increases the critical hit rate damage by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_crit_amp }}%</strong
                >, allowing for more powerful attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Increases Defense Rate Effect -->
        <v-card v-if="activeCard.is_def_amp" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-shield-plus" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Increases the defense rate by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_def_amp }}%</strong
                >, providing better protection against enemy attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Increases Agility Rate Effect -->
        <v-card v-if="activeCard.is_agil_amp" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-run-fast" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Increases agility by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_agil_amp }}%</strong
                >, allowing better chances to dodge attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Defense Debuff Effect -->
        <v-card v-if="activeCard.is_def_debuff" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-shield-remove" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Reduces the enemy's defense by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_def_debuff }}%</strong
                >, making them more vulnerable to attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Agility Debuff Effect -->
        <v-card v-if="activeCard.is_agil_debuff" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-run" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Reduces the enemy's agility by
                <strong :style="{ color: rarityColor }"
                  >{{ activeCard.is_agil_debuff }}%</strong
                >, decreasing their chances to dodge attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Turn Count Effect -->
        <v-card v-if="activeCard.turn_count" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-timer" :color="rarityColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                This effect lasts for
                <strong :style="{ color: rarityColor }">{{
                  activeCard.turn_count
                }}</strong>
                turns, impacting the battle for the specified duration.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <!-- Energy Charge Effect -->
        <v-card v-if="activeCard.is_mana" color="#121212" class="mt-5">
          <v-row>
            <v-col cols="3" class="d-flex align-center justify-center">
              <v-avatar color="white">
                <v-icon icon="mdi-battery-charging" :color="typeColor"></v-icon>
              </v-avatar>
            </v-col>
            <v-col cols="9" class="ps-0">
              <v-card-text class="text-body-2 ps-0">
                Charges the user's energy by
                <strong :style="{ color: typeColor }"
                  >{{ activeCard.is_mana }}%</strong
                >, allowing for more attacks.
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>
      </div>
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
