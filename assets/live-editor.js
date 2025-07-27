// Live Editor JavaScript
class LiveEditor {
  constructor() {
    this.isAuthenticated = false;
    this.currentFile = null;
    this.originalContent = null;
    this.init();
  }

  init() {
    this.createEditButton();
    this.createEditorModal();
    this.createPasswordModal();
    this.bindEvents();
  }

  createEditButton() {
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-page-btn';
    editBtn.innerHTML = '<i class="fa fa-edit"></i> Edit Page';
    editBtn.onclick = () => this.showPasswordModal();
    document.body.appendChild(editBtn);
  }

  createEditorModal() {
    const modal = document.createElement('div');
    modal.className = 'live-editor-overlay';
    modal.innerHTML = `
      <div class="live-editor-modal">
        <div class="live-editor-header">
          <h3 class="live-editor-title">Live Editor</h3>
          <button class="live-editor-close">&times;</button>
        </div>
        <div class="live-editor-content">
          <div class="live-editor-tabs">
            <button class="live-editor-tab active" data-tab="content">Content</button>
            <button class="live-editor-tab" data-tab="preview">Preview</button>
          </div>
          <textarea class="live-editor-textarea" placeholder="Loading content..."></textarea>
        </div>
        <div class="live-editor-footer">
          <div class="live-editor-actions">
            <button class="live-editor-btn live-editor-btn-secondary" id="cancel-btn">Cancel</button>
            <button class="live-editor-btn live-editor-btn-primary" id="save-btn">
              <span class="btn-text">Save Changes</span>
              <span class="loading-spinner" style="display: none;"></span>
            </button>
          </div>
          <div class="live-editor-status" id="status">Ready to edit</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
  }

  createPasswordModal() {
    const passwordModal = document.createElement('div');
    passwordModal.className = 'password-modal';
    passwordModal.innerHTML = `
      <h3>Enter Edit Password</h3>
      <input type="password" class="password-input" placeholder="Enter password" />
      <div style="margin-top: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">
          GitHub Token (Optional - will use default if empty):
        </label>
        <input type="password" class="github-token-input" placeholder="Enter custom GitHub token (optional)" />
        <small style="display: block; margin-top: 0.25rem; color: var(--text-secondary);">
          Leave empty to use the default token
        </small>
      </div>
      <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
        <button class="live-editor-btn live-editor-btn-secondary" id="cancel-password">Cancel</button>
        <button class="live-editor-btn live-editor-btn-primary" id="submit-password">Submit</button>
      </div>
    `;
    document.body.appendChild(passwordModal);
    this.passwordModal = passwordModal;
  }

  bindEvents() {
    // Password modal events
    document.getElementById('submit-password').onclick = () => this.authenticate();
    document.getElementById('cancel-password').onclick = () => this.hidePasswordModal();
    
    // Editor modal events
    document.querySelector('.live-editor-close').onclick = () => this.hideEditor();
    document.getElementById('cancel-btn').onclick = () => this.hideEditor();
    document.getElementById('save-btn').onclick = () => this.saveChanges();
    
    // Tab switching
    document.querySelectorAll('.live-editor-tab').forEach(tab => {
      tab.onclick = () => this.switchTab(tab.dataset.tab);
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveChanges();
      }
      if (e.key === 'Escape') {
        this.hideEditor();
      }
    });
  }

  showPasswordModal() {
    this.passwordModal.style.display = 'block';
    this.passwordModal.querySelector('.password-input').focus();
  }

  hidePasswordModal() {
    this.passwordModal.style.display = 'none';
    this.passwordModal.querySelector('.password-input').value = '';
    this.passwordModal.querySelector('.github-token-input').value = '';
  }

  authenticate() {
    const password = this.passwordModal.querySelector('.password-input').value;
    const githubToken = this.passwordModal.querySelector('.github-token-input').value;
    const correctPassword = '984904';
    
    if (password === correctPassword) {
      this.isAuthenticated = true;
      
      // Store custom GitHub token if provided, otherwise use fallback
      if (githubToken && githubToken.trim()) {
        this.setGitHubToken(githubToken.trim());
        console.log('Custom GitHub token stored for pull request creation');
      } else {
        console.log('Using default GitHub token for pull request creation');
      }
      
      this.hidePasswordModal();
      this.showEditor();
    } else {
      alert('Incorrect password. Please try again.');
      this.passwordModal.querySelector('.password-input').value = '';
      this.passwordModal.querySelector('.password-input').focus();
    }
  }

  async showEditor() {
    try {
      this.updateStatus('Loading content...');
      const filePath = this.getCurrentPagePath();
      const content = await this.fetchPageContent(filePath);
      
      if (content.success) {
        this.originalContent = content.content;
        this.currentFile = filePath;
        
        const textarea = this.modal.querySelector('.live-editor-textarea');
        textarea.value = content.content;
        
        this.modal.style.display = 'block';
        textarea.focus();
        
        // Show GitHub integration status
        this.updateStatus(`Editing: ${filePath} (Real GitHub integration enabled)`);
      } else {
        throw new Error(content.message || 'Failed to load content');
      }
    } catch (error) {
      console.error('Error loading content:', error);
      this.updateStatus('Error loading content: ' + error.message);
      alert('Error loading content: ' + error.message);
    }
  }

  hideEditor() {
    this.modal.style.display = 'none';
    this.isAuthenticated = false;
  }

  switchTab(tabName) {
    const tabs = document.querySelectorAll('.live-editor-tab');
    const textarea = document.querySelector('.live-editor-textarea');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'preview') {
      this.showPreview();
    } else {
      textarea.style.display = 'block';
      // Remove any preview div that might exist
      const previewDiv = textarea.parentNode.querySelector('.preview-div');
      if (previewDiv) {
        previewDiv.remove();
      }
    }
  }

  showPreview() {
    const textarea = document.querySelector('.live-editor-textarea');
    const content = textarea.value;
    
    // Remove any existing preview div
    const existingPreview = textarea.parentNode.querySelector('.preview-div');
    if (existingPreview) {
      existingPreview.remove();
    }
    
    // Create a preview div
    const previewDiv = document.createElement('div');
    previewDiv.className = 'preview-div';
    previewDiv.innerHTML = this.renderMarkdown(content);
    previewDiv.style.cssText = `
      flex: 1;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--text-primary);
      overflow-y: auto;
      font-family: var(--font-family);
      line-height: 1.6;
    `;
    
    textarea.style.display = 'none';
    textarea.parentNode.appendChild(previewDiv);
  }

  renderMarkdown(content) {
    // Simple markdown to HTML conversion for preview
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  async saveChanges() {
    const textarea = this.modal.querySelector('.live-editor-textarea');
    const content = textarea.value;
    
    if (content === this.originalContent) {
      this.updateStatus('No changes to save');
      return;
    }
    
    try {
      this.setLoading(true);
      this.updateStatus('Saving changes...');
      
      // Create a pull request to GitHub
      const result = await this.createPullRequest(content);
      
      if (result.success) {
        this.updateStatus('Changes saved! Pull request created.');
        setTimeout(() => {
          this.hideEditor();
          // Open the pull request in a new tab
          window.open(result.pull_request_url, '_blank');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      this.updateStatus('Error saving changes: ' + error.message);
      alert('Error saving changes: ' + error.message);
    } finally {
      this.setLoading(false);
    }
  }

  async createPullRequest(content) {
    try {
      // Always require GitHub token - no simulation mode
      const token = this.getGitHubToken();
      if (!token) {
        throw new Error('GitHub token required. Please enter your GitHub token in the password modal.');
      }
      
      // Test the token first
      this.updateStatus('Testing GitHub connection...');
      await this.testGitHubToken();
      
      // Create a real pull request
      this.updateStatus('Creating pull request...');
      return await this.createRealPullRequest(content);
    } catch (error) {
      console.error('Error creating pull request:', error);
      throw error;
    }
  }

  async createRealPullRequest(content) {
    try {
      // Create a new branch and pull request using GitHub API
      const branchName = `live-edit-${Date.now()}`;
      const commitMessage = `Live edit: Update ${this.currentFile}`;
      
      // Step 1: Create a new branch
      await this.createGitHubBranch(branchName);
      
      // Step 2: Update the file in the new branch
      await this.updateGitHubFile(this.currentFile, content, branchName, commitMessage);
      
      // Step 3: Create a pull request
      const prData = await this.createGitHubPullRequest(branchName, this.currentFile);
      
      return {
        success: true,
        pull_request_url: prData.html_url,
        branch: branchName,
        message: `Pull request created successfully: ${prData.title}`
      };
    } catch (error) {
      console.error('Error creating real pull request:', error);
      throw error;
    }
  }

  async createGitHubBranch(branchName) {
    const token = this.getGitHubToken();
    if (!token) throw new Error('GitHub token not available');
    
    try {
      // Get the latest commit SHA from master branch (not main)
      console.log('Fetching master branch info...');
      const masterResponse = await fetch(`https://api.github.com/repos/upgautamvt/upgautamvt.github.io/git/ref/heads/master`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      console.log('Master branch response status:', masterResponse.status);
      
