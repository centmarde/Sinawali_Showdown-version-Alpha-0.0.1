<template>
    <div>
     <AdBattle1/>
    </div>
</template>

<script>
import { onMounted } from 'vue';
import { useAudioStore } from '@/stores/audioStore';
import AdBattle1 from '@/components/AdBattlePage/AdBattle1.vue';



export default {
    components: {
        AdBattle1,
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
