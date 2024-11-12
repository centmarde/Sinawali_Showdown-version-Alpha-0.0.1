<template>
  <div class="display">
    <SecBtn id="back_btn" class="top-right-button" @click="navigateWithSound('/')" />
    <v-container>
      <v-row>
        <!-- Card Display -->
        <v-col id="cards" cols="12" lg="6">
          <swiper
            :effect="'cards'"
            :grabCursor="true"
            :modules="modules"
            class="mySwiper"
            @slideChange="onSlideChange"
          >
            <swiper-slide
              v-for="(card, index) in cards"
              :key="card.id"
              class="swiper-slide"
            >
              <img :src="card.img" alt="Card Image" class="card-image" />
              <div
                class="card-name balsamiq-sans-bold"
                :style="{ top: cardNameTop }"
              >
                <svg width="500" height="100">
                  <defs>
                    <path id="curve" d="M 50,90 Q 250,10 500,95" />
                    <linearGradient
                      id="textGradient"
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="350"
                      y2="0"
                    >
                      <stop offset="0%" :stop-color="gradientColors.start" />
                      <stop offset="100%" :stop-color="gradientColors.end" />
                    </linearGradient>
                  </defs>
                  <text
                    class="text-uppercase"
                    width="500"
                    text-anchor="middle"
                    x="210"
                    fill="url(#textGradient)"
                    stroke="#9c6810"
                    stroke-width="0.5"
                    :style="textShadowStyle"
                  >
                    <textPath href="#curve">{{ activeCard.name }}</textPath>
                  </text>
                </svg>
              </div>

              <div id="card_rarity"
                class="card-rarity merienda text-capitalize"
                :style="{ bottom: cardRarityBottom }"
              >
                <span>{{ activeCard.rarity }} Card</span>
              </div>

              <div 
                class="card-description balsamiq-sans text-center text-uppercase"
                :style="cardDescriptionStyle"
              >
                <small id="card_desc" >{{ activeCard.description }}</small>
              </div>
            </swiper-slide>
          </swiper>
        </v-col>

        <!-- Card Details -->
        <v-col  cols="12" lg="6">
          <CardDetails 
            :activeCard="activeCard"
            :avatarImage="avatarImage"
            :cardRarityClass="cardRarityClass"
            :cardTypeClass="cardTypeClass"
            :rarityColor="rarityColor"
            :rarityStyles="rarityStyles"
          />
        </v-col>
      </v-row>
    </v-container>
    <AudioPlayer
      ref="audioPlayerRef"
      :audioSrc="audioSrc"
      audioType="audio/mp3"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { supabase } from "../lib/supabase";
import SecBtn from "./buttons/SecBtn.vue";
import AudioPlayer from "./buttonSounds/buttonAudio.vue";
import CardDetails from "./CardDetails.vue"; // Import the new component
const router = useRouter();

const audioSrc = new URL("@/assets/audio/click.mp3", import.meta.url).href;
const audioPlayerRef = ref(null);

// Swiper modules
const modules = [EffectCards];

// Reactive references for cards data and active slide index
const cards = ref([]);
const activeIndex = ref(0);

// Function to fetch cards data from Supabase
const fetchCards = async () => {
  const { data, error } = await supabase.from("cards").select("*");

  if (error) {
    console.error(error);
  } else {
    cards.value = data;
  }
};

// Function to handle slide change event
const onSlideChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};

// Computed property to get the active card based on the active slide index
const activeCard = computed(() => cards.value[activeIndex.value]);

// Computed property to get the CSS class for the card type
const cardTypeClass = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.type) {
    case "attack":
      return "attack_bg";
    case "defense":
      return "defense_bg";
    case "buff":
      return "buff_bg";
    default:
      return "";
  }
});

// Computed property to get the CSS class for the card rarity
const cardRarityClass = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.rarity) {
    case "common":
      return "common_bg";
    case "rare":
      return "rare_bg";
    case "special":
      return "special_bg";
    default:
      return "";
  }
});

// Computed property to get the color based on the card rarity
const rarityColor = computed(() => {
  if (!activeCard.value) return "#ffd82b"; // Default color
  switch (activeCard.value.rarity) {
    case "common":
      return "#307605";
    case "rare":
      return "#772011";
    case "special":
      return "#936529";
    default:
      return "#ffd82b";
  }
});

// Computed property to get the styles based on the card rarity
const rarityStyles = computed(() => {
  if (!activeCard.value) return {};
  switch (activeCard.value.rarity) {
    case "common":
      return {
        boxShadow: "none",
      };
    case "rare":
      return {
        boxShadow: "0 0 4px #c96013",
      };
    case "special":
      return {
        boxShadow: "0 0 20px #936529",
        animation: "fadeInOut 2s infinite",
      };
    default:
      return {};
  }
});

// Computed property to get the avatar image URL based on the card type
const avatarImage = computed(() => {
  if (!activeCard.value) return "";
  switch (activeCard.value.type) {
    case "attack":
      return new URL("./../assets/icon/sticks.png", import.meta.url).href;
    case "defense":
      return new URL("./../assets/icon/defense.png", import.meta.url).href;
    case "buff":
      return new URL("./../assets/icon/buff.png", import.meta.url).href;
    default:
      return "";
  }
});

