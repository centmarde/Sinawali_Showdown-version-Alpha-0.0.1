<template>
  <v-btn
    class="Btn"
    :data-content="dynamicContent"
    :style="{ width: buttonWidth, height: buttonHeight }"
  ></v-btn>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  content: {
    type: String,
    default: "BACK",
  },
  width: {
    type: String,
    default: "110px",
  },
  height: {
    type: String,
    default: "40px",
  },
});

const dynamicContent = computed(() => props.content);
const buttonWidth = computed(() => props.width);
const buttonHeight = computed(() => props.height);
</script>

<style scoped>
/* From Uiverse.io by vinodjangid07 */
.Btn {
  border: none;
  border-radius: 10px;
  background: linear-gradient(
    to right,
    #555555,
    #aaaaaa,
    #555555,
    #555555,
    #aaaaaa,
    #555555
  );
  background-size: 250%;
  background-position: left;
  color: #aaaaaa;
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
  color: #aaaaaa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3px;
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
