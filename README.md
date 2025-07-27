# 🎓 Uddhav P. Gautam - Founder, RGR Innovate LLC - Academic Website

A modern, responsive academic website built with Jekyll, featuring a clean design, dark/light theme support, and comprehensive research documentation.

## ✨ Features

- **🎨 Modern Design** - Clean, professional academic website design
- **🌙 Dark/Light Theme** - Toggle between themes with persistent preference
- **📱 Responsive** - Fully responsive design for all devices
- **⚡ Fast Performance** - Optimized for speed and efficiency
- **🔧 Maintainable** - Well-structured, refactored codebase following best practices
- **📊 Research Focused** - Dedicated sections for publications, software, and blogs
- **🎯 SEO Optimized** - Proper meta tags and structured data

## 🏗️ Architecture

### **Configuration Management**
- **Centralized Configuration** - Single source of truth in `_config.yml`
- **Structured Data** - Organized data files in `_data/` directory
- **Environment Awareness** - Different settings for development and production
- **Fallback Mechanisms** - Graceful degradation when data is missing

### **Template System**
- **Modular Components** - Reusable template includes
- **Utility Functions** - Centralized helper functions in `_includes/utils.html`
- **Consistent Patterns** - Standardized Liquid templating across all pages
- **No Hardcoding** - All content dynamically generated from data files

### **Data Organization**
```
_data/
├── site.yml          # Site-wide configuration and metadata
├── pi.yml            # Principal investigator information
├── events.yml        # Academic events and calendar
├── news.yml          # News and announcements
└── [other data files] # Specialized data collections
```

## 🚀 Quick Start

### **Prerequisites**
- Ruby 3.0+ and Bundler
- Git

### **Installation**
```bash
# Clone the repository
git clone https://github.com/upgautamvt/upgautamvt.github.io.git
cd upgautamvt.github.io

# Install dependencies
bundle install

# Start development server
bundle exec jekyll serve --livereload
```

### **Configuration**
1. **Update `_config.yml`** - Modify site settings and metadata
2. **Edit `_data/site.yml`** - Update site-wide information
3. **Modify `_data/pi.yml`** - Update personal and academic information
4. **Customize themes** - Edit `_sass/_theme.scss` for styling

## 📁 Project Structure

```
├── _config.yml              # Main Jekyll configuration
├── _data/                   # Data files (YAML)
│   ├── site.yml            # Site-wide data
│   ├── pi.yml              # Personal information
│   ├── events.yml          # Events and calendar
│   └── news.yml            # News and announcements
├── _includes/              # Reusable template components
│   ├── utils.html          # Utility functions and helpers
│   ├── header.html         # Navigation header
│   ├── footer.html         # Site footer
│   └── [other includes]    # Additional components
├── _layouts/               # Page layout templates
├── _pages/                 # Static pages
├── _posts/                 # Blog posts
├── _sass/                  # Stylesheets
│   └── _theme.scss         # Main theme styles
├── assets/                 # Compiled assets
├── images/                 # Image files
└── [other directories]     # Additional resources
```

## 🔧 Development

### **Adding New Content**

#### **Blog Posts**
```bash
# Create new post
bundle exec jekyll post "My New Post"
```

#### **Pages**
```html
<!-- Create new page in _pages/ -->
---
layout: default
title: "My Page"
permalink: /my-page/
---
```

#### **Data Updates**
```yaml
# Update _data/site.yml for site-wide changes
# Update _data/pi.yml for personal information
# Update _data/events.yml for calendar events
```

### **Styling**
- **Main styles**: `_sass/_theme.scss`
- **Bootstrap integration**: `_sass/bootstrap/`
- **Custom components**: `_sass/SHB_css.scss`

### **Theme Customization**
```scss
// In _sass/_theme.scss
:root {
  // Light theme variables
  --bg-primary: #ffffff;
  --text-primary: #333333;
  // ... other variables
}

[data-theme="dark"] {
  // Dark theme variables
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  // ... other variables
}
```

## 📚 Documentation

- **[Refactoring Guide](REFACTORING_GUIDE.md)** - Comprehensive guide to the refactored codebase
- **[Security Guide](SECURITY_GUIDE.md)** - GitHub token and security best practices
- **[GitHub Setup](GITHUB_SETUP.md)** - Environment setup and deployment guide

## 🎯 Best Practices

### **Configuration Management**
- ✅ Use centralized configuration in `_config.yml`
- ✅ Organize data in structured YAML files
- ✅ Implement fallback mechanisms for missing data
- ✅ Use environment-aware settings

### **Template Development**
- ✅ Include utility functions in all templates
- ✅ Use consistent Liquid templating patterns
- ✅ Avoid hardcoded values
- ✅ Implement proper error handling

### **Data Organization**
- ✅ Maintain single source of truth
- ✅ Use consistent naming conventions
- ✅ Structure data with clear relationships
- ✅ Eliminate duplicate information

## 🔒 Security

### **GitHub Token Management**
- Use GitHub Secrets for sensitive data
- Never commit tokens to version control
- Follow the [Security Guide](SECURITY_GUIDE.md) for best practices

### **Environment Variables**
```bash
# Set environment variable for GitHub API
export WEBSITE_TOKEN="your_github_token_here"
```

## 🚀 Deployment

### **GitHub Pages**
- Automatic deployment from `master` branch
- Uses GitHub Actions for CI/CD
- Environment variables configured in repository secrets

### **Local Development**
```bash
# Development server with live reload
bundle exec jekyll serve --livereload

# Production build
bundle exec jekyll build
```

## 📊 Performance

### **Optimizations**
- ✅ Minified CSS and JavaScript
- ✅ Optimized images
- ✅ Efficient template rendering
- ✅ Reduced redundancy in data files

### **Monitoring**
- Google Analytics integration (optional)
- Build time optimization
- Page load performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the established code patterns
4. Test your changes thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Based on academic website templates
- Built with Jekyll and Bootstrap
- Icons from Font Awesome
- Theme switching functionality

---

**Maintained by:** Uddhav P. Gautam - Founder, RGR Innovate LLC  
**Last Updated:** {{ "now" | date: "%Y-%m-%d" }}  
**Version:** 2.0.0 (Refactored)
