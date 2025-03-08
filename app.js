// ----- Animation Code -----
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Read the "text" parameter from the URL query string
const params = new URLSearchParams(window.location.search);
const dynamicText = params.get('text') || 'test';
console.log('Dynamic text:', dynamicText);

// Set font properties
ctx.font = '40px Arial';
ctx.fillStyle = 'white';
ctx.textAlign = 'left';
ctx.textBaseline = 'top';

// Animation variables
let x = 50;
const y = 100;
const speed = 2; // Pixels per frame

function animate() {
    // Clear the canvas for the next frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update the text position (move horizontally)
    x += speed;
    
    // Reset x position if the text has moved off the right edge
    const textWidth = ctx.measureText(dynamicText).width;
    if (x > canvas.width) {
        x = -textWidth;
    }
    
    // Draw the dynamic text
    ctx.fillText(dynamicText, x, y);
    
    // Request the next animation frame
    requestAnimationFrame(animate);
}

// Start the animation loop
animate();


// ----- Recording & Dropbox Upload Code -----
function recordAndUploadVideo() {
    // Capture the canvas stream at 30 fps
    const fps = 30;
    const stream = canvas.captureStream(fps);
    if (!stream) {
        console.error('Failed to capture canvas stream.');
        return;
    }
    
    // Set MediaRecorder options with an increased bitrate for better quality
    const options = { mimeType: 'video/webm', videoBitsPerSecond: 2500000 };
    let chunks = [];
    const recorder = new MediaRecorder(stream, options);

    recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    recorder.onerror = (err) => {
        console.error('Recorder error:', err);
    };

    recorder.onstop = () => {
        if (chunks.length === 0) {
            console.error('No data recorded.');
            return;
        }
        const blob = new Blob(chunks, { type: 'video/webm' });
        console.log('Recording finished, blob size:', blob.size);
        uploadToDropbox(blob);
    };

    recorder.start();
    console.log('Recording started');
    
    // Stop recording after 10 seconds (10000 ms)
    setTimeout(() => {
        recorder.stop();
        console.log('Recording stopped');
    }, 10000);
}

function uploadToDropbox(blob) {
    // Replace with your Dropbox access token
    const DROPBOX_ACCESS_TOKEN = 'sl.u.AFmVNDl-uojUp613q4zQ5PuWtveEag9U5Cfum-M6kkG-T755mKDNLKnthrUc09w1AsUHsfZ12_s35x2S-lDlOYP2YT-B30FpgXa32mrErlK_uKaPqQXwUkUM7rakrNWMPzeoNiArQvY_wB6JM8MPBBSukqu0Cl7TBcnttU_9yKDhOjZeuPUiGyy8f3aleyziSt1F-Ijug6NDJ0-gz8SsrSb0tLYF75BKQhf3KIaiUiWWCJPXe6Dgsm5O2JHDGpZ7sS-v7R4mCkSOzGBaZD1GXqC9ikafDEmoW8dQ2IaBNIn_nwnxU_oeeLxjI8PjPqR0oPfq--DQ8JSys9FTKFcq4b5ZbwtdyoUamvnAxmmoYhcgihxRuxbjoFwOK5XuY0-NdfJZYgJoA3OHaLCCV-Kgy1eXD6uFpIgkQ8TrH70nGvyWyUNVdSikkeKvOQG3bE7_te7tj-fxA3iQuYCWz0OpfnMwLXXZpVyEOybycGEXEPgqXhLsoxFHI7KZeAr5563NJXsbokFrFIfV5F2Q1CoIQSCEnmJFfJGF1YREfiY3jB3Xax7HQJo0sttwoYRmQHP_QEnyKT09c6ihn_OYwuyLsvUQdOFFToBjI8oMq6IS2_GfaDskoTIcYxVfCsMwqCFg9J9jAxZXkRXBic5gag_RGz3mf-1bMKCG4k7I54BgU11l4AvTMh9ORGJ1oGBxYTTfP14g6heWusHtzqA0_fAe_LUlDk8ifqnLVj74NU1FLC6lJFpc_-WSygYxEIRKdTjJyMyWiFDZpgUq2jp1OxHdZkG9IJgX9JCLiKRBMDjrfx2xca0vdZLGp1G82cQlWQFkdIFdqFaT_nMKqnI8ALE_0LJKYGOQv4dOmITqStkw3EM5aBVrv9nLznng4rm2CooIkPt9X80jvoEXj3w0MIsrcw-6TQXqX3VVLuH_0NEWPoX4p2ZVVy8DkNHLb-echVa5UnfOQBFePZgRjms8jUOAh0aOXsbFdGFGynAYf3UEa3XSv3yrbh8u3L6UEc4yiNyVcHsJfhC0KQ1cFcEzISBslzfpoo9n2nKk5OOFpEkfMrESPuiuOqjMG0wjhuvNe-Ozjj_ojeY-HGS64-kRX2QVdn360FI6rL9WqGrHDb_1Ht1eFbt26s7YoyRcUvUeTkinW5A1bax7ipzIXnQvRGHYij13QthitHoNvFQWDONM5p_8JuHXhmW36CYHKnyplz_mr956hurDkU-0C2K3GtEkkqY8YUjIdoTaWBbJa3bfVOhqf-6H0gRL-ANtFliTsTrJArzh-5uQAjqgzLrcfm6PgGfh4StlwkEjZZJktSxjZrduRg';
    if (!DROPBOX_ACCESS_TOKEN) {
        console.error('Dropbox access token is missing.');
        return;
    }
    
    // Read the blob as an ArrayBuffer (required for the Dropbox upload)
    blob.arrayBuffer().then(arrayBuffer => {
        fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + DROPBOX_ACCESS_TOKEN,
                'Dropbox-API-Arg': JSON.stringify({
                    path: '/video.webm', // Destination path in Dropbox
                    mode: 'overwrite',
                    autorename: true,
                    mute: false,
                    strict_conflict: false
                }),
                'Content-Type': 'application/octet-stream'
            },
            body: arrayBuffer
        })
        .then(response => response.json())
        .then(data => {
            console.log('Uploaded to Dropbox:', data);
        })
        .catch(error => {
            console.error('Dropbox upload error:', error);
        });
    });
}

// Option 1: Automatically start recording/upload after a delay (e.g., 5 seconds)
 setTimeout(recordAndUploadVideo, 5000);

// Option 2: Add a button to start recording/upload manually
const uploadButton = document.createElement('button');
uploadButton.innerText = 'Record & Upload Video';
uploadButton.style.position = 'absolute';
uploadButton.style.top = '20px';
uploadButton.style.right = '20px';
uploadButton.onclick = recordAndUploadVideo;
document.body.appendChild(uploadButton);
