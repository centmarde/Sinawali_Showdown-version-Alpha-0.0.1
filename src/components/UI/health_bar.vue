<template>
  <v-container fluid fill-height class="d-flex align-center justify-center">
    <v-row class="d-flex justify-content-center">
      <v-col cols="4" lg="4" md="4">
        <!-- Player 1 Health Bar -->
        <div
          :class="[
            'player1-health-border',
            { 'low-health-border': currentPlayerHealth <= 30 },
          ]"
        >
          <v-progress-linear
            class="slanted-health-player1"
            v-model="currentPlayerHealth"
            :buffer-value="maxHealth"
            :color="player1HealthColor"
            height="26"
          >
          </v-progress-linear>
        </div>
        <!-- Player 1 Mana Bar -->
        <div class="player1-mana-border me-lg-8 me-md-8 me-sm-6">
          <v-progress-linear
            class="slanted-mana-player1"
            v-model="currentPlayerMana"
            :buffer-value="maxMana"
            height="12"
            color="light-blue"
          >
          </v-progress-linear>
        </div>
      </v-col>
      <v-col cols="1">
        <!-- Conditionally render Timer component based on route -->
        <Timer v-if="isStandardBattleRoute" />
        <TimerAi v-else-if="isAiBattleRoute" />
      </v-col>
      <!-- Player 2 Health Bar -->
      <v-col cols="4" lg="4" md="4">
        <div
          :class="[
            'player2-health-border',
            { 'low-health-border': currentPlayer2Health <= 30 },
          ]"
        >
          <v-progress-linear
            class="slanted-health-player2"
            v-model="currentPlayer2Health"
            :buffer-value="maxHealth"
            :color="player2HealthColor"
            height="26"
            reverse
          >
          </v-progress-linear>
        </div>

        <!-- Player 2 Mana Bar -->
        <div class="player2-mana-border ms-lg-8 ms-md-8 ms-sm-6">
          <v-progress-linear
            class="slanted-mana-player2"
            v-model="currentPlayer2Mana"
            :buffer-value="maxMana"
            height="12"
            reverse
            color="light-blue"
          >
          </v-progress-linear>
        </div>
      </v-col>
    </v-row>

    <!-- Player Image with Name-->
    <div :class="['player1-img', { 'glowing-shadow': isPlayer1Turn }]">
      <v-img :src="player1Image" width="130"></v-img>
    </div>

    <div class="player1-name">
      <span>{{ player1Name }}</span>
    </div>

    <div :class="['player2-img', { 'glowing-shadow': isPlayer2Turn }]">
      <v-img :src="player2Image" width="130"></v-img>
    </div>

    <div class="player2-name">
      <span>{{ player2Name }}</span>
    </div>
  </v-container>
</template>

