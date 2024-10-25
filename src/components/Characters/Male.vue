<template>
  <div>
    <canvas id="canvas" ref="canvas1"></canvas>
    <button @click="toggleAnimation">{{ isRunning ? 'Switch to Idle' : 'Switch to Run' }}</button>
  </div>
</template>

<script>
import playerImageSrc from '@/assets/anim/man1.png';

export default {
  data() {
    return {
      isRunning: false,
      animationFrame: null,
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
      ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteWidth);
      if (gameFrame % staggerFrames === 0) frameX = frameX < 6 ? frameX + 1 : 0;
      gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const run = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      frameY = 2;
      ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteWidth);
      if (gameFrame % staggerFrames === 0) frameX = frameX < 8 ? frameX + 1 : 0;
      gameFrame++;
      this.animationFrame = requestAnimationFrame(run);
    };

    this.toggleAnimation = () => {
      cancelAnimationFrame(this.animationFrame);
      this.isRunning = !this.isRunning;
      if (this.isRunning) run();
      else idle();
    };

    idle(); // Start with Idle by default
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame); // Cleanup on component unmount
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  width: 30rem;
}
button {
  margin-top: 10px;
}
</style>
