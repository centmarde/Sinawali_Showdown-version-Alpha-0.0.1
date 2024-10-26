<template>
  <div class="canvas-container">
    <!-- Canvas for Player 1's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <v-row>
      <v-col class="d-flex justify-content-center">
        <!-- Button to toggle between Attack and Idle states -->
        <!-- <button @click="toggleAnimation">{{ isattack ? 'Switch to Idle' : 'Attack' }}</button> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import playerImageSrc from '@/assets/anim/man2.png'; // Import Player 1's sprite image

export default {
  data() {
    return {
      isattack: false, // State to track if player is attacking
      animationFrame: null, // Reference for the animation frame ID
    };
  },
  mounted() {
    const canvas = this.$refs.canvas1; // Reference to canvas element
    const ctx = canvas.getContext('2d'); // 2D drawing context for the canvas
    const CANVAS_WIDTH = (canvas.width = 600); // Set canvas width
    const CANVAS_HEIGHT = (canvas.height = 600); // Set canvas height

    const playerImage = new Image(); // Create new image element for player sprite
    playerImage.src = playerImageSrc; // Set image source to imported sprite
    const spriteWidth = 575; // Width of a single frame in the sprite sheet
    const spriteHeight = 523; // Height of a single frame in the sprite sheet
    let frameX = 0; // Horizontal frame index for animations
    let frameY = 0; // Vertical frame index for animations
    let gameFrame = 0; // Tracks game frames to manage staggered animation
    const staggerFrames = 10; // Controls frame speed for smoother animation

    // Idle animation function
    const idle = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear previous frame
      frameY = 0; // Set to idle row in sprite sheet
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2, // Center player horizontally
        CANVAS_HEIGHT / 2 - spriteHeight / 2, // Center player vertically
        spriteWidth,
        spriteHeight
      );
      if (gameFrame % staggerFrames === 0) frameX = frameX < 3 ? frameX + 1 : 0; // Loop idle frames
      gameFrame++; // Increment game frame counter
      this.animationFrame = requestAnimationFrame(idle); // Repeat idle animation
    };

    // Attack animation function
    const attack = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear previous frame
      frameY = 2; // Set to attack row in sprite sheet
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2, // Center player horizontally
        CANVAS_HEIGHT / 2 - spriteHeight / 2, // Center player vertically
        spriteWidth,
        spriteHeight
      );
      if (gameFrame % staggerFrames === 0) frameX = frameX < 7 ? frameX + 1 : 0; // Loop attack frames
      gameFrame++; // Increment game frame counter
      if (frameX < 7) {
        this.animationFrame = requestAnimationFrame(attack); // Continue attack animation
      } else {
        frameX = 0; // Reset to first frame of sprite
        this.isattack = false; // Set state back to idle
        idle(); // Return to idle animation
      }
    };

    // Toggle between attack and idle animations
    this.toggleAnimation = () => {
      cancelAnimationFrame(this.animationFrame); // Cancel ongoing animation frame
      if (!this.isattack) {
        this.isattack = true; // Set attacking state
        frameX = 0; // Reset to first frame of attack
        attack(); // Trigger attack animation
      }
    };

    idle(); // Start with Idle animation by default
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame); // Clean up animation frame on unmount
  },
};
</script>

<style lang="scss" scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the canvas and button horizontally */
}

#canvas {
  margin-top: 18rem;
    width: 13rem; // Set canvas width
    transition: transform 0.5s ease; // Smooth transition when moving left
}

.moveLeft {
  transform: translateX(600px); /* Default for large screens */
}

/* For medium screens (tablets) */
@media (max-width: 1024px) {
  .moveLeft {
    transform: translateX(400px); /* Adjust as needed for medium screens */
  }
}

/* For small screens (mobile devices) */
@media (max-width: 768px) {
  .moveLeft {
    transform: translateX(200px); /* Adjust as needed for small screens */
  }
}

/* For extra small screens (very small mobile devices) */
@media (max-width: 480px) {
  .moveLeft {
    transform: translateX(100px); /* Further adjust for very small screens */
  }
}


button {
  margin-top: 5px; /* Space above the button */
}
</style>
