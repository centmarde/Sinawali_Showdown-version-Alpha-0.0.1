<template>
 
  <p class="beta mt-2 ms-2">Beta Version 0.0.1</p>
  <main>  
      
        <!-- Sky -->
        <img src="../../assets/parallax/sky.png" class="parallax layer-sky" data-speedx="0.03" data-speedy="0.32" alt="Sky Background">
        <!-- Clouds -->
        <img src="../../assets/parallax/clouds center 2.png" class="parallax layer-clouds-center-2"  data-speedx="0.065" data-speedy="0.28" alt="Center Clouds 2">
        <img src="../../assets/parallax/clouds center.png" class="parallax layer-clouds-center"  data-speedx="0.27" data-speedy="0.308" alt="Center Clouds">
       
        <img src="../../assets/parallax/left cloud.png" class="parallax layer-clouds-left"  data-speedx="0.065" data-speedy="0.118"alt="Left Cloud">
      
        <img src="../../assets/parallax/right cloud.png" class="parallax layer-clouds-right"  data-speedx="0.1" data-speedy="0.118"alt="Right Cloud">
        <!-- Mountains -->
        <img src="../../assets/parallax/mountains.png" class="parallax layer-mountains"  data-speedx="0.1"  data-speedy="0.32"alt="Mountains">
        <img src="../../assets/parallax/grasses.png" class="parallax layer-grasses"  data-speedx="0.1" data-speedy="0.323"alt="Grass Layer">
        <!-- Houses -->
        <img src="../../assets/parallax/house with flag.gif" class="parallax layer-house1"  data-speedx="0.1" data-speedy="0.318" alt="House with Flag">
        <img src="../../assets/parallax/second house with stairs_.png" class="parallax layer-house2" data-speedx="0.1"data-speedy="0.38" alt="Second House with Stairs">
        <img src="../../assets/parallax/small house.png" class="parallax layer-house3"  data-speedx="0.1" data-speedy="0.38"alt="Small House">
        <!-- People and Animals -->

        <!-- wind -->
         <img src="../../assets/parallax/wind.gif" class="parallax wind" data-speedx="0.1" data-speedy="0.38"alt="wind">

    </main>
</template>

<script>

export default {
  
  mounted() {
    const parallaxElements = document.querySelectorAll(".parallax");

    window.addEventListener("mousemove", (e) => {
      const xValue = e.clientX - window.innerWidth / 2;
      const yValue = e.clientY - window.innerHeight / 2;

      parallaxElements.forEach((el) => {
        // Parse speed values to floats for consistent calculations
        const speedx = parseFloat(el.dataset.speedx);
        const speedy = parseFloat(el.dataset.speedy);

        // Apply parallax transform based on mouse position and speed
        el.style.transform = `
          translateX(calc(-50% + ${-xValue * speedx}px)) 
          translateY(calc(-50% + ${-yValue * speedy}px))
        `;
      });
    });
  },
};
</script>

<style scoped>
h1 {
  color: aliceblue;
}
/* Reset and Body Styling */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body, html {
    height: 100%;
    overflow-x: hidden;
}

main {
    position: relative;
    width: 100vw;
    height: 100vh; /* Increase for more scrolling space */
    overflow: hidden;
}

/* Parallax Layer Base Styles */
.parallax {
    position: absolute;
    width: 100%;
    height: auto; /* Allow images to maintain their aspect ratio */
    top: 0;
    object-fit: cover; /* Ensures images cover their space properly */
}

/* Sky Layer */
.layer-sky {
    width: 1960px;
    top: calc(60% - 200px);
    left: calc(50% + 10px);
    transform: translate(-50%, -50%);
    z-index: 1;
}

/* Cloud Layers */
.layer-clouds-center,
.layer-clouds-center-2,
.layer-clouds-left,
.layer-clouds-right {
    z-index: 2;
}

.layer-clouds-center {
    width: 1200px;
    top: calc(90% - 430px);
    left: calc(45% + 5px);
    transform: translate(-50%, -50%);
}

.layer-clouds-center-2 {
    width: 1200px;
    top: calc(90% - 310px);
    left: calc(45% + 10px);
    transform: translate(-50%, -50%);
}

.layer-clouds-left {
    width: 1200px;
    top: calc(90% - 370px);
    left: calc(10% + 20px);
    transform: translate(-50%, -50%);
}

.layer-clouds-right {
    width: 1200px;
    top: calc(90% - 270px);
    left: calc(60% + 125px);
    transform: translate(-50%, -50%);
}

/* Mountain and Grass Layers */
.layer-mountains,
.layer-grasses {
    z-index: 2;
}

.layer-mountains {
    width: 1960px;
    top: calc(97% - 270px);
    left: calc(50% + 20px);
    transform: translate(-50%, -50%);
}

.layer-grasses {
    width: 1960px;
    top: calc(89% - 110px);
    left: calc(50% + 20px);
    transform: translate(-50%, -50%);
}

/* House Layers */
.layer-house1,
.layer-house2,
.layer-house3,
.wind {
    z-index: 2;
}

.layer-house1 {
    width: 1300px;
    top: calc(85% - 240px);
    left: calc(58% + 15px);
    transform: translate(-50%, -50%);
}

.layer-house2 {
    width: 2500px;
    top: calc(90% - 50px);
    left: calc(30% + 65px);
    transform: translate(-50%, -50%);
}

.layer-house3 {
    width: 1100px;
    top: calc(86% - 190px);
    left: calc(90% + 40px);
    transform: translate(-50%, -50%);
}
.wind{
  width: 1960px;
    top: calc(60% - 200px);
    left: calc(50% + 10px);
    transform: translate(-50%, -50%);
    z-index:8;
}
/* People Layer */
.layer-people {
    width: 1200px;
    top: calc(100%- 360px);
    left: calc(48% + 15px);
    transform: translate(-50%, -50%);
    z-index: 2;
}

/* end of parallax */
.beta{
  position: fixed;
  z-index: 10;
  font-size: 13px;
}


</style>
