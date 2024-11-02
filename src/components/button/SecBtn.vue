<template>
  <v-btn class="Btn"></v-btn>
</template>

<style scoped>
/* From Uiverse.io by vinodjangid07 */
.Btn {
  width: 110px;
  height: 40px;
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
  content: "BACK";
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
