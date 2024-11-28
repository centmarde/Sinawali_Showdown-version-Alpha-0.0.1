<template>
    <v-container fluid>
      <CharacterBuild />
    </v-container>
  </template>
  
  <script>
  import { onMounted } from "vue";
  import CharacterBuild from "@/components/StoryMode/CharacterBuild.vue";
  import { useAudioAdventure } from "@/stores/adventureAudio";
  
  export default {
    name: "AdventureComponent",
    components: {
      CharacterBuild,
    },
    setup() {
      const adventureAudio = useAudioAdventure();
  
      onMounted(() => {
        adventureAudio.playAdBg(); 
      });
  
      return {};
    },
  };
  </script>
  
  <style lang="scss" scoped>
  </style>
  