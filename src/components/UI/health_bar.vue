<template>
  <v-container fluid fill-height class="d-flex align-center justify-center">
    <v-row class="d-flex justify-content-center">
      <!-- Player 1 Health Bar -->
      <v-col cols="5">
        <v-progress-linear
          class="player1-health"
          v-model="currentPlayerHealth"
          :buffer-value="maxHealth"
          height="20"
          rounded
        >
          <span style="color: aliceblue">
            {{ selectedChar === "1" ? player1.health : player2.health }} /
            {{ maxHealth }}
          </span>
        </v-progress-linear>
      </v-col>
      <v-col cols="2" lg="2">
        <!--  <timer/> -->
      </v-col>
      <!-- Player 2 Health Bar -->
      <v-col cols="5">
        <v-progress-linear
          class="player2-health"
          v-model="currentPlayer2Health"
          :buffer-value="maxHealth"
          height="20"
          rounded
          reverse
        >
          <span style="color: aliceblue">
            {{ selectedChar === "2" ? player1.health : player2.health }} /
            {{ maxHealth }}
          </span>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, onMounted, watch } from "vue";
import timer from "./timer.vue";
import { supabase } from "../../lib/supabase";
import { usePlayerStore } from "../../stores/healtbar";

export default {
  setup() {
    const playerStore = usePlayerStore();
    const { player1, player2 } = playerStore;
    const maxHealth = 100;
    const selectedChar = localStorage.getItem("selectedCharacter");

    // Computed properties for dynamic health values
    const currentPlayerHealth = computed(() => {
      return selectedChar === "1" ? player1.health : player2.health;
    });

    const currentPlayer2Health = computed(() => {
      return selectedChar === "1" ? player2.health : player1.health;
    });

    const fetchCharacterData = async () => {
      try {
        const { data: player1Data } = await supabase
          .from("characters")
          .select("name, health")
          .eq("id", 1)
          .single();

        const { data: player2Data } = await supabase
          .from("characters")
          .select("name, health")
          .eq("id", 2)
          .single();

        if (player1Data) player1.value = player1Data;
        if (player2Data) player2.value = player2Data;
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    };

    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel("public:characters")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "characters" },
          (payload) => {
            if (payload.new.id === 1) {
              player1.health = payload.new.health;
            }
            if (payload.new.id === 2) {
              player2.health = payload.new.health;
            }
          }
        )
        .subscribe();
    };

    onMounted(() => {
      fetchCharacterData();
      setupRealtimeSubscription();
    });

    return {
      player1,
      player2,
      maxHealth,
      selectedChar,
      currentPlayerHealth,
      currentPlayer2Health,
    };
  },
};
</script>

<style scoped>
/* Common styles for both health bars */
.v-progress-linear {
  color: #f44336;
  margin-top: 2.1%;
  transition: width 0.5s ease; /* Smooth transition for health changes */
}
.player2-health {
  border: 2px solid black; /* Add black border */
}
.player1-health {
  border: 2px solid black; /* Add black border */
}

.hp {
  position: fixed; /* Fixed positioning */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust to center the element */
  z-index: 9999; /* Ensure it appears on top */
}
</style>
