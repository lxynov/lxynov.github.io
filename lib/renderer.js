const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const glob = require('glob');
const _ = require('lodash');

class Renderer {
  constructor(config) {
    this.config = config;
    this.layouts = {};
    this.partials = {};
    
    // Initialize handlebars
    this.registerHandlebarsHelpers();
    this.loadTemplates();
  }

  /**
   * Register custom helpers for handlebars
   */
  registerHandlebarsHelpers() {
    // Format date
    handlebars.registerHelper('formatDate', (date, format) => {
      if (!date) return '';
      
      const dateObj = new Date(date);
      
      // Basic format options
      const formats = {
        'YYYY-MM-DD': () => {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        },
        'DD/MM/YYYY': () => {
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          return `${day}/${month}/${year}`;
        },
        'MMM DD, YYYY': () => {
          return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        },
        'MMMM DD, YYYY': () => {
          return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      };
      
      if (format && formats[format]) {
        return formats[format]();
      }
      
      // Default format
      return formats['MMMM DD, YYYY']();
    });
    
    // Limit array items
    handlebars.registerHelper('limit', (array, limit) => {
      if (!array || !Array.isArray(array)) return [];
      return array.slice(0, limit);
    });
    
    // Sort array
    handlebars.registerHelper('sort', (array, field, direction = 'asc') => {
      if (!array || !Array.isArray(array)) return [];
      
      return _.sortBy(array, item => {
        const value = _.get(item, field);
        return direction.toLowerCase() === 'desc' ? -value : value;
      });
    });
    
    // Check if value equals something
    handlebars.registerHelper('eq', function(a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    });
    
    // Check if value does not equal something
    handlebars.registerHelper('ne', function(a, b, options) {
      return a !== b ? options.fn(this) : options.inverse(this);
    });
    
    // Debug helper - dumps content
    handlebars.registerHelper('debug', function(optionalValue) {
      console.log('Current context:');
      console.log(this);
      
      if (optionalValue) {
        console.log('Value:');
        console.log(optionalValue);
      }
    });

    // Current date/time helper
    handlebars.registerHelper('now', function() {
      return new Date();
    });

    handlebars.registerHelper('breaklines', function(text) {
      text = handlebars.Utils.escapeExpression(text);
      text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
      return new handlebars.SafeString(text);
    });
  }

  /**
   * Register a custom handlebars helper
   * @param {String} name - Helper name
   * @param {Function} helperFn - Helper function
   */
  registerHelper(name, helperFn) {
    handlebars.registerHelper(name, helperFn);
  }

  /**
   * Load layout templates and partials from the theme
   */
  loadTemplates() {
    try {
      // Load layouts
      const layoutFiles = glob.sync(path.join(this.config.themePath, 'layouts', '*.hbs'));
      
      for (const file of layoutFiles) {
        const layoutName = path.basename(file, '.hbs');
        const template = fs.readFileSync(file, 'utf-8');
        this.layouts[layoutName] = handlebars.compile(template);
      }
      
      // Load partials
      // const partialFiles = glob.sync(path.join(this.config.themePath, 'partials', '*.hbs'));
      
      // for (const file of partialFiles) {
      //   const partialName = path.basename(file, '.hbs');
      //   const template = fs.readFileSync(file, 'utf-8');
      //   handlebars.registerPartial(partialName, template);
      // }
    } catch (error) {
      console.error('Error loading templates:', error);
      throw error;
    }
  }

  /**
   * Render content using the appropriate layout
   * @param {Object} content - Transformed content object
   * @returns {String} Rendered HTML
   */
  async render(content) {
    try {
      const { data, content: html } = content;
      const layoutName = data.layout || 'default';
      
      // If layout doesn't exist, fall back to default
      if (!this.layouts[layoutName]) {
        console.warn(`Layout "${layoutName}" not found. Using default layout.`);
        
        if (!this.layouts['default']) {
          throw new Error('Default layout not found. Please check your theme.');
        }
        
        data.layout = 'default';
      }
      
      // Prepare the context for the template
      const context = {
        page: data,
        content: html,
        site: this.config.siteData
      };
      
      // Render the layout with the content
      return this.layouts[data.layout](context);
    } catch (error) {
      console.error('Render error:', error);
      throw error;
    }
  }

  /**
   * Render home page
   * @param {Array} content - Array of all content objects
   * @returns {String} Rendered HTML
   */
  async renderHome(content) {
    try {
      const homeLayout = this.layouts['home'] || this.layouts['default'];
      
      if (!homeLayout) {
        throw new Error('Home layout not found. Please check your theme.');
      }
      
      // Prepare the context for the template
      const context = {
        page: {
          title: this.config.siteData.title,
          description: this.config.siteData.description.replace(/\n/g, '<br>'),
          url: '/index.html'
        },
        posts: content.filter(item => item.data.type === 'post'),
        pages: content.filter(item => item.data.type === 'page'),
        site: this.config.siteData
      };
      
      // Render the home template
      return homeLayout(context);
    } catch (error) {
      console.error('Home render error:', error);
      throw error;
    }
  }
}

module.exports = Renderer;