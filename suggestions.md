---
applyTo: '**'
---
# 1. Suggestions
1. Always read the file first before applying the suggestions.
2. Always provide the full path to the file for apply-to-editor to know which file to apply the change.
3. Before any suggestion, acknowledge that suggestions have been read and understood.

# 2. System Architecture
## 2.1. Overview
1. We are creating a 2 layer app:

- Frontend: Visual HTML editor
- Backend: Python server for template management

## 2.2. Frontend Editor
1. Purpose: Allow users to create and edit HTML web pages visually
2. Web component-based architecture
3. User-friendly drag-and-drop interface
4. Change history management for undo/redo operations
5. **State Management Enhancement**:

- Centralized state store with Redux-like pattern
- Component state isolation with global state synchronization
- Event-driven state changes with observer pattern
- Session storage for temporary data persistence

6. **Component Lifecycle Management**:

- Clear mounting/unmounting patterns with cleanup handlers
- Component registration system with dependency tracking
- Lazy loading for performance optimization
- Memory leak prevention with proper event listener cleanup

7. **Performance Optimization**:

- Virtual DOM implementation for efficient updates
- Component diff algorithms to minimize re-renders
- Batch updates for multiple simultaneous changes
- Template caching with intelligent invalidation

## 2.3. Python Backend
1. Responsibilities:

- Serve HTML content requested by the editor
- Generate HTML templates based on user selections
- Store and manage template data in JSON files
- Process editor requests to modify templates

2. Configuration:

- **Uses JSON layout files** as the source of truth for all template layouts
- Layout JSON provides complete information about component structure and relationships
- Template generation is driven entirely by the JSON configuration
- File-based storage in organized directory structure

3. Communication:

- WebSocket for real-time template generation
- RESTful API endpoints for CRUD operations

4. Technologies:

- Flask/FastAPI framework
- Jinja2 template engine
- File-based JSON storage with organized directory structure

5. **Development Setup**:

- NPM development server for frontend
- Python development server for backend
- Hot reloading for both frontend and backend changes
- Local file watching for JSON template changes

6. **File Storage Structure**:

- `/templates/` - JSON layout files
- `/projects/` - User project files
- `/assets/` - Static assets and media
- `/backups/` - Automatic backup copies

7. **Caching Strategy**:

- In-memory caching for frequently accessed templates
- File system caching for compiled templates
- Browser caching for static assets

8. **Security Framework**:

- Input validation with JSON schema enforcement
- HTML sanitization to prevent XSS attacks
- Rate limiting for API endpoints
- File system access controls

# 3. Frontend UI Components
## 3.1. Layout Structure
1. Three main sections:

- Header: Title and toolbar (save/undo/redo)
- Main: HtmlItems and canvas
  - HtmlItems: Draggable HTML elements with two sections:
    - Layout: Container components like rows, columns, and grids
    - HTML Tags: Individual HTML elements like headers, paragraphs, images
  - Canvas: Main editing area with full element manipulation
- Footer: Copyright and status messages