      if (!masterResponse.ok) {
        const errorText = await masterResponse.text();
        console.error('Master branch error response:', errorText);
        throw new Error(`Failed to get master branch: ${masterResponse.status} ${masterResponse.statusText} - ${errorText}`);
      }
      
      const masterData = await masterResponse.json();
      console.log('Master branch data:', masterData);
      const masterSha = masterData.object.sha;
      
      // Create new branch
      console.log('Creating new branch:', branchName);
      const branchResponse = await fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io/git/refs', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: masterSha
        })
      });
      
      console.log('Branch creation response status:', branchResponse.status);
      
      if (!branchResponse.ok) {
        const errorText = await branchResponse.text();
        console.error('Branch creation error response:', errorText);
        throw new Error(`Failed to create branch: ${branchResponse.status} ${branchResponse.statusText} - ${errorText}`);
      }
      
      console.log('Branch created successfully');
    } catch (error) {
      console.error('Error in createGitHubBranch:', error);
      throw error;
    }
  }

  async updateGitHubFile(filePath, content, branchName, commitMessage) {
    const token = this.getGitHubToken();
    if (!token) throw new Error('GitHub token not available');
    
    try {
      // Get current file info
      console.log('Getting current file info for:', filePath);
      const fileResponse = await fetch(`https://api.github.com/repos/upgautamvt/upgautamvt.github.io/contents/${filePath}?ref=${branchName}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      let sha = null;
      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        sha = fileData.sha;
        console.log('File exists, SHA:', sha);
      } else {
        console.log('File does not exist yet, will create new file');
      }
      
      // Update file
      console.log('Updating file:', filePath);
      const updateResponse = await fetch(`https://api.github.com/repos/upgautamvt/upgautamvt.github.io/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMessage,
          content: btoa(content), // Base64 encode content
          branch: branchName,
          sha: sha
        })
      });
      
      console.log('File update response status:', updateResponse.status);
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('File update error response:', errorText);
        throw new Error(`Failed to update file: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
      }
      
      console.log('File updated successfully');
    } catch (error) {
      console.error('Error in updateGitHubFile:', error);
      throw error;
    }
  }

  async createGitHubPullRequest(branchName, filePath) {
    const token = this.getGitHubToken();
    if (!token) throw new Error('GitHub token not available');
    
    const prResponse = await fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io/pulls', {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `Live Edit: Update ${filePath}`,
        body: this.generatePRBody(filePath, branchName),
        head: branchName,
        base: 'master'
      })
    });
    
    if (!prResponse.ok) {
      throw new Error(`Failed to create pull request: ${prResponse.statusText}`);
    }
    
    return await prResponse.json();
  }

  generatePRBody(filePath, branchName) {
    return `## 🔄 Live Edit Pull Request

**File Updated:** \`${filePath}\`
**Branch:** \`${branchName}\`
**Timestamp:** ${new Date().toISOString()}

### Changes Summary
- Content modified via live editor interface
- Password-protected editing session
- Automated branch creation and file update
- Pull request created for review

### Review Instructions
1. **Review the changes** in the diff below
2. **Test the site locally** if needed
3. **Check for any syntax errors** in the modified file
4. **Approve and merge** if changes look good

### File Details
- **Path:** \`${filePath}\`
- **Branch:** \`${branchName}\`
- **Base Branch:** \`master\`
- **Edit Method:** Live Editor (Password Protected)

### Security Notes
- Changes were made through the password-protected live editor
- All modifications are tracked in this pull request
- No direct commits to main branch

---
*This pull request was automatically created by the Live Editor system.*`;
  }

  hasGitHubToken() {
    // Always return true since we have a fallback token
    return true;
  }

  getGitHubToken() {
    // Try to get token from various sources
    return localStorage.getItem('github_token') || 
           sessionStorage.getItem('github_token') || 
           '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'; // Fallback token
  }

  setGitHubToken(token) {
    // Store token securely (in production, use more secure methods)
    localStorage.setItem('github_token', token);
  }

  async fetchPageContent(filePath) {
    try {
      // Try to fetch from our API endpoint first
      const response = await fetch(`/api/content/?file=${encodeURIComponent(filePath)}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result;
        } else {
          console.warn('API returned error:', result.message);
          return this.fetchContentFallback(filePath);
        }
      } else {
        console.warn('API response not ok:', response.status);
        return this.fetchContentFallback(filePath);
      }
    } catch (error) {
      console.warn('API fetch failed, using fallback:', error);
      return this.fetchContentFallback(filePath);
    }
  }

  fetchContentFallback(filePath) {
    // Fallback method - try to get content from the current page
    const currentPage = this.getCurrentPageContent();
    
    return {
      success: true,
      file_path: filePath,
      content: currentPage,
      message: 'Content loaded via fallback method - API endpoint may not be available'
    };
  }

  getCurrentPageContent() {
    // Try to extract content from the current page
    const mainContent = document.querySelector('#homeid, .container-fluid, main, .content, .card, .jumbotron');
    
    if (mainContent) {
      // Convert HTML back to markdown-like format
      const extractedContent = this.htmlToMarkdown(mainContent.innerHTML);
      
      // If we got some meaningful content, use it
      if (extractedContent.length > 100) {
        return `---
layout: page
title: ${document.title}
---

${extractedContent}`;
      }
    }
    
    // Fallback content with more comprehensive template
    const currentPath = this.getCurrentPagePath();
    const currentUrl = window.location.pathname;
    
    return `---
layout: page
title: ${document.title}
---

# ${document.title}

This is the content for ${currentPath}

## Page Information
- **File:** ${currentPath}
- **URL:** ${currentUrl}
- **Title:** ${document.title}
- **Last Modified:** ${new Date().toLocaleDateString()}

## Content
This page was loaded via the live editor system.

### Current Page Details
- **Path:** ${currentPath}
- **URL:** ${currentUrl}
- **Document Title:** ${document.title}

### Features Available
- Live editing capability
- Password protection (984904)
- GitHub integration
- Real-time preview
- Markdown support

### How to Edit This Page
1. Click the "Edit Page" button (bottom-right corner)
2. Enter the password: **984904**
3. Make your changes in the editor
4. Use the Preview tab to see how it looks
5. Save changes to create a pull request
6. Review and merge the pull request

### Page Structure
This is a Jekyll page that can be customized with:
- **Front Matter:** YAML configuration at the top
- **Content:** Markdown or HTML content
- **Layouts:** Different page layouts available
- **Includes:** Reusable components

### Example Content
You can add content like:

\`\`\`markdown
## Section Title

This is a paragraph with **bold text** and *italic text*.

### Subsection
- List item 1
- List item 2
- List item 3

\`\`\`code\`\`\`
// Code example
console.log("Hello World");
\`\`\`

[Link to external site](https://example.com)

---
*This content was generated by the Live Editor system.*`;
  }

  htmlToMarkdown(html) {
    // Simple HTML to markdown conversion
    return html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  getCurrentPagePath() {
    const path = window.location.pathname;
    
    // Map common paths to file locations
    if (path === '/') return '_pages/home.html';
    if (path === '/about/') return '_pages/about.html';
    if (path === '/publications/') return '_pages/publications.html';
    if (path === '/blogs/') return '_pages/blogs.html';
    if (path === '/team/') return '_pages/team.html';
    if (path === '/research/') return '_pages/research.html';
    if (path === '/software/') return '_pages/software.html';
    if (path === '/privacy/') return '_pages/privacy.html';
    if (path === '/talks/') return '_pages/talks.html';
    if (path === '/teaching/') return '_pages/teaching.html';
    if (path === '/allnews/') return '_pages/allnews.html';
    
    // Handle other paths
    if (path.endsWith('/')) {
      const pageName = path.slice(1, -1);
      return `_pages/${pageName}.html`;
    }
    
    const pageName = path.slice(1);
    return `_pages/${pageName}.html`;
  }

  updateStatus(message) {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = message;
    }
  }

  setLoading(loading) {
    const saveBtn = document.getElementById('save-btn');
    const btnText = saveBtn.querySelector('.btn-text');
    const spinner = saveBtn.querySelector('.loading-spinner');
    
    if (loading) {
      btnText.style.display = 'none';
      spinner.style.display = 'inline-block';
      saveBtn.disabled = true;
    } else {
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
      saveBtn.disabled = false;
    }
  }

  async testGitHubToken() {
    const token = this.getGitHubToken();
    if (!token) {
      throw new Error('No GitHub token available');
    }
    
    try {
      console.log('Testing GitHub token...');
      
      // Test basic authentication
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`Token authentication failed: ${userResponse.status} ${userResponse.statusText} - ${errorText}`);
      }
      
      const userData = await userResponse.json();
      console.log('Token authenticated for user:', userData.login);
      
      // Test repository access
      const repoResponse = await fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!repoResponse.ok) {
        const errorText = await repoResponse.text();
        throw new Error(`Repository access failed: ${repoResponse.status} ${repoResponse.statusText} - ${errorText}`);
      }
      
      const repoData = await repoResponse.json();
      console.log('Repository access confirmed:', repoData.full_name);
      
      // Test master branch access
      const masterResponse = await fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io/git/ref/heads/master', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!masterResponse.ok) {
        const errorText = await masterResponse.text();
        throw new Error(`Master branch access failed: ${masterResponse.status} ${masterResponse.statusText} - ${errorText}`);
      }
      
      const masterData = await masterResponse.json();
      console.log('Master branch access confirmed:', masterData.ref);
      
      return {
        success: true,
        user: userData.login,
        repository: repoData.full_name,
        permissions: repoData.permissions,
        defaultBranch: 'master'
      };
    } catch (error) {
      console.error('GitHub token test failed:', error);
      throw error;
    }
  }
}

// Initialize live editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LiveEditor();
});