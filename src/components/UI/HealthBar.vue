<template>
    <v-container fluid fill-height class="d-flex align-center justify-center">
      <v-row class="d-flex justify-content-center">
        <v-col cols="5">
          <v-progress-linear
            class="player1-health"
            v-model="currentPlayerHealth"
            :buffer-value="player1.health"
            height="20"
            rounded
          >
            <span style="color: aliceblue">
              {{ selectedChar === player1.id ? player1.health : player2.health }} /
              100
            </span>
          </v-progress-linear>
          <v-progress-linear
            class="player1-mana"
            v-model="currentPlayerMana"
            :buffer-value="player1.mana"
            height="20"
            rounded
            color="light-blue"
          >
            <span style="color: aliceblue">
              {{ selectedChar === player1.id ? player1.mana : player2.mana }} /
              100
            </span>
          </v-progress-linear>
        </v-col>
        <v-col cols="2"> <TimerAd/></v-col>
       
        <v-col cols="5">
          <v-progress-linear
            class="player2-health"
            v-model="currentPlayer2Health"
            :buffer-value="player2.health"
            height="20"
            rounded
            reverse
          >
            <span style="color: aliceblue">
              {{ selectedChar === player2.id ? player1.health : player2.health }} /
              100
            </span>
          </v-progress-linear>
          <v-progress-linear
            class="player2-mana"
            v-model="currentPlayer2Mana"
            :buffer-value="player2.mana"
            height="20"
            rounded
            reverse
            color="light-blue"
          >
            <span style="color: aliceblue">
              {{ selectedChar === player2.id ? player1.mana : player2.mana }} /
              100
            </span>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { computed, onMounted, ref, onUnmounted } from "vue";
  import { supabase } from "../../lib/supabase";
  import { usePlayerStore } from "../../stores/healthBarAd";
  import { useRoute } from "vue-router";

  import TimerAd from "./timerAd.vue";
  
  export default {
    components: { TimerAd },
    setup() {
      const route = useRoute();
      const playerStore = usePlayerStore();
      const { player1, player2, updatePlayerMana, updatePlayerHealth } = playerStore;
      const selectedChar = localStorage.getItem("character_id");
      const isStandardBattleRoute = computed(() =>
        ["ad_battle", "next_phase_ad"].includes(route.name)
      );
  
      const characterId = localStorage.getItem("character_id");
      const enemyId = localStorage.getItem("enemy_id");
  
      player1.id = characterId;
      player2.id = enemyId;
  
      const currentPlayerHealth = computed(() => (selectedChar === player1.id ? player1.health : player2.health));
      const currentPlayer2Health = computed(() => (selectedChar === player1.id ? player2.health : player1.health));
      const currentPlayerMana = computed(() => (selectedChar === player1.id ? player1.mana : player2.mana));
      const currentPlayer2Mana = computed(() => (selectedChar === player1.id ? player2.mana : player1.mana));
  
      const fetchCharacterData = async () => {
        try {
          const { data: player1Data } = await supabase
            .from("characters")
            .select("name, health, mana")
            .eq("id", selectedChar)
            .single();
  
          const { data: player2Data } = await supabase
            .from("enemies")
            .select("name, health, mana")
            .eq("id", enemyId)
            .single();
  
          if (player1Data) {
            updatePlayerHealth(1, player1Data.health);
            updatePlayerMana(1, player1Data.mana);
            player1.health = player1Data.health;
            player1.mana = player1Data.mana;
          }
  
          if (player2Data) {
            updatePlayerHealth(2, player2Data.health);
            updatePlayerMana(2, player2Data.mana);
            player2.health = player2Data.health;
            player2.mana = player2Data.mana;
          }
        } catch (error) {
          console.error("Error fetching character data:", error);
        }
      };
  
      // Separate subscription for player 1 (characters)
      const setupPlayer1RealtimeSubscription = () => {
        const player1Channel = supabase
          .channel("public:characters")
          .on("postgres_changes", { event: "*", schema: "public", table: "characters" }, async (payload) => {
            const { id, health, mana } = payload.new;
            if (id === selectedChar) {
              updatePlayerHealth(1, health);
              updatePlayerMana(1, mana);
              player1.health = health;
              player1.mana = mana;
            }
          })
          .subscribe();
      };
  
      // Separate subscription for player 2 (enemies)
      const setupPlayer2RealtimeSubscription = () => {
        const player2Channel = supabase
          .channel("public:enemies")
          .on("postgres_changes", { event: "*", schema: "public", table: "enemies" }, async (payload) => {
            const { id, health, mana } = payload.new;
            if (id === enemyId) {
              updatePlayerHealth(2, health);
              updatePlayerMana(2, mana);
              player2.health = health;
              player2.mana = mana;
            }
          })
          .subscribe();
      };
  
      // Soft reload every second
      let interval;
      const triggerSoftUpdate = () => {
        interval = setInterval(() => {
          fetchCharacterData(); 
        }, 1000); 
      };
  
      onMounted(() => {
        fetchCharacterData();
        setupPlayer1RealtimeSubscription();
        setupPlayer2RealtimeSubscription();
        triggerSoftUpdate();  // Start the soft reload when the component mounts
      });
  
      onUnmounted(() => {
        clearInterval(interval);  // Clean up the interval when the component is unmounted
      });
  
      return {
        player1,
        player2,
        selectedChar,
        currentPlayerHealth,
        currentPlayer2Health,
        currentPlayerMana,
        currentPlayer2Mana,
        isStandardBattleRoute,
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