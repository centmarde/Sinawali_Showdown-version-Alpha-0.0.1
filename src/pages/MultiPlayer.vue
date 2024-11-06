<template>
    <v-card class="pa-4">
      <v-card-title>Create or Join a Room</v-card-title>
      <v-card-text>
        <!-- Input for Room Name -->
        <v-text-field
          v-model="roomName"
          label="Room Name"
          required
          placeholder="Enter room name"
        ></v-text-field>
        <router-link to="/landing" class="mx-2">
  <v-btn style="background-color: yellow; color: black;">Back</v-btn>
</router-link>

        <v-btn color="primary" @click="createRoom">Create a Room</v-btn>
        
        <v-divider class="my-4"></v-divider>
  
        
      </v-card-text>
    </v-card>

    <v-container fluid v-if="rooms.length">
         
          <!-- Two-column layout for rooms -->
          <v-row dense>
            <v-col v-for="room in rooms" :key="room.id" cols="6">
              <v-card outlined class="pa-4">
                <v-card-subtitle>Available Rooms</v-card-subtitle>
                <v-card-title class="font-weight-bold">{{ room.room_name }}</v-card-title>
                <v-card-subtitle>Created by: {{ room.player_1_user_name }}</v-card-subtitle>
                <v-card-actions>
                  <v-btn color="primary" @click.stop="enterRoom(room.id)">Enter Room</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { supabase } from '@/lib/supabase';
  import { useToast } from "vue-toastification";
  
  export default {
    setup() {
      const toast = useToast();
      const roomName = ref('');
      const rooms = ref([]);
  
      // Function to create a new room
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
          .from('rooms')
          .insert([{ player_1: userId, room_name: roomName.value }]);
  
        if (error) {
          toast.error(`Error creating room: ${error.message}`, { timeout: 3000 });
        } else {
          toast.success("Room created successfully!", { timeout: 3000 });
          roomName.value = ''; // Clear input after room creation
          fetchRooms(); // Refresh room list
        }
      };
  
      // Fetch existing rooms and display them
      const fetchRooms = async () => {
        const { data, error } = await supabase
          .from('rooms')
          .select('id, room_name, player_1(user_name)');
  
        if (error) {
          toast.error(`Error fetching rooms: ${error.message}`, { timeout: 3000 });
        } else {
          rooms.value = data.map(room => ({
            id: room.id,
            room_name: room.room_name,
            player_1_user_name: room.player_1.user_name
          }));
        }
      };
  
      // Function to enter a room
      const enterRoom = (roomId) => {
        toast.info(`Entering room with ID: ${roomId}`, { timeout: 3000 });
        // Implement additional navigation logic if needed
      };
  
      // Fetch rooms on component mount
      onMounted(() => {
        fetchRooms();
      });
  
      return {
        roomName,
        rooms,
        createRoom,
        enterRoom
      };
    }
  };
  </script>
  
  <style scoped>
  /* Customize styles as needed */
  </style>
  