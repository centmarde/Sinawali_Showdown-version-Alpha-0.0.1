// stores/useUserStore.js
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase'; // Ensure Supabase is correctly imported
import { useToast } from "vue-toastification";
const toast = useToast();
export const useUserStore = defineStore('user', {
    
  state: () => ({
    userId: null,    // Store the user ID here
    username: null,  // Store the username if needed
  }),
  actions: {
    async signup(email, password, username) {
      console.log("Signup started with email:", email, "and username:", username);
      const { user, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) {
        console.error("Signup error:", authError);
        return { error: authError };
      }
      console.log("Signup successful, user:", user);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ user_name: username, user_id: user.id }]);

      if (userError) {
        console.error("Error inserting username into users table:", userError);
        return { error: userError };
      }
      console.log("User data inserted into 'users' table:", userData);

      // Store user ID and username in the Pinia store
      this.userId = user.id;
      this.username = username;
     
      return { user: userData };
    },
    
    async login(email, password) {
      console.log("Login started with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
  
      if (data.session) {
        const { session, user } = data;
  
        // Storing tokens in localStorage
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);
        localStorage.setItem("auth_id", user.id);
  
        // Fetching user profile from 'User' table
        const { data: profiles, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id);
  
        if (profileError || profiles.length === 0) {
          throw new Error("Profile fetch error.");
        }
  
        localStorage.setItem("user_id", profiles[0].id);
        localStorage.setItem("Role", profiles[0].is_admin ? "true" : "false");
      // Store user ID and username in the Pinia store
      this.userId = data.user.id;
      this.username = profiles.user_name;

      return { user: data.user };
    }
  }

    
  },
});
