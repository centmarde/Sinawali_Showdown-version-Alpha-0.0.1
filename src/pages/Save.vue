<template>
    <v-container>
      <v-row>
        <!-- Adventure Cards -->
        <v-col v-for="adventure in adventures" :key="adventure.id" cols="12" md="6">
          <v-card class="p-4">
            <v-card-title>Adventure {{ adventure.id }}</v-card-title>
            <p>{{ adventure.intro }}</p>
  
            <v-card-actions>
              <v-btn
                color="primary"
                :disabled="!characters[adventure.id]"
                @click="continueAdventure(adventure)"
              >
                Continue Adventure
              </v-btn>
              <v-btn
                color="error"
                @click="openDeleteDialog(adventure.id)"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Fixed Floating Button -->
      <v-btn
        class="floating-button"
        color="secondary"
        @click="createNewAdventure"
      >
        Create New Adventure
      </v-btn>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog
        v-model="dialogVisible"
        max-width="400px"
      >
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete this adventure? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="grey"
              text
              @click="dialogVisible = false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              text
              @click="confirmDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/lib/supabase";
  
  export default {
    name: "AdventureSelector",
    setup() {
      const router = useRouter();
      const adventures = ref([]);
      const characters = ref({});
      const dialogVisible = ref(false);  // Controls the visibility of the dialog
      const adventureToDelete = ref(null);  // Stores the ID of the adventure to be deleted
  
      // Fetch adventures
      const fetchAdventures = async () => {
        const { data, error } = await supabase.from("adventures").select("*");
        if (error) {
          console.error("Error fetching adventures:", error);
        } else {
          adventures.value = data;
        }
      };
  
      // Fetch characters associated with adventures
      const fetchCharacters = async () => {
        const { data, error } = await supabase
          .from("characters")
          .select("id, adventure_id"); // Assuming `adventure_id` links characters to adventures
  
        if (error) {
          console.error("Error fetching characters:", error);
        } else {
          // Map characters to their respective adventure IDs
          data.forEach((char) => {
            characters.value[char.adventure_id] = char.id;
          });
        }
      };
  
      // Continue adventure action
      const continueAdventure = (adventure) => {
        const characterId = characters.value[adventure.id];
        if (!characterId) return;
  
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("No user_id found in localStorage");
          return;
        }
  
        // Save data to localStorage manually as separate entries
        localStorage.setItem("user_id", userId);
        localStorage.setItem("adventure_id", adventure.id);
        localStorage.setItem("character_id", characterId);
  
        // Navigate to story base
        router.push("/story_base");
      };
  
      // Open the delete confirmation dialog
      const openDeleteDialog = (adventureId) => {
        adventureToDelete.value = adventureId;
        dialogVisible.value = true;
      };
  
      // Confirm deletion action
      const confirmDelete = async () => {
        if (!adventureToDelete.value) return;
  
        const { error } = await supabase
          .from("adventures")
          .delete()
          .eq("id", adventureToDelete.value);
  
        if (error) {
          console.error("Error deleting adventure:", error);
        } else {
          // Remove the deleted adventure from the list
          adventures.value = adventures.value.filter(
            (adventure) => adventure.id !== adventureToDelete.value
          );
          dialogVisible.value = false;  // Close the dialog after deletion
        }
      };
  
      // Navigate to create new adventure
      const createNewAdventure = () => {
        router.push("/story_character");
      };
  
      onMounted(() => {
        fetchAdventures();
        fetchCharacters();
      });
  
      return {
        adventures,
        characters,
        continueAdventure,
        openDeleteDialog,
        confirmDelete,
        createNewAdventure,
        dialogVisible,
      };
    },
  };
  </script>
  
  
  
  <style scoped>
  .v-card {
    margin-bottom: 16px;
  }
  
  .floating-button {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    font-weight: bold;
  }
  </style>
  