// Get the canvas and its drawing context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Read the "text" parameter from the URL query string
const params = new URLSearchParams(window.location.search);
const dynamicText = params.get('text') || 'Hello, World!';
console.log('Dynamic text:', dynamicText);

// Create an Image object and set its source to your template image
const templateImg = new Image();
templateImg.src = 'TemplatePost.png'; // Ensure this file is in your project folder

// When the image loads, draw it on the canvas and then export as JPEG
templateImg.onload = function() {
  // Draw the image to fill the canvas
  ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

  // Set text properties
  ctx.font = '40px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Draw the dynamic text on the canvas
  ctx.fillText(dynamicText, 50, 100);
  canvas.toBlob(function(blob) {
    // Create a FormData object and append the blob with a filename
    const formData = new FormData();
    formData.append('file', blob, 'output.jpg');
  
    // Replace this with the webhook URL you copied from Make.com
    const webhookURL = 'https://hook.eu2.make.com/9rhggc7f2jfxux56u2k5w4b4e1x0ww0x';
  
    // Send a POST request to the webhook
    fetch(webhookURL, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('File successfully sent to Make.com:', data);
    })
    .catch(error => {
      console.error('Error sending file:', error);
    });
  }, 'image/jpeg');
  
};
