<template>
 <v-container>
  <v-row>
    <v-col> <Player1 /></v-col>
    <v-col></v-col>
  </v-row>
 </v-container>
</template>

<script>
import Player1 from "@/components/Characters/Player1.vue";


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
