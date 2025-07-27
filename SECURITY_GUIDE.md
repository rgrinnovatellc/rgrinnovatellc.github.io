# 🔒 Security Guide: GitHub Tokens & Secrets

## 🚨 **CRITICAL: Never Hardcode Tokens!**

This guide explains how to properly manage GitHub tokens and secrets to avoid security breaches.

## ❌ **What NOT to Do**

- ❌ **Never commit tokens to Git**
- ❌ **Never hardcode tokens in files**
- ❌ **Never share tokens publicly**
- ❌ **Never use tokens in client-side code**

## ✅ **What TO Do**

- ✅ **Use GitHub Secrets for workflows**
- ✅ **Use environment variables for local development**
- ✅ **Use placeholder values in documentation**
- ✅ **Rotate tokens regularly**

## 🔧 **Setting Up GitHub Secrets**

### Step 1: Generate a Personal Access Token

1. Go to **GitHub Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set **expiration** (recommended: 90 days)
4. Select **scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Add Token to GitHub Secrets

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. **Name:** `GITHUB_TOKEN_CUSTOM`
6. **Value:** Paste your token
7. Click **"Add secret"**

### Step 3: Update Workflow Files

Your workflow files should use secrets like this:

```yaml
# .github/workflows/jekyll.yml
name: Jekyll site CI

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 3.2
        bundler-cache: true
    
    - name: Build site
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN_CUSTOM }}
      run: |
        bundle exec jekyll build
```

## 🏠 **Local Development Setup**

### Option 1: Environment Variable (Recommended)

```bash
# Set token for current session
export GITHUB_TOKEN="your_actual_token_here"

# Start Jekyll
bundle exec jekyll serve
```

### Option 2: .env File (Never commit this!)

Create a `.env` file (add to `.gitignore`):

```bash
# .env (add to .gitignore!)
GITHUB_TOKEN=your_actual_token_here
```

Load it in your shell:
```bash
source .env
bundle exec jekyll serve
```

### Option 3: Jekyll Configuration (Use environment variable)

In `_config.yml`:
```yaml
# Use environment variable, never hardcode!
github_token: <%= ENV['GITHUB_TOKEN'] %>
```

## 🔄 **Token Rotation**

### When to Rotate Tokens

- 🔄 **Every 90 days** (recommended)
- 🔄 **After security incidents**
- 🔄 **When team members leave**
- 🔄 **When permissions change**

### How to Rotate

1. **Generate new token** (see Step 1 above)
2. **Update GitHub Secret** with new token
3. **Update local environment** if needed
4. **Revoke old token** in GitHub settings
5. **Test everything works**

## 🛡️ **Security Best Practices**

### 1. **Principle of Least Privilege**
- Only grant tokens the minimum permissions needed
- Use different tokens for different purposes
- Regularly review token permissions

### 2. **Secure Storage**
- Store tokens in GitHub Secrets (not in code)
- Use environment variables locally
- Never commit tokens to version control

### 3. **Monitoring & Auditing**
- Monitor token usage in GitHub settings
- Set up alerts for unusual activity
- Regularly audit token permissions

### 4. **Documentation**
- Use placeholders in documentation
- Document token requirements clearly
- Keep security guides updated

## 🚨 **Emergency Response**

### If Token is Compromised

1. **Immediately revoke the token** in GitHub settings
2. **Generate a new token** with same permissions
3. **Update all systems** using the old token
4. **Review access logs** for suspicious activity
5. **Update documentation** if needed

### If Token is Found in Git History

1. **Revoke the token immediately**
2. **Use BFG Repo-Cleaner or git filter-branch** to remove from history
3. **Force push** the cleaned history
4. **Generate new token**
5. **Update all systems**

## 📋 **Checklist**

- [ ] No hardcoded tokens in code
- [ ] Tokens stored in GitHub Secrets
- [ ] Environment variables used locally
- [ ] Token permissions minimized
- [ ] Token expiration set
- [ ] Documentation uses placeholders
- [ ] Regular token rotation scheduled
- [ ] Security monitoring enabled

## 🔗 **Useful Links**

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Security Best Practices](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)

---

**Remember: Security is everyone's responsibility!** 🔒 