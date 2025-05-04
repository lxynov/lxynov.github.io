/**
 * SSG Configuration
 */

module.exports = {
    // Site information
    siteData: {
      title: 'Xingyuan Lin',
      description: 'Interest-driven learning, research, and thinking.',
      // description: ' Interest-driven learning. \n dddrying to comprehend the essence of things.',
      baseUrl: '/',
      author: 'Xingyuan',
      email: 'alxynov@gmail.com',
      github: 'https://github.com/lxynov'
    },
    
    // Content directory
    sourceDir: './source',
    
    // Output directory
    outputDir: './public',
    
    // Theme settings
    themesDir: './themes',
    theme: 'default',
    
    // Build settings
    cleanUrls: true, // creates /about/index.html instead of /about.html
    
    // Development server settings
    port: 3000,
    
    // Plugins
    plugins: [
      // Example GitHub comments plugin (not included)
      // 'github-comments'
    ],
    
    // Plugin settings
    pluginSettings: {
      // Example GitHub comments settings
      // 'github-comments': {
      //   repo: 'yourusername/repo-name',
      //   theme: 'github-light',
      //   issueMapping: 'title' // Maps posts to GitHub issues by title
      // }
    }
  };