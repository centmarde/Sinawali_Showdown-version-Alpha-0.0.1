<template>
  <div>
    <v-btn class="my-2" color="dark" block to="/"> Back </v-btn>
    <v-row>
        <v-col>
          <player2/>
        </v-col>
        <v-col>
           
        </v-col>
    </v-row>

   
    
  </div>
</template>

<script>
import Player1 from '@/components/Characters/Player1.vue';
import Player2 from '@/components/Characters/Player2.vue';
import player1mirror from '@/components/Characters/player1mirror.vue';
import player2mirror from '@/components/Characters/player2mirror.vue';
</script>

<style lang="scss" scoped></style>
