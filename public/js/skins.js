import { supabaseUrl, supabaseAnonKey, firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, update, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let playerId = null;

async function getUserId() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user ? user.id : null;
}

async function getSelectedSkins() {
    if (!playerId) {
        alert('User not authenticated. Please log in.');
        return;
    }
    try {
        const snapshot = await get(ref(db, `players/${playerId}`));
        if (!snapshot.exists()) {
            console.error("No player data found!");
            return;
        }
        const data = snapshot.val();
        return {
            phoneSkin: data.PhoneSkinFile || "phone_default.png",
            cameraSkin: data.CameraSkinFile || "camera_default.png",
        };
    } catch (err) {
        console.error("Error fetching selected skins:", err);
    }
}

function updateSkinSelectionUI(selectedSkins) {
    document.querySelectorAll("button[onclick^='handleSelectSkin']").forEach((button) => {
        const skinType = button.getAttribute("onclick").match(/'(\w+)'/)[1]; // Extract 'phone' or 'camera'
        const skinFile = button.getAttribute("onclick").match(/'([^']+)'/g)[1].replace(/'/g, ""); // Extract filename

        if (
            (skinType === "phone" && skinFile === selectedSkins.phoneSkin) ||
            (skinType === "camera" && skinFile === selectedSkins.cameraSkin)
        ) {
            button.textContent = "SELECTED";
            button.classList.add("bg-agreen", "cursor-default", "text-egg-yellow");
            button.classList.remove("bg-yellow-500");
        } else {
            button.textContent = "Select";
            button.classList.remove("bg-agreen", "cursor-default", "text-egg-yellow");
            button.classList.add("bg-yellow-500");
        }
    });
}

async function initializeShop() {
    playerId = await getUserId();

    if (!playerId) {
        alert('User not authenticated. Please log in.');
        return;
    }
    const selectedSkins = await getSelectedSkins();
    if (selectedSkins) updateSkinSelectionUI(selectedSkins);
}

window.handleSelectSkin = async function (skinType, skinFileName) {
    let updates = {};
    if (skinType === "phone") {
        updates[`players/${playerId}/PhoneSkinFile`] = skinFileName;
    } else if (skinType === "camera") {
        updates[`players/${playerId}/CameraSkinFile`] = skinFileName;
    } else {
        console.error("Unknown skin type:", skinType);
        return;
    }
    try {
        await update(ref(db), updates);
        console.log("Skin updated in Firebase:", updates);
        initializeShop(); // Refresh UI after selection
    } catch (err) {
        console.error("Error updating Firebase:", err);
    }
};

document.addEventListener("DOMContentLoaded", initializeShop);
