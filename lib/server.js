const path = require('path');
const express = require('express');
const livereload = require('livereload');
const chokidar = require('chokidar');
const SimpleSsg = require('./index');
const fs = require('fs-extra');

async function start(config) {
  try {
    // Create SSG instance
    const ssg = new SimpleSsg(config);
    
    // Build the site initially
    await ssg.build();
    
    // Create Express app
    const app = express();
    
    // Serve static files from the output directory
    app.use(express.static(config.outputDir));
    
    // Create livereload server
    const lrServer = livereload.createServer({
      exts: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg'],
      debug: false
    });
    
    // Watch for changes in content, theme, and config
    const watcher = chokidar.watch([
      `${config.sourcePath}/**/*.md`,
      `${config.themePath}/**/*.hbs`,
      `${config.themePath}/assets/**/*`,
      path.resolve(process.cwd(), 'config.js')
    ], {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });
    
    // Add middleware to inject livereload script
    app.use((req, res, next) => {
      if (req.url.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
        
        // Save the original end method
        const originalEnd = res.end;
        
        // Override end method to inject livereload script
        res.end = function(chunk, encoding) {
          if (chunk) {
            const html = chunk.toString();
            const injectedHtml = html.replace('</body>', 
              '<script src="http://localhost:35729/livereload.js"></script></body>');
            
            // Call the original end method with the modified HTML
            originalEnd.call(res, injectedHtml, encoding);
          } else {
            originalEnd.call(res, chunk, encoding);
          }
        };
      }
      
      next();
    });
    
    // Handle 404s by sending index.html
    app.use((req, res) => {
      res.status(404).sendFile(path.join(config.outputPath, 'index.html'));
    });
    
    // Start server
    const server = app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
    
    // Watch for file changes and rebuild
    watcher.on('change', async (filePath) => {
      console.log(`File changed: ${filePath}`);
      
      try {
        // Reload config if it changed
        if (filePath.endsWith('config.js')) {
          delete require.cache[require.resolve(path.resolve(process.cwd(), 'config.js'))];
          const newConfig = require(path.resolve(process.cwd(), 'config.js'));
          Object.assign(config, newConfig);
        }
        
        // Rebuild the site
        await ssg.build();
        
        // Refresh browser
        lrServer.refresh(filePath);
      } catch (error) {
        console.error('Error rebuilding site:', error);
      }
    });
    
    // Add file to watch list if added
    watcher.on('add', async (filePath) => {
      console.log(`File added: ${filePath}`);
      
      try {
        // Rebuild the site
        await ssg.build();
        
        // Refresh browser
        lrServer.refresh(filePath);
      } catch (error) {
        console.error('Error rebuilding site:', error);
      }
    });
    
    // Watch the output directory for changes
    lrServer.watch(config.outputPath);
    
    return server;
  } catch (error) {
    console.error('Server error:', error);
    throw error;
  }
}

// Handle direct execution of server.js
if (require.main === module) {
  try {
    // Try to load config.js from the current directory
    let config;

    const configPath = path.resolve(process.cwd(), 'source/config.js');
    
    // Check if config.js exists in the current directory
    if (fs.existsSync(configPath)) {
      config = require(configPath);
    } else {
      // Use default config if config.js doesn't exist
      config = {
        sourceDir: './content',
        outputDir: './public',
        themesDir: './themes',
        theme: 'default',
        port: 3000,
        siteData: {
          title: 'Simple SSG Site',
          description: 'A site built with SimpleSsg',
          baseUrl: '/'
        }
      };
      console.log('No config.js found. Using default configuration.');
    }
    
    // Set default port
    config.port = config.port || 3000;
    
    // Start the server
    start(config).then(() => {
      console.log(`Server started with config from ${configPath}`);
    }).catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

module.exports = { start };