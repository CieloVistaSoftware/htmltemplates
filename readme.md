I understand the issue you're facing with the "Insert into new file" functionality. Let me provide you with a complete, formatted README.md file that accurately reflects your current Node.js/Express architecture (no Python references) that you can manually copy into your project.

# HTML Editor

A visual HTML editor with drag-and-drop interface for creating web pages. This project features a JavaScript frontend with a Node.js/Express backend that handles template management and project storage.

## Features

- **Visual drag-and-drop HTML editing interface**
- **Component-based architecture** for HTML elements 
- **Express API endpoints** for data operations
- **HTML partial system** with nested component support
- **Project saving and loading** with automatic backups

## Element Manipulation

- **Move**: Click and drag elements around
- **Resize**: Corner handles for resizing
- **Select**: Click to select with visual indicators
- **Edit**: Double-click for inline content editing
- **Style**: CSS editor with live preview
- **Context Menu**: Right-click for element actions

## Advanced Features

- **Undo/Redo**: 50-level history system
- **Search**: Filter elements by type/category
- **Responsive Testing**: Mobile/tablet/desktop preview
- **Zoom**: Multiple zoom levels for detailed editing

## System Requirements

- **Node.js** 14.0.0 or higher
- **NPM** 7.0.0 or higher

## Installation

1. Clone the repository or download the ZIP file
2. Open a command prompt in the project folder
3. Install dependencies:

```
npm install
```

## Starting the Application

### Development Mode

```
npm run dev
```

This command uses concurrently to start both:
- Express backend server with nodemon for auto-restart
- Vite frontend development server

You can also start them individually:

```
npm run dev:server    # Starts the backend with nodemon
npm run dev:frontend  # Starts the Vite dev server
```

### Production Mode

```
npm start
```

This runs both the Express backend server and Vite frontend concurrently.

## Initialization Flow

When the application starts:

1. **Pre-start Scripts**:
   - The `create-directories.js` script ensures all required directories exist
   - Directory structure is validated before proceeding

2. **Backend Initialization**:
   - Express server starts on port 5000
   - Required directories are verified or created
   - Template cache is initialized
   - API endpoints are registered
   - Static file serving is configured

3. **Partials Handling**:
   The backend processes HTML partials using the following workflow:
   
   - Client requests a partial via `/api/partials/:filename` endpoint
   - Server checks the template cache for the requested partial
   - If not in cache, the server:
     1. Loads the partial file from the partials directory
     2. Processes any `<include>` tags found in the HTML
     3. Recursively loads and processes included partials (up to max depth)
     4. Caches the processed result
   - Processed content is sent back to the client
   - Error handling provides detailed feedback if partials can't be found

4. **Frontend Initialization**:
   - Vite serves the frontend application
   - Frontend connects to backend API endpoints
   - HTML editor interface loads with all components
   - Partial content is requested from backend when needed

## Project Structure

```
html-editor/
├── data/               # Data storage directories
│   ├── templates/      # JSON layout templates
│   ├── projects/       # Saved user projects
│   ├── assets/         # Uploaded assets
│   └── backups/        # Automatic backups
├── partials/           # HTML partial files
│   ├── header-section.html
│   ├── main-container.html
│   ├── html-items-panel.html
│   ├── canvas-area.html
│   └── footer-section.html
├── scripts/            # Setup scripts
│   └── create-directories.js
├── src/                # Frontend source code
│   ├── assets/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── main.js         # Frontend entry point
├── app.log             # Application logs
├── index.html          # Main HTML file
├── package.json        # NPM configuration
├── server.js           # Express backend server
└── vite.config.js      # Vite configuration
```

## API Endpoints

The Express backend provides the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/partials/:filename` | GET | Load an HTML partial with includes processed |
| `/partials/:filename` | GET | Legacy endpoint for getting raw HTML partial content |
| `/api/projects` | GET | List all available projects |
| `/api/projects` | POST | Save a project |
| `/api/projects/:name` | GET | Load a specific project |
| `/api/errors` | POST | Log client-side errors |
| `/api/status` | GET | Check connection status |

## HTML Partials

The editor uses a partial-based approach for HTML components. Partials can include other partials using custom include tags:

```html
<include src="another-partial.html"></include>
```

The Express backend processes these includes recursively when serving partials, allowing for component composition.

## Development Commands

```
npm run dev          # Start development servers (frontend + backend)
npm run dev:server   # Start only the backend server with nodemon
npm run dev:frontend # Start only the frontend Vite server
npm run build        # Build for production
npm run lint         # Lint JavaScript code
npm test             # Run unit tests
npm start            # Run production servers
```

## Troubleshooting

### Common Issues on Windows

**Port conflicts:**
To find and kill processes using specific ports:

```
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Node.js dependency issues:**
```
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

## License

MIT