<script setup>
// Import necessary functions and components
import { computed, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { supabase } from "../../lib/supabase";
import { usePlayerStore } from "../../stores/healtbar";
import Timer from "./timer.vue";
import TimerAi from "./timerAi.vue";

// Initialize route and router
const route = useRoute();
const router = useRouter();

// Initialize player store and destructure necessary properties
const playerStore = usePlayerStore();
const { player1, player2, updatePlayerMana, updatePlayerHealth } = playerStore;

// Define constants for max health and mana
const maxHealth = 100;
const maxMana = 100;

// Get selected character from local storage
const selectedChar = localStorage.getItem("selectedCharacter");

// Computed properties to determine the current route
const isStandardBattleRoute = computed(() =>
  ["battle_area", "next_phase"].includes(route.name)
);
const isAiBattleRoute = computed(() =>
  ["battle_area_ai", "next_phase_ai"].includes(route.name)
);

// Computed properties for dynamic health and mana values
const currentPlayerHealth = computed(() =>
  selectedChar === "1" ? player1.health : player2.health
);
const currentPlayer2Health = computed(() =>
  selectedChar === "1" ? player2.health : player1.health
);
const currentPlayerMana = computed(() =>
  selectedChar === "1" ? player1.mana : player2.mana
);
const currentPlayer2Mana = computed(() =>
  selectedChar === "1" ? player2.mana : player1.mana
);

const isPlayer1Turn = computed(
  () => route.name === "battle_area" || route.name === "battle_area_ai"
);
const isPlayer2Turn = computed(
  () => route.name === "next_phase" || route.name === "next_phase_ai"
);

// Computed properties for dynamic player images and names
const player1Image = ref("");
const player2Image = ref("");

if (selectedChar === "1") {
  import("../../assets/anim/red-av.png").then((module) => {
    player1Image.value = module.default;
  });
  import("../../assets/anim/yellow-av.png").then((module) => {
    player2Image.value = module.default;
  });
} else {
  import("../../assets/anim/yellow-av.png").then((module) => {
    player1Image.value = module.default;
  });
  import("../../assets/anim/red-av.png").then((module) => {
    player2Image.value = module.default;
  });
}

const player1Name = computed(() => (selectedChar === "1" ? "Kidlat" : "Alon"));
const player2Name = computed(() => (selectedChar === "1" ? "Alon" : "Kidlat"));

// Computed properties for dynamic health bar colors
const player1HealthColor = computed(() => {
  const health = currentPlayerHealth.value;
  if (health > 75) return "#e6d011"; // Full health color
  if (health > 35) return "orange"; // Middle health color
  return "red"; // Low health color
});

const player2HealthColor = computed(() => {
  const health = currentPlayer2Health.value;
  if (health > 75) return "#e6d011"; // Full health color
  if (health > 35) return "orange"; // Middle health color
  return "red"; // Low health color
});

// Function to fetch character data from the database
const fetchCharacterData = async () => {
  try {
    const { data: player1Data } = await supabase
      .from("characters")
      .select("name, health, mana")
      .eq("id", 1)
      .single();
    const { data: player2Data } = await supabase
      .from("characters")
      .select("name, health, mana")
      .eq("id", 2)
      .single();

    if (player1Data) {
      updatePlayerHealth(1, player1Data.health);
      updatePlayerMana(1, player1Data.mana);
    }
    if (player2Data) {
      updatePlayerHealth(2, player2Data.health);
      updatePlayerMana(2, player2Data.mana);
    }
  } catch (error) {
    console.error("Error fetching character data:", error);
  }
};

// Function to check victory condition
const checkVictoryCondition = () => {
  if (player1.health <= 0) {
    localStorage.setItem("winner", player2.name);

    setTimeout(() => {
      router.push({ name: "Victory" });
    }, 3000); // 3-second delay
  } else if (player2.health <= 0) {
    localStorage.setItem("winner", player1.name);

    setTimeout(() => {
      router.push({ name: "Victory" });
    }, 3000); // 3-second delay
  }
};

// Function to set up real-time subscription for character data
const setupRealtimeSubscription = () => {
  const channel = supabase
    .channel("public:characters")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "characters" },
      async (payload) => {
        const { id, health, mana } = payload.new;
        if (id === 1) {
          updatePlayerHealth(1, health);
          updatePlayerMana(1, mana);
        } else if (id === 2) {
          updatePlayerHealth(2, health);
          updatePlayerMana(2, mana);
        }

        // Check for victory condition
        checkVictoryCondition();
      }
    )
    .subscribe();
};

// Fetch character data and set up real-time subscription when component is mounted
onMounted(() => {
  fetchCharacterData();
  setupRealtimeSubscription();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap");

/* Common styles for both health bars */
.v-progress-linear {
  transition: width 0.5s ease; /* Smooth transition for health and mana changes */
}

.player1-health-border {
  background: rgb(21, 21, 22);
  padding: 4px;
  /* Clip-path to create slanted border */
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
}

.player1-mana-border {
  background: rgb(21, 21, 22);
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 4px;
  /* Clip-path to create slanted border */
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0 100%);
  display: flex;
  justify-content: flex-end; /* Align content to the end */
  align-items: center; /* Center vertically */
  width: 200px; /* Set the width to match slanted-mana-player1 */
  margin-left: auto; /* Push the element to the end */
}

.slanted-health-player1 {
  clip-path: polygon(5% 0, 99% 0, 95% 100%, 1% 100%);
}

.slanted-mana-player1 {
  clip-path: polygon(5% 0, 99% 0, 95% 100%, 1% 100%);
  width: 100%; /* Set the width to 100% to match the parent */
}

.player2-health-border {
  background: rgb(21, 21, 22);
  padding: 4px;
  /* Clip-path to create slanted border */
  clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%);
}

