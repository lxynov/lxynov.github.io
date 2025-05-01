const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const _ = require('lodash');
const Parser = require('./parser');
const Transformer = require('./transformer');
const Renderer = require('./renderer');
const { loadPlugins } = require('./utils');

class Ssg {
  constructor(config = {}) {
    this.config = _.merge({
      // Default configuration
      sourceDir: './source',
      outputDir: './public',
      themesDir: './themes',
      theme: 'default',
      plugins: [],
      siteData: {
        title: 'My SSG Site',
        description: 'A site built with Ssg',
        baseUrl: '/'
      }
    }, config);

    // Resolve paths
    this.config.sourcePath = path.resolve(process.cwd(), this.config.sourceDir);
    this.config.outputPath = path.resolve(process.cwd(), this.config.outputDir);
    this.config.themePath = path.resolve(
      process.cwd(),
      this.config.themesDir,
      this.config.theme
    );

    // Initialize components
    this.parser = new Parser(this.config);
    this.transformer = new Transformer(this.config);
    this.renderer = new Renderer(this.config);

    // Load plugins
    this.plugins = loadPlugins(this.config.plugins);
    this.applyPlugins();
  }

  applyPlugins() {
    // Apply plugins to the transformer
    this.plugins.forEach(plugin => {
      if (typeof plugin.transform === 'function') {
        this.transformer.registerTransformer(plugin.transform);
      }
      
      if (typeof plugin.render === 'function') {
        this.renderer.registerHelper(plugin.name, plugin.render);
      }
    });
  }

  async build() {
    try {
      // 1. Clean output directory
      await fs.emptyDir(this.config.outputPath);
      
      // 2. Copy static assets from theme
      const themeAssetsPath = path.join(this.config.themePath, 'assets');
      if (await fs.pathExists(themeAssetsPath)) {
        await fs.copy(themeAssetsPath, this.config.outputPath);
      }

      // 4. Process content files
      const contentFiles = glob.sync(`${this.config.sourcePath}/**/*.md`);
      
      // Collect all content for index pages
      const allContent = [];
      
      for (const file of contentFiles) {
        // Parse markdown files
        const content = await this.parser.parse(file);
        
        // Skip draft posts in production
        if (content.data.draft === true) {
          continue;
        }
        
        // Transform content
        const transformed = await this.transformer.transform(content);
        
        // Add to collection for indexes
        allContent.push(transformed);
        
        // Render individual page
        const html = await this.renderer.render(transformed);
        
        // Determine output path
        const relativePath = path.relative(this.config.sourcePath, file);
        const outputPath = path.join(
          this.config.outputPath,
          relativePath.replace(/\.md$/, '.html')
        );
        
        // Create directory if it doesn't exist
        await fs.ensureDir(path.dirname(outputPath));
        
        // Write HTML file
        await fs.writeFile(outputPath, html);
      }
      
      // 6. Generate main index page
      const indexHtml = await this.renderer.renderHome(allContent);
      await fs.writeFile(path.join(this.config.outputPath, 'index.html'), indexHtml);

    } catch (error) {
      console.error('Build error:', error);
      throw error;
    }
  }
}

module.exports = Ssg;