/**
 * Makes an element editable on click
 * @param {HTMLElement} element - The element to make editable
 */
function makeElementEditable(element) {
  // Skip elements that shouldn't be editable
  if (element.classList.contains('non-editable') || 
      element.tagName === 'SCRIPT' || 
      element.tagName === 'STYLE') {
    return;
  }
  
  // Add editable class for styling
  element.classList.add('editor-element');
  element.dataset.editable = 'true';
  
  // Store original styles and content to restore later if needed
  element.dataset.originalContent = element.innerHTML;
  
  // Add click handler to make element editable
  element.addEventListener('click', function(e) {
    // Don't handle clicks on child elements that are already being edited
    if (e.target !== element && e.target.isContentEditable) {
      return;
    }
    
    // Prevent click from bubbling to parent elements
    e.stopPropagation();
    
    // Select the element
    selectElement(element);
    
    // Make content editable
    element.contentEditable = true;
    element.classList.add('editing');
    
    // Place cursor at the end of the content
    placeCaretAtEnd(element);
    
    // Dispatch event so other components can respond
    const editEvent = new CustomEvent('element:edit:start', { 
      detail: { element: element } 
    });
    document.dispatchEvent(editEvent);
  });
  
  // Add keyboard handlers
  element.addEventListener('keydown', function(e) {
    // Tab key: finish editing and move to the next editable element
    if (e.key === 'Tab') {
      e.preventDefault();
      finishEditing(element);
      
      // Find and focus the next editable element
      const editables = Array.from(document.querySelectorAll('[data-editable="true"]'));
      const currentIndex = editables.indexOf(element);
      const nextElement = editables[(currentIndex + 1) % editables.length];
      
      if (nextElement) {
        selectElement(nextElement);
        nextElement.contentEditable = true;
        nextElement.classList.add('editing');
        placeCaretAtEnd(nextElement);
      }
    }
    
    // Enter key: in most cases, we want to add a line break, not submit
    if (e.key === 'Enter' && !e.shiftKey) {
      // Allow normal behavior for multi-line elements
      if (element.tagName === 'DIV' || element.tagName === 'P' || 
          element.tagName === 'TEXTAREA') {
        return;
      }
      
      // For other elements, prevent default and finish editing
      e.preventDefault();
      finishEditing(element);
    }
    
    // Escape key: cancel editing and restore original content
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing(element);
    }
  });
  
  // Add blur handler to finish editing when clicking elsewhere
  element.addEventListener('blur', function(e) {
    // Don't finish if focus moved to a child element
    if (element.contains(document.activeElement)) {
      return;
    }
    
    // Only finish if we're not clicking on another editable element
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !relatedTarget.hasAttribute('data-editable')) {
      finishEditing(element);
    }
  });
  
  // Add child elements recursively
  Array.from(element.children).forEach(child => {
    makeElementEditable(child);
  });
}

/**
 * Makes all elements within a container editable
 * @param {HTMLElement} container - Container with elements to make editable
 */
function makeElementsEditable(container) {
  if (!container) return;
  
  // Direct children only - we'll handle recursion in makeElementEditable
  Array.from(container.children).forEach(element => {
    makeElementEditable(element);
  });
}

/**
 * Selects an element for editing
 * @param {HTMLElement} element - The element to select
 */
function selectElement(element) {
  // Deselect any currently selected elements
  document.querySelectorAll('.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Select this element
  element.classList.add('selected');
  
  // Dispatch event so other components can respond
  const selectEvent = new CustomEvent('element:selected', { 
    detail: { element: element } 
  });
  document.dispatchEvent(selectEvent);
}

/**
 * Finish editing an element and save changes
 * @param {HTMLElement} element - The element being edited
 */
function finishEditing(element) {
  // Only process if element is actually being edited
  if (!element.isContentEditable) return;
  
  // Make element non-editable
  element.contentEditable = false;
  element.classList.remove('editing');
  
  // Store the updated content
  element.dataset.originalContent = element.innerHTML;
  
  // Dispatch event so other components can respond
  const editEvent = new CustomEvent('element:edit:finish', { 
    detail: { element: element } 
  });
  document.dispatchEvent(editEvent);
}

/**
 * Cancel editing and restore original content
 * @param {HTMLElement} element - The element being edited
 */
function cancelEditing(element) {
  // Only process if element is actually being edited
  if (!element.isContentEditable) return;
  
  // Restore original content
  if (element.dataset.originalContent) {
    element.innerHTML = element.dataset.originalContent;
  }
  
  // Make element non-editable
  element.contentEditable = false;
  element.classList.remove('editing');
  
  // Dispatch event so other components can respond
  const editEvent = new CustomEvent('element:edit:cancel', { 
    detail: { element: element } 
  });
  document.dispatchEvent(editEvent);
}

/**
 * Places the caret at the end of the element's content
 * @param {HTMLElement} element - The element to place caret in
 */
function placeCaretAtEnd(element) {
  element.focus();
  
  if (typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined") {
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false); // false = collapse to end
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

export {
  makeElementEditable,
  makeElementsEditable,
  selectElement,
  finishEditing,
  cancelEditing
};