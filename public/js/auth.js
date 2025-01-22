import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { createClient } from '@supabase/supabase-js';
import { firebaseConfig, supabaseUrl, supabaseKey } from './config.js';

const app = initializeApp(firebaseConfig);
const supabase = createClient(supabaseUrl, supabaseKey);

// Input Validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // Password must be at least 8 characters, contain one uppercase, one lowercase, one digit, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
  return passwordRegex.test(password);
}

// Error Handling
function handleAuthError(error) {
  if (error) {
    console.error("Authentication error:", error.message);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// Redirect
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session.user);
      // Redirect to your app's dashboard or homepage
      window.location.href = '/dashboard';
    }
  });  

// Sign Up
export async function signUp(email, password) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!isValidPassword(password)) {
    throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
  }
  const { data, error } = await supabase.auth.signUp({ email, password });
  handleAuthError(error);
  return data;
}

// Log In With Password
export async function loginInPW(email, password) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  handleAuthError(error);
  return data;
}

// Log In with Google
export async function logInGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      console.error('Error signing in with Google:', error.message);
      throw new Error(`Google sign-in failed: ${error.message}`);
    }
  
    return data;  // Returns the authentication data
  }

// Log In With Email Link
export async function loginInOTP(email) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  handleAuthError(error);
  return data;
}

// Update User
export async function updateUser(email, password) {
  const updates = {};
  if (email) {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format.");
    }
    updates.email = email;
  }
  if (password) {
    if (!isValidPassword(password)) {
      throw new Error("Password must meet complexity requirements.");
    }
    updates.password = password;
  }

  const { data, error } = await supabase.auth.updateUser(updates);
  handleAuthError(error);
  return data;
}

// Reset Password
export async function resetPassword(email) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  handleAuthError(error);
  return data;
}

// Log Out
export async function logOut() {
  const { error } = await supabase.auth.signOut();
  handleAuthError(error);
}
