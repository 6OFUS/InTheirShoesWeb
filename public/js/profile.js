const usernameText = document.getElementById('profileDisplayName');
const emailText = document.getElementById('profileEmail');
const currentPasswordText = document.getElementById('currentPasswordText');
const newPasswordText = document.getElementById('newPasswordText');

//Change Password
document.getElementById('changePasswordBtn').addEventListener("click", () => {
    console.log("Change Password!")
    if (reauthenticateAuth(auth.currentUser.email, document.getElementById('currentPasswordText').value)) {
        changePassword(document.getElementById('newPasswordText').value)
    } else {
        console.log("wrong password!")
    }
});

//Change Email
document.getElementById('changeEmailBtn').addEventListener("click", () => {
    console.log("Change Email!")
    document.getElementById('changeEmailBtn').classList.add("hidden")
    document.getElementById('changeEmailLabel').classList.remove("hidden")
    document.getElementById('changeUsernameBtn').classList.remove("hidden")
    document.getElementById('changeUsernameLabel').classList.add("hidden")
});

document.getElementById('changeEmailCfmBtn').addEventListener("click", () => {
    changeEmail(document.getElementById('newEmailText').value)
});

// Change Username
document.getElementById('changeUsernameBtn').addEventListener("click", () => {
    console.log("Change Username!")
    document.getElementById('changeUsernameBtn').classList.add("hidden")
    document.getElementById('changeUsernameLabel').classList.remove("hidden")
    document.getElementById('changeEmailBtn').classList.remove("hidden")
    document.getElementById('changeEmailLabel').classList.add("hidden")
});

document.getElementById('changeUsernameCfmBtn').addEventListener("click", () => {
    changeUsername(document.getElementById('newUsernameText').value)
});

// Log Out
document.getElementById('logoutAccountBtn').addEventListener("click", () => {
    console.log("Logout Account!")
    if(logoutAccount()){
        window.location.href = 'index.html'
    }
});

// Delete or Deactivate Account
document.getElementById('deleteAccountBtn').addEventListener("click", () => {
    console.log("Delete Account!")
    document.getElementById('confirmationModal').classList.remove("hidden")
});

document.getElementById('deleteAccountCfmBtn').addEventListener("click", () => {
    console.log("Confirm: Delete Account")
    document.getElementById('confirmationModal').classList.add("hidden")
    deleteAccount()
});

document.getElementById('deleteAccountCancelBtn').addEventListener("click", () => {
    console.log("Cancel: Delete Account")
    document.getElementById('confirmationModal').classList.add("hidden")
});