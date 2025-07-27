# 🔧 GitHub API Setup for Live Editor

To enable real GitHub integration for the live editor, you need to set up a GitHub Personal Access Token.

## 📋 Prerequisites

1. **GitHub Account** - You need a GitHub account with access to the repository
2. **Repository Access** - Write access to `upgautamvt/upgautamvt.github.io`

## 🔑 Creating a GitHub Personal Access Token

### Step 1: Go to GitHub Settings
1. Log in to GitHub
2. Click your profile picture → **Settings**
3. Scroll down to **Developer settings** (bottom left)
4. Click **Personal access tokens** → **Tokens (classic)**

### Step 2: Generate New Token
1. Click **Generate new token** → **Generate new token (classic)**
2. Give it a descriptive name: `Live Editor - Jekyll Site`
3. Set expiration: Choose an appropriate duration (e.g., 90 days)

### Step 3: Select Permissions
Enable the following permissions:
- ✅ **repo** (Full control of private repositories)
  - This includes: `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
- ✅ **workflow** (Update GitHub Action workflows)

### Step 4: Generate Token
1. Click **Generate token**
2. **Copy the token immediately** (you won't see it again!)

## ⚙️ Configuration

### Option 1: Environment Variable (Recommended)
Set the token as an environment variable:

```bash
export GITHUB_TOKEN="your_token_here"
```

### Option 2: Jekyll Configuration
Add the token to `_config.yml`:

```yaml
# GitHub API Configuration for Live Editor
website_token: "your_token_here"
github_repo: "upgautamvt/upgautamvt.github.io"
```

⚠️ **Security Warning**: Don't commit the token to version control!

## 🚀 Testing the Setup

1. **Start Jekyll server** with the token:
   ```bash
   WEBSITE_TOKEN="your_token_here" bundle exec jekyll serve
   ```

2. **Check the console output**:
   - ✅ `GitHub API initialized with token` = Success
- ⚠️ `WEBSITE_TOKEN not set. Live editor will use simulation mode.` = Token not configured

3. **Test the live editor**:
   - Go to any page on your site
   - Click "Edit Page" button
   - Enter password: `984904`
   - Make changes and save
   - Check if a real pull request is created

## 🔄 How It Works

When you save changes in the live editor:

1. **Creates a new branch** with name like `live-edit-1234567890`
2. **Updates the file** in that branch with your changes
3. **Creates a pull request** from the new branch to `main`
4. **Provides feedback** with the pull request URL

## 🛠️ Troubleshooting

### Token Not Working
- ✅ Check if token has correct permissions
- ✅ Verify token hasn't expired
- ✅ Ensure token is properly set in environment/config
- ✅ Check Jekyll console for error messages

### Permission Denied
- ✅ Verify you have write access to the repository
- ✅ Check if token has `repo` permissions
- ✅ Ensure repository exists and is accessible

### API Rate Limits
- GitHub has rate limits for API calls
- Personal tokens: 5,000 requests per hour
- If you hit limits, wait and try again

## 🔒 Security Best Practices

1. **Use Environment Variables** instead of config files
2. **Set Token Expiration** to reasonable timeframes
3. **Limit Token Permissions** to only what's needed
4. **Rotate Tokens** regularly
5. **Monitor Token Usage** in GitHub settings

## 📝 Example Workflow

```bash
# Set token and start server
export WEBSITE_TOKEN="ghp_your_token_here"
bundle exec jekyll serve

# In browser:
# 1. Go to your site
# 2. Click "Edit Page"
# 3. Enter password: 984904
# 4. Make changes
# 5. Save → Creates real pull request
# 6. Review and merge on GitHub
```

## 🎯 Success Indicators

- ✅ Jekyll console shows: `GitHub API initialized with token`
- ✅ Live editor creates real pull requests
- ✅ Pull requests appear in GitHub repository
- ✅ Changes are properly tracked in Git history

---

**Need Help?** Check the GitHub API documentation or create an issue in the repository. 