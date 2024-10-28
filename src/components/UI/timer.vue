<template>
   <div class="timer" ><v-progress-circular
        :value="(timeLeft / totalTime) * 100"
        :color="timerColor"
        rotate="-90"
        size="100"
        width="15"
      >
        <span>{{ timeLeft }}s</span>
      </v-progress-circular>
  
      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5">Time's up!</v-card-title>
          <v-card-text>You are out of time!</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="proceedToNextPhase">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog></div>
      
   
  </template>
  
  <script>
  export default {
    data() {
      return {
        timeLeft: 120, // Initial countdown time in seconds
        totalTime: 120,
        dialog: false,
        timer: null,
      };
    },
    computed: {
      timerColor() {
        if (this.timeLeft <= 10) {
          return 'red';
        } else if (this.timeLeft <= 20) {
          return 'orange';
        } else {
          return '#00897B';
        }
      },
    },
    methods: {
      startTimer() {
        this.timer = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            this.dialog = true;
            clearInterval(this.timer);
          }
        }, 1000);
      },
      proceedToNextPhase() {
        this.dialog = false;
        if (this.$route.path === '/next_phase') {
          this.$router.push('/battle_area');
        } else {
          this.$router.push('/next_phase');
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
  .timer {
  position: fixed;
  top: 10px; /* Adjust this value to position the timer slightly away from the top */
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

  </style>
  