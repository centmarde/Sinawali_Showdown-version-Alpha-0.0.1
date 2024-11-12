<template>
  <div class="canvas-container">
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <v-row>
      <v-col class="d-flex justify-content-center">
        <!-- Control buttons can be uncommented for use -->
        <!-- <button @click="toggleAttack">{{ isattack ? 'Switch to Idle' : 'Attack' }}</button>
        <button @click="toggleHurtInjured">Hurt (Injured)</button>
        <button @click="toggleHurtSkinDamage">Hurt (Skin Damage)</button>
        <button @click="toggleBuff">Buff</button>  -->
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
      hurtActive: false, // Track if hurt animations are active
      animationType: null, // Track the current animation type
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
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        playerImage,
        frameX * spriteWidth,
        frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        -CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
      ctx.restore();
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
      if (gameFrame % staggerFrames === 0) {
        frameX = frameX < 4 ? frameX + 1 : 0;
        if (frameX === 0) {
          this.buffActive = false; // Deactivate buff
          idle(); // Return to idle animation
          return;
        }
      }
      gameFrame++;
      this.animationFrame = requestAnimationFrame(buff);
    };

    const hurtAnimation = (animationFrameY) => {
      if (!this.hurtActive) return; // Stop if hurt is no longer active

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = animationFrameY;
      drawPlayer();
      if (gameFrame % 70 === 0) {
        frameX = frameX < 1 ? frameX + 1 : 0;
        if (frameX === 0) {
          this.hurtActive = false; // Deactivate hurt
          idle(); // Return to idle animation
          return;
        }
      }
      gameFrame++;
      this.animationFrame = requestAnimationFrame(() => hurtAnimation(animationFrameY));
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

    const attack2 = () => {
  if (!this.isattack) return;

  frameY = 9;
  drawPlayer();
  if (gameFrame % staggerFrames === 0) frameX = frameX < 6 ? frameX + 1 : 0;
  gameFrame++;
  if (frameX < 6) {
    this.animationFrame = requestAnimationFrame(attack2);
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

   
    const randomAttack = Math.floor(Math.random() * 2);
    if (randomAttack === 0) {
      attack2();
    } else if (randomAttack === 1) {
      attack();
    } 

   
  }
};
    this.toggleHurt = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; // Set hurt active flag
      hurtAnimation(4);
    };
    this.toggleHurtInjured = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; // Set hurt active flag
      hurtAnimation(6.1); // Call for injured animation
    };

    this.toggleHurtSkinDamage = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; // Set hurt active flag
      hurtAnimation(7.1); // Call for skin damage animation
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
  margin-top: 12rem;
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
    margin-top: 18rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

button {
  margin-top: 5px;
}
</style>