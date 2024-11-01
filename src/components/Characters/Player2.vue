<template>
  <div class="canvas-container">
    <!-- Canvas for Player 1's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <v-row>
      <v-col class="d-flex justify-content-center">
        <!-- Buttons for controlling animations -->
      
        <!-- <<button @click="toggleAttack">{{ isattack ? 'Switch to Idle' : 'Attack' }}</button>
        <button @click="toggleHurt">Hurt</button>
        <button @click="toggleBuff">Buff</button>  -->
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
    const canvas = this.$refs.canvas1;
    const ctx = canvas.getContext('2d');
    const CANVAS_WIDTH = (canvas.width = 600);
    const CANVAS_HEIGHT = (canvas.height = 600);

    const playerImage = new Image();
    playerImage.src = playerImageSrc;
    const spriteWidth = 575;
    const spriteHeight = 523;
    let frameX = 0;
    let frameY = 0;
    let gameFrame = 0;
    const staggerFrames = 10;

    const drawPlayer = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.save(); // Save the current context state
      ctx.scale(-1, 1); // Flip horizontally
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        -CANVAS_WIDTH / 2 - spriteWidth / 2, // Adjust for flipped image
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
      ctx.restore(); // Restore the context to its original state
    };

    const idle = () => {
      frameY = 0;
      drawPlayer();
      if (gameFrame % staggerFrames === 0) frameX = frameX < 3 ? frameX + 1 : 0;
      gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const buff = () => {
      cancelAnimationFrame(this.animationFrame);
      frameY = 5;
      drawPlayer();
      if (gameFrame % 30 === 0) {
        frameX = frameX < 4 ? frameX + 1 : 0;

        // End buff animation cycle if it reaches the last frame
        if (frameX === 0) {
          this.buffActive = false; // Deactivate buff
          idle(); // Return to idle animation
          return;
        }
      }

      gameFrame++;
      this.animationFrame = requestAnimationFrame(buff);
    };

    const hurt = () => {
      cancelAnimationFrame(this.animationFrame);
      frameY = 4;
      drawPlayer();
      if (gameFrame % 70 === 0) {
        frameX = frameX < 1 ? frameX + 1 : 0;

        // End hurt animation cycle if it reaches the last frame
        if (frameX === 0) {
          this.hurtActive = false; // Deactivate hurt
          idle(); // Return to idle animation
          return;
        }}
        gameFrame++;
        this.animationFrame = requestAnimationFrame(hurt);
        
    };

    const attack = () => {
      frameY = 2;
      drawPlayer();
      if (gameFrame % staggerFrames === 0) frameX = frameX < 7 ? frameX + 1 : 0;
      gameFrame++;
      if (frameX < 7) {
        this.animationFrame = requestAnimationFrame(attack);
      } else {
        frameX = 0;
        this.isattack = false;
        idle();
      }
    };

    this.toggleAttack = () => {
      cancelAnimationFrame(this.animationFrame);
      if (!this.isattack) {
        this.isattack = true;
        frameX = 0;
        attack();
      }
    };

    this.toggleHurt = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      hurt();
    };

    this.toggleBuff = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      buff();
    };

    idle();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame);
  },
};
</script>

<style lang="scss" scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#canvas {
  margin-top: 15rem;
  width: 13rem;
  transition: transform 0.5s ease;
}

.moveLeft {
  transform: translateX(-600px);
}

@media (max-width: 1024px) {
  .moveLeft {
    transform: translateX(-400px);
  }
  #canvas {
  margin-top: 23rem;
  width: 13rem;
  transition: transform 0.5s ease;
  }
}

@media (max-width: 768px) {
  .moveLeft {
    transform: translateX(-200px);
  }
  #canvas {
  margin-top: 23rem;
  width: 13rem;
  transition: transform 0.5s ease;
  }
}

@media (max-width: 480px) {
  .moveLeft {
    transform: translateX(-100px);
  }
  #canvas {
  margin-top: 23rem;
  width: 13rem;
  transition: transform 0.5s ease;
  }
}

button {
  margin-top: 5px;
}
</style>
