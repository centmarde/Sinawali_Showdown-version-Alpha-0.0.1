<template>
  <v-container fluid fill-height class="d-flex align-center justify-center">
    <v-row class="d-flex justify-content-center">
      <!-- Player 1 Health Bar -->
      <v-col cols="6">
        <v-progress-linear
          class="player1-health" 
          v-model="currentPlayerHealth"
          :buffer-value="maxHealth"
          height="20"
          rounded
        >
          <span style="color: aliceblue;">
            {{ selectedChar === '1' ? player1.health : player2.health }} / {{ maxHealth }}
          </span>
        </v-progress-linear>
      </v-col>

      <!-- Player 2 Health Bar -->
      <v-col cols="6">
        <v-progress-linear
          class="player2-health" 
          v-model="currentPlayer2Health"
          :buffer-value="maxHealth"
          height="20"  
          rounded
          reverse 
        >
          <span style="color: aliceblue;">
            {{ selectedChar === '2' ? player1.health : player2.health }} / {{ maxHealth }}
          </span>
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { supabase } from "../../lib/supabase"; // Ensure this path is correct

export default {
  setup() {
    const player1 = ref({ name: "", health: 100 });
    const player2 = ref({ name: "", health: 100 });
    const maxHealth = 100;
    const selectedChar = localStorage.getItem('selectedCharacter');

    // Computed properties for dynamic health values
    const currentPlayerHealth = computed(() => {
      return selectedChar === '1' ? player1.value.health : player2.value.health;
    });

    const currentPlayer2Health = computed(() => {
      return selectedChar === '1' ? player2.value.health : player1.value.health;
    });

    const fetchCharacterData = async () => {
      const char1Id = 1;
      const char2Id = 2;

      try {
        const { data: player1Data, error: player1Error } = await supabase
          .from("characters")
          .select("name, health")
          .eq("id", char1Id)
          .single();

        const { data: player2Data, error: player2Error } = await supabase
          .from("characters")
          .select("name, health")
          .eq("id", char2Id)
          .single();

        if (player1Error) throw player1Error;
        if (player2Error) throw player2Error;

        if (player1Data) player1.value = player1Data;
        if (player2Data) player2.value = player2Data;
      } catch (error) {
        console.error("Error fetching character data:", error);
      }
    };

    const setupRealtimeSubscription = () => {
      const channel = supabase
        .channel("public:characters")
        .on("postgres_changes", { event: "*", schema: "public", table: "characters" }, (payload) => {
          // Check if the health update is for Player 1 or Player 2
          if (payload.new.id === 1) {
            player1.value.health = payload.new.health;
          }
          if (payload.new.id === 2) {
            player2.value.health = payload.new.health;
          }
        })
        .subscribe();

      return channel;
    };

    // Watch for changes in health to make the UI health bar respond in real-time
    watch(player1, (newVal, oldVal) => {
      if (newVal.health < oldVal.health) {
        console.log("Player 1 took damage:", oldVal.health - newVal.health);
      }
    });

    watch(player2, (newVal, oldVal) => {
      if (newVal.health < oldVal.health) {
        console.log("Player 2 took damage:", oldVal.health - newVal.health);
      }
    });

    onMounted(() => {
      fetchCharacterData();
      setupRealtimeSubscription();
    });

    onUnmounted(() => {
      supabase.removeAllSubscriptions();
    });

    return { player1, player2, maxHealth, selectedChar, currentPlayerHealth, currentPlayer2Health }; // Ensure selectedChar is returned
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
