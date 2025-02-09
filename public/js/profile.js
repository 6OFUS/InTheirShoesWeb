import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { supabaseUrl, supabaseAnonKey } from './config.js';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const usernameText = document.getElementById('profileDisplayName');
const emailText = document.getElementById('profileEmail');
const currentPasswordText = document.getElementById('currentPasswordText');
const newPasswordText = document.getElementById('newPasswordText');
const newUsernameText = document.getElementById('newUsernameText');
const newEmailText = document.getElementById('newEmailText');

const changeUsernameBtn = document.getElementById('changeUsernameBtn');
const changeUsernameLabel = document.getElementById('changeUsernameLabel');
const changeEmailBtn = document.getElementById('changeEmailBtn');
const changeEmailLabel = document.getElementById('changeEmailLabel');

function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}\[\]:;"'<>,.?/]).{8,}$/;
    return passwordRegex.test(password);
}

// Fetch user profile
document.addEventListener("DOMContentLoaded", async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error fetching user data:", error);
    } else {
        usernameText.textContent = user.user_metadata.full_name || "Unknown User";
        emailText.textContent = user.email;
    }
});

document.getElementById('changePasswordBtn').addEventListener("click", async () => {
    const currentPassword = currentPasswordText.value;
    const newPassword = newPasswordText.value;

    // Re-authenticate user by signing in again
    const { error: signInError, data: session } = await supabase.auth.signInWithPassword({
        email: emailText.textContent,
        password: currentPassword
    });

    if (signInError) {
        alert("Incorrect current password. Please try again.");
        return;
    }

    if (!isValidPassword(newPassword)) {
        alert("New password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
        return;
    }

    if (currentPassword === newPassword) {
        alert("New password must be different from the old password.");
        return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
        console.error("Error updating password:", updateError);
        alert(updateError.message || "Failed to update password. Please try again later.");
    } else {
        alert("Password updated successfully!");
    }
});

// Change Email
changeEmailBtn.addEventListener("click", () => {
    changeUsernameBtn.classList.remove("hidden");
    changeUsernameLabel.classList.add("hidden");

    changeEmailBtn.classList.add("hidden");
    changeEmailLabel.classList.remove("hidden");
});

document.getElementById('changeEmailCfmBtn').addEventListener("click", async () => {
    const { error } = await supabase.auth.updateUser({ email: newEmailText.value });
    if (error) {
        console.error("Error updating email:", error);
    } else {
        alert("Email updated successfully! Check your inbox for verification.");
        
        changeEmailBtn.classList.remove("hidden");
        changeEmailLabel.classList.add("hidden");
    }
});

// Change Username
changeUsernameBtn.addEventListener("click", () => {
    changeEmailBtn.classList.remove("hidden");
    changeEmailLabel.classList.add("hidden");

    changeUsernameBtn.classList.add("hidden");
    changeUsernameLabel.classList.remove("hidden");
});

document.getElementById('changeUsernameCfmBtn').addEventListener("click", async () => {
    const { error } = await supabase.auth.updateUser({
        data: { full_name: newUsernameText.value }
    });
    if (error) {
        console.error("Error updating username:", error);
    } else {
        alert("Username updated successfully!");
        usernameText.textContent = newUsernameText.value;

        changeUsernameBtn.classList.remove("hidden");
        changeUsernameLabel.classList.add("hidden");
    }
});

// Log Out
document.getElementById('logoutAccountBtn').addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error);
    } else {
        window.location.href = 'index.html';
    }
});

// Delete Account
document.getElementById('deleteAccountBtn').addEventListener("click", () => {
    document.getElementById('confirmationModal').classList.remove("hidden");
});

document.getElementById('deleteAccountCfmBtn').addEventListener("click", async () => {
    const user = await supabase.auth.getUser();
    if (user.error) {
        console.error("Error fetching user:", user.error);
        return;
    }

    const { error } = await supabase.auth.admin.deleteUser(user.data.user.id);
    if (error) {
        console.error("Error deleting account:", error);
    } else {
        alert("Account deleted successfully.");
        window.location.href = 'index.html';
    }
});
