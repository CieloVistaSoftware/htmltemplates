# Understanding Fetch in HTML Editor

## Overview

The HTML Editor application uses the browser's native `fetch` API to load templates and communicate with the Express server. Here's how it works:

## Server Setup

The Express server (`server.js`) is configured to serve static files:

```javascript
app.use(express.static('.'));
```

This means any files in the project directory structure are automatically served when requested via their path relative to the root.

## Fetch Flow for Layout Templates

1. **Initial Request**:
   - User selects a layout in `layout/index.html`
   - The selection is saved in localStorage
   - Browser redirects to main editor page

2. **Template Loading**:
   - `main.js` reads the selected layout from localStorage
   - Constructs path: `/layout/${layoutName}-layout.html`
   - Makes a fetch request to this path

3. **Server Response**:
   - Express's static middleware receives the request
   - Looks for the file in the project directory
   - Serves the HTML file directly from the `layout` folder

4. **Processing Response**:
   - Browser receives the HTML content
   - JavaScript extracts:
     - Body content for the layout
     - Style definitions
   - Content is injected into the editor canvas
   - Styles are added to the document head

## File Locations

- Layout templates: `/layout/*.html`
- Main script: `/src/main.js`
- Server: `/server.js`

## Example Flow

```javascript
// 1. User clicks "Select" on nav-left layout
localStorage.setItem('htmlEditorLayout', 'nav-left');

// 2. main.js constructs path
const templatePath = `/layout/nav-left-layout.html`;

// 3. Fetch request is made
fetch(templatePath)
  .then(response => response.text())
  .then(html => {
    // 4. Process and inject the template
  });
```

## Debugging Tips

1. Check Network Tab:
   - Look for the fetch request
   - Verify the path is correct
   - Check response status (should be 200)

2. Common Issues:
   - 404: Template file not found at expected path
   - CORS: Not an issue due to same-origin serving
   - Parse errors: Invalid HTML in template

3. Server Logs:
   - Check `app.log` for server-side errors
   - Express logs static file requests

## Important Notes

- All fetches are handled by Express's static middleware
- Paths must be relative to project root
- Server runs on default port 5000
- Templates must contain valid HTML with `<body>` tag
