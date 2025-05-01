/**
 * SSG Theme JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    
    if (mobileMenuToggle && siteNav) {
      mobileMenuToggle.addEventListener('click', function() {
        siteNav.classList.toggle('active');
      });
    }
    
    // Handle code highlighting
    const codeBlocks = document.querySelectorAll('pre code');
    if (window.Prism && codeBlocks.length > 0) {
      codeBlocks.forEach(block => {
        Prism.highlightElement(block);
      });
    }
    
    // Add current year to footer if there's a year placeholder
    const yearPlaceholder = document.querySelector('.current-year');
    if (yearPlaceholder) {
      yearPlaceholder.textContent = new Date().getFullYear();
    }
    
    // Add target="_blank" to external links
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.getAttribute('href').includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70, // Adjust for fixed header
            behavior: 'smooth'
          });
        }
      });
    });
  });

// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  
  if (!themeToggle) return; // Exit if toggle doesn't exist
  
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  
  // Apply saved theme on load
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-mode');
    themeToggle.classList.add('active');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    themeToggle.classList.remove('active');
  } else {
    // No saved preference, use system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark-mode');
      themeToggle.classList.add('active');
    }
  }
  
  // Toggle theme when switch is clicked
  themeToggle.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark-mode')) {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      themeToggle.classList.remove('active');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
      themeToggle.classList.add('active');
    }
  });
});