<template>
    <v-card class="pa-4">
      <v-card-title>Create or Join a Room</v-card-title>
      <v-card-text>
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
      <v-row dense>
        <v-col v-for="room in rooms" :key="room.id" cols="6">
          <v-card outlined class="pa-4">
            <v-card-subtitle>Available Rooms</v-card-subtitle>
            <v-card-title class="font-weight-bold">{{ room.room_name }}</v-card-title>
            <v-card-subtitle>
              Created by: {{ room.player_1_user_name }}
              <br />
              Player 2: {{ room.player_2_user_name || 'Open' }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                color="primary"
                @click.stop="enterRoom(room)"
                :disabled="room.isFull"
              >
                BATTLE
              </v-btn>
              <v-btn
                v-if="room.isFull"
                color="green"
                @click.stop="startBattle(room)"
              >
                On Battle!
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>


<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { supabase } from '@/lib/supabase';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const toast = useToast();
    const router = useRouter();
    const roomName = ref('');
    const rooms = ref([]);

    // Fetch all rooms and mark them as "On Battle!" if both players are filled
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, room_name, player_1(id, user_name), player_2(id, user_name)');

      if (error) {
        toast.error(`Error fetching rooms: ${error.message}`, { timeout: 3000 });
      } else {
        rooms.value = data.map(room => ({
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

    const createRoom = async () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error('User ID not found in local storage', { timeout: 3000 });
        return;
      }
      if (!roomName.value) {
        toast.warning('Room name is required', { timeout: 3000 });
        return;
      }

      const { data, error } = await supabase
        .from('rooms')
        .insert([{ player_1: userId, room_name: roomName.value }]);

      if (error) {
        toast.error(`Error creating room: ${error.message}`, { timeout: 3000 });
      } else {
        toast.success('Room created successfully!', { timeout: 3000 });
        roomName.value = ''; // Clear input after room creation
        fetchRooms(); // Refresh room list
      }
    };

    const enterRoom = async (room) => {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error('User ID not found in local storage', { timeout: 3000 });
        return;
      }

      if (room.player_1_id == userId) {
        toast.info('Invite your friends for a match!', { timeout: 3000 });
        return;
      }

      if (room.isFull) {
        toast.error('Room is already in battle', { timeout: 3000 });
        return;
      }

      const { data, error } = await supabase
        .from('rooms')
        .update({ player_2: userId })
        .eq('id', room.id);

      if (error) {
        toast.error(`Error entering room: ${error.message}`, { timeout: 3000 });
      } else {
        toast.success('You have entered the room!', { timeout: 3000 });
        fetchRooms(); // Refresh room list
      }
    };

    const startBattle = async (room) => {
      if (!room.player_2_user_name) {
        toast.error('Player 2 is not yet in the room', { timeout: 3000 });
        return;
      }
      router.push('/battle');
    };

    const setupRealtimeSubscription = () => {
      const roomsChannel = supabase
        .channel('rooms')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, async (payload) => {
          if (payload.new.player_2 || payload.old.player_2 !== payload.new.player_2) {
            const updatedRoom = {
              id: payload.new.id,
              room_name: payload.new.room_name,
              player_1_user_name: payload.new.player_1.user_name,
              player_2_user_name: payload.new.player_2 ? payload.new.player_2.user_name : null,
              player_1_id: payload.new.player_1.id,
              player_2_id: payload.new.player_2 ? payload.new.player_2.id : null,
              isFull: payload.new.player_1 && payload.new.player_2,
            };

            const index = rooms.value.findIndex(room => room.id === updatedRoom.id);
            if (index !== -1) {
              rooms.value[index] = updatedRoom;
            } else {
              rooms.value.push(updatedRoom);
            }
          }
        })
        .subscribe();
    };

    onMounted(() => {
      fetchRooms();
      setupRealtimeSubscription();

      // Add an event listener to refetch rooms on any click
      document.addEventListener('click', fetchRooms);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', fetchRooms);
    });

    return {
      roomName,
      rooms,
      createRoom,
      enterRoom,
      startBattle,
    };
  },
};
</script>


