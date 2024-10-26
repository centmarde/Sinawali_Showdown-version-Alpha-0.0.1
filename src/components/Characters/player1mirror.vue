<template>
    <div class="canvas-container">
      <!-- Canvas for Player 2 animations; adds 'moveLeft' class when isAttacking is true -->
      <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isAttacking }"></canvas>
      <v-row>
        <v-col class="d-flex justify-content-center">
          <!-- Button toggles between Attack and Idle states -->
          <button @click="toggleAnimation">{{ isAttacking ? 'Switch to Idle' : 'Attack' }}</button>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  import playerImageSrc from '@/assets/anim/man1.png'; // Import sprite for Player 2
  
  export default {
    data() {
      return {
        isAttacking: false, // State tracking whether player is attacking
        animationFrame: null, // Stores current animation frame ID
      };
    },
    mounted() {
      const canvas = this.$refs.canvas1; // Reference to the canvas element
      const ctx = canvas.getContext('2d'); // 2D context for drawing on the canvas
      const CANVAS_WIDTH = (canvas.width = 600); // Set canvas width
      const CANVAS_HEIGHT = (canvas.height = 600); // Set canvas height
  
      const playerImage = new Image(); // New image element for player sprite
      playerImage.src = playerImageSrc; // Assign source to imported sprite
      const spriteWidth = 575; // Width of each frame in the sprite sheet
      const spriteHeight = 523; // Height of each frame in the sprite sheet
      let frameX = 0; // Horizontal frame index for animation
      let frameY = 0; // Vertical frame index for animation (row)
      let gameFrame = 0; // Tracks overall frames for staggered animation
      const staggerFrames = 10; // Frame delay for smooth animation
      const yOffset = 40; // Offset for positioning player on canvas
  
      // Idle animation function for player
      const idle = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear previous frame
        ctx.save(); // Save current context settings
        ctx.scale(-1, 1); // Flip player horizontally for orientation
        frameY = 0; // Set to row for idle animation
        ctx.drawImage(
          playerImage,
          frameX * spriteWidth, // Horizontal frame position in sprite
          frameY * spriteHeight, // Vertical frame position in sprite
          spriteWidth, // Width of frame in sprite sheet
          spriteHeight, // Height of frame in sprite sheet
          -spriteWidth, // Horizontal position on canvas (flipped)
          yOffset, // Vertical position on canvas
          spriteWidth, // Drawn width on canvas
          spriteHeight // Drawn height on canvas
        );
        ctx.restore(); // Restore context to undo flipping
        if (gameFrame % staggerFrames === 0) frameX = frameX < 3 ? frameX + 1 : 0; // Loop idle frames
        gameFrame++; // Increment game frame count
        this.animationFrame = requestAnimationFrame(idle); // Call idle on each frame
      };
  
      // Attack animation function for player
      const attack = () => {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear previous frame
        ctx.save(); // Save context state before flipping
        ctx.scale(-1, 1); // Flip player for left-side orientation
        frameY = 2; // Set to attack row in sprite sheet
        ctx.drawImage(
          playerImage,
          frameX * spriteWidth, // Horizontal frame position for attack
          frameY * spriteHeight, // Vertical frame position for attack
          spriteWidth, // Width of sprite frame
          spriteHeight, // Height of sprite frame
          -spriteWidth, // Position on canvas (flipped horizontally)
          yOffset, // Offset from top for consistent alignment
          spriteWidth, // Drawn width on canvas
          spriteHeight // Drawn height on canvas
        );
        ctx.restore(); // Restore context after flipping
        if (gameFrame % staggerFrames === 0) frameX = frameX < 7 ? frameX + 1 : 0; // Advance attack frames
        gameFrame++; // Increment frame count
        if (frameX < 7) {
          this.animationFrame = requestAnimationFrame(attack); // Continue attack animation
        } else {
          frameX = 0; // Reset frame index to start
          this.isAttacking = false; // Reset attack state
          idle(); // Return to idle animation
        }
      };
  
      // Function to toggle between attack and idle animations
      this.toggleAnimation = () => {
        cancelAnimationFrame(this.animationFrame); // Stop any ongoing animation
        if (!this.isAttacking) {
          this.isAttacking = true; // Set attacking state
          frameX = 0; // Start from first attack frame
          attack(); // Start attack animation
        }
      };
  
      idle(); // Start with idle animation by default
    },
    beforeUnmount() {
      cancelAnimationFrame(this.animationFrame); // Cleanup animation on component unmount
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .canvas-container {
    display: flex;
    flex-direction: column;
    align-items: center; // Centers canvas and button horizontally
  }
  
  #canvas {
    margin-top: 18rem;
    width: 13rem; // Set canvas width
    transition: transform 0.5s ease; // Smooth transition when moving left
  }
  
  .moveLeft {
    transform: translateX(-620px); // Move canvas left when attacking
  }
  
  button {
    margin-top: 5px; // Add space above button
  }
  </style>
  