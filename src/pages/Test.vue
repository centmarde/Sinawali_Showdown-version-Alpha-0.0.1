<template>
  <div>
    <v-btn class="my-2" color="dark" block to="/"> Back </v-btn>
    <v-row>
        <v-col>
            <Player1/>
        </v-col>
        <v-col>
            <Player2/>
        </v-col>
    </v-row>

   
    
  </div>
</template>

<script>
import Player1 from '@/components/Characters/Player1.vue';
import Player2 from '@/components/Characters/Player2.vue';

</script>

<style lang="scss" scoped></style>
