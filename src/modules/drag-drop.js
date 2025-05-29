// Drag and drop functionality

import { createHtmlElement } from './elements.js';
import { selectElement } from './element-editor.js';
import { updateElementCount } from './ui.js';
import { createGridDots } from '../main.js';

// Initialize drag and drop functionality
function initDragAndDrop() {
  // Find all draggable elements
  const draggableItems = document.querySelectorAll('[draggable="true"]');
  // Get the canvas drop zone
  const canvas = document.getElementById('editor-canvas');
  
  if (!canvas || draggableItems.length === 0) {
    console.error('Required elements not found: canvas or draggable items');
    return;
  }
  
  // Set up drag event listeners for draggable items
  draggableItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
  
  // Set up drop zone event listeners
  canvas.addEventListener('dragover', handleDragOver);
  canvas.addEventListener('dragenter', handleDragEnter);
  canvas.addEventListener('dragleave', handleDragLeave);
  canvas.addEventListener('drop', handleDrop);
  
  // Create grid dots on the canvas
  createGridDots(canvas);
  
  console.log('Drag and drop initialized with', draggableItems.length, 'draggable items');
}

// Highlight dots near the dragged element
function highlightNearbyDot(x, y) {
  const canvas = document.getElementById('editor-canvas');
  const dots = canvas.querySelectorAll('.grid-dot');
  const proximityThreshold = 24; // 1.5rem = 24px with base 16px font
  
  // First, clear all highlights
  dots.forEach(dot => dot.classList.remove('highlight'));
  
  // Find the closest dot
  let closestDot = null;
  let minDistance = Number.MAX_VALUE;
  
  dots.forEach(dot => {
    const dotX = parseInt(dot.dataset.x);
    const dotY = parseInt(dot.dataset.y);
    
    // Calculate distance
    const distance = Math.sqrt(Math.pow(x - dotX, 2) + Math.pow(y - dotY, 2));
    
    if (distance < minDistance) {
      minDistance = distance;
      closestDot = dot;
    }
  });
  
  // Highlight the closest dot if it's within threshold
  if (closestDot && minDistance < proximityThreshold) {
    closestDot.classList.add('highlight');
    return {
      x: parseInt(closestDot.dataset.x),
      y: parseInt(closestDot.dataset.y),
      isClose: true
    };
  }
  
  return { isClose: false };
}

// Handle the start of a drag operation
function handleDragStart(e) {
  // Store the element type being dragged in the dataTransfer
  const elementType = this.getAttribute('data-element-type');
  const category = this.getAttribute('data-category');
  
  e.dataTransfer.setData('text/plain', JSON.stringify({
    type: elementType,
    category: category,
    text: this.textContent.trim()
  }));
  
  // Set a visual indicator for drag operation
  e.dataTransfer.effectAllowed = 'copy';
  this.classList.add('dragging');
  
  // If we have a welcome message in the canvas, hide it when dragging starts
  const welcomeMessage = document.getElementById('canvas-welcome');
  if (welcomeMessage) {
    welcomeMessage.classList.add('hidden');
  }
  
  console.log('Drag started:', elementType);
}

// Handle the end of a drag operation
function handleDragEnd(e) {
  // Remove the dragging class
  this.classList.remove('dragging');
  
  // If canvas is empty, show welcome message again
  const canvas = document.getElementById('editor-canvas');
  const welcomeMessage = document.getElementById('canvas-welcome');
  
  if (canvas && welcomeMessage && canvas.children.length <= 1) {
    welcomeMessage.classList.remove('hidden');
  }
}

// Handle dragover event on the canvas
function handleDragOver(e) {
  // Prevent default to allow drop
  e.preventDefault();
  // Set the drop effect to copy
  e.dataTransfer.dropEffect = 'copy';
  
  // Get position relative to the canvas
  const canvasRect = this.getBoundingClientRect();
  const x = e.clientX - canvasRect.left;
  const y = e.clientY - canvasRect.top;
  
  // Highlight nearby dot
  highlightNearbyDot(x, y);
}

// Handle dragenter event on the canvas
function handleDragEnter(e) {
  e.preventDefault();
  this.classList.add('drag-over');
}

// Handle dragleave event on the canvas
function handleDragLeave(e) {
  this.classList.remove('drag-over');
  
  // Remove all dot highlights
  const dots = this.querySelectorAll('.grid-dot');
  dots.forEach(dot => dot.classList.remove('highlight'));
}

// Handle drop event on the canvas
function handleDrop(e) {
  e.preventDefault();
  
  // Remove the drag-over class
  this.classList.remove('drag-over');
  
  // Get the data from dataTransfer
  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    // Create a new element based on the dropped type
    const newElement = createHtmlElement(data.type, data.category, data.text);
    
    // Position the element at the drop coordinates
    const canvasRect = this.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    // Check if we're near a grid dot
    const nearbyDot = highlightNearbyDot(x, y);
    
    // Set position based on the closest dot if we're near one
    let posX = x;
    let posY = y;
    
    if (nearbyDot.isClose) {
      posX = nearbyDot.x;
      posY = nearbyDot.y;
      console.log(`Snapped to grid dot at ${posX}, ${posY}`);
    }
    
    newElement.style.position = 'absolute';
    newElement.style.left = `${posX}px`;
    newElement.style.top = `${posY}px`;
    
    // Add the element to the canvas
    this.appendChild(newElement);
    
    // Show a brief success message
    displaySuccessIndicator(this, posX, posY, data.type);
    
    // Update element count in the footer
    updateElementCount();
    
    // Hide welcome message if it's still visible
    const welcomeMessage = document.getElementById('canvas-welcome');
    if (welcomeMessage) {
      welcomeMessage.classList.add('hidden');
    }
    
    // Select the newly created element
    selectElement(newElement);
    
    console.log('Element dropped:', data.type, 'at position:', posX, posY);
    
    // Remove all dot highlights
    const dots = this.querySelectorAll('.grid-dot');
    dots.forEach(dot => dot.classList.remove('highlight'));
  } catch (error) {
    console.error('Error handling drop:', error);
  }
}

// Display success indicator after dropping an element
function displaySuccessIndicator(container, x, y, elementType) {
  const successIndicator = document.createElement('div');
  successIndicator.className = 'drop-success';
  successIndicator.textContent = `${elementType} added`;
  successIndicator.style.position = 'absolute';
  successIndicator.style.left = `${x + 5}px`;
  successIndicator.style.top = `${y - 25}px`;
  successIndicator.style.backgroundColor = 'var(--success-color)';
  successIndicator.style.color = 'white';
  successIndicator.style.padding = '3px 8px';
  successIndicator.style.borderRadius = '4px';
  successIndicator.style.fontSize = '12px';
  successIndicator.style.opacity = '0';
  successIndicator.style.transition = 'opacity 0.3s ease';
  container.appendChild(successIndicator);
  
  // Animate indicator
  setTimeout(() => {
    successIndicator.style.opacity = '1';
    setTimeout(() => {
      successIndicator.style.opacity = '0';
      setTimeout(() => successIndicator.remove(), 300);
    }, 1000);
  }, 0);
}

export {
  initDragAndDrop,
  highlightNearbyDot
};