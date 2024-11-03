<template>
      <HomeMenu/>
    <div class="background-container">
        <div class="fade-image image-1"></div>
        <div class="fade-image image-2"></div>
        <div class="fade-image image-3"></div>
        <div class="fade-image image-4"></div>
        <div class="fade-image image-5"></div>
      
    </div>
</template>

<script>
import HomeMenu from '../Menu/HomeMenu.vue';

export default {
    components: {
        HomeMenu
    }
};
</script>

<style lang="scss" scoped>
h1 {
    color: aliceblue;
}

.background-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .fade-image {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-size: cover;
        opacity: 0;
        animation: fade 25s infinite; // Total duration for all images
    }

    @keyframes fade {
        0% {
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        20% {
            opacity: 1;
        }
        30% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }

    // Individual image timings
    .image-1 {
        background-image: url('@/assets/background/image1.jpg');
        animation-delay: 0s;
    }

    .image-2 {
        background-image: url('@/assets/background/image2.jpg');
        animation-delay: 5s; // Adjust for timing
    }

    .image-3 {
        background-image: url('@/assets/background/image3.jpg');
        animation-delay: 10s;
    }

    .image-4 {
        background-image: url('@/assets/background/image4.jpg');
        animation-delay: 15s;
    }

    .image-5 {
        background-image: url('@/assets/background/image5.jpg');
        animation-delay: 20s;
    }
}
</style>
