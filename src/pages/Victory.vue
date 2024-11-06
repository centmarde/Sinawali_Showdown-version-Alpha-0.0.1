<template>
  <div class="victory-screen">
    <h1>Victory!</h1>
    <p>{{ winnerName }} has won the battle!</p>
    <button @click="goToBattleArea">Back to main Menu</button>
  </div>
</template>

<script>
import { useAudioStore } from '@/stores/audioStore'; // Adjust path if needed
import { onMounted } from 'vue';
import { supabase } from "@/lib/supabase";

export default {
  name: "Victory",
  data() {
    return {
      winnerName: localStorage.getItem("winner") || "Unknown",
    };
  },
  methods: {
    async goToBattleArea() {
    
      await this.resetCharacters();
      window.location.href = '/landing';

    },

    async resetCharacters() {
      const { error: error1 } = await supabase
        .from("characters")
        .update({
          health: 100,
          mana: 100,
          agility: 5,
          defense: 0,
          critical_rate: 0,
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
          agility: 0,
          defense: 0,
          critical_rate: 5,
        })
        .eq("id", 2);

      if (error2) {
        console.error("Failed to update character 2:", error2);
        return;
      }
    },
  },
  setup() {
    const audioStore = useAudioStore();

    onMounted(() => {
      audioStore.pauseAudio(); // Pause the audio when this component loads
    });

    return {
      audioStore,
    };
  },
};
</script>

<style scoped>
.victory-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #151515;
}

h1 {
  font-size: 2.5rem;
  color: #28a745;
}

p {
  font-size: 1.5rem;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
