const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to create a placeholder image
function createPlaceholderImage(filename, text, width = 800, height = 400) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Add border
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = '#6c757d';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    // Save the image
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(imagesDir, filename), buffer);
    console.log(`Created ${filename}`);
}

// Create all placeholder images
const images = [
    { filename: 'college.jpg', text: 'College Campus' },
    { filename: 'laundry.jpg', text: 'Laundry Service' },
    { filename: 'canteen.jpg', text: 'Canteen' },
    { filename: 'clubs.jpg', text: 'College Clubs' },
    { filename: 'permissions.jpg', text: 'Permissions' },
    { filename: 'alumni.jpg', text: 'Alumni Network' },
    { filename: 'feedback.jpg', text: 'Feedback' }
];

images.forEach(img => createPlaceholderImage(img.filename, img.text)); 