import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { firebaseConfig, supabaseUrl, supabaseAnonKey } from './config.js';

const app = initializeApp(firebaseConfig);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Sign Up
export async function signUp(email, password) {
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!isValidPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
    );
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  const user = data.user;
  if (user) {
    window.location.href = "/public/dashboard.html"; // change in prod
  } else {
    throw new Error("Signup failed. Please try again.");
  }

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
      options: {
        redirectTo: `${window.location.origin}/public/dashboard.html`, // change in prod
      },
    });
    
    if (error) {
      console.error('Error signing in with Google:', error.message);
      throw new Error(`Google sign-in failed: ${error.message}`);
    }
  
    return data;
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
