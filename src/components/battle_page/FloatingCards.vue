<template>
  <div class="container" id="container">
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      class="card"
      tabindex="0"
      :style="`--i: ${
        index - Math.floor(cards.length / 2)
      }; background-image: url(${
        card.img
      }); background-size: cover; background-position: center;`"
      @click="() => openDialog(card)"
      @mouseenter="() => handleCardHover(card.id)"
    >
      <div class="card-title balsamiq-sans-bold" :style="getTitleStyle(card)">
        <svg width="200" height="50">
          <defs>
            <path id="curve" d="M 10,45 Q 100,10 190,40" />
            <linearGradient
              :id="'textGradient' + card.id"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="200"
              y2="0"
            >
              <stop offset="0%" :stop-color="getGradientColors(card).start" />
              <stop offset="100%" :stop-color="getGradientColors(card).end" />
            </linearGradient>
          </defs>
          <text
            width="200"
            text-anchor="middle"
            x="100"
            :fill="'url(#textGradient' + card.id + ')'"
            :stroke="getStrokeColor(card)"
            stroke-width="0.5"
            :style="getTextShadowStyle(card)"
          >
            <textPath href="#curve">{{ card.name }}</textPath>
          </text>
        </svg>
      </div>
      <div class="card-rarity merienda text-capitalize">
        <span>{{ card.rarity }} Card</span>
      </div>
      <div
        class="card-description balsamiq-sans text-center text-uppercase font-weight-medium"
        :style="getDescriptionStyle(card)"
      >
        <small>{{ card.description }}</small>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useAudioStore } from "@/stores/audioStore";

const audioStore = useAudioStore();

const props = defineProps({
  cards: {
    type: Array,
    required: true,
  },
  openDialog: {
    type: Function,
    required: true,
  },
});

const getGradientColors = (card) => {
  switch (card.rarity) {
    case "common":
      return { start: "#9c6810", end: "#3f870e" };
    case "rare":
      return { start: "#772011", end: "#c96013" };
    case "special":
      return { start: "#37790a", end: "#936529" };
    default:
      return { start: "#3f870e", end: "#9c6810" };
  }
};

const getStrokeColor = (card) => {
  switch (card.rarity) {
    case "rare":
      return "#9c6810";
    case "special":
      return "#936529";
    default:
      return "#9c6810";
  }
};

const getTextShadowStyle = (card) => {
  switch (card.rarity) {
    case "rare":
      return { textShadow: "2px 2px 4px #c95f13e2" };
    case "special":
      return { textShadow: "2px 2px 6px #dab458" };
    default:
      return {};
  }
};

const getDescriptionStyle = (card) => {
  switch (card.rarity) {
    case "common":
      return { color: "#307605" };
    case "rare":
      return { color: "#772011" };
    case "special":
      return { color: "#936529" };
    default:
      return { color: "#34782e" };
  }
};

const getTitleStyle = (card) => {
  let topValue;
  switch (card.rarity) {
    case "special":
      topValue = "3px";
      break;
    case "rare":
      topValue = "-6px";
      break;
    case "common":
    default:
      topValue = "-2px";
      break;
  }
  return { top: topValue };
};

const handleCardHover = (cardId) => {
  audioStore.playCardSound(); 
};
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Rock+Salt&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&display=swap");

.balsamiq-sans-bold {
  font-family: "Balsamiq Sans", sans-serif;
  font-weight: 900;
  font-style: normal;
}

.merienda {
  font-family: "Merienda", cursive;
  font-weight: 100;
  font-style: normal;
}

.container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
}

.container .card {
  position: absolute;
  top: 14.5rem;
  width: 180px;
  height: 225px;
  border-radius: 8px;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #151515;
  font-size: 10px;
  border: none;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  transform: rotate(calc(var(--i) * 3deg))
    translate(calc(var(--i) * 150px), -50px);
}

.card-title {
  position: absolute;
  left: 49%;
  transform: translateX(-50%);
  color: rgb(0, 0, 0); /* Adjust text color as needed */
  font-size: 12px;
  text-transform: capitalize;
}

.card-rarity {
  position: absolute;
  bottom: 72px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  color: rgb(244, 244, 244); /* Adjust text color as needed */
  font-size: 7px;
}

.card-description {
  position: absolute;
  top: 160px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  color: #34782e;
  width: 70%;
  font-size: 7px;
  letter-spacing: 0; /* Add this line to remove inline text spacing */
  line-height: 1.2; /* Adjust line height to reduce gap */
  padding: 0; /* Remove any padding */
  margin: 0; /* Remove any margin */
}

@media (max-width: 600px) {
  .container {
    height: 25%;
  }

  .container .card {
    width: 120px;
    height: 150px;
    top: 15rem;
    font-size: 0.8em;
    transform: rotate(calc(var(--i) * 3deg))
      translate(calc(var(--i) * 50px), -50px);
  }

  .container .card:hover {
    transform: rotate(calc(var(--i) * 3deg))
      translate(calc(var(--i) * 50px), -100px);
    z-index: 1;
  }
}

.card.inactive {
  background-color: #333;
}

.card.inactive:hover {
  background-color: #444;
}

.card.active {
  transform: scale(1.5);
  background: #5e5cfc;
  z-index: 1;
}

.container .card:hover {
  transform: rotate(calc(var(--i) * 3deg))
    translate(calc(var(--i) * 150px), -80px);
}

@media (max-width: 600px) {
  .card-title {
    top: 7px;
    font-size: 10px;
  }

  .card-rarity {
    bottom: 149px;
    font-size: 12px;
  }

  .card-description {
    top: 350px;
    font-size: 12px;
  }
}
@media (max-width: 400px) {
  .card-title {
    position: absolute;
    font-size: 10px;
    margin-top: 14%;
    left: 50%;
    transform: translate(-50%, -50%);
}


  .card-rarity {
    bottom: 46px;
    font-size: 12px;
    font-size: 5px;
  }

  .card-description {
    top: 98px;
    font-size: 5px;
  }
}
</style>
