// UI-related functionality

import { createStepIndicator, toggleCanvasMode } from './workflow.js';
import { applySelectedLayout } from './layout.js';

// Initialize UI components
function initUI() {
  // Apply the selected layout first
  applySelectedLayout();
  
  // Create step indicator
  createStepIndicator();
  
  // Set up collapsible sections
  setupCollapsibleSections();
  
  // Set up toolbar buttons
  setupToolbarButtons();
  
  // Set up canvas toolbar buttons
  setupCanvasToolbarButtons();
  
  console.log('UI initialized');
}

// Set up collapsible sections
function setupCollapsibleSections() {
  const collapsibleSections = document.querySelectorAll('.collapsible h4');
  collapsibleSections.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('collapsed');
      const icon = header.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = section.classList.contains('collapsed') ? '▶' : '▼';
      }
    });
  });
}

// Set up toolbar buttons
function setupToolbarButtons() {
  const toolbar = document.getElementById('toolbar');
  if (toolbar) {
    const buttons = toolbar.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Toolbar button clicked:', button.id);
        
        // Handle specific button actions
        if (button.id === 'change-layout-btn') {
          handleChangeLayout();
        }
        // Other button handlers can go here
      });
    });
  }
}

// Set up canvas toolbar buttons
function setupCanvasToolbarButtons() {
  const canvasToolbar = document.getElementById('canvas-toolbar');
  if (canvasToolbar) {
    const previewBtn = document.getElementById('preview-mode');
    const codeViewBtn = document.getElementById('code-view');
    const responsiveBtn = document.getElementById('responsive-test');
    
    if (previewBtn) {
      previewBtn.addEventListener('click', () => toggleCanvasMode('preview'));
    }
    
    if (codeViewBtn) {
      codeViewBtn.addEventListener('click', () => toggleCanvasMode('code'));
    }
    
    if (responsiveBtn) {
      responsiveBtn.addEventListener('click', () => toggleCanvasMode('responsive'));
    }
  }
}

// Setup preview and select button functionality
function setupPreviewSelectButtons() {
  const previewButton = document.getElementById('preview-button');
  const selectButton = document.getElementById('select-button');
  const editorCanvas = document.getElementById('editor-canvas');
  const previewPane = document.getElementById('preview-pane') || document.createElement('div');
  
  if (!previewButton || !selectButton || !editorCanvas) {
    console.warn('Preview/Select buttons or editor canvas not found');
    return;
  }
  
  // Ensure preview pane exists
  if (!document.getElementById('preview-pane')) {
    previewPane.id = 'preview-pane';
    previewPane.className = 'preview-pane';
    previewPane.style.display = 'none';
    editorCanvas.parentNode.insertBefore(previewPane, editorCanvas.nextSibling);
  }
  
  // Preview button click handler
  previewButton.addEventListener('click', () => {
    previewButton.classList.add('active');
    selectButton.classList.remove('active');
    
    // Generate HTML preview from canvas content
    const htmlContent = generatePreviewHTML();
    previewPane.innerHTML = htmlContent;
    
    // Show preview, hide editor
    editorCanvas.style.display = 'none';
    previewPane.style.display = 'block';
    
    console.log('Switched to Preview mode');
  });
  
  // Select button click handler
  selectButton.addEventListener('click', () => {
    selectButton.classList.add('active');
    previewButton.classList.remove('active');
    
    // Hide preview, show editor
    previewPane.style.display = 'none';
    editorCanvas.style.display = 'block';
    
    console.log('Switched to Edit mode');
  });
  
  console.log('Preview/Select buttons initialized');
}

// Generate HTML for preview from editor canvas content
function generatePreviewHTML() {
  const canvas = document.getElementById('editor-canvas');
  if (!canvas) return '';
  
  // Clone the canvas to avoid modifying the original
  const canvasClone = canvas.cloneNode(true);
  
  // Remove editor-specific elements and classes
  canvasClone.querySelectorAll('.grid-dot, .template-hint, .template-structure-label').forEach(el => el.remove());
  canvasClone.querySelectorAll('[data-editable], .editor-element').forEach(el => {
    el.removeAttribute('data-editable');
    el.removeAttribute('contenteditable');
    el.classList.remove('editor-element', 'selected', 'editing');
  });
  
  return canvasClone.innerHTML;
}

// Update the UI to show editing status
function updateEditingStatus(element) {
  const statusElement = document.getElementById('selected-element');
  if (statusElement) {
    if (element) {
      statusElement.textContent = `Editing: ${element.tagName.toLowerCase()} (Tab to save)`;
      statusElement.classList.add('editing-status');
      
      // Add a helper tooltip to the element being edited
      const tooltip = document.createElement('div');
      tooltip.className = 'edit-tooltip';
      tooltip.textContent = 'Press Tab to save';
      tooltip.style.position = 'absolute';
      tooltip.style.top = '-28px';
      tooltip.style.right = '0';
      tooltip.style.backgroundColor = 'var(--accent-secondary)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '3px 8px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '12px';
      tooltip.style.zIndex = '1000';
      
      // Remove any existing tooltips
      const existingTooltips = element.querySelectorAll('.edit-tooltip');
      existingTooltips.forEach(t => t.remove());
      
      element.appendChild(tooltip);
      
      // Auto-hide the tooltip after 3 seconds
      setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 300);
      }, 3000);
    } else {
      statusElement.textContent = 'Selected: None';
      statusElement.classList.remove('editing-status');
    }
  }
}

// Update the element count in the footer
function updateElementCount() {
  const elementCountSpan = document.getElementById('element-count');
  const elementCount = document.querySelectorAll('#editor-canvas .editor-element').length;
  
  if (elementCountSpan) {
    elementCountSpan.textContent = `Elements: ${elementCount}`;
  }
}

export {
  initUI,
  setupPreviewSelectButtons,
  updateEditingStatus,
  updateElementCount,
  generatePreviewHTML
};