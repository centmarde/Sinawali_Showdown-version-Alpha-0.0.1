import { createClient } from "@supabase/supabase-js";
import { useToast } from "vue-toastification";
// Initialize Supabase client

const toast = useToast();
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function doLogout() {
  // Confirm logout
  const confirmed = window.confirm("Are you sure you want to logout?");

  // If not confirmed, exit the function early
  if (!confirmed) {
    return;
  }
  // Supabase Logout
  const { error } = await supabase.auth.signOut();

  if (error) {
    toast("Logout Failed: " + error.message); // Display error message
  } else {
    toast("Logout Successfully!"); // Notify successful logout
    localStorage.clear(); // Clear local storage
    window.location.href = "/"; // Redirect to login page
  }
}
// localStorage.clear();
export { doLogout };