// Computed property to get the top value for the card name based on the card rarity
const cardNameTop = computed(() => {
  if (!activeCard.value) return "5px"; // Default top value
  const topValue = activeCard.value.rarity === "special" ? "16px" : "5px";
  console.log(
    `Card rarity: ${activeCard.value.rarity}, Top value: ${topValue}`
  );
  return topValue;
});

// Computed property to get the gradient colors based on the card rarity
const gradientColors = computed(() => {
  if (!activeCard.value) return { start: "#3f870e", end: "#9c6810" }; // Default gradient colors
  switch (activeCard.value.rarity) {
    case "common":
      return { start: "#9c6810", end: "#3f870e" };
    case "rare":
      return { start: "#772011", end: "#c96013" };
    case "special":
      return { start: "#37790a", end: "#936529" };
    default:
      return { start: "#3f870e", end: "#9c6810" };
  }
});

// Computed property to get the text shadow style based on the card rarity
const textShadowStyle = computed(() => {
  if (!activeCard.value) return {};
  switch (activeCard.value.rarity) {
    case "rare":
      return { textShadow: "2px 2px 4px #c95f13e2" };
    case "special":
      return { textShadow: "2px 2px 6px #dab458" };
    default:
      return {};
  }
});

// Computed property to get the bottom value for the card rarity based on the card rarity
const cardRarityBottom = computed(() => {
  if (!activeCard.value) return "156px"; // Default bottom value
  if (activeCard.value.rarity === "rare") return "149px";
  if (activeCard.value.rarity === "special") return "158px";

  return "156px";
});

// Computed property to get the top value and color for the card description based on the card rarity
const cardDescriptionStyle = computed(() => {
  if (!activeCard.value) return { top: "362px", color: "#34782e" }; // Default styles
  switch (activeCard.value.rarity) {
    case "common":
      return { top: "362px", color: "#307605" };
    case "rare":
      return { top: "370px", color: "#772011" };
    case "special":
      return { top: "350px", color: "#936529" };
    default:
      return { top: "362px", color: "#34782e" };
  }
});

const playAudio = () => {
  if (audioPlayerRef.value) {
    audioPlayerRef.value.playAudio();
  }
};

const navigateWithSound = (route) => {
  playAudio();
  setTimeout(() => {
    router.push(route);
  }, 500); // 500 ms delay before navigation
};

// Fetch cards data when the component is mounted
onMounted(() => {
  fetchCards();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Rock+Salt&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Balsamiq+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Merienda:wght@300..900&family=Rock+Salt&display=swap");

.balsamiq-sans {
  font-family: "Balsamiq Sans", sans-serif;
  font-weight: 100;
  font-style: normal;
}

.balsamiq-sans-bold {
  font-family: "Balsamiq Sans", sans-serif;
  font-weight: 900;
  font-style: normal;
}

.merienda {
  font-family: "Merienda", cursive;
  font-weight: 100; /* You can change the weight as needed */
  font-style: normal;
}

.display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Temporary BG */
  background-image: url("./../assets/background/bg2.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.mySwiper {
  width: 400px;
  height: 500px;
}

.swiper-slide {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card-image {
  width: 100%;
  height: auto;
  border-radius: 18px;
}

.card-name {
  position: absolute;
  top: 5px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  color: rgb(0, 0, 0); /* Adjust text color as needed */
  font-size: 22px;
  text-transform: capitalize;
}

.card-rarity {
  position: absolute;
  bottom: 156px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  color: rgb(244, 244, 244); /* Adjust text color as needed */
  font-size: 14px;
}

.card-description {
  position: absolute;
  top: 362px; /* Adjust as needed */
  left: 50%;
  transform: translateX(-50%);
  color: #34782e;
  width: 70%;
  font-size: 14px;
  letter-spacing: 0; /* Add this line to remove inline text spacing */
  line-height: 1.2; /* Adjust line height to reduce gap */
  padding: 0; /* Remove any padding */
  margin: 0; /* Remove any margin */
}

.top-right-button {
  position: absolute;
  top: 40px;
  right: 50px;
}

/* Add styles for card type classes */
.attack_bg {
  background-color: #464646;
}

.defense_bg {
  background-color: #263238;
}

.buff_bg {
  background-color: #3e2723;
}

/* Add styles for card rarity classes */
.common_bg {
  background-color: #307605;
}

.rare_bg {
  background-color: #772011;
  box-shadow: 0 0 20px #c96013;
}

.special_bg {
  background-color: #936529;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px #936529;
  animation: fadeInOut 2s infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    box-shadow: 0 0 15px #936529;
    background-color: #936529;
  }
  50% {
    box-shadow: 0 0 40px #ddb75a;
    background-color: #ddb75a; /* Slightly lighter shade for emphasis */
  }
}
@media (max-width: 1300px) {
  #cards{
    position: relative;
    top: 10rem;
  }
  

 
  .display{
    height: 100%;
  }
}
@media (max-width: 360px) {
  #cards {
   top: 4rem;
    max-width: 100%; /* Adjust further if needed for smaller screens */
  }
  .mySwiper {
    width: 100%;
  }
  #card_rarity{
    position: absolute;
    top: 16.3rem;
    font-size: 15px;
  }
 #card_desc{
  position: absolute;
  right: -0.2rem;
  bottom: 1.4rem;
  width: 100%;
  font-size: 8px;
 }
  .display{
    height: 100%;
  }
  #back_btn{
    position: absolute;
    left: 8.5rem;
  }
}
</style>
