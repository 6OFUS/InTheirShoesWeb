import { supabaseUrl, supabaseAnonKey } from "./config.js";

const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const photos = [];

const galleryContainer = document.getElementById('galleryContainer');

async function getUserId() {
    const { data: { user } } = await _supabase.auth.getUser();
    return user ? user.id : null;
}

async function displayGallery(userId) {
    if (!userId) {
        alert('User not authenticated. Please log in.');
        return;
    }
    
    const { data, error } = await _supabase
        .storage
        .from('playerGalleries')
        .list(`${userId}/`, {
            limit: 50,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

    if (error) {
        console.error('Error listing files:', error.message);
        return;
    }

    data.forEach(item => {
        photos.push({
            timestamp: item.created_at,
            url: `${supabaseUrl}/storage/v1/object/public/playerGalleries/${userId}/${item.name}`
        });
    });

    if (photos.length > 0) {
        galleryContainer.innerHTML = "";
    }

    photos.forEach(photo => {
        const button = document.createElement('button');
        button.className = 'bg-yellow-700 h-80 w-full rounded-lg overflow-hidden shadow-xl';
        button.onclick = () => openLightbox(photo.url);

        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = 'Photo';
        img.className = 'w-full h-full object-cover';

        button.appendChild(img);
        galleryContainer.appendChild(button);
    });
}

function openLightbox(imageUrl) {
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
    lightbox.onclick = () => document.body.removeChild(lightbox);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'max-w-full max-h-full rounded-lg';
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
}

displayGallery(await getUserId());