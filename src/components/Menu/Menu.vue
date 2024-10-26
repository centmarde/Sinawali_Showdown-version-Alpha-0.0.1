<template>
  <div>
    <br /><br /><br />
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="8" lg="8"> </v-col>
        <v-col cols="12" sm="6" md="4" lg="4">
          <v-card class="pa-4" elevation="3">
            <v-card-title class="text-h5">Menu</v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="d-flex flex-column">
              <v-card-actions class="d-flex flex-column">
               
                <v-btn class="my-2" color="primary" block to="/select_character">
                  Quickstart
                </v-btn>
                <v-btn class="my-2" color="primary" block to="/multiplier">
                  Multiplayer
                </v-btn>
                <v-btn class="my-2" color="primary" block to="/cards">
                  Cards
                </v-btn>
                <v-btn class="my-2" color="primary" block to="/info">
                  Info
                </v-btn>
              </v-card-actions>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "MenuCard",
};
</script>

<style scoped>
.v-card {
  max-width: 400px;
}

router-link {
  text-decoration: none;
}
</style>
