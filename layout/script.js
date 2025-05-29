// Layout selection page script

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Layout selection script loaded');
  
  // Handle "Select This Layout" buttons
  const selectButtons = document.querySelectorAll('.layout-card .select-button, button:contains("Select This Layout")');
  console.log(`Found ${selectButtons.length} select buttons`);
  
  selectButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      // Stop the default action
      event.preventDefault();
      
      // Find the layout card or closest parent with layout info
      const card = this.closest('.layout-card');
      let layoutName;
      
      if (card && card.getAttribute('data-layout')) {
        // Get layout from data attribute
        layoutName = card.getAttribute('data-layout');
      } else {
        // Fallback to extract from heading
        const heading = card ? card.querySelector('h3') : null;
        if (heading) {
          layoutName = heading.textContent.toLowerCase().replace(/\s+layout$/, '').replace(/\s+/g, '-');
        }
      }
      
      if (!layoutName) {
        console.error('Could not determine layout name');
        return;
      }
      
      console.log('Selected layout:', layoutName);
      
      // Save to localStorage
      localStorage.setItem('htmlEditorLayout', layoutName);
      
      // Show feedback
      const feedback = document.createElement('div');
      feedback.className = 'selection-feedback';
      feedback.textContent = `Layout "${layoutName}" selected. Redirecting...`;
      feedback.style.position = 'fixed';
      feedback.style.bottom = '20px';
      feedback.style.left = '50%';
      feedback.style.transform = 'translateX(-50%)';
      feedback.style.backgroundColor = '#1e90ff';
      feedback.style.color = 'white';
      feedback.style.padding = '10px 20px';
      feedback.style.borderRadius = '4px';
      feedback.style.zIndex = '1000';
      document.body.appendChild(feedback);
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 800);
    });
  });
  
  // Handle "Preview" buttons
  const previewButtons = document.querySelectorAll('.layout-card .preview-button, button:contains("Preview")');
  console.log(`Found ${previewButtons.length} preview buttons`);
  
  previewButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      // Stop the default action
      event.preventDefault();
      
      // Find the layout card or closest parent with layout info
      const card = this.closest('.layout-card');
      let layoutName;
      
      if (card && card.getAttribute('data-layout')) {
        // Get layout from data attribute
        layoutName = card.getAttribute('data-layout');
      } else {
        // Fallback to extract from heading
        const heading = card ? card.querySelector('h3') : null;
        if (heading) {
          layoutName = heading.textContent.toLowerCase().replace(/\s+layout$/, '').replace(/\s+/g, '-');
        }
      }
      
      if (!layoutName) {
        console.error('Could not determine layout name');
        return;
      }
      
      console.log('Preview layout:', layoutName);
      
      // Open preview in new tab/window
      window.open(`templates/${layoutName}.html`, '_blank');
    });
  });
});

// Custom selector for buttons with specific text
document.querySelectorAll = function(selector) {
  const elements = document.querySelectorAll(selector);
  
  // Special case for text-containing buttons
  if (selector.includes(':contains(')) {
    const textMatch = selector.match(/:contains\("([^"]+)"\)/);
    if (textMatch) {
      const searchText = textMatch[1];
      const baseSelector = selector.replace(/:contains\("[^"]+"\)/, '');
      const baseElements = document.querySelectorAll(baseSelector);
      
      return Array.from(baseElements).filter(el => 
        el.textContent.includes(searchText)
      );
    }
  }
  
  return elements;
};