# HTML Editor - Main Application Documentation

## Overview

`main.js` is the core entry point for the HTML Editor application. It manages layout selection, template loading, and editing functionality.

## Core Components

### 1. Initialization Flow

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Check layout selection
    // Initialize drag and drop
    // Set up UI components
    // Configure grid system
    // Set up preview buttons
});
```

### 2. Key Functions

#### Layout Management
- `loadSelectedLayout()`: Loads and applies selected template
- `hasLayoutSelected()`: Checks for existing layout selection
- `redirectToLayoutSelection()`: Redirects to layout picker if needed

#### UI Components
- `setupPreviewSelectButtons()`: Handles preview/edit mode switching
- `makeElementsEditable()`: Makes template elements editable
- `createGridDots()`: Creates alignment grid system

#### Utility Functions
- `debounce()`: Prevents rapid-fire execution of resize handlers

## Module Structure

```
src/
├── main.js              # Main entry point
├── modules/
│   ├── ui.js           # UI functionality
│   ├── drag-drop.js    # Drag and drop features
│   ├── layout.js       # Layout management
│   └── element-editor.js # Element editing features
```

## Event Flow

1. **Page Load**
   - Check for selected layout
   - Initialize UI components
   - Set up event listeners

2. **Layout Loading**
   - Fetch template HTML
   - Extract and apply styles
   - Make elements editable
   - Create grid system

3. **Edit Mode**
   - Enable contenteditable
   - Handle element selection
   - Apply visual feedback

4. **Preview Mode**
   - Disable editing
   - Show final layout view

## DOM Structure

```html
<div id="app" class="app-container">
    <header id="header">...</header>
    <main id="main">
        <div id="editor-canvas">
            <!-- Layout template injected here -->
        </div>
    </main>
    <footer id="footer">...</footer>
</div>
```

## Grid System

- Uses CSS Grid for layout structure
- Overlay dot grid for alignment
- Responsive to window resizing
- Configurable spacing via CSS variables

## Template Loading

1. Get selected layout from localStorage
2. Fetch template HTML file
3. Extract body content and styles
4. Inject into editor canvas
5. Apply layout-specific classes
6. Make elements editable

## Edit Mode Features

- Click to select elements
- Contenteditable enabled
- Visual feedback for selected elements
- Grid system for alignment
- Preview toggle

## Classes and Styling

- `.app-container`: Main application wrapper
- `.canvas`: Editor canvas container
- `.grid-dot`: Alignment grid points
- `.selected`: Currently selected element
- `[contenteditable]`: Editable elements

## Error Handling

```javascript
try {
    // Template processing
} catch (err) {
    console.error('Error processing template:', err);
    // Show error feedback to user
}
```

## Dependencies

- **Browser APIs**: DOM, localStorage, Fetch
- **Modules**: ui.js, drag-drop.js, layout.js
- **CSS**: main.css, editor.css

## Best Practices

1. **Performance**
   - Debounced resize handlers
   - Efficient DOM updates
   - Template caching

2. **Maintainability**
   - Modular structure
   - Clear naming conventions
   - Comprehensive error handling

3. **User Experience**
   - Visual feedback
   - Graceful error handling
   - Intuitive editing interface

## Debug Tools

```javascript
console.log('Editor canvas element found:', !!canvas);
console.log('Canvas dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
console.log('Loading template from:', templatePath);
```

## Common Issues & Solutions

1. **Missing Canvas**
   - Check DOM structure
   - Verify partial loading
   - Check element IDs

2. **Template Loading**
   - Verify file paths
   - Check server configuration
   - Monitor network requests

3. **Layout Issues**
   - Check CSS Grid setup
   - Verify template structure
   - Monitor responsive behavior
