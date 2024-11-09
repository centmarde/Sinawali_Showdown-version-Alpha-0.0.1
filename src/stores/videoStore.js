// videoStore.js (Pinia store)
import { defineStore } from "pinia";

export const useVideoStore = defineStore("video", {
  state: () => ({
    videoUrl: "", // To store the video URL
    isPlaying: false, // To track if the video is playing
  }),
  actions: {
    playVideo(url) {
      this.videoUrl = url;
      this.isPlaying = true;
    },
    stopVideo() {
      this.isPlaying = false;
      this.videoUrl = "";
    },
  },
});
