<template>
  <v-container fluid class="d-flex justify-center align-center map-container">
    <v-img
      src="@/assets/maps/map1.jpeg"
      class="map-background"
      alt="DND Map"
      cover
    >
      <!-- Pin Buttons -->
      <div
        v-for="(pin, index) in pins"
        :key="index"
        :style="{
          position: 'absolute',
          top: pin.y + 'px',
          left: pin.x + 'px',
          transform: 'translate(-50%, -50%)',
        }"
      >
        <v-btn
          class="circle-btn"
          @click="handlePinClick(pin.name)"
          elevation="3"
        >
          {{ pin.name }}
        </v-btn>
      </div>

      <!-- Cards Container -->
      <v-card
  v-if="filteredCards.length > 0"
  class="p-1"
  :style="{
    position: 'relative',
    top: '20px',
    left: '20px',
    height: '80px',
    width: '300px',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }"
  
>
  <v-img
    v-for="(card, index) in filteredCards"
    :key="index"
    :src="card.img"
    :style="{
      height: '100%',
      width: 'auto',
      borderRadius: '10px',
      opacity: '0.8', /* Make it transparent */
      order: index === 0 ? 0 : index, /* Ensure the first card is at the start */
    }"
  />
</v-card>

    </v-img>
  </v-container>
</template>


<script>
import { supabase } from '@/lib/supabase';

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
      filteredCards: [], // Array for filtered cards based on deck builds
    };
  },
  mounted() {
    this.fetchDeckBuilds();
  },
  methods: {
    async fetchDeckBuilds() {
      const userId = localStorage.getItem('user_id'); // Move this here
      const adventureId = localStorage.getItem('adventure_id');
      try {
        // Fetch data from the 'deck_builds' table (assuming deck_id links to cards)
        const { data: deckData, error } = await supabase
          .from('deck_builds') // Use the actual table name
          .select('*')
          .eq('user_id', userId)
          .eq('adventure_id', adventureId);

        if (error) throw error;

        if (deckData && deckData.length > 0) {
          this.deckBuilds = deckData; // Store deck build data
          this.fetchCards(); // Now fetch the cards and filter them
        }
      } catch (error) {
        console.error('Error fetching deck builds:', error);
      }
    },

    async fetchCards() {
      try {
        // Fetch data from the 'cards' table
        const { data, error } = await supabase
          .from('cards') // Use the correct table name
          .select('img, id'); // Fetch the 'img' and 'id' columns

        if (error) throw error;

        if (data && data.length > 0) {
          this.cards = data; // Store the fetched cards
          this.filterCards(); // Filter cards based on the deck builds
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    },

    filterCards() {
      // Get all card IDs from the deckBuilds array
      const deckCardIds = this.deckBuilds.map((build) => build.card_id);

      // Filter the cards to only include those whose ID is in the deckCardIds array
      this.filteredCards = this.cards.filter((card) =>
        deckCardIds.includes(card.id)
      );
    },

    handlePinClick(locationName) {
      this.$emit("pinClicked", locationName); // Emit the selected pin name
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
  </style>
  