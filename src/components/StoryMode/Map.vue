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
      </v-img>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Pins data with initial positions and names
        pins: [
          { name: "tribe", x: 300, y: 150 },
          { name: "remnants", x: 300, y: 500 },
          { name: "village", x: 800, y: 500 },
          { name: "manor", x: 850, y: 250 },
          { name: "fields", x: 1200, y: 350 },
          { name: "woods", x: 600, y: 100 },
        ],
      };
    },
    methods: {
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
  