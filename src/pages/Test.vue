<template>
  <div>
    <v-btn class="my-2" color="dark" block to="/"> Back </v-btn>
    <v-row>
      <v-col>
        <Player1/>
      <ConnectionState/>
      </v-col>
        <v-col>
      <Player2/>
        </v-col>
    </v-row>

   
  </div>
</template>

<script>
import Player1 from "@/components/Characters/Player1.vue";
import Player2 from "@/components/Characters/Player2.vue";
import player1mirror from "@/components/Characters/player1mirror.vue";
import player2mirror from "@/components/Characters/player2mirror.vue";
import ConnectionState from "@/components/ConnectionState.vue";
import DeckBuild from "@/components/DeckBuild.vue";

</script>

<style lang="scss" scoped>
//  .overlayBrand {
//   position: fixed;
//   background-color: #C5C5C5;
//   z-index: 5225;
//   width: 200px;
//   height: 200px;
//   bottom: 0%;
//   right: 0%;

// }

.overlay-content {
  position: absolute;
  top: 10%;
  left: 10%;
  color: white;
  z-index: 5225;
}
</style>