<template>
  <p class="beta mt-2 ms-2">Beta Version 0.0.1</p>
  <main>
    <!-- Sky -->
    <img
      src="../../assets/parallax/bbg new.png"
      class="parallax layer-main-bg"
      data-speedx="0.03"
      data-speedy="0.065"
      alt="Background"
    />

    <!-- Clouds -->
    <img
      src="../../assets/parallax/front cloud.png"
      class="parallax layer-front-cloud"
      data-speedx="0.065"
      data-speedy="0.28"
      alt="Front Cloud"
    />
    <img
      src="../../assets/parallax/lcloud.png"
      class="parallax layer-clouds-left"
      data-speedx="0.065"
      data-speedy="0.118"
      alt="Left Cloud"
    />
    <img
      src="../../assets/parallax/rcloud.png"
      class="parallax layer-clouds-right"
      data-speedx="0.1"
      data-speedy="0.118"
      alt="Right Cloud"
    />

    <!-- Wind -->
    <img
      src="../../assets/parallax/wind.gif"
      class="parallax wind"
      data-speedx="0.1"
      data-speedy="0.38"
      alt="Wind"
    />
  </main>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const parallaxElements = document.querySelectorAll(".parallax");

  const applyParallaxTransform = (xValue, yValue) => {
    parallaxElements.forEach((el) => {
      const speedx = parseFloat(el.dataset.speedx);
      const speedy = parseFloat(el.dataset.speedy);

      el.style.transform = `
        translateX(calc(-50% + ${-xValue * speedx}px)) 
        translateY(calc(-50% + ${-yValue * speedy}px))
      `;
    });
  };

  const initialXValue = window.innerWidth / 2;
  const initialYValue = window.innerHeight / 2;
  applyParallaxTransform(initialXValue, initialYValue);

  window.addEventListener("mousemove", (e) => {
    const xValue = e.clientX - window.innerWidth / 2;
    const yValue = e.clientY - window.innerHeight / 2;
    applyParallaxTransform(xValue, yValue);
  });
});
</script>

<style scoped>
/* Reset and Body Styling */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body,
html {
  height: 100%;
  overflow-x: hidden;
}

main {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Parallax Base Styles */
.parallax {
  position: absolute;
  width: 100%;
  height: auto;
  top: 0;
  object-fit: cover;
}

/* Individual Layer Styles */
.layer-main-bg {
  width: 1870px; /* Ensure this matches your design */
  top: calc(60% - 200px);
  left: 45%; /* Use 50% for horizontal centering */
  z-index: 1;
}

.layer-front-cloud {
  width: 1200px;
  top: calc(90% - 430px);
  left: 55%; /* Adjust horizontal positioning */
  z-index: 1;
}

.layer-clouds-left {
  width: 1200px;
  top: calc(72% - 370px);
  left: 40%; /* Position clouds on the left */
  z-index: 1;
}

.layer-clouds-right {
  width: 1200px;
  top: calc(65% - 270px);
  left: 60%; /* Position clouds on the right */
  z-index: 1;
}

.wind {
  width: 100%;
  z-index: 8;
  top: 0; /* Make sure it's positioned correctly */
}

/* Beta Tag */
.beta {
  position: fixed;
  z-index: 10;
  font-size: 13px;
  color: #333;
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 5px;
  border-radius: 3px;
  top: 10px; /* Adjust vertical positioning */
  left: 10px; /* Adjust horizontal positioning */
}

/* Smooth Transition for Parallax */
.parallax {
  transition: transform 0.1s ease-out;
}

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .layer-main-bg {
    width: 2060px; /* Scale down for smaller screens */
    top: calc(60% - 150px);
    left: 50%;
  }

  .layer-front-cloud,
  .layer-clouds-left,
  .layer-clouds-right {
    width: 600px;
  }

  .layer-front-cloud {
    top: calc(90% - 300px);
    left: 50%;
  }

  .layer-clouds-left {
    top: calc(72% - 250px);
    left: 30%;
  }

  .layer-clouds-right {
    top: calc(65% - 200px);
    left: 70%;
  }

  .beta {
    font-size: 11px;
    padding: 1px 3px;
  }
}
</style>
