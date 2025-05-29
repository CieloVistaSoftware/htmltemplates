import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Checking required HTML partials...');

// Define required partial file names (no content)
const requiredPartials = [
  'header-section.html',
  'main-container.html',
  'html-items-panel.html',
  'canvas-area.html',
  'footer-section.html'
];

// Check if partials directory exists
const partialsDir = path.join(__dirname, '..', 'partials');
if (!fs.existsSync(partialsDir)) {
  throw new Error(`Partials directory not found: ${partialsDir}`);
}

// Check if each required partial exists
console.log('📄 Verifying required HTML partials...');
const missingPartials = [];

requiredPartials.forEach(partialName => {
  const partialPath = path.join(partialsDir, partialName);
  if (fs.existsSync(partialPath)) {
    console.log(`  ✅ ${partialName} exists`);
  } else {
    console.log(`  ❌ ${partialName} is MISSING`);
    missingPartials.push(partialName);
  }
});

// Throw error if any partials are missing
if (missingPartials.length > 0) {
  throw new Error(`Required HTML partials are missing: ${missingPartials.join(', ')}\nPlease create these files in the partials directory before starting the application.`);
}

console.log('✅ All required HTML partials are present and ready.');