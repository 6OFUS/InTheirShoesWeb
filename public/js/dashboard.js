import { supabaseUrl, supabaseAnonKey } from "./config.js";
import { logOut } from "./auth.js"

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", function () {
    const sections = {
        "DASHBOARD": "dashboard-content",
        "PROFILE": "profile-content",
        "SHOP / SKINS": "shop-content",
        "PHOTO GALLERY": "gallery-content",
        "STATISTICS": "statistics-content",
        "SETTINGS": "settings-content"
    };

    const navLinks = document.querySelectorAll("nav ul li a");
    const buttons = document.querySelectorAll("main button");

    function switchSection(sectionId) {
        Object.values(sections).forEach(id => {
            document.getElementById(id).classList.add("hidden");
        });
        document.getElementById(sectionId).classList.remove("hidden");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const sectionId = sections[this.textContent.trim()];
            if (sectionId) switchSection(sectionId);
        });
    });

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const sectionId = sections[this.textContent.trim()];
            if (sectionId) switchSection(sectionId);
        });
    });

    // Show dashboard by default
    switchSection("dashboard-content");

    async function checkUser() {
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
            console.log('User not signed in, redirecting...');
            window.location.href = 'auth.html';
            return;
        }
        
        //Displaying user information

        console.log(`Display Name: ${data.user.user_metadata?.full_name || 'N/A'}`);
        console.log(`Email: ${data.user.email}`);

        document.getElementById('sidebarDisplayName').innerHTML = data.user.user_metadata?.full_name || 'N/A';
        document.getElementById('sidebarEmail').innerHTML = data.user.email;
        document.getElementById('profileDisplayName').innerHTML = data.user.user_metadata?.full_name || 'N/A';
        document.getElementById('profileEmail').innerHTML = data.user.email;

        document.getElementById('profileAvatar').src = data.user.user_metadata?.avatar_url || 'img/characters/blindman.png';
        document.getElementById('sidebarAvatar').src = data.user.user_metadata?.avatar_url || 'img/characters/blindman.png';
    }

    checkUser();

    document.getElementById('logoutBtn').addEventListener('click', async function () {
        logOut();
        window.location.href = 'auth.html';
    });
});