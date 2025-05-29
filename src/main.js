// HTML Editor - Main JavaScript Entry Point

// When DOM is loaded, check if we have a selected layout and open it
document.addEventListener('DOMContentLoaded', () => {
  const layoutName = localStorage.getItem('htmlEditorLayout');
  
  if (layoutName) {
    // Open the layout file directly
    window.location.href = `layout/${layoutName}-layout.html`;
    
    // Make elements editable once loaded
    window.addEventListener('load', () => {
      document.querySelectorAll('*:not(script):not(style)').forEach(element => {
        element.setAttribute('contenteditable', 'true');
      });
    });
  } else {
    // If no layout selected, go to layout selection page
    window.location.href = 'layout/index.html';
  }
});