const path = require('path');

class Transformer {
  constructor(config) {
    this.config = config;
    this.transformers = [];
  }

  /**
   * Register a new transformer function
   * @param {Function} transformer - Function that transforms content
   */
  registerTransformer(transformer) {
    if (typeof transformer === 'function') {
      this.transformers.push(transformer);
    }
  }

  /**
   * Apply all registered transformers to the content
   * @param {Object} content - Content object from the parser
   * @returns {Object} Transformed content object
   */
  async transform(content) {
    try {
      let transformedContent = { ...content };
      
      // Apply built-in transformers
      transformedContent = await this.applyBuiltInTransformers(transformedContent);
      
      // Apply registered transformers from plugins
      for (const transformer of this.transformers) {
        transformedContent = await transformer(transformedContent, this.config);
      }
      
      return transformedContent;
    } catch (error) {
      console.error('Transform error:', error);
      throw error;
    }
  }

  /**
   * Apply built-in transformers
   * @param {Object} content - Content object from the parser
   * @returns {Object} Transformed content object
   */
  async applyBuiltInTransformers(content) {
    try {
      let transformedContent = { ...content };
      
      // Add layout information
      transformedContent = this.addLayoutInfo(transformedContent);
      
      // Process relative URLs
      transformedContent = this.processUrls(transformedContent);
      
      // Add metadata for templates
      transformedContent = this.addTemplateMetadata(transformedContent);
      
      return transformedContent;
    } catch (error) {
      console.error('Built-in transformer error:', error);
      throw error;
    }
  }

  /**
   * Add layout information to content
   * @param {Object} content - Content object
   * @returns {Object} Content with layout info
   */
  addLayoutInfo(content) {
    const { data } = content;
    
    // Determine layout based on content type if not specified
    if (!data.layout) {
      data.layout = data.type === 'post' ? 'post' : 'default';
    }
    
    return {
      ...content,
      data: {
        ...data,
        layout: data.layout
      }
    };
  }

  /**
   * Process URLs in content to make them absolute
   * @param {Object} content - Content object
   * @returns {Object} Content with processed URLs
   */
  processUrls(content) {
    let { data, content: html } = content;
    const baseUrl = this.config.siteData.baseUrl || '/';
    
    // Process URLs in HTML content (images, links, etc.)
    html = html.replace(
      /(src|href)="(?!http|https|mailto|tel|#)([^"]+)"/g,
      `$1="${baseUrl}$2"`
    );
    
    // Make sure the URL starts with a slash
    if (data.url && !data.url.startsWith('/')) {
      data.url = `/${data.url}`;
    }
    
    // Make URL absolute with baseUrl
    if (data.url && baseUrl !== '/') {
      data.url = `${baseUrl.replace(/\/$/, '')}${data.url}`;
    }
    
    return {
      ...content,
      data: {
        ...data
      },
      content: html
    };
  }

  /**
   * Add additional metadata for templates
   * @param {Object} content - Content object
   * @returns {Object} Content with additional metadata
   */
  addTemplateMetadata(content) {
    const { data } = content;
    
    // Generate formatted date for display
    const dateObj = new Date(data.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Add reading time estimate (approximate)
    const words = content.rawContent.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
    
    return {
      ...content,
      data: {
        ...data,
        formattedDate,
        readingTime,
        siteData: this.config.siteData
      }
    };
  }
}

module.exports = Transformer;