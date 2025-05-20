const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const dirs = [
    'public/css',
    'public/js',
    'public/images',
    'public/svg'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Move files to their respective directories
const moveFiles = {
    '*.css': 'public/css',
    '*.js': 'public/js',
    '*.jpg': 'public/images',
    '*.jpeg': 'public/images',
    '*.png': 'public/images',
    '*.webp': 'public/images',
    '*.avif': 'public/images',
    '*.svg': 'public/svg'
};

// Function to move files
function moveFile(source, destination) {
    try {
        fs.renameSync(source, path.join(destination, path.basename(source)));
        console.log(`Moved ${source} to ${destination}`);
    } catch (error) {
        console.error(`Error moving ${source}:`, error.message);
    }
}

// Move files from root directory
fs.readdirSync('.').forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (moveFiles[`*${ext}`]) {
        moveFile(file, moveFiles[`*${ext}`]);
    }
});

// Move files from mood directory
if (fs.existsSync('mood')) {
    fs.readdirSync('mood').forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (moveFiles[`*${ext}`]) {
            moveFile(path.join('mood', file), moveFiles[`*${ext}`]);
        }
    });
}

console.log('File organization complete!'); 