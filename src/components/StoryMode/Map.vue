<template>
  <v-container fluid class="d-flex justify-center align-center map-container">
    <v-img
      src="@/assets/maps/map1.jpeg"
      class="map-background"
      alt="DND Map"
      cover
    >
      <!-- Pin Buttons -->
      <div v-for="(pin, index) in pins" :key="index" :style="getPinStyle(pin)">
        <v-btn
          class="circle-btn"
          @click="handlePinClick(pin.name)"
          elevation="3"
        >
          {{ pin.name }}
        </v-btn>
      </div>

      <!-- Cards Container -->
      <div v-if="filteredCards.length > 0" class="cards-container pa-4">
        <v-img
          v-for="(card, index) in limitedCards"
          :key="index"
          :src="card.img"
          class="card-image"
        />
      </div>

      <!-- Character Stats -->
      <div class="character-stats pa-3">
        <small class="text-uppercase font-weight-medium">Max Points</small>
        <v-progress-linear
          class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
          :model-value="health"
          max="100"
          color="red"
          height="20"
          rounded
          :style="`--progress-shadow-color: rgba(255, 0, 0, ${health / 100});`"
        >
          <template v-slot:default>
            <div class="progress-content">
              <strong>{{ health }}%</strong>
            </div>
          </template>
        </v-progress-linear>

        <small class="text-uppercase font-weight-medium">Max Energy</small>
        <v-progress-linear
          class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
          :model-value="mana"
          max="100"
          color="blue"
          height="20"
          rounded
          :style="`--progress-shadow-color: rgba(0, 0, 255, ${mana / 100});`"
        >
          <template v-slot:default>
            <div class="progress-content">
              <strong>{{ mana }}%</strong>
            </div>
          </template>
        </v-progress-linear>

        <small class="text-uppercase font-weight-medium">Max Agility</small>
        <v-progress-linear
          class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
          :model-value="agility"
          max="100"
          color="green"
          height="20"
          rounded
          :style="`--progress-shadow-color: rgba(0, 0, 255, ${agility / 100});`"
        >
          <template v-slot:default>
            <div class="progress-content">
              <strong>{{ agility }}%</strong>
            </div>
          </template>
        </v-progress-linear>

        <small class="text-uppercase font-weight-medium"
          >Max Critical Rate</small
        >
        <v-progress-linear
          class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
          :model-value="critical_rate"
          max="100"
          color="orange"
          height="20"
          rounded
          :style="`--progress-shadow-color: rgba(128, 0, 128, ${
            critical_rate / 100
          });`"
        >
          <template v-slot:default>
            <div class="progress-content">
              <strong>{{ critical_rate }}%</strong>
            </div>
          </template>
        </v-progress-linear>

        <small class="text-uppercase font-weight-medium">Max Defense</small>
        <v-progress-linear
          class="mt-2 mb-4 text-overline font-weight-bold animated-progress"
          :model-value="defense"
          max="100"
          color="purple"
          height="20"
          rounded
          :style="`--progress-shadow-color: rgba(255, 165, 0, ${
            defense / 100
          });`"
        >
          <template v-slot:default>
            <div class="progress-content">
              <strong>{{ defense }}%</strong>
            </div>
          </template>
        </v-progress-linear>
      </div>
    </v-img>

    <div v-if="filteredCards.length > 4" class="card-plus text-center">
      <h2>+{{ filteredCards.length - 4 }}</h2>
    </div>
  </v-container>
</template>

<script>
import { supabase } from "@/lib/supabase";
import { de } from "vuetify/locale";

export default {
  data() {
    return {
      pins: [
        { name: "tribe", x: 300, y: 150 },
        { name: "remnants", x: 300, y: 500 },
        { name: "village", x: 800, y: 500 },
        { name: "manor", x: 850, y: 250 },
        { name: "fields", x: 1200, y: 350 },
        { name: "woods", x: 600, y: 100 },
      ],
      cards: [], // Array to hold all cards
      deckBuilds: [], // Array to hold deck build data
      health: 0, // Character health
      mana: 0, // Character mana
      agility: 0, // Character agility
      defense: 0, // Character defense
      critical_rate: 0, // Character critical rate
    };
  },
  computed: {
    filteredCards() {
      const deckCardIds = this.deckBuilds.map((build) => build.card_id);
      return this.cards.filter((card) => deckCardIds.includes(card.id));
    },
    limitedCards() {
      return this.filteredCards.slice(0, 5);
    },
  },
  mounted() {
    this.fetchDeckBuilds();
    this.fetchCharacterStats();
  },
  methods: {
    async fetchDeckBuilds() {
      const userId = localStorage.getItem("user_id");
      const adventureId = localStorage.getItem("adventure_id");
      try {
        const { data: deckData, error } = await supabase
          .from("deck_builds")
          .select("*")
          .eq("user_id", userId)
          .eq("adventure_id", adventureId);

        if (error) throw error;

        if (deckData && deckData.length > 0) {
          this.deckBuilds = deckData;
          this.fetchCards();
        }
      } catch (error) {
        console.error("Error fetching deck builds:", error);
        // Provide user feedback here
      }
    },

    async fetchCards() {
      try {
        const { data, error } = await supabase.from("cards").select("img, id");

        if (error) throw error;

        if (data && data.length > 0) {
          this.cards = data;
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        // Provide user feedback here
      }
    },

    async fetchCharacterStats() {
      try {
        const characterId = localStorage.getItem("character_id");
        if (!characterId) {
          console.warn("No character ID found in localStorage.");
          return;
        }

        // Fetch character stats from the database
        const { data: characterData, error } = await supabase
          .from("characters")
          .select("health, mana, agility, defense, critical_rate")
          .eq("id", characterId)
          .single();

        if (error) {
          console.error("Error fetching character stats:", error);
          return;
        }

        // Update health and mana properties
        this.health = characterData.health ?? 0;
        this.mana = characterData.mana ?? 0;
        this.agility = characterData.agility ?? 0;
        this.defense = characterData.defense ?? 0;
        this.critical_rate = characterData.critical_rate ?? 0;
      } catch (error) {
        console.error("Error in fetchCharacterStats:", error.message);
      }
    },

    handlePinClick(locationName) {
      this.$emit("pinClicked", locationName);
    },

    getPinStyle(pin) {
      return {
        position: "absolute",
        top: pin.y + "px",
        left: pin.x + "px",
        transform: "translate(-50%, -50%)",
      };
    },
  },
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-background {
  width: 100%;
  height: 100%;
}

.circle-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  color: white;
  background-color: #4646462f;
}

.cards-container {
  background: rgba(0, 0, 0, 0.435);
  backdrop-filter: blur(3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(3px);
  position: absolute;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}

.card-image {
  height: 90px;
  width: 80px;
  border-radius: 10px;
  opacity: 0.8;
  margin-right: 5px;
}

.card-plus {
  position: absolute;
  top: 15px;
  left: 372px;
  width: 100px;
  height: 121px;

  background: rgba(0, 0, 0, 0.52);
  backdrop-filter: blur(3px);
  box-shadow: 5px 5px 40px rgba(0, 0, 0, 0.568);
  -webkit-backdrop-filter: blur(3px);

  display: flex;
  justify-content: center;
  align-items: center;
}

.character-stats {
  /* From https://css.glass */
  background: rgba(0, 0, 0, 0.435);
  backdrop-filter: blur(3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: blur(3px);
  position: absolute;
  top: 140px;
  width: 230px;
}

.progress-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
}

.animated-progress {
  animation: brighten 2s infinite;
  box-shadow: 0 0 15px var(--progress-shadow-color);
}

@keyframes brighten {
  0%,
  100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.5);
  }
}
</style>
