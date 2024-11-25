<template>
  <div class="timer">
    <v-progress-circular
      :value="(timeLeft / totalTime) * 100"
      :color="timerColor"
      rotate="-90"
      size="100"
      width="15"
    >
      <span>{{ timeLeft }}</span>
    </v-progress-circular>

    <!-- Pause Button -->
    <v-btn @click="pauseTimer" class="pause_btn"> Menu </v-btn>

    <!-- Dialog for Pause -->
    <v-dialog
      v-model="dialog"
      max-width="700"
      persistent
      :overlay="true"
      :style="{ zIndex: 99999 }"
    >
      <v-img
        class="align-end text-white"
        src="../../assets/background/main-menu.png"
        cover
      >
        <v-container
          class="d-flex game-pause"
          style="position: absolute; top: 0; left: 0; right: 0; bottom: 0"
        >
          <v-row justify="center" align="center">
            <v-col cols="12" class="text-center">
              <h1 class="pb-2">Game Paused</h1>
              <div class="d-flex flex-column">
                <v-btn
                  class="merienda"
                  size="large"
                  variant="tonal"
                  color="#6f3433"
                  @click="resumeTimer"
                  >Resume</v-btn
                >
                <v-btn
                  class="merienda"
                  size="large"
                  variant="tonal"
                  color="#6f3433"
                  @click="restartGame"
                  >Restart</v-btn
                >
                <v-btn
                  class="merienda"
                  size="large"
                  variant="tonal"
                  color="#6f3433"
                  @click="exitGame"
                  >Main Menu</v-btn
                >
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-img>
    </v-dialog>

    <!-- Dialog for Timer Completion -->
    <v-dialog v-model="timeUpDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Time's up!</v-card-title>
        <v-card-text>You are out of time!</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="proceedToNextPhase">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { usePlayerStore } from "../../stores/healthBarAd"; // Adjust the import path as necessary

export default {
  data() {
    return {
      timeLeft: 60, // Initial countdown time in seconds
      totalTime: 60,
      dialog: false, // Dialog for Pause
      timeUpDialog: false, // Dialog for Time's up
      timer: null,
      isPaused: false, // State to track whether the timer is paused
    };
  },
  computed: {
    timerColor() {
      if (this.timeLeft <= 10) {
        return "red";
      } else if (this.timeLeft <= 20) {
        return "orange";
      } else {
        return "#00897B";
      }
    },
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0 && !this.isPaused) {
          this.timeLeft--;
        } else if (this.timeLeft === 0) {
          this.timeUpDialog = true;
          clearInterval(this.timer);
        }
      }, 1000);
    },
    pauseTimer() {
      this.isPaused = true;
      this.dialog = true;
      clearInterval(this.timer); // Stop the timer when paused
    },
    resumeTimer() {
      this.isPaused = false;
      this.dialog = false;
      this.startTimer(); // Restart the timer
    },
    exitGame() {
      this.dialog = false;
      this.$router.push("/"); // Redirect to the homepage or another route
    },
    proceedToNextPhase() {
      this.timeUpDialog = false;
      if (this.$route.path === "/next_phase") {
        this.$router.push("/battle_area");
      } else {
        this.$router.push("/next_phase");
      }
    },
    restartGame() {
      clearInterval(this.timer); // Clear the existing timer
      this.timeLeft = this.totalTime; // Reset the time left
      this.isPaused = false; // Ensure the timer is not paused
      this.dialog = false; // Close the pause dialog
      this.timeUpDialog = false; // Close the time up dialog if open

      // Reset player health and mana
      const playerStore = usePlayerStore();
      playerStore.updatePlayerHealth(1, 100); // Reset Player 1 health to 100
      playerStore.updatePlayerMana(1, 100); // Reset Player 1 mana to 100
      playerStore.updatePlayerHealth(2, 100); // Reset Player 2 health to 100
      playerStore.updatePlayerMana(2, 100); // Reset Player 2 mana to 100

      this.startTimer(); // Start the timer again
    },
  },
  mounted() {
    this.startTimer();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped>
.v-progress-circular span {
  font-size: 24px;
  font-weight: bold;
}

.v-dialog {
  z-index: 99999 !important; /* Ensure dialog overlays on top of other elements */
}

.v-btn {
  margin-top: 20px;
}
.timer {
  position: fixed;
  top: 20px; /* Adjust this value to position the timer slightly away from the top */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000; /* Ensure it stays on top */
}
.stroke-red {
  border: 2px solid darkred; /* Darker stroke for red */
}

.stroke-orange {
  border: 2px solid darkorange; /* Darker stroke for orange */
}

.stroke-green {
  border: 2px solid darkgreen; /* Darker stroke for green */
}
.pause_btn {
  position: absolute;
  top: 75px; /* Adjust this value to position the timer slightly away from the top */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: transparent !important;
  box-shadow: none !important;
  color: inherit;
}

.game-pause {
  width: 300px;
}

.game-pause h1 {
  font-family: "Merienda", cursive;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  animation: fadeIn 2s ease-out;
  color: #6f3433;
}

.game-pause-btn {
  width: 300px;
}

.game-pause .v-btn {
  font-weight: 800 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
