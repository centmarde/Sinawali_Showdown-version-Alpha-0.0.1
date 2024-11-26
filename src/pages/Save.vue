<template>
  <v-container fluid>
    <v-row>
      <v-img class="bg"
    src="@/assets/parallax/bbgDarken.png"
    cover></v-img>
   <v-col
  v-for="adventure in adventures"
  :key="adventure.id"
  cols="12"
  md="6"
>
  <v-img
    class="adventure-dialog"
    src="@/assets/background/dialog-bg.png"
    contain
  >
    <v-container
      class="adventure-contents"
    >
      <div class="responsive-content">
        <h5 id="titleM" class="merienda" >Adventure {{ adventure.id }}</h5>
        <p  class="text">
  {{ truncateText(adventure.intro, wordLimit) }}
</p>


      </div>
      <div id="button" class="responsive-content">
        <v-btn
          class="merienda"
          :disabled="!characters[adventure.id]"
          @click="continueAdventure(adventure)"
        >
          Continue Adventure
        </v-btn>
        <v-btn
          class="merienda"
          color="error"
          @click="openDeleteDialog(adventure.id)"
        >
          Delete
        </v-btn>
      </div>
    </v-container>
  </v-img>
</v-col>

    </v-row>

    <!-- Fixed Floating Button -->
    <v-btn
      class="floating-button merienda"
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
            class="merienda"
            color="grey"
            text
            @click="dialogVisible = false"
          >
            Cancel
          </v-btn>
          <v-btn
            class="merienda"
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
      const wordLimit = ref(70);
      

      const updateWordLimit = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        wordLimit.value = 20; // Smaller limit for small screens
      } else if (screenWidth < 1024) {
        wordLimit.value = 45; // Medium limit for tablets
      } else {
        wordLimit.value = 70; // Default limit for larger screens
      }
    };

    const truncateText = (text, wordLimit) => {
      if (!text) return '';
      const words = text.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...'; // Adds ellipsis if truncated
      }
      return text; // Return as is if within limit
    };
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
       // Truncate text to a specific number of words
   
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
        updateWordLimit(); // Set initial limit
        window.addEventListener("resize", updateWordLimit);
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
        truncateText,
        wordLimit,
      };
    },
  };
  </script>
  
  
  <style scoped>
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Ensures the image is in the background */
}
.adventure-dialog {
  position: relative;
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Maintain Image Aspect Ratio */
.adventure-dialog v-img {
  width: 100%;
  aspect-ratio: 16/9; /* Ensures image maintains ratio */
}

/* Adventure Contents */
.adventure-contents {
  position: absolute;
  inset: 0; /* Fills the space inside v-img */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  color: rgba(111, 52, 51, 0.9);
  z-index: 1;
}

/* Responsive Content */
.responsive-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

#button {
  margin-top: 2px;
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4rem;
}

/* Merienda Font Style */
.merienda {
  font-family: "Merienda", cursive;
  font-weight: bold;
  color: #fff;
  background-color: rgba(111, 52, 51, 0.9);
  border-radius: 8px;
}

/* Floating Button */
.floating-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-weight: bold;
}

.text {
  width: 70%;
  font-size: 15px;
}
#titleM{
 margin-top: 7rem;
 padding: 0.5rem;
}
/* For small screens (mobile devices) */
@media (max-width: 400px) {
  .text {
    width: 90%;        /* Increase width for smaller screens */
    font-size: 10px;   /* Smaller font size for better readability */
  }
  #titleM{
 margin-top: 1rem;
}
#button {
  margin-top: 0;
  gap: 2px;
}

}

/* For medium screens (tablets) */
@media (max-width: 1024px) {
  .text {
    width: 70%;        
    font-size: 12px;   
  }
  #titleM{
 margin-top: 2rem;
}
}

</style>
