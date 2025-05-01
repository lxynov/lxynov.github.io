const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

/**
 * Load plugins from the config
 * @param {Array} plugins - Array of plugin names or paths
 * @returns {Array} Array of plugin objects
 */
function loadPlugins(plugins = []) {
  const loadedPlugins = [];
  
  for (const plugin of plugins) {
    try {
      let pluginModule;
      
      // If plugin is a string, try to require it
      if (typeof plugin === 'string') {
        // Try to load from node_modules
        try {
          pluginModule = require(plugin);
        } catch (err) {
          // If not found in node_modules, try to load from local plugins directory
          try {
            pluginModule = require(path.resolve(process.cwd(), 'plugins', plugin));
          } catch (err2) {
            // Try to load from absolute path
            try {
              pluginModule = require(path.resolve(process.cwd(), plugin));
            } catch (err3) {
              console.error(`Could not load plugin "${plugin}":`, err3);
              continue;
            }
          }
        }
      } else if (typeof plugin === 'object') {
        // If plugin is already an object, use it directly
        pluginModule = plugin;
      } else {
        console.error(`Invalid plugin format: ${plugin}`);
        continue;
      }
      
      // Validate plugin
      if (typeof pluginModule !== 'object') {
        console.error(`Plugin "${plugin}" is not a valid object`);
        continue;
      }
      
      // Add plugin to loaded plugins
      loadedPlugins.push(pluginModule);
    } catch (error) {
      console.error(`Error loading plugin "${plugin}":`, error);
    }
  }
  
  return loadedPlugins;
}

/**
 * Create a slug from a string
 * @param {String} str - String to slugify
 * @returns {String} Slugified string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get relative URL from absolute path
 * @param {String} filePath - Absolute file path
 * @param {String} basePath - Base directory path
 * @param {String} ext - Output file extension (default: .html)
 * @returns {String} Relative URL
 */
function pathToUrl(filePath, basePath, ext = '.html') {
  const relativePath = path.relative(basePath, filePath);
  const { dir, name } = path.parse(relativePath);
  
  const urlPath = path.join(dir, name);
  return `/${urlPath.replace(/\\/g, '/')}${ext}`;
}

/**
 * Get available templates from theme
 * @param {String} themePath - Path to theme directory
 * @returns {Array} Array of template names
 */
function getAvailableTemplates(themePath) {
  const layoutsPath = path.join(themePath, 'layouts');
  
  if (!fs.existsSync(layoutsPath)) {
    return ['default'];
  }
  
  const templateFiles = glob.sync(`${layoutsPath}/*.hbs`);
  
  return templateFiles.map(file => path.basename(file, '.hbs'));
}

module.exports = {
  loadPlugins,
  slugify,
  pathToUrl,
  getAvailableTemplates
};