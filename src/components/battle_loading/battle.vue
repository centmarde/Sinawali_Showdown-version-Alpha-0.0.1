<template>
  <div class="battleground">
   
    <div class="bg1">
      <v-row class="fill-height">
        <v-col cols="6">
          <div class="char1">
            <Player1 v-if="selectedCharacter === 1" />
            <player2mirror v-if="selectedCharacter === 2" />
          </div>
        </v-col>
        <v-col cols="6">
          <div class="char2">
            <player1mirror v-if="selectedCharacter === 2" />
            <Player2 v-if="selectedCharacter === 1" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Player1 from '../Characters/Player1.vue';
import Player2 from '../Characters/Player2.vue';
import player2mirror from '../Characters/player2mirror.vue';
import player1mirror from '../Characters/player1mirror.vue';


export default {
  components: {
    Player1,
    Player2,
    player2mirror,
    player1mirror,
   
  },
  data() {
    return {
      selectedCharacter: null,
    };
  },
  created() {
    // Retrieve the selected character from localStorage
    this.selectedCharacter = Number(localStorage.getItem('selectedCharacter'));
  },
};
</script>

<style lang="scss" scoped>
.battleground {
  position: relative;
  overflow: hidden;
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  background-image: url('https://img.freepik.com/premium-photo/pixel-art-dungeon-background-8-bit-games_334978-2385.jpg?w=826'); 
  background-size: cover; /* Cover the entire area */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Prevent repeating the background */
}



.bg1 {
  position: relative;
  z-index: 2; /* Ensures content is above the background */
  color: white; /* Change text color for visibility if needed */
}

.fill-height {
  height: 100%; /* Ensures the row fills the column height */
}
.char1{
  margin-top: 5rem;
}
.char2{
  margin-top: 5rem;
}
</style>
