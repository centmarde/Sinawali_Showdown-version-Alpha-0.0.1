<template>
  <div class="canvas-container">
    <!-- Canvas for Player 1's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
   <!--  <button @click="toggleHurtInjured">Hurt (Injured)</button>
        <button @click="toggleHurtSkinDamage">Hurt (Skin Damage)</button>
        <button @click="toggleBuff">Buff</button>
        <button @click="toggleAttack">attack</button>  -->
  </div>
</template>

<script>
import playerImageSrc from '@/assets/anim/man1.png';

export default {
  data() {
    return {
      isattack: false,
      animationFrame: null,
      buffActive: false, // Flag for buff animation
      hurtActive: false, // Flag for hurt animation
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
    };

    const idle = () => {
      frameY = 0;
      drawPlayer();
      if (gameFrame % staggerFrames === 0) frameX = frameX < 3 ? frameX + 1 : 0;
      gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const buff = () => {
      if (!this.buffActive) return; // Stop if buff is no longer active

      frameY = 5;
      drawPlayer();
      if (gameFrame % staggerFrames === 0) {
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

    const hurtAnimation = (animationFrameY) => {
      if (!this.hurtActive) return; // Stop if hurt is no longer active

      frameY = animationFrameY;
      drawPlayer();
      if (gameFrame % 70 === 0) {
        frameX = frameX < 1 ? frameX + 1 : 0;
        // End hurt animation cycle if it reaches the last frame
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
  if (!this.isattack) return;

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

  frameY = 3;
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

const attack3 = () => {
  if (!this.isattack) return;

  frameY = 1; // Assume frameY 4 is the new attack3 animation row
  drawPlayer();
  if (gameFrame % staggerFrames === 0) frameX = frameX < 7 ? frameX + 1 : 0; // Example frame count for attack3
  gameFrame++;
  if (frameX < 7) {
    this.animationFrame = requestAnimationFrame(attack3);
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

   
   /*  const randomAttack = Math.floor(Math.random() * 3);
    if (randomAttack === 0) {
      attack();
    } else if (randomAttack === 1) {
      attack2();
    } else {
      attack3();
    } */

    attack3();
  }
};



    this.toggleHurt = () => {
      cancelAnimationFrame(this.animationFrame);
      frameX = 0;
      this.hurtActive = true; // Set hurt active flag
      hurtAnimation(4); // Call for default hurt animation
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
      this.buffActive = true; // Set buff active flag
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