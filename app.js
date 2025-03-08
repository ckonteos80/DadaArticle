// Get the canvas and its drawing context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Read the "text" parameter from the URL query string
const params = new URLSearchParams(window.location.search);
const dynamicText = params.get('text') || 'test1';
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
