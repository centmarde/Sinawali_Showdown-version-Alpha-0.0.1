<template>
    <div>
      <canvas id="canvas"ref="canvas1"></canvas>
    </div>
  </template>
  
  <script>
  import playerImageSrc from '@/assets/anim/man1.png';
  
  export default {
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
  
      function idle() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // ctx.fillRect(x, 50, 100, 100);
       ctx.drawImage(playerImage, frameX* spriteWidth, frameY * spriteHeight, 
       spriteWidth,spriteHeight, 0, 0, spriteWidth, spriteWidth);
       if (gameFrame % staggerFrames == 0){
       if (frameX < 6) frameX++;
       else frameX = 0;
       }
       gameFrame++;
       requestAnimationFrame(idle);
      }
      idle();
    }
  };
  </script>
  
  <style lang="scss" scoped>
  #canvas{
    width: 30rem;
  }
  </style>
  