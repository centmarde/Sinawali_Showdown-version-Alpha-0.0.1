<template>
  <div>
    <div class="background-image" :style="backgroundStyle">
      <Background />
    </div>
    <div class="content bg-glass" :style="contentStyle">
      <div class="text-center py-8">
        <v-btn color="blue" size="x-large" rounded="xl" class="mx-2"
          >Create Room</v-btn
        >
        <v-btn color="red" size="x-large" rounded="xl" class="mx-2"
          >Join Room</v-btn
        >
      </div>

      <div>
        <v-container fluid>
          <v-row>
            <!-- Chat Room -->
            <v-col cols="12" lg="4" md="4">
              <!-- Chat Display Area -->
              <v-card elevation="10" class="pa-5" rounded="xl">
                <v-card-title class="font-weight-bold text-h5"
                  >Chat Room</v-card-title
                >
                <v-card-text class="py-10 bg-grey-darken-4">
                  <v-list>
                    <v-list-item
                      v-for="(message, index) in messages"
                      :key="index"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{
                          message.user
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          message.text
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <!-- Chat Input Area -->
                <v-text-field
                  v-model="newMessage"
                  placeholder="Type your message"
                  variant="outlined"
                  rounded="xl"
                >
                  <template v-slot:append>
                    <v-btn icon @click="sendMessage" elevation="24">
                      <v-icon>mdi-send</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-card>
            </v-col>

            <!-- Quick Start Join Random open Room -->
            <v-col cols="12" lg="3" md="3">
              <v-card elevation="10" class="pa-5" rounded="xl">
                <div class="d-flex justify-center align-center pt-9">
                  <v-img
                    :width="280"
                    :height="280"
                    contain
                    src="../../assets/images/random.png"
                  ></v-img>
                </div>

                <v-card-text class="text-center py-10">
                  <v-btn
                    color="yellow-darken-1"
                    @click="joinRandomRoom"
                    size="large"
                    rounded="xl"
                    >Start Game</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Display Rooms in lobby -->
            <v-col cols="12" lg="5" md="5">
              <v-card elevation="10" class="pa-5" rounded="xl">
                <v-card-title class="font-weight-bold text-h5"
                  >Rooms</v-card-title
                >
                <v-card-text class="pt-2">
                  <v-row>
                    <v-col cols="5">
                      <span class="text-subtitle-1 text-md-body-2"
                        >Room Name</span
                      >
                    </v-col>
                    <v-col cols="4" class="text-center">
                      <span class="text-subtitle-1 text-md-body-2">Status</span>
                    </v-col>
                    <v-col cols="3" class="text-center">
                      <span class="text-subtitle-1 text-md-body-2"
                        >Players</span
                      >
                    </v-col>
                  </v-row>
                  <v-divider class="mt-3"></v-divider>

                  <v-row v-if="rooms.length">
                    <v-col v-for="room in rooms" :key="room.id" cols="5">
                      <span class="text-subtitle-1 text-md-body-2">{{
                        room.room_name
                      }}</span>
                    </v-col>
                    <v-col
                      v-for="room in rooms"
                      :key="room.id"
                      cols="4"
                      class="text-center"
                    >
                      <span class="text-subtitle-1 text-md-body-2"
                        >Waiting</span
                      >
                      <!-- <span class="text-subtitle-1">{{ room.status }}</span> -->
                    </v-col>
                    <v-col
                      v-for="room in rooms"
                      :key="room.id"
                      cols="3"
                      class="text-center"
                    >
                      <span class="text-subtitle-1 text-md-body-2">1/2</span>
                      <!-- <span class="text-subtitle-1">{{ room.players }}/2</span> -->
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import necessary modules and components
import { ref, onMounted, onBeforeUnmount } from "vue";
import { supabase } from "@/lib/supabase";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import Background from "@/components/landingpage/Background.vue";

// Initialize toast and router
const toast = useToast();
const router = useRouter();

// Define reactive variables
const roomName = ref("");
const rooms = ref([]);
const backgroundStyle = ref({});
const contentStyle = ref({
  backgroundColor: "rgba(0, 0, 0, 0)", // Initial light background color
  boxShadow: "0 4px 50px rgba(0, 0, 0, 0)", // Initial light shadow
});

// Handle scroll event to update styles dynamically
const handleScroll = () => {
  const scrollY = window.scrollY;
  const blurValue = Math.min(scrollY / 100, 10); // Adjust the divisor to control the blur intensity
  const shadowValue = Math.min(scrollY / 50, 20); // Adjust the divisor to control the shadow intensity
  const bgColorValue = Math.min(scrollY / 500, 0.8); // Adjust the divisor to control the background color intensity

  backgroundStyle.value = {
    filter: `blur(${blurValue}px)`,
  };

  contentStyle.value = {
    boxShadow: `0 4px 50px rgba(0, 0, 0, ${shadowValue / 10})`,
    backgroundColor: `rgba(0, 0, 0, ${bgColorValue})`, // Update background color dynamically
  };
};

// Fetch all rooms and mark them as "On Battle!" if both players are filled
const fetchRooms = async () => {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, room_name, player_1(id, user_name), player_2(id, user_name)");

  if (error) {
    toast.error(`Error fetching rooms: ${error.message}`, {
      timeout: 3000,
    });
  } else {
    rooms.value = data.map((room) => ({
      id: room.id,
      room_name: room.room_name,
      player_1_user_name: room.player_1.user_name,
      player_2_user_name: room.player_2 ? room.player_2.user_name : null,
      player_1_id: room.player_1.id,
      player_2_id: room.player_2 ? room.player_2.id : null,
      isFull: room.player_1 && room.player_2, // Mark room as full if both players are present
    }));
  }
};

// Create a new room
const createRoom = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    toast.error("User ID not found in local storage", { timeout: 3000 });
    return;
  }
  if (!roomName.value) {
    toast.warning("Room name is required", { timeout: 3000 });
    return;
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert([{ player_1: userId, room_name: roomName.value }])
    .select("player_1")
    .single();

  if (data) {
    localStorage.setItem("player1", data.player_1);
  }
  if (error) {
    toast.error(`Error creating room: ${error.message}`, { timeout: 3000 });
  } else {
    toast.success("Room created successfully!", { timeout: 3000 });
    roomName.value = ""; // Clear input after room creation
    fetchRooms(); // Refresh room list
  }
};

