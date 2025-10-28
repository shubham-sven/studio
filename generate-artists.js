const fs = require('fs');

// Load placeholder images to get available avatarIds
const images = JSON.parse(fs.readFileSync('./src/lib/placeholder-images.json', 'utf8')).placeholderImages;

// Function to generate random name
function generateRandomName() {
  const firstNames = ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Avery', 'Blake', 'Cameron', 'Dakota', 'Eden', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jade', 'Kai', 'Logan', 'Madison', 'Nolan', 'Oakley', 'Parker', 'Quinn', 'Reese', 'Sage', 'Tanner', 'Umber', 'Violet', 'Willow', 'Xander', 'Yara', 'Zane'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

// Function to generate random bio
function generateRandomBio() {
  const bios = [
    'An emerging artist exploring the boundaries of creativity and expression.',
    'Specializing in vibrant colors and dynamic compositions that capture the essence of life.',
    'A digital artist pushing the limits of technology and imagination.',
    'Creating surreal worlds that invite viewers to question reality.',
    'Focusing on portraiture that reveals the depth of human emotion.',
    'An abstract painter whose work reflects the chaos and beauty of modern existence.',
    'Blending traditional techniques with contemporary themes.',
    'Exploring the intersection of nature and technology in my art.',
    'Capturing fleeting moments of beauty in everyday life.',
    'Using art as a medium to tell stories of resilience and hope.',
    'A minimalist artist who believes in the power of simplicity.',
    'Creating immersive experiences through mixed media.',
    'Drawing inspiration from urban landscapes and city life.',
    'An experimental artist constantly evolving my style and techniques.',
    'Focusing on themes of identity and self-discovery.',
    'Using bold colors and shapes to convey powerful messages.',
    'A landscape artist capturing the majesty of nature.',
    'Exploring the human form through innovative perspectives.',
    'Creating art that challenges societal norms and expectations.',
    'An artist who believes in the transformative power of creativity.'
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

// Generate 5000 artists
const artists = [];
for (let i = 0; i < 5000; i++) {
  const id = `artist-${i + 11}`; // Start from 11 to avoid conflict with existing artists
  const name = generateRandomName();
  const bio = generateRandomBio();
  const avatarId = images[Math.floor(Math.random() * images.length)].id; // Random avatar from available images

  artists.push({
    id,
    name,
    bio,
    avatarId
  });
}

// Save to a JSON file
fs.writeFileSync('./generated-artists.json', JSON.stringify(artists, null, 2));

console.log('Generated 5000 artists and saved to generated-artists.json');
