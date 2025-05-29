const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const winston = require('winston');

// Configure logging
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ]
});

// Initialize Express
const app = express();

// Cache for processed templates
const templateCache = {};

// Ensure required directories exist
function ensureDirectories() {
  const directories = [
    'data',
    'data/templates',
    'data/projects',
    'data/assets',
    'data/backups',
    'partials'
  ];
  
  directories.forEach(dir => {
    fs.ensureDirSync(dir);
    logger.info(`Directory ensured: ${dir}`);
  });
}

// Process include tags in HTML content
function processIncludes(htmlContent, basePath = 'partials', depth = 0, maxDepth = 10) {
  if (depth > maxDepth) {
    logger.warn(`Maximum include depth (${maxDepth}) reached`);
    return htmlContent;
  }
  
  // Find all include tags
  const pattern = /<include\s+src=['"]([^'"]+)['"]\s*><\/include>/g;
  let match;
  let processedContent = htmlContent;
  
  while ((match = pattern.exec(htmlContent)) !== null) {
    const fullTag = match[0];
    const includePath = match[1];
    
    try {
      // Read the included file
      const filePath = path.join(basePath, path.basename(includePath));
      if (!fs.existsSync(filePath)) {
        logger.error(`Include file not found: ${filePath}`);
        const replacement = `<!-- ERROR: Include file '${filePath}' not found -->`;
        processedContent = processedContent.replace(fullTag, replacement);
      } else {
        const includedContent = fs.readFileSync(filePath, 'utf8');
        // Process nested includes
        const processedIncludedContent = processIncludes(includedContent, basePath, depth + 1, maxDepth);
        processedContent = processedContent.replace(fullTag, processedIncludedContent);
      }
    } catch (e) {
      logger.error(`Error processing include ${includePath}: ${e.message}`);
      const replacement = `<!-- ERROR: Failed to process include '${includePath}': ${e.message} -->`;
      processedContent = processedContent.replace(fullTag, replacement);
    }
  }
  
  return processedContent;
}