## 3.2. Enhanced Layout Configuration
```json
{
  "layoutName": "HTML Editor - Development Version",
  "version": "1.0.0",
  "environment": "development",
  "storage": "json-files",
  "grid": {
    "areas": [
      "header header header",
      "html-items canvas canvas",
      "footer footer footer"
    ],
    "rows": "10% 80% 10%",
    "columns": "25% 1fr 1fr"
  },
  "stateManagement": {
    "store": {
      "type": "immutable",
      "persistence": "sessionStorage",
      "syncInterval": 1000
    },
    "components": {
      "lazyLoad": true,
      "diffStrategy": "virtual-dom",
      "batchUpdates": true
    }
  },
  "backend": {
    "development": {
      "server": "flask-dev",
      "hotReload": true,
      "fileWatching": true,
      "autoBackup": true
    },
    "storage": {
      "type": "json-files",
      "structure": {
        "templates": "./data/templates/",
        "projects": "./data/projects/",
        "assets": "./data/assets/",
        "backups": "./data/backups/"
      }
    },
    "caching": {
      "memory": true,
      "fileSystem": true,
      "ttl": {
        "templates": 3600,
        "static": 86400
      }
    },
    "security": {
      "inputValidation": "jsonschema",
      "htmlSanitization": "bleach",
      "rateLimiting": "100/hour",
      "fileAccess": "restricted"
    }
  },
  "structure": [
    {
      "id": "header-section",
      "component": "header",
      "parent": "body",
      "area": "header",
      "contentPath": "partials/header-section.html",
      "lifecycle": {
        "onMount": "initializeToolbar",
        "onUnmount": "cleanupToolbar"
      },
      "errorBoundary": true
    },
    {
      "id": "main-container",
      "component": "main",
      "parent": "body",
      "contentPath": "partials/main-container.html",
      "children": ["html-items-panel", "canvas-area"],
      "stateSync": {
        "enabled": true,
        "dependencies": ["html-items-panel", "canvas-area"]
      }
    },
    {
      "id": "html-items-panel",
      "component": "html-items",
      "parent": "main-container",
      "area": "html-items",
      "contentPath": "partials/html-items-panel.html",
      "features": {
        "search": {
          "enabled": true,
          "categories": ["layout", "content", "media", "interactive"]
        },
        "collapsible": true
      },
      "dragDrop": {
        "enabled": true,
        "preview": true,
        "snapToGrid": true
      }
    },
    {
      "id": "canvas-area",
      "component": "canvas",
      "parent": "main-container",
      "area": "canvas",
      "contentPath": "partials/canvas-area.html",
      "features": {
        "modes": ["edit", "preview", "code"],
        "responsive": {
          "breakpoints": ["mobile", "tablet", "desktop"],
          "testing": true
        },
        "zoom": {
          "min": 25,
          "max": 200,
          "step": 25
        },
        "propertyPanel": true,
        "grid": {
          "enabled": true,
          "size": 10,
          "snap": true
        },
        "elementManipulation": {
          "draggable": true,
          "resizable": true,
          "selectable": true,
          "editable": true,
          "deletable": true
        },
        "cssEditor": {
          "enabled": true,
          "livePreview": true,
          "validation": true,
          "presetStyles": ["margin", "padding", "color", "background", "border", "font"]
        }
      },
      "dropZone": {
        "enabled": true,
        "highlightOnDragOver": true,
        "validationRules": "validateDropTarget"
      },
      "elementInteraction": {
        "onClick": "selectElement",
        "onDoubleClick": "editElement",
        "onRightClick": "showContextMenu",
        "onDrag": "moveElement",
        "contextMenu": {
          "items": ["edit", "duplicate", "delete", "moveUp", "moveDown", "cssEditor"]
        }
      }
    },
    {
      "id": "footer-section",
      "component": "footer",
      "parent": "body",
      "area": "footer",
      "contentPath": "partials/footer-section.html",
      "errorHandling": {
        "maxErrors": 50,
        "maxHeight": "20rem",
        "autoHide": true,
        "autoHideDelay": 5000,
        "grouping": {
          "enabled": true,
          "timeWindow": 60000,
          "maxGroupSize": 10
        },
        "severityColors": {
          "INFO": "#2196F3",
          "WARNING": "#FF9800",
          "ERROR": "#F44336",
          "CRITICAL": "#9C27B0"
        },
        "userFriendlyMessages": {
          "enabled": true,
          "fallbackToTechnical": true
        },
        "retryButton": {
          "enabled": true,
          "showForSeverity": ["ERROR", "WARNING"]
        },
        "export": {
          "formats": ["json", "txt"],
          "includeContext": true
        },
        "rateLimiting": {
          "maxPerMinute": 10,
          "duplicateSupression": true,
          "suppressionWindow": 30000,
          "escalationThreshold": 5
        },
        "recovery": {
          "autoRetry": true,
          "maxRetries": 3,
          "backoffMs": [1000, 2000, 5000],
          "circuitBreaker": {
            "failureThreshold": 5,
            "resetTimeout": 60000
          }
        }
      },
      "statusTracking": {
        "elementCount": true,
        "lastSaved": true,
        "connectionStatus": true,
        "selectedElement": true,
        "currentFile": true
      }
    }
  ],
  "globalFeatures": {
    "projectManagement": {
      "newProject": true,
      "saveProject": true,
      "loadProject": true,
      "exportHtml": true,
      "autoSave": false
    },
    "undo": {
      "maxHistory": 50,
      "saveInterval": 1000
    },
    "themes": {
      "default": "light",
      "available": ["light", "dark"]
    },
    "accessibility": {
      "keyboardNavigation": true,
      "screenReader": true
    },
    "performance": {
      "lazyLoading": true,
      "debounceMs": 300
    },
    "elementManipulation": {
      "selectOnDrop": true,
      "showHandles": true,
      "multiSelect": true,
      "copyPaste": true,
      "undoRedo": true
    },
    "cssEditor": {
      "inlineEditing": true,
      "cssPanel": true,
      "presetStyles": true,
      "cssValidation": true
    }
  },
  "validation": {
    "schema": "json-schema-v7",
    "strictMode": false,
    "warnings": true
  }
}
```

