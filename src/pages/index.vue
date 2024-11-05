<template>
  <div @click="handleUserInteraction" @touchstart="handleUserInteraction">
    <Background />
    <!-- Hide HomeMenu if login or signup dialog is shown -->
    <HomeMenu v-if="!showLoginDialog && !showSignUpDialog" />
    <div
      v-if="isLoading"
      class="loader-overlay"
      :class="{ 'fade-out': !isLoading }"
    >
      <IntroLoader />
      <PrimBtn class="skip-btn" @click="skipLoader"></PrimBtn>

      <audio ref="skipAudio">
        <source src="../assets/audio/click.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>


    <!-- Login Dialog -->
    <v-dialog v-if="!isLoggedIn" style="z-index: 10" persistent v-model="showLoginDialog" max-width="400">
      <template v-slot:default>
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-form ref="loginForm" v-model="valid">
              <v-text-field
                v-model="loginEmail"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="loginPassword"
                label="Password"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="login">Login</v-btn>
            <v-btn @click="showSignUpDialog = true">Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- Sign Up Dialog -->
    <v-dialog v-if="!isLoggedIn" v-model="showSignUpDialog" max-width="400">
      <template v-slot:default>
        <v-card>
          <v-card-title>Sign Up</v-card-title>
          <v-card-text>
            <v-form ref="signupForm" v-model="valid">
              <v-text-field
                v-model="signupEmail"
                label="Email"
                type="email"
                required
              ></v-text-field>
              <v-text-field
                v-model="signupUsername"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="signupPassword"
                label="Password"
                type="password"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="signup">Create Account</v-btn>
            <v-btn @click="showSignUpDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Background from "@/components/landingpage/Background.vue";
import IntroLoader from "@/pages/loader.vue";
import PrimBtn from "@/components/buttons/PrimBtn.vue";
import { useUserStore } from "@/stores/useUserStore";
import { useRouter } from "vue-router";
import { useAudioStore } from "@/stores/audioStore";

const audioStore = useAudioStore();
const isLoading = ref(true);
const audioPlayer = ref(null);
const skipAudio = ref(null);
const hasPlayedAudio = ref(false);
const userStore = useUserStore();
const valid = ref(false);

const router = useRouter();
const signupEmail = ref('');
const signupUsername = ref('');
const signupPassword = ref('');
const loginEmail = ref('');
const loginPassword = ref('');

const showSignUpDialog = ref(false);
const showLoginDialog = ref(true);

// Computed property to check if the user is already logged in
const isLoggedIn = computed(() => userStore.isAuthenticated);

// Function to skip the loader and show the login dialog if not logged in
const skipLoader = () => {
  if (skipAudio.value) {
    skipAudio.value
      .play()
      .then(() => {
        setTimeout(() => {
          isLoading.value = false;
          if (!isLoggedIn.value) showLoginDialog.value = true;
        }, 500);
      })
      .catch((error) => {
        console.error("Error playing skip audio:", error);
      });
  }
};

const handleUserInteraction = () => {
    // Play click sound when user interacts with the component
    if (!hasPlayedAudio.value) {
        audioStore.playAdal(); // Ensure adal sound plays once on mount
        hasPlayedAudio.value = true;
    }
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
    if (!isLoggedIn.value) showLoginDialog.value = true;
  }, 10000);
});

const signup = async () => {
  const { error } = await userStore.signup(signupEmail.value, signupPassword.value, signupUsername.value);
  if (!error) {
    console.log("Signup successful!");
    showSignUpDialog.value = false;
  }
};

const login = async () => {
  console.log("Attempting login with email:", loginEmail.value);
  const { error } = await userStore.login(loginEmail.value, loginPassword.value);
  if (!error) {
    console.log("Login successful!");
    showLoginDialog.value = false;
    router.push({ name: "landing" });
  } else {
    console.error("Login error:", error);
  }
};
</script>


<style scoped>
#ygar {
  background-color: #151515;
  position: relative;
}

.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(21, 21, 21, 0.9); /* Dark semi-transparent overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure it's on top of all content */
  transition: opacity 0.5s ease-in-out;
}

.loader-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-in-out, visibility 0s 0.5s; /* Visibility hidden after fade-out */
}

.skip-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
