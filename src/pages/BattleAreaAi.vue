<template>
    <div>
       <BattleAi/>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import BattleAi from '@/components/player-vs-ai/BattleAi.vue';


export default {
    components: {
        BattleAi,
    },
    setup() {
        const audioStore = useAudioStore();

        onMounted(() => {
            audioStore.playAudio();
        });

        return {
            audioStore,
        };
    },
};
</script>

<style lang="scss" scoped>
/* Add any additional styling here */
</style>
