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
    <v-dialog
      v-if="!isLoggedIn"
      style="z-index: 10"
      persistent
      v-model="showLoginDialog"
      max-width="390"
    >
      <template v-slot:default>
        <v-card class="bg-card" elevation="16" rounded="lg">
          <v-card-title class="text-center bg-ct">
            <h4 class="py-2">Login</h4>
          </v-card-title>
          <v-card-text class="p-0">
            <v-form ref="loginForm" v-model="valid" class="px-8 pt-8">
              <v-text-field
                v-model="loginEmail"
                density="compact"
                placeholder="Email"
                type="email"
                rounded="lg"
                variant="outlined"
                style="line-height: 30px"
                color="yellow-darken-1"
                @focus="isLoginEmailFocused = true"
                @blur="isLoginEmailFocused = false"
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon :color="isLoginEmailFocused ? 'yellow-darken-1' : ''"
                    >mdi-email</v-icon
                  >
                </template></v-text-field
              >
              <v-text-field
                v-model="loginPassword"
                :append-inner-icon="
                  isLoginPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                :type="isLoginPasswordVisible ? 'text' : 'password'"
                placeholder="Password"
                type="password"
                rounded="lg"
                density="compact"
                variant="outlined"
                style="line-height: 30px"
                color="yellow-darken-1"
                @focus="isLoginPasswordFocused = true"
                @blur="isLoginPasswordFocused = false"
                @click:append-inner="
                  isLoginPasswordVisible = !isLoginPasswordVisible
                "
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    :color="isLoginPasswordFocused ? 'yellow-darken-1' : ''"
                    >mdi-lock</v-icon
                  >
                </template></v-text-field
              >
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-content-center pb-7">
            <v-btn
              variant="tonal"
              color="grey-lighten-1"
              elevation="24"
              @click="showSignUpDialog = true"
              >SignUp</v-btn
            >
            <v-btn
              variant="tonal"
              color="yellow-darken-1"
              elevation="24"
              @click="login"
              >Login</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

    <!-- Sign Up Dialog -->
    <v-dialog v-if="!isLoggedIn" v-model="showSignUpDialog" max-width="390">
      <template v-slot:default>
        <!-- <v-img src="@/assets/logo.png" height="200"></v-img> -->
        <v-card class="bg-card" elevation="16" rounded="lg">
          <v-card-title class="text-center bg-ct">
            <h3 class="py-2">Sign Up</h3>
          </v-card-title>
          <v-card-text class="p-0">
            <v-form ref="signupForm" v-model="valid" class="px-8 pt-8">
              <v-text-field
                v-model="signupEmail"
                density="compact"
                placeholder="Email"
                type="email"
                rounded="lg"
                variant="outlined"
                style="line-height: 30px"
                color="yellow-darken-1"
                :rules="[emailRules]"
                @focus="isSignupEmailFocused = true"
                @blur="isSignupEmailFocused = false"
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon :color="isSignupEmailFocused ? 'yellow-darken-1' : ''"
                    >mdi-email</v-icon
                  >
                </template></v-text-field
              >
              <v-text-field
                v-model="signupUsername"
                placeholder="Username"
                rounded="lg"
                density="compact"
                variant="outlined"
                style="line-height: 30px"
                color="yellow-darken-1"
                @focus="isSignupUsernameFocused = true"
                @blur="isSignupUsernameFocused = false"
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    :color="isSignupUsernameFocused ? 'yellow-darken-1' : ''"
                    >mdi-account</v-icon
                  >
                </template></v-text-field
              >
              <v-text-field
                v-model="signupPassword"
                :append-inner-icon="
                  isSignupPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                :type="isSignupPasswordVisible ? 'text' : 'password'"
                placeholder="Password"
                type="password"
                rounded="lg"
                density="compact"
                variant="outlined"
                style="line-height: 30px"
                color="yellow-darken-1"
                @focus="isSignupPasswordFocused = true"
                @blur="isSignupPasswordFocused = false"
                @click:append-inner="
                  isSignupPasswordVisible = !isSignupPasswordVisible
                "
                required
              >
                <template v-slot:prepend-inner>
                  <v-icon
                    :color="isSignupPasswordFocused ? 'yellow-darken-1' : ''"
                    >mdi-lock</v-icon
                  >
                </template></v-text-field
              >
            </v-form>
          </v-card-text>
          <v-card-actions class="d-flex justify-content-center pb-7">
            <v-btn
              variant="tonal"
              color="grey-lighten-1"
              @click="showSignUpDialog = false"
              elevation="24"
            >
              Cancel
            </v-btn>

            <v-btn
              variant="tonal"
              color="yellow-darken-1"
              @click="signup"
              elevation="24"
            >
              Create Account
            </v-btn>
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
import SecBtn from "@/components/buttons/SecBtn.vue";
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
const signupEmail = ref("");
const signupUsername = ref("");
const signupPassword = ref("");
const loginEmail = ref("");
const loginPassword = ref("");

const showSignUpDialog = ref(false);
const showLoginDialog = ref(false);

const isLoginEmailFocused = ref(false);
const isLoginPasswordFocused = ref(false);

const isSignupEmailFocused = ref(false);
const isSignupUsernameFocused = ref(false);
const isSignupPasswordFocused = ref(false);

const isLoginPasswordVisible = ref(false);
const isSignupPasswordVisible = ref(false);

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
        audioStore.playAdal();
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
  const { error } = await userStore.signup(
    signupEmail.value,
    signupPassword.value,
    signupUsername.value
  );
  if (!error) {
    console.log("Signup successful!");
    showSignUpDialog.value = false;
  }
};

const login = async () => {
  console.log("Attempting login with email:", loginEmail.value);
  const { error } = await userStore.login(
    loginEmail.value,
    loginPassword.value
  );
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

.bg-card {
  background: rgba(0, 0, 0, 0.67);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.bg-ct {
  background: rgb(0, 0, 0);
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 1) 0%,
    rgba(85, 85, 85, 0) 100%
  );
}

:deep(.v-overlay__scrim) {
  background-color: rgba(
    255,
    193,
    7,
    0.8
  ) !important; /* Change to your desired color */
  opacity: var(--v-overlay-opacity, 0.15) !important;
}
</style>
