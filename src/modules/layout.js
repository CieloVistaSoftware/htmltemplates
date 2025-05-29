// Layout management functionality

import { makeElementsEditable } from './elements.js';
import { createGridDots } from '../main.js';
import { createStepIndicator } from './workflow.js';

// Format layout name for display
function formatLayoutName(name) {
  return name.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Check if a layout has been selected
function hasLayoutSelected() {
  // First clear the selection if there's a specific query parameter to do so
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('clearLayout') && urlParams.get('clearLayout') === 'true') {
    localStorage.removeItem('htmlEditorLayout');
    console.log('Layout selection cleared.');
    return false;
  }
  
  // Check URL parameters next
  if (urlParams.has('layout')) {
    const layoutName = urlParams.get('layout');
    console.log(`Layout selected from URL parameter: ${layoutName}`);
    localStorage.setItem('htmlEditorLayout', layoutName);
    return true;
  }
  
  // Finally check localStorage
  const savedLayout = localStorage.getItem('htmlEditorLayout');
  const hasLayout = savedLayout !== null;
  if (hasLayout) {
    console.log(`Using previously selected layout: ${savedLayout}`);
  } else {
    console.log('No layout found in localStorage');
  }
  return hasLayout;
}

// Redirect to layout selection page
function redirectToLayoutSelection() {
  console.log('No layout selected, redirecting to layout selection page...');
  
  // Force the redirect to the layout selection page
  try {
    // Use replace to prevent going back with browser history
    window.location.replace('layout/index.html');
  } catch (e) {
    console.error('Error redirecting to layout selection:', e);
    // Fallback if replace fails
    window.location.href = 'layout/index.html';
  }
}

// Function to handle changing layouts from the Change Layout button
function handleChangeLayout() {
  console.log('Changing layout...');
  
  // Show confirmation dialog
  if (confirm('Changing the layout will reset your current design. Are you sure you want to continue?')) {
    // Clear the current layout selection
    localStorage.removeItem('htmlEditorLayout');
    
    // Redirect to layout selection page
    redirectToLayoutSelection();
  }
}

export {
  hasLayoutSelected,
  redirectToLayoutSelection,
  handleChangeLayout,
  formatLayoutName
};