.player2-mana-border {
  background: rgb(21, 21, 22);
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 4px;
  /* Clip-path to create slanted border */
  clip-path: polygon(0 0, 95% 0, 100% 100%, 5% 100%);
  display: flex;
  justify-content: flex-start; /* Align content to the start */
  align-items: center; /* Center vertically */
  width: 200px; /* Set the width to match slanted-mana-player1 */
}

.slanted-health-player2 {
  clip-path: polygon(1% 0, 95% 0, 99% 100%, 5% 100%);
}

.slanted-mana-player2 {
  clip-path: polygon(0 0, 94% 0, 98% 100%, 4% 100%);
  width: 100%; /* Set the width to 100% to match the parent */
}

.player1-img {
  position: absolute;
  top: -10px;
  left: 80px;
  z-index: 1;
}

.player2-img {
  position: absolute;
  top: -10px;
  right: 80px;
  z-index: 1;
}

.player1-name {
  position: absolute;
  top: 55px;
  left: 230px;
  z-index: 1;
  color: #171717;
  font-size: 26px;
  font-weight: 900;
  font-family: "Rock Salt", serif;
}

.player2-name {
  position: absolute;
  top: 55px;
  right: 230px;
  z-index: 1;
  color: #171717;
  font-size: 26px;
  font-weight: 900;
  font-family: "Rock Salt", serif;
}

.glowing-shadow {
  display: inline-block;
  box-shadow: 0 0 50px 5px rgba(255, 0, 0, 0.7); /* Initial glowing shadow */
  border-radius: 50%; /* Optional: to make the shadow more circular */
}

.low-health-border {
  animation: fadeInOutBorder 1.5s infinite ease-in-out;
}

.hp {
  position: fixed; /* Fixed positioning */
  z-index: 9999; /* Ensure it appears on top */
}

@keyframes fadeInOutBorder {
  0%,
  100% {
    box-shadow: 0 0 20px 5px rgba(255, 0, 0, 0.7);
    background-color: rgb(9, 0, 0);
  }
  50% {
    box-shadow: 0 0 40px 10px rgba(255, 0, 0, 0.7);
    background-color: rgb(77, 0, 0);
  }
}

/* Media queries for large */
@media (max-width: 1124px) {
  .player1-img,
  .player2-img {
    width: 110px;
  }

  .player1-name,
  .player2-name {
    font-size: 22px;
  }

  .player1-name {
    top: 55px;
    left: 180px;
  }

  .player2-name {
    top: 55px;
    right: 180px;
  }
}

/* Media queries for medium */
@media (max-width: 992px) {
  .player1-img,
  .player2-img {
    width: 100px;
  }

  .player1-img {
    top: -10px;
    left: 50px;
  }

  .player2-img {
    top: -10px;
    right: 50px;
  }

  .player1-name,
  .player2-name {
    font-size: 18px;
  }

  .player1-name {
    top: 55px;
    left: 130px;
  }

  .player2-name {
    top: 55px;
    right: 130px;
  }
}

/* Media queries for small */
@media (max-width: 768px) {
  .player1-mana-border {
    width: 100px;
  }

  .player2-mana-border {
    width: 100px;
  }

  .player1-img,
  .player2-img {
    width: 80px;
  }

  .player1-img {
    top: -10px;
    left: 30px;
  }

  .player2-img {
    top: -10px;
    right: 30px;
  }

  .player1-name,
  .player2-name {
    font-size: 14px;
  }

  .player1-name {
    top: 55px;
    left: 100px;
  }

  .player2-name {
    top: 55px;
    right: 100px;
  }
}

/* Media queries for extra small */
@media (max-width: 576px) {
  .player1-mana-border {
    width: 60px;
  }

  .player2-mana-border {
    width: 60px;
  }

  .player1-img,
  .player2-img {
    width: 70px;
  }

  .player1-img {
    top: -10px;
    left: 10px;
  }

  .player2-img {
    top: -10px;
    right: 10px;
  }

  .player1-name,
  .player2-name {
    font-size: 10px;
  }

  .player1-name {
    top: 55px;
    left: 60px;
  }

  .player2-name {
    top: 55px;
    right: 60px;
  }
}
</style>
