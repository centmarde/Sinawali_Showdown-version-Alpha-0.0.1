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
        <!-- Player 1 Mana Bar -->
        <v-progress-linear
          class="player1-mana"
          v-model="currentPlayerMana"
          :buffer-value="maxMana"
          height="20"
          rounded
          color="light-blue"
        >
          <span style="color: aliceblue">
            {{ selectedChar === "1" ? player1.mana : player2.mana }} / {{ maxMana }}
          </span>
        </v-progress-linear>
      </v-col>
      <v-col cols="2" lg="2">
      <!--   <timer/> -->
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
        <!-- Player 2 Mana Bar -->
        <v-progress-linear
          class="player2-mana"
          v-model="currentPlayer2Mana"
          :buffer-value="maxMana"
          height="20"
          rounded
          reverse
          color="light-blue"
        >
          <span style="color: aliceblue">
            {{ selectedChar === "2" ? player1.mana : player2.mana }} / {{ maxMana }}
          </span>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router"; // Import useRouter
import { supabase } from "../../lib/supabase";
import { usePlayerStore } from "../../stores/healtbar";

export default {
  setup() {
    const playerStore = usePlayerStore();
    const { player1, player2, updatePlayerMana, updatePlayerHealth } = playerStore;
    const router = useRouter(); // Get the router instance
    const maxHealth = 100;
    const maxMana = 100;
    const selectedChar = localStorage.getItem("selectedCharacter");

    // Computed properties for dynamic health and mana values
    const currentPlayerHealth = computed(() => selectedChar === "1" ? player1.health : player2.health);
    const currentPlayer2Health = computed(() => selectedChar === "1" ? player2.health : player1.health);
    const currentPlayerMana = computed(() => selectedChar === "1" ? player1.mana : player2.mana);
    const currentPlayer2Mana = computed(() => selectedChar === "1" ? player2.mana : player1.mana);

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

    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel("public:characters")
        .on("postgres_changes", { event: "*", schema: "public", table: "characters" }, async (payload) => {
          if (payload.new.id === 1) {
            updatePlayerHealth(1, payload.new.health);
            updatePlayerMana(1, payload.new.mana);
          }
          if (payload.new.id === 2) {
            updatePlayerHealth(2, payload.new.health);
            updatePlayerMana(2, payload.new.mana);
          }

          // Check for victory condition
          if (player1.health <= 0) {
            localStorage.setItem("winner", player2.name);
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay for 1500 ms
            window.location.href = "/Victory";
          } else if (player2.health <= 0) {
            localStorage.setItem("winner", player1.name);
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Delay for 1500 ms
           window.location.href = "/Victory";
          }
        })
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
      maxMana,
      selectedChar,
      currentPlayerHealth,
      currentPlayer2Health,
      currentPlayerMana,
      currentPlayer2Mana,
    };
  },
};
</script>

<style scoped>
/* Common styles for both health bars */
.v-progress-linear {
  color: #f44336;
  margin-top: 2.1%;
  transition: width 0.5s ease; /* Smooth transition for health and mana changes */
}

.player2-health,
.player2-mana,
.player1-health,
.player1-mana {
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
