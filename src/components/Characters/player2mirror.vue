<template>
  <div class="canvas-container">
    <!-- Canvas for Player 2's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <v-row>
      <v-col class="d-flex justify-content-center">
       <!--  <button @click="toggleAttack">{{ isattack ? 'Switch to Idle' : 'Attack' }}</button>
        <button @click="toggleHurtInjured">Hurt (Injured)</button>
        <button @click="toggleHurtSkinDamage">Hurt (Skin Damage)</button>
        <button @click="toggleBuff">Buff</button> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import playerImageSrc from '@/assets/anim/man2.png';

export default {
  data() {
    return {
      isattack: false,
      animationFrame: null,
      buffActive: false,
      hurtActive: false,
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

    const idle = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = 0;
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
      if (gameFrame % staggerFrames === 0) frameX = frameX < 3 ? frameX + 1 : 0;
      gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const buff = () => {
      if (!this.buffActive) return;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = 5; // Buff animation frame
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
      if (gameFrame % staggerFrames === 0) {
        frameX = frameX < 4 ? frameX + 1 : 0;

        // End buff animation cycle
        if (frameX === 0) {
          this.buffActive = false;
          idle(); 
          return;
        }
      }

      gameFrame++;
      this.animationFrame = requestAnimationFrame(buff);
    };

    const hurtAnimation = (animationFrameY) => {
      if (!this.hurtActive) return;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = animationFrameY; // Use specified animation frame for hurt
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
      if (gameFrame % 70 === 0) {
        frameX = frameX < 1 ? frameX + 1 : 0;
        if (frameX === 0) {
          this.hurtActive = false;
          idle(); 
          return;
        }
      }
      gameFrame++;
      this.animationFrame = requestAnimationFrame(() => hurtAnimation(animationFrameY));
    };

    const attack = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = 2; // Attack animation frame
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
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
      this.hurtActive = true; 
      hurtAnimation(4); // Call with appropriate frame for hurt
    };
    
    this.toggleHurtInjured = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; 
      hurtAnimation(6.1);
    };

    this.toggleHurtSkinDamage = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; 
      hurtAnimation(7.1);
    };

    this.toggleBuff = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.buffActive = true; 
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
  margin-top: 12rem;
  width: 13rem;
  transition: transform 0.5s ease;
}

.moveLeft {
  transform: translateX(600px);
}

@media (max-width: 1524px) {
  #canvas {
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

@media (max-width: 1024px) {
  .moveLeft {
    transform: translateX(400px);
  }
  #canvas {
    margin-top: 23rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

@media (max-width: 768px) {
  .moveLeft {
    transform: translateX(200px);
  }
  #canvas {
    margin-top: 23rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

@media (max-width: 480px) {
  .moveLeft {
    transform: translateX(100px);
  }
  #canvas {
    margin-top: 18rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

button {
  margin-top: 5px;
}
</style>
