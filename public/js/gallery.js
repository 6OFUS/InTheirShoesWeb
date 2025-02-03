import { supabaseUrl, supabaseAnonKey } from "./config.js";

// Create Supabase Client
const _supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

const photos = [];

const galleryContainer = document.getElementById('galleryContainer');

async function displayGallery() {
    const { data, error } = await _supabase
        .storage
        .from('webcamImages')
        .list('', {
            limit: 50,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
            })
        ; if (error) {
            console.error('Error listing files:', error.message);
        }
        data.forEach(item => {
            photos.push({
            timestamp: item.created_at,
            url: `${supabaseUrl}/storage/v1/object/public/webcamImages/${item.name}`
            });
    });

    photos.forEach(photo => {
        const div = document.createElement('button');
        div.className = 'bg-yellow-700 h-80 w-full rounded-lg overflow-hidden shadow-xl';
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.onclick = () => {
            window.open(photo.url, '_blank');
            // const { data, error } = _supabase
            //     .storage
            //     .from('webcamPhotos')
            //     .download(photo.url);
            // if (error) {
            //     console.error('Error downloading file:', error.message);
            // } else {
            //     const url = URL.createObjectURL(data);
            //     window.open(url, '_blank');
            // }
        }
        img.alt = 'Photo';
        img.className = 'w-full h-full object-cover';
        
        div.appendChild(img);
        galleryContainer.appendChild(div);
    });
}

displayGallery();