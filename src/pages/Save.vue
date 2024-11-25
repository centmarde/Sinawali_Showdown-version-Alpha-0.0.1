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
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { useRouter } from "vue-router";
  import { supabase } from "@/lib/supabase";
  import { useAudioAdventure } from "@/stores/adventureAudio";
  
  export default {
    name: "AdventureSelector",
    setup() {
      const audioStore = useAudioAdventure();
      const router = useRouter();
      const adventures = ref([]);
      const characters = ref({});
      const dialogVisible = ref(false);
      const adventureToDelete = ref(null);
  
      // Fetch adventures
      const fetchAdventures = async () => {
        try {
          const { data, error } = await supabase.from("adventures").select("*");
          if (error) throw error;
          adventures.value = data;
        } catch (error) {
          console.error("Error fetching adventures:", error);
        }
      };
  
      // Fetch characters associated with adventures
      const fetchCharacters = async () => {
        try {
          const { data, error } = await supabase
            .from("characters")
            .select("id, adventure_id");
          if (error) throw error;
  
          data.forEach((char) => {
            characters.value[char.adventure_id] = char.id;
          });
        } catch (error) {
          console.error("Error fetching characters:", error);
        }
      };
  
      // Continue adventure action
      const continueAdventure = (adventure) => {
        try {
          audioStore.playClick();
          const characterId = characters.value[adventure.id];
          if (!characterId) return;
  
          const userId = localStorage.getItem("user_id");
          if (!userId) {
            console.error("No user_id found in localStorage");
            return;
          }
  
          // Save data to localStorage
          localStorage.setItem("user_id", userId);
          localStorage.setItem("adventure_id", adventure.id);
          localStorage.setItem("character_id", characterId);
  
          router.push("/story_base");
        } catch (error) {
          console.error("Error continuing adventure:", error);
        }
      };
  
      // Open delete confirmation dialog
      const openDeleteDialog = (adventureId) => {
        audioStore.playClick();
        adventureToDelete.value = adventureId;
        dialogVisible.value = true;
      };
  
      // Confirm deletion
      const confirmDelete = async () => {
        try {
          if (!adventureToDelete.value) return;
          audioStore.playClick();
  
          const { error } = await supabase
            .from("adventures")
            .delete()
            .eq("id", adventureToDelete.value);
          if (error) throw error;
  
          adventures.value = adventures.value.filter(
            (adventure) => adventure.id !== adventureToDelete.value
          );
          dialogVisible.value = false;
        } catch (error) {
          console.error("Error deleting adventure:", error);
        }
      };
  
      // Create new adventure
      const createNewAdventure = () => {
        audioStore.playClick();
        router.push("/story_character");
      };
  
      onMounted(() => {
        fetchAdventures();
        fetchCharacters();
        audioStore.playAdBg();
      });
  
      onBeforeUnmount(() => {
        audioStore.pauseAdBg();
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
  