// Enter an existing room
const enterRoom = async (room) => {
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    toast.error("User ID not found in local storage", { timeout: 3000 });
    return;
  }

  if (room.player_1_id == userId) {
    toast.info("Invite your friends for a match!", { timeout: 3000 });
    return;
  }

  if (room.isFull) {
    toast.error("Room is already in battle", { timeout: 3000 });
    return;
  }

  const { data, error } = await supabase
    .from("rooms")
    .update({ player_2: userId })
    .eq("id", room.id)
    .select("player_2")
    .single();

  if (data) {
    localStorage.setItem("player2", data.player_2);
  }
  if (room.player_1_id == userId) {
    toast.info("Invite your friends for a match!", { timeout: 3000 });
    return;
  }
  if (error) {
    toast.error(`Error entering room: ${error.message}`, { timeout: 3000 });
  } else {
    toast.success("You have entered the room!", { timeout: 3000 });
    fetchRooms(); // Refresh room list
  }
};

// Start a battle by navigating to the character selection page
const startBattle = async (room) => {
  router.push("/onlineBase");
};

// Set up real-time subscription to listen for changes in the rooms table
const setupRealtimeSubscription = () => {
  const roomsChannel = supabase
    .channel("rooms")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "rooms" },
      async (payload) => {
        if (
          payload.new.player_2 ||
          payload.old.player_2 !== payload.new.player_2
        ) {
          const updatedRoom = {
            id: payload.new.id,
            room_name: payload.new.room_name,
            player_1_user_name: payload.new.player_1.user_name,
            player_2_user_name: payload.new.player_2
              ? payload.new.player_2.user_name
              : null,
            player_1_id: payload.new.player_1.id,
            player_2_id: payload.new.player_2 ? payload.new.player_2.id : null,
            isFull: payload.new.player_1 && payload.new.player_2,
          };

          const index = rooms.value.findIndex(
            (room) => room.id === updatedRoom.id
          );
          if (index !== -1) {
            rooms.value[index] = updatedRoom;
          } else {
            rooms.value.push(updatedRoom);
          }
        }
      }
    )
    .subscribe();
};

// Lifecycle hooks
onMounted(() => {
  fetchRooms();
  setupRealtimeSubscription();

  // Add event listeners
  document.addEventListener("click", fetchRooms);
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  // Remove event listeners
  document.removeEventListener("click", fetchRooms);
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 500px; /* Adjust height as needed */
  background-size: cover;
  background-position: center;
  z-index: 1;
  transition: filter 0.3s ease; /* Smooth transition for blur effect */
}

.content {
  position: relative;
  z-index: 2;
  margin-top: 560px; /* Same as the height of the background image */

  transition: box-shadow 0.1s ease, background-color 0.1s ease; /* Smooth transition for shadow and background color effect */
}

.bg-glass {
  background: rgba(0, 0, 0, 0); /* Initial light background color */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0); /* Initial light shadow */
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
