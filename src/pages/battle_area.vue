<template>
    <div>
        <battle/>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import battle from '@/components/battle_page/battle.vue';

export default {
    components: {
        battle,
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
