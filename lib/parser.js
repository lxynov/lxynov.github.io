const fs = require('fs-extra');
const path = require('path');
const frontMatter = require('front-matter');
const { marked } = require('marked');

class Parser {
  constructor(config) {
    this.config = config;
    
    // Configure marked with default options
    marked.setOptions({
      gfm: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: true,
      xhtml: false
    });
    
    // Custom renderer for code blocks to add syntax highlighting classes
    const renderer = new marked.Renderer();
    
    renderer.code = (code, language) => {
      return `<pre><code class="language-${language}">${code}</code></pre>`;
    };

    renderer.listitem = function(text) {
      // Remove any <p> tags from the text
      return '<li>' + text.replace(/<\/?p>/g, '') + '</li>';
    };

    marked.use({ renderer });
  }

  async parse(filePath) {
    try {
      // Read the file content
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse front matter
      const { attributes, body } = frontMatter(fileContent);
      
      // Convert markdown to HTML
      const html = marked(body);
      
      // Determine the content type based on file path
      const relativePath = path.relative(this.config.sourcePath, filePath);
      let type = 'page';
      
      if (relativePath.startsWith('posts/')) {
        type = 'post';
      }
      
      // Generate URL from file path
      let url = `/${relativePath.replace(/\.md$/, '.html')}`;
      
      // Get creation date (from front matter or file stats)
      let date = attributes.date;
      if (!date) {
        const stats = await fs.stat(filePath);
        date = stats.birthtime;
      }
      
      // Create a metadata object
      const metadata = {
        ...attributes,
        date: new Date(date).toISOString(),
        url,
        type,
        filePath,
        id: path.basename(filePath, '.md')
      };
      
      return {
        data: metadata,
        content: html,
        excerpt: this.generateExcerpt(body),
        rawContent: body
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      throw error;
    }
  }

  generateExcerpt(markdown, length = 200) {
    // Remove markdown formatting
    const plainText = markdown
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Replace links with just the text
      .replace(/#{1,6}\s+/g, '') // Remove headings
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
      .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
      .replace(/`{1,3}([\s\S]*?)`{1,3}/g, '$1') // Remove code blocks
      .replace(/^\s*>+\s*/gm, '') // Remove blockquotes
      .replace(/^\s*[-+*]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n{2,}/g, '\n'); // Normalize line breaks
    
    // Trim and limit to specified length
    return plainText.trim().substring(0, length) + 
           (plainText.length > length ? '...' : '');
  }
}

module.exports = Parser;