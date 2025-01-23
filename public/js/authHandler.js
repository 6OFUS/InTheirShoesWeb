import { signUp, loginInPW, logInGoogle, resetPassword, supabase } from './auth.js';

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session.user);
  
      // Check if we're in prod or test (remove on production)
      const isProduction = (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1');
      
      // Set the correct redirect URL based on environment
      const redirectUrl = isProduction 
        ? '/dashboard.html'  // PROD
        : '/public/dashboard.html';  //TEST
      
      // Perform the redirect
      window.location.href = redirectUrl;
    }
  });
  

// Utility function to show error messages
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = '';
  errorElement.classList.add('hidden');
}

// Event listeners for the login form
const loginForm = document.querySelector('#login-form');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const loginError = document.querySelector('#login-error');
const googleLoginButton = document.querySelector('#google-login');
const googleSignupButton = document.querySelector('#google-signup');

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError('login-error');

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    try {
      await loginInPW(email, password);
    } catch (error) {
      showError('login-error', error.message);
    }
  });
}

if (googleLoginButton) {
  googleLoginButton.addEventListener('click', async () => {
    try {
      await logInGoogle();
    } catch (error) {
      showError('login-error', error.message);
    }
  });
}

if (googleSignupButton) {
    googleSignupButton.addEventListener('click', async () => {
      try {
        await logInGoogle();
      } catch (error) {
        showError('signup-error', error.message);
      }
    });
  }

// Event listeners for the sign-up form
const signUpForm = document.querySelector('#signup-form');
const signUpEmail = document.querySelector('#signup-email');
const signUpPassword = document.querySelector('#signup-password');
const signUpConfirmPassword = document.querySelector('#signup-confirm-password');
const signUpError = document.querySelector('#signup-error');

if (signUpForm) {
  signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError('signup-error');

    const email = signUpEmail.value.trim();
    const password = signUpPassword.value.trim();
    const confirmPassword = signUpConfirmPassword.value.trim();

    if (password !== confirmPassword) {
      showError('signup-error', "Passwords don't match.");
      return;
    }

    try {
      await signUp(email, password);
    } catch (error) {
      showError('signup-error', error.message);
    }
  });
}

// Event listeners for the reset password form
const resetPasswordForm = document.querySelector('#reset-password-form');
const resetPasswordEmail = document.querySelector('#reset-password-email');
const resetPasswordError = document.querySelector('#reset-password-error');

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearError('reset-password-error');

    const email = resetPasswordEmail.value.trim();

    try {
      await resetPassword(email);
      alert('Password reset email sent successfully.');
      signupSection.classList.add('hidden');
        resetSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    } catch (error) {
      showError('reset-password-error', error.message);
    }
  });
}

// Form switching functionality
const loginSection = document.querySelector('#login-section');
const signupSection = document.querySelector('#signup-section');
const resetSection = document.querySelector('#reset-section');

const showLoginLink = document.querySelector('#show-login');
const showSignupLink = document.querySelector('#show-signup');
const showResetLink = document.querySelector('#show-reset');
const cancelResetLink = document.querySelector('#cancel-reset');

if (showLoginLink) {
  showLoginLink.addEventListener('click', (event) => {
    event.preventDefault();
    signupSection.classList.add('hidden');
    resetSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });
}

if (showSignupLink) {
  showSignupLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginSection.classList.add('hidden');
    resetSection.classList.add('hidden');
    signupSection.classList.remove('hidden');
  });
}

if (showResetLink) {
  showResetLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginSection.classList.add('hidden');
    signupSection.classList.add('hidden');
    resetSection.classList.remove('hidden');
  });
}

if (cancelResetLink) {
  cancelResetLink.addEventListener('click', (event) => {
    event.preventDefault();
    resetSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.error-message').forEach((error) => {
    error.classList.add('hidden');
  });
});
