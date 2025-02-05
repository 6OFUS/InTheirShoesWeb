import { uploadFile } from "./upload.js";

let photoCaptured = false;

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const uploadButton = document.getElementById('camUploadButton');
const context = canvas.getContext('2d');

let imageData;
// settings
const dataType = 'image/png';
const dataBucket = 'webcamImages';

function updateCanvasDimensions() {
    const container = video.parentElement;
    const aspectRatio = video.videoWidth / video.videoHeight;
    
    // Set canvas width to container's width and adjust height to maintain aspect ratio
    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth / aspectRatio;
}

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream; // Display webcam feed

        // Wait for the video to load metadata to get the actual video dimensions
        video.onloadedmetadata = () => {
            updateCanvasDimensions();
        };

        // Update canvas dimensions on window resize
        window.addEventListener('resize', updateCanvasDimensions);
    } catch (error) {
        console.error('Error accessing webcam, check permissions:', error);
    }
}

function capturePhoto() {
    if (!photoCaptured) {
        photoCaptured = true;
        video.classList.add('hidden');
        captureButton.innerHTML = 'Retake';

        updateCanvasDimensions();
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        imageData = canvas.toDataURL('image/png'); // Store image as a base64 data
        canvas.classList.remove('hidden');
        uploadButton.classList.remove('hidden');
    } else {
        photoCaptured = false;
        video.classList.remove('hidden');
        captureButton.innerHTML = 'Take Picture';
        canvas.classList.add('hidden');
        uploadButton.classList.add('hidden');
    }
}

async function uploadToSupabase() {
    if (!imageData) {
        console.error("Capture an image first.");
        return;
    }
    
    // Convert base64 to Blob
    const blob = await fetch(imageData).then(res => res.blob());
    const fileName = `${Date.now()}.png`;
    uploadFile(blob, fileName);
}

function switchModal() {
    document.getElementById('camModal').classList.toggle('hidden');
    document.getElementById('uploadModal').classList.toggle('hidden');
}

window.addEventListener('load', startWebcam);

document.getElementById('cameraPageBtn').addEventListener('click', switchModal);
document.getElementById('uploadPageBtn').addEventListener('click', switchModal);
captureButton.addEventListener('click', capturePhoto);
uploadButton.addEventListener('click', uploadToSupabase);