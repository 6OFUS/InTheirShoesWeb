import { supabaseUrl, supabaseAnonKey, firebaseConfig } from "./config.js";
import { updateAvatar } from "./auth.js";

import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Create Supabase Client
const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const allowedTypes = ['image/jpeg', 'image/png'];

async function getUserId() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user ? user.id : null;
}

export async function uploadFile(file, fileName) {
    const userId = await getUserId();
    if (!userId) {
        alert('User not authenticated. Please log in.');
        return;
    }

    const filePath = `${userId}/${fileName}`;

    await deleteExistingFile(userId);
    
    // Upload new file
    const { data, error } = await _supabase
        .storage
        .from('playerProfilePictures')
        .upload(filePath, file, { upsert: true });
    
    if (error) {
        console.error('Upload failed:', error.message);
        return;
    }

    const { data: publicUrlData } = _supabase.storage
        .from('playerProfilePictures')
        .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;
    console.log('Uploaded File URL:', publicUrl);

    // Store public URL in Firebase Realtime Database
    // const dbRef = ref(database, `images/${userId}`);
    // await set(dbRef, { url: publicUrl });

    alert('File uploaded successfully!');

    updateAvatar(publicUrl);
}

function getFirstFile(files) {
    return files[0];
}

async function deleteExistingFile(userId) {
    const folderPath = `${userId}/`;
    
    const { data, error } = await _supabase.storage.from('playerProfilePictures').list(folderPath);
    
    if (error) {
        console.error('Error listing files:', error);
        return false;
    }

    if (data.length === 0) {
        console.log('No file to delete.');
        return true;
    }

    const filePath = `${folderPath}${data[0].name}`;
    const { error: deleteError } = await _supabase.storage.from('playerProfilePictures').remove([filePath]);

    if (deleteError) {
        console.error('Error deleting file:', deleteError);
        return false;
    }

    console.log('File deleted successfully.');
    return true;
}

document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = getFirstFile(fileInput.files);

    if (file) {
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please upload an image file (JPEG, PNG).');
            return;
        }

        let fileName = `${Date.now()}-${file.name}`;
        fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special characters with underscores

        console.log(fileName);

        await uploadFile(file, fileName);
    } else {
        alert('Please select a file.');
    }
});
