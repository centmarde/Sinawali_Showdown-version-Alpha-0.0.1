<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title class="headline">Menu</v-card-title>
      <v-card-actions>
        <v-btn color="red" @click="exitGame">Exit</v-btn>
        <v-btn color="green" @click="closeDialog">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:dialog"],

  setup(props, { emit }) {
    const router = useRouter();

    const closeDialog = () => {
      emit("update:dialog", false);  // Close the dialog
    };

    const exitGame = () => {
      router.push("/");  // Redirect to the home page
    };

    return {
      closeDialog,
      exitGame,
    };
  },
};
</script>
