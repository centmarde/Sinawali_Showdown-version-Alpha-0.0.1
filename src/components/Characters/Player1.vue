<template>
  <div class="canvas-container">
    <!-- Canvas for Player 1's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <button @click="toggleHurtInjured">Hurt (Injured)</button>
        <button @click="toggleHurtSkinDamage">Hurt (Skin Damage)</button>
        <button @click="toggleBuff">Buff</button>
        <button @click="toggleAttack">attack</button> 
  </div>
</template>

<script>
import playerImageSrc from "@/assets/anim/man1.png";
import { io } from "socket.io-client";

export default {
  data() {
    return {
      isattack: false,
      animationFrame: null,
      buffActive: false,
      hurtActive: false,
      socket: null,
      frameX: 0,
      frameY: 0,
      gameFrame: 0,
      staggerFrames: 10,
      isAnimating: false, 
    };
  },
  mounted() {
    this.socket = io("http://localhost:3002");
    const canvas = this.$refs.canvas1;
    const ctx = canvas.getContext("2d");
    const CANVAS_WIDTH = (canvas.width = 600);
    const CANVAS_HEIGHT = (canvas.height = 600);
    const playerImage = new Image();
    playerImage.src = playerImageSrc;
    const spriteWidth = 575;
    const spriteHeight = 523;

    const drawPlayer = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(
        playerImage,
        this.frameX * spriteWidth,
        this.frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
    };

    const emitSocketEvent = (eventName, data) => {
      this.socket.emit(eventName, data);
    };

    const idle = () => {
      this.frameY = 0;
      drawPlayer();
      if (this.gameFrame % this.staggerFrames === 0) this.frameX = this.frameX < 3 ? this.frameX + 1 : 0;
      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const buff = () => {
  if (!this.buffActive) return;  // Stop if buff is not active

  this.frameY = 5;               // Set the frameY to 5 for this animation state
  drawPlayer();                  // Call the draw function

  if (this.gameFrame % this.staggerFrames === 0) {
    // Cycle through frames 0 to 4 and reset to 0 when reaching the end
    this.frameX = this.frameX < 4 ? this.frameX + 1 : 0;

    // When frameX completes a cycle, deactivate buff and reset animation
    if (this.frameX === 0) {
      this.buffActive = false;   // Deactivate buff
      idle();                    // Call idle function to reset character
      this.isAnimating = false;  // Reset animation flag
      cancelAnimationFrame(this.animationFrame);  // Stop the animation loop
      return;  // Exit the function after the first update
    }
  }

  // Emit socket event with current animation state
  emitSocketEvent("buff", { animation: "buff", frameX: this.frameX, frameY: this.frameY });
  this.gameFrame++;              // Increment the game frame
  this.animationFrame = requestAnimationFrame(buff); // Continue animation until frameX reaches 0
};


    const hurtAnimation = (animationFrameY) => {
      if (!this.hurtActive) return;
      this.frameY = animationFrameY;
      drawPlayer();
      if (this.gameFrame % 70 === 0) {
        this.frameX = this.frameX < 1 ? this.frameX + 1 : 0;
        if (this.frameX === 0) {
          this.hurtActive = false;
          idle();
          this.isAnimating = false; // Reset animation flag
          return;
        }
      }
      emitSocketEvent("hurt", { animation: "hurt", frameX: this.frameX, frameY: this.frameY });
      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(() =>
        hurtAnimation(animationFrameY)
      );
    };

    const attack = () => {
  if (!this.isattack) return;  // Stop if attack is not active

  this.frameY = 2;              // Set the frameY for attack animation
  drawPlayer();                 // Call drawPlayer to update the animation

  if (this.gameFrame % this.staggerFrames === 0) {
    // Cycle through frames 0 to 7
    this.frameX = this.frameX < 7 ? this.frameX + 1 : 7;
  }

  this.gameFrame++;             // Increment the game frame
  emitSocketEvent("attack", { animation: "attack1", frameX: this.frameX, frameY: this.frameY });

  if (this.frameX === 7) {
    // Stop animation and reset after the last frame
    this.frameX = 0;
    this.isattack = false;       // Deactivate attack
    idle();                      // Call idle to reset the player state
    this.isAnimating = false;    // Reset animation flag
    cancelAnimationFrame(this.animationFrame);  // Stop any ongoing animation loop
    return;                      // Exit the function, stopping the animation
  }

  // Continue animation if not yet completed (only if frameX < 7)
  this.animationFrame = requestAnimationFrame(attack);
};



    const attack2 = () => {
      if (!this.isattack) return;
      this.frameY = 3;
      drawPlayer();
      if (this.gameFrame % this.staggerFrames === 0) this.frameX = this.frameX < 6 ? this.frameX + 1 : 0;
      this.gameFrame++;
      emitSocketEvent("attack", { animation: "attack2", frameX: this.frameX, frameY: this.frameY });
      if (this.frameX < 6) {
        this.animationFrame = requestAnimationFrame(attack2);
      } else {
        this.frameX = 0;
        this.isattack = false;
        idle();
        this.isAnimating = false; // Reset animation flag
      }
    };

    const attack3 = () => {
      if (!this.isattack) return;
      this.frameY = 1;
      drawPlayer();
      if (this.gameFrame % this.staggerFrames === 0) this.frameX = this.frameX < 7 ? this.frameX + 1 : 0;
      this.gameFrame++;
      emitSocketEvent("attack", { animation: "attack3", frameX: this.frameX, frameY: this.frameY });
      if (this.frameX < 7) {
        this.animationFrame = requestAnimationFrame(attack3);
      } else {
        this.frameX = 0;
        this.isattack = false;
        idle();
        this.isAnimating = false; // Reset animation flag
      }
    };

    this.toggleAttack = () => {
      if (this.isAnimating) return; // Prevent starting a new attack if an animation is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.isattack = true;
      this.frameX = 0;
      const randomAttack = Math.floor(Math.random() * 2);
     
    
        attack();
     
    };

    this.toggleHurt = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(4);
    };

    this.toggleHurtInjured = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt injured animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(6.1);
      emitSocketEvent("hurt_injured", { animation: "injured", frameX: this.frameX, frameY: this.frameY });
    };

    this.toggleHurtSkinDamage = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt skin damage animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(7.1);
      emitSocketEvent("hurt_skin_damage", { animation: "skin_damage", frameX: this.frameX, frameY: this.frameY });
    };

    this.toggleBuff = () => {
      if (this.isAnimating) return; // Prevent starting a new buff animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.buffActive = true;
      buff();
    };

    this.socket.on("animation_update", (data) => {
      if (this.isAnimating) return; // Prevent starting new animation if one is already running

      const { animation, frameX, frameY } = data.data;

      // Log the incoming animation update
      console.log('Received animation update:', animation);

      this.frameX = frameX;
      this.frameY = frameY;
      this.gameFrame = 0;
      this.isAnimating = true; // Mark animation as in progress

      switch (animation) {
        case "attack1":
          this.isattack = true;
          attack();
          break;
        case "attack2":
          this.isattack = true;
          attack2();
          break;
        case "attack3":
          this.isattack = true;
          attack3();
          break;
        case "buff":
          this.buffActive = true;
          buff();
          break;
        case "hurt":
          this.hurtActive = true;
          hurtAnimation(frameY);
          break;
        default:
          idle();
          break;
      }
    });

    idle();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame);
    if (this.socket) {
      this.socket.disconnect();
    }
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
  width: 13rem;
  transition: transform 0.5s ease;
}

.moveLeft {
  transform: translateX(600px);
}

@media (max-width: 1920px) {
  .moveLeft {
    transform: translateX(810px);
  }
  #canvas {
    margin-top: 20rem;
    width: 20rem;
  }
}

@media (max-width: 1366px) {
  .moveLeft {
    transform: translateX(600px);
  }
  #canvas {
    margin-top: 12rem;
    width: 13rem;
  }
}

@media (max-width: 1024px) {
  .moveLeft {
    transform: translateX(400px);
  }
  #canvas {
    margin-top: 11rem;
    width: 13rem;
  }
}

@media (max-width: 768px) {
  .moveLeft {
    transform: translateX(200px);
  }
  #canvas {
    margin-top: 10rem;
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
