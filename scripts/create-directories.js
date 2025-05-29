const fs = require('fs-extra');
const path = require('path');

console.log('🚀 Setting up HTML Editor development environment...');

// Directory structure
const directories = [
  'data',
  'data/templates',
  'data/projects',
  'data/assets',
  'data/backups',
  'partials',
  'src/assets/css',
  'src/assets/js',
  'src/assets/images'
];

// Create directories
console.log('📁 Creating directory structure...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  fs.ensureDirSync(dirPath);
  console.log(`  ✓ ${dir}`);
});

// Create placeholder logo.svg file if it doesn't exist
const logoPath = path.join(__dirname, '..', 'src/assets/images/logo.svg');
if (!fs.existsSync(logoPath)) {
  const logoSvg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#2196F3" />
    <text x="50" y="60" font-family="Arial" font-size="24" fill="white" text-anchor="middle">HTML</text>
  </svg>`;
  fs.writeFileSync(logoPath, logoSvg);
  console.log('  ✓ Created placeholder logo.svg');
}

// Check if required partials exist
const requiredPartials = [
  'header-section.html',
  'main-container.html',
  'html-items-panel.html',
  'canvas-area.html',
  'footer-section.html'
];

console.log('📄 Checking required HTML partials...');
requiredPartials.forEach(partial => {
  const partialPath = path.join(__dirname, '..', 'partials', partial);
  if (fs.existsSync(partialPath)) {
    console.log(`  ✓ ${partial} exists`);
  } else {
    console.log(`  ⚠ ${partial} is missing - please create this file in the partials directory`);
  }
});

// Create Vite config if it doesn't exist
const viteConfigPath = path.join(__dirname, '..', 'vite.config.js');
if (!fs.existsSync(viteConfigPath)) {
  const viteConfig = `import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {    port: 3000,
    open: true,    proxy: {
      '/api': 'http://localhost:5001'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
`;
  fs.writeFileSync(viteConfigPath, viteConfig);
  console.log('  ✓ Created vite.config.js');
}

console.log('✅ Development environment setup complete! Ready to run.');