# 4. Enhanced Error Handling System
## 4.1. Overview
1. Comprehensive try-catch structure throughout the application
2. WebSocket-based error notification system
3. Centralized error tracking and display
4. Responsive footer with error history
5. **Rate limiting and intelligent error management**
6. **Context preservation and recovery mechanisms**

## 4.2. Frontend Error Handling Enhancement
1. Component-level error boundaries:

- Each component wraps critical operations in try-catch
- Errors are captured and formatted with component context
- Error details include timestamp, component ID, and operation
- **Breadcrumb trail for debugging context**

2. **Rate Limiting and Deduplication**:

- Prevent error spam with configurable rate limits
- Duplicate error suppression within time windows
- Error severity escalation for repeated issues
- Circuit breaker pattern for failing operations

3. **Recovery Mechanisms**:

- Automatic retry with exponential backoff
- Component-level recovery strategies
- Graceful degradation for non-critical failures
- User-initiated retry options

4. Error transmission enhancement:

- All errors sent via WebSocket to central error handler
- Format: `{timestamp, source, severity, message, details, breadcrumb, retryable}`
- Severity levels: INFO, WARNING, ERROR, CRITICAL
- **Context preservation with operation stack traces**

## 4.3. Backend Error Handling Enhancement
1. Global exception handling:

- Flask/FastAPI exception handlers for all routes
- Custom exception types for specific error scenarios
- Detailed logging with context preservation
- **Structured logging with correlation IDs**

2. **File System Error Handling**:

- JSON file validation before processing
- Backup creation before modifying files
- Recovery from corrupted files using backups
- Directory structure validation and auto-creation

3. WebSocket error broadcasting enhancement:

- Errors captured and sent via active WebSocket connections
- Connection errors trigger reconnection attempts with backoff
- Failed operations store errors for delivery when connection restored
- **Error acknowledgment system for delivery confirmation**

4. Development-specific error handling:

- Hot reload error recovery
- File watching error management
- NPM process error handling
- Development server restart mechanisms

# 5. Technical Implementation Interfaces
## 5.1. Component State Interface
```typescript
interface ComponentState {
  id: string;
  data: any;
  version: number;
  lastModified: number;
  dependencies: string[];
  errorBoundary?: boolean;
  lifecycle?: {
    onMount?: string;
    onUnmount?: string;
    onUpdate?: string;
  };
}
```

## 5.2. Error Context Structure
```typescript
interface ErrorContext {
  timestamp: number;
  source: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  details: any;
  breadcrumb: string[];
  retryable: boolean;
  correlationId: string;
  userAction?: string;
  componentState?: ComponentState;
}
```

## 5.3. Element Manipulation Interface
```typescript
interface ElementManipulation {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  styles: CSSStyleDeclaration;
  editable: boolean;
  selected: boolean;
  moveable: boolean;
  resizable: boolean;
  deletable: boolean;
}
```

## 5.4. Project Structure
```typescript
interface ProjectStructure {
  name: string;
  version: string;
  layout: LayoutConfiguration;
  elements: ElementManipulation[];
  styles: CSSRules;
  assets: AssetReference[];
  metadata: {
    created: Date;
    modified: Date;
    author: string;
  };
}
```

## 5.5. File System Configuration
```typescript
interface FileSystemConfig {
  templatesDir: string;
  projectsDir: string;
  assetsDir: string;
  backupsDir: string;
  autoBackup: boolean;
  maxBackups: number;
  fileWatching: boolean;
}
```

# 6. Development Setup Instructions
## 6.1. Frontend Setup
1. **NPM Development Server**:

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Hot reloading enabled for all changes
- Browser sync for multi-device testing

2. **Build Process**:

- Development build: `npm run build:dev`
- Watch mode: `npm run watch`
- Linting: `npm run lint`

## 6.2. Backend Setup
1. **Python Development Server**:

- Install dependencies: `pip install -r requirements.txt`
- Start Flask development server: `python app.py`
- Debug mode enabled with hot reloading
- File watching for JSON template changes

2. **Directory Structure Creation**:

- Automatic creation of required directories
- Default template files generation
- Example project setup

## 6.3. Development Workflow
1. **File Management**:

- JSON templates stored in `./data/templates/`
- User projects saved to `./data/projects/`
- Automatic backup system for safety
- Version control integration ready

2. **Testing**:

- Component testing with Jest
- Integration testing for API endpoints
- Manual testing guidelines for UI interactions

This streamlined architecture focuses on your core requirements: JSON-based storage, NPM development setup, and comprehensive element manipulation without the complexity of collaboration or plugin systems.