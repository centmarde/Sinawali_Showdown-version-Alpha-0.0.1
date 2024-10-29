<template>
    <div class="viewer-container">
      <!-- Spline Viewer -->
      <div v-html="splineViewerHtml"></div>
  
      <!-- Overlay Content (e.g., buttons, text) -->
      <div class="overlay-content mt-5">
        <button @click="onClickEvent">Click Me</button>
        <p>This is overlayed content.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    name: 'SplineViewer',
    setup() {
      const splineViewerHtml = ref(
        '<spline-viewer id="splineViewer" url="https://prod.spline.design/mYvqQ49slox9E1oB/scene.splinecode"></spline-viewer>'
      );
  
      onMounted(() => {
        if (!document.querySelector('script[src="https://unpkg.com/@splinetool/viewer@1.9.35/build/spline-viewer.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/@splinetool/viewer@1.9.35/build/spline-viewer.js';
          script.type = 'module';
          document.body.appendChild(script);
        }
  
        const viewer = document.getElementById('splineViewer');
        viewer?.addEventListener('load', () => {
          const spline = viewer?.scene;
          // Interact with Spline scene if API allows
          // e.g., spline.setObjectProperty("objectName", "visible", false);
        });
      });
  
      const onClickEvent = () => {
        console.log("Button clicked!");
        // Additional interactions with the Spline scene can be triggered here
      };
  
      return { splineViewerHtml, onClickEvent };
    },
  };
  </script>
  
  <style scoped>
  .viewer-container {
    position: relative;
    width: 100%;
    height: 100vh;
  }
  
  spline-viewer {
    width: 100%;
    height: 100%;
  }
  
  .overlay-content {
    position: absolute;
    top: 10%;
    left: 10%;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 1rem;
    border-radius: 8px;
    z-index: 52265;
  }


  </style>
  