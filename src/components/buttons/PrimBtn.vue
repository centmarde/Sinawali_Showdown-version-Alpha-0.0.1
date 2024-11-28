<template>
  <v-btn
    class="Btn"
    :data-content="dynamicContent"
    :style="{
      width: buttonWidth,
      height: buttonHeight,
      '--button-margin-left': buttonMarginLeft,
    }"
  ></v-btn>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: "PLAY",
  },
  width: {
    type: String,
    default: "110px",
  },
  height: {
    type: String,
    default: "40px",
  },
  marginLeft: {
    type: String,
    default: "3px",
  },
});

const dynamicContent = computed(() => props.content);
const buttonWidth = computed(() => props.width);
const buttonHeight = computed(() => props.height);
const buttonMarginLeft = computed(() => props.marginLeft);
</script>

<style scoped>
/* From Uiverse.io by vinodjangid07 */
.Btn {
  border: none;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    #77530a,
    #ffd277,
    #77530a,
    #77530a,
    #ffd277,
    #77530a
  );
  background-size: 250%;
  background-position: left;
  color: #ffd277;
  position: relative;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition-duration: 1s;
  overflow: hidden;
}

.Btn::before {
  position: absolute;
  content: attr(data-content);
  color: #ffd277;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: var(--button-margin-left);
  width: 95%;
  height: 88%;
  border-radius: 8px;
  transition-duration: 1s;
  background-color: rgba(0, 0, 0, 0.842);
  background-size: 200%;
}

.Btn:hover {
  background-position: right;
  transition-duration: 1s;
}

.Btn:hover::before {
  background-position: right;
  transition-duration: 1s;
}

.Btn:active {
  transform: scale(0.95);
}
</style>
