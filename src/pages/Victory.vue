<template>
  <div class="victory-container">
    <video ref="victoryVideo" autoplay muted playsinline class="victory-video">
      <source src="@/assets/video/Victory.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div class="victory-overlay">
      <h3>{{ winnerName }}</h3>
      <span>has won the battle!</span>
      <PrimBtn
        @click="goToBattleArea"
        content="Back to main Menu"
        width="200px"
        marginLeft="5px"
      />
      <!-- <v-btn @click="goToBattleArea" color="#e6d011">Back to main Menu</v-btn> -->
    </div>
  </div>
</template>

<script>
import { useAudioStore } from "@/stores/audioStore";
import { onMounted, ref } from "vue";
import { supabase } from "@/lib/supabase";
import PrimBtn from "@/components/buttons/PrimBtn.vue";
import router from "@/router";

export default {
  name: "Victory",
  data() {
    return {
      winnerName: localStorage.getItem("winner") || "Unknown",
    };
  },
  methods: {
    async goToBattleArea() {
      const battleId = localStorage.getItem("battleId");

      if (battleId) {
        const { error } = await supabase
          .from("battles")
          .delete()
          .eq("id", battleId);

        if (error) {
          console.error("Failed to delete battle record:", error);
          return;
        }

        localStorage.removeItem("battleId");
      }

      await this.resetDeckBuilds();
      await this.resetCharacters();

      window.location.href = "/";
    },

    async resetCharacters() {
      const { error: error1 } = await supabase
        .from("characters")
        .update({
          health: 100,
          mana: 100,
          agility: 10,
          defense: 0,
          critical_rate: 30,
        })
        .eq("id", 1);

      if (error1) {
        console.error("Failed to update character 1:", error1);
        return;
      }

      const { error: error2 } = await supabase
        .from("characters")
        .update({
          health: 100,
          mana: 100,
          agility: 30,
          defense: 0,
          critical_rate: 10,
        })
        .eq("id", 2);

      if (error2) {
        console.error("Failed to update character 2:", error2);
        return;
      }
    },

    async resetDeckBuilds() {
      const user_id = localStorage.getItem("user_id");

      const { data, error } = await supabase
        .from("deck_builds")
        .delete()
        .eq("user_id", user_id);

      if (error) {
        console.error("Error deleting rows for user_id:", error);
      } else {
        console.log("Rows deleted successfully for user_id:", data);
      }
    },
  },

  setup() {
    const audioStore = useAudioStore();
    const victoryVideo = ref(null);

    onMounted(() => {
      audioStore.pauseAudio(); // Pause the audio when this component loads

      const videoElement = victoryVideo.value;
      if (videoElement) {
        videoElement.addEventListener("timeupdate", () => {
          if (videoElement.duration - videoElement.currentTime <= 0.5) {
            videoElement.pause();
          }
        });
      }
    });

    return {
      audioStore,
      victoryVideo,
    };
  },
};
</script>

<style scoped>
.victory-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.victory-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.victory-overlay {
  position: absolute;
  top: 180px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  animation: zoomIn 2s ease-in-out;
}

@keyframes zoomIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

p {
  font-size: 1.5rem;
}

.v-btn {
  margin-top: 20px;
  font-size: 14px;
}
</style>