// Load partial content
function loadPartialContent(partialPath) {
  // Check cache first
  if (templateCache[partialPath]) {
    logger.info(`Serving cached partial: ${partialPath}`);
    return {
      path: partialPath,
      content: templateCache[partialPath],
      status: 'success'
    };
  }
  
  try {
    // Read and process the partial
    const filePath = path.join('partials', partialPath.replace(/^\//, ''));
    const content = fs.readFileSync(filePath, 'utf8');
    const processedContent = processIncludes(content);
    
    // Cache the result
    templateCache[partialPath] = processedContent;
    
    return {
      path: partialPath,
      content: processedContent,
      status: 'success'
    };
  } catch (e) {
    const errorMsg = `Error loading partial ${partialPath}: ${e.message}`;
    logger.error(errorMsg);
    return {
      path: partialPath,
      status: 'error',
      error: errorMsg
    };
  }
}

// Create a backup of files before modifying
function createBackup(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  const backupDir = 'data/backups';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = path.basename(filePath);
  const backupName = `${path.parse(fileName).name}_${timestamp}${path.parse(fileName).ext}`;
  const backupPath = path.join(backupDir, backupName);
  
  try {
    fs.copySync(filePath, backupPath);
    return true;
  } catch (e) {
    logger.error(`Backup error: ${e.message}`);
    return false;
  }
}

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Express routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to load a partial (replacing WebSocket 'load_partial' event)
app.get('/api/partials/:filename', (req, res) => {
  const partialPath = req.params.filename;
  const requestId = req.query.requestId; // Optional for client tracking
  
  const result = loadPartialContent(partialPath);
  if (requestId) {
    result.requestId = requestId;
  }
  
  if (result.status === 'success') {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
});

// Original HTTP route for backward compatibility
app.get('/partials/:filename', (req, res) => {
  const result = loadPartialContent(req.params.filename);
  
  if (result.status === 'success') {
    res.send(result.content);
  } else {
    res.status(500).send(`<!-- ERROR: ${result.error} -->`);
  }
});

// API endpoint to list all projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = [];
    const projectsDir = 'data/projects';
    
    if (fs.existsSync(projectsDir)) {
      fs.readdirSync(projectsDir).forEach(file => {
        if (file.endsWith('.json')) {
          projects.push({
            name: path.parse(file).name,
            file: file,
            modified: fs.statSync(path.join(projectsDir, file)).mtime
          });
        }
      });
    }
    
    res.json({ projects });
  } catch (e) {
    logger.error(`Error listing projects: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// API endpoint to save a project
app.post('/api/projects', (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }
    
    const projectsDir = 'data/projects';
    fs.ensureDirSync(projectsDir);
    
    const filePath = path.join(projectsDir, `${name}.json`);
    
    // Create backup if file exists
    if (fs.existsSync(filePath)) {
      createBackup(filePath);
    }
    
    // Save the new content
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    
    res.json({ 
      status: 'success', 
      message: 'Project saved successfully',
      file: `${name}.json`,
      timestamp: new Date()
    });
  } catch (e) {
    logger.error(`Error saving project: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// API endpoint to get a project by name
app.get('/api/projects/:name', (req, res) => {
  try {
    const name = req.params.name;
    const projectsDir = 'data/projects';
    const filePath = path.join(projectsDir, `${name}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({
      name,
      content: JSON.parse(content),
      modified: fs.statSync(filePath).mtime
    });
  } catch (e) {
    logger.error(`Error loading project: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// API endpoint to log client-side errors (replacing WebSocket 'error' event)
app.post('/api/errors', (req, res) => {
  try {
    const errorData = req.body;
    logger.error(`Client error: ${JSON.stringify(errorData)}`);
    res.json({ status: 'logged' });
  } catch (e) {
    logger.error(`Error logging client error: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// API endpoint to check connection status (replacing WebSocket 'connection_status')
app.get('/api/status', (req, res) => {
  res.json({ status: 'connected' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  ensureDirectories();
  logger.info(`Starting Express API server on port ${PORT}`);
  
  // Open the browser automatically when server starts successfully
  logger.info(`Opening browser to http://localhost:${PORT}`);
  try {
    // Direct approach using child_process specifically for Windows PowerShell
    const { exec } = require('child_process');
    
    // Use PowerShell command for Windows
    const url = `http://localhost:${PORT}`;
    exec(`powershell.exe -Command "Start-Process '${url}'"`, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Failed to open browser: ${error.message}`);
        logger.info(`Please manually open ${url} in your browser`);
      } else {
        logger.info('Browser opened successfully');
      }
    });
  } catch (e) {
    // If anything goes wrong, just tell the user to open manually
    logger.error(`Could not open browser automatically: ${e.message}`);
    logger.info(`Please open http://localhost:${PORT} in your browser manually`);
  }
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.info(`Port ${PORT} is already in use. Checking if our application is running...`);
    
    // Try to fetch the status endpoint to see if our app is already running
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/status',
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);          if (response.status === 'connected') {
            logger.info(`Application is already running on port ${PORT}. Opening browser to existing instance...`);
            
            try {
              // Direct approach using child_process specifically for Windows PowerShell
              const { exec } = require('child_process');
              
              // Use PowerShell command for Windows
              const url = `http://localhost:${PORT}`;
              exec(`powershell.exe -Command "Start-Process '${url}'"`, (error, stdout, stderr) => {
                if (error) {
                  logger.error(`Failed to open browser: ${error.message}`);
                  logger.info(`Please manually open ${url} in your browser`);
                } else {
                  logger.info('Browser opened successfully');
                }
                // Print the URL so the user can open it manually if needed
                logger.info(`Application URL: ${url}`);
                process.exit(0); // Exit gracefully regardless
              });
            } catch (e) {
              // If anything goes wrong, just tell the user to open manually
              logger.error(`Could not open browser automatically: ${e.message}`);
              logger.info(`Please open http://localhost:${PORT} in your browser manually`);
              process.exit(0); // Exit gracefully
            }
          } else {
            logger.error(`Unknown service running on port ${PORT}. Please try a different port.`);
            process.exit(1);
          }
        } catch (e) {
          logger.error(`Error checking existing service: ${e.message}`);
          logger.error(`Another service is using port ${PORT}. Please try a different port.`);
          process.exit(1);
        }
      });
    });
    
    req.on('error', () => {
      logger.error(`Port ${PORT} is in use but could not connect to it. Please try a different port.`);
      process.exit(1);
    });
    
    req.end();
  } else {
    logger.error(`Server error: ${err.message}`);
    process.exit(1);
  }
});