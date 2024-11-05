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
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        console.error('Error signing up:', signUpError.message);
        toast.error('An error occurred during sign-up. Please try again.'); // Use toast instead of alert
        return;
      }

      const userId = signUpData?.user?.id;
      console.log("Signup successful, user:", signUpData.user);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{ user_name: username, user_id: userId }]);

      if (userError) {
        console.error("Error inserting username into users table:", userError.message);
        toast.error("Error inserting username into users table."); // Use toast for errors
        return { error: userError };
      }

      console.log("User data inserted into 'users' table:", userData);

      // Store user ID and username in the Pinia store
      this.userId = userId;  // Update with userId from signup
      this.username = username;

      toast.success("Signup successful!"); // Notify successful signup
      return { user: userData };
    },
    
    async login(email, password) {
      console.log("Login started with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message); // Use toast for error messages
        throw new Error(error.message);
      }
  
      if (data.session) {
        const { session, user } = data;

        // Storing tokens in localStorage
        localStorage.setItem("access_token", session.access_token);
        localStorage.setItem("refresh_token", session.refresh_token);
        localStorage.setItem("auth_id", user.id);
  
        // Fetching user profile from 'users' table
        const { data: profiles, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id); // Corrected reference to user.id
  
        if (profileError || profiles.length === 0) {
          console.error("Profile fetch error:", profileError);
          toast.error("Profile fetch error."); // Use toast for profile errors
          throw new Error("Profile fetch error.");
        }
  
        localStorage.setItem("user_id", profiles[0].user_id); // Assuming user_id is the correct column
        localStorage.setItem("Role", profiles[0].is_admin ? "true" : "false");
        
        // Store user ID and username in the Pinia store
        this.userId = user.id;
        this.username = profiles[0].user_name; // Correctly set the username

        toast.success("Login successful!"); // Notify successful login
        return { user: data.user };
      }
    },
  },
});
