<template>
    <div @click="playAudioOnInteraction">
        <battle />
    </div>
</template>

<script>
import { ref } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import battle from '@/components/battle_page/battle.vue';

export default {
    components: {
        battle,
    },
    setup() {
        const audioStore = useAudioStore();
        const hasInteracted = ref(false);

        const playAudioOnInteraction = () => {
            if (!hasInteracted.value) {
                audioStore.playAudio();
                hasInteracted.value = true; // Ensure audio only plays once per page load
            }
        };

        return {
            playAudioOnInteraction,
        };
    },
};
</script>

<style lang="scss" scoped>
/* Add any additional styling here */
</style>
