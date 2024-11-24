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
      max-width="400"
      persistent
      :overlay="true"
      :style="{ zIndex: 99999 }"
    >
      <v-card>
        <v-card-title class="text-h5">Menu</v-card-title>
        <v-card-text>Do you want to continue or exit?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="resumeTimer">Continue</v-btn>
          <v-btn color="error" @click="exitGame">Exit</v-btn>
        </v-card-actions>
      </v-card>
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
      if (this.$route.path === "/next_phase_ai") {
        this.$router.push("/battle_area_ai");
      } else {
        this.$router.push("/next_phase_ai");
      }
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
</style>
