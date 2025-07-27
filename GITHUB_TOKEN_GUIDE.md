# 🔑 GitHub Token Setup Guide for Live Editor

This guide will walk you through creating a GitHub Personal Access Token that allows the live editor to create real pull requests.

## 📋 Prerequisites

- A GitHub account
- Access to your repository (`upgautamvt/upgautamvt.github.io`)
- Admin or write permissions to the repository

## 🚀 Step-by-Step Instructions

### Step 1: Go to GitHub Settings

1. **Log into GitHub** at [github.com](https://github.com)
2. **Click your profile picture** in the top-right corner
3. **Select "Settings"** from the dropdown menu

### Step 2: Navigate to Developer Settings

1. **Scroll down** in the left sidebar
2. **Click "Developer settings"** (near the bottom)
3. **Click "Personal access tokens"**
4. **Click "Tokens (classic)"**

### Step 3: Generate New Token

1. **Click "Generate new token"**
2. **Select "Generate new token (classic)"**
3. **Enter a descriptive name** like: `Live Editor - upgautamvt.github.io`

### Step 4: Set Token Expiration

1. **Choose expiration:**
   - **Recommended:** `90 days` (for security)
   - **Alternative:** `No expiration` (less secure but convenient)
   - **Note:** You can always regenerate the token

### Step 5: Select Permissions

**⚠️ IMPORTANT:** Only grant the minimum required permissions:

#### ✅ **Repository Permissions:**
- **Contents:** `Read and write` ✅
- **Metadata:** `Read-only` ✅
- **Pull requests:** `Read and write` ✅

#### ❌ **Do NOT enable:**
- Admin permissions
- Workflow permissions
- Package permissions
- Any other permissions

### Step 6: Generate Token

1. **Scroll to the bottom**
2. **Click "Generate token"**
3. **⚠️ IMPORTANT:** Copy the token immediately! You won't see it again.

### Step 7: Store Token Securely

**⚠️ SECURITY WARNING:** Never share this token or commit it to your repository!

**Recommended storage methods:**
- **Password manager** (1Password, LastPass, etc.)
- **Secure note app**
- **Encrypted file**

## 🔧 Using the Token in Live Editor

### Method 1: Enter Custom Token (Most Secure)

1. **Click "Edit Page"** on any page
2. **Enter password:** `984904`
3. **Enter custom GitHub token** in the optional field
4. **Click "Submit"**
5. **Edit and save** → Creates real pull request

### Method 2: Use Default Token (Convenient)

1. **Click "Edit Page"** on any page
2. **Enter password:** `984904`
3. **Leave GitHub token empty** → Uses built-in default token
4. **Edit and save** → Creates real pull request

**Note:** The live editor now always creates real pull requests - no simulation mode!

## 🧪 Testing the Live Editor

### Test 1: Basic Functionality
1. **Click "Edit Page"** on any page
2. **Enter password:** `984904`
3. **Leave token empty** (uses default)
4. **Make a small change**
5. **Save** → Should create real pull request

### Test 2: Custom Token (Optional)
1. **Generate your own token** (see steps above)
2. **Click "Edit Page"** on any page
3. **Enter password:** `984904`
4. **Enter your custom token**
5. **Make changes and save** → Creates pull request with your token

### Test 3: Verify Pull Request
1. **Check GitHub repository** → Pull requests tab
2. **Look for:** `Live Edit: Update [filename]`
3. **Review the changes** in the diff
4. **Merge if satisfied**

**Note:** The live editor now always creates real pull requests - no simulation mode!

## 🔒 Security Best Practices

### ✅ **Do:**
- Use token expiration (90 days recommended)
- Grant minimum required permissions
- Store token securely
- Rotate token regularly
- Monitor token usage

### ❌ **Don't:**
- Share token publicly
- Commit token to repository
- Use admin permissions
- Store token in plain text files
- Use token on public computers

## 🚨 Troubleshooting

### "Bad credentials" Error
- **Check:** Token is correct and not expired
- **Solution:** Generate new token

### "Not found" Error
- **Check:** Repository name is correct
- **Check:** Token has repository access
- **Solution:** Verify repository permissions

### "Forbidden" Error
- **Check:** Token has correct permissions
- **Check:** Repository is not private (if using public token)
- **Solution:** Regenerate token with correct permissions

## 📱 Token Management

### View Active Tokens
1. Go to **Settings → Developer settings → Personal access tokens**
2. See all active tokens and their expiration dates

### Revoke Token
1. Find the token in the list
2. Click **"Delete"**
3. Confirm deletion

### Regenerate Token
1. Delete old token
2. Follow steps above to create new token
3. Update stored token in live editor

## 🔄 Token Expiration

### Before Expiration
- GitHub will send email notification
- Token will show expiration date in settings
- Plan to regenerate before expiration

### After Expiration
- Live editor will fall back to simulation mode
- Generate new token to restore real PR creation
- Update stored token

## 📞 Support

If you encounter issues:

1. **Check this guide** for troubleshooting steps
2. **Verify token permissions** are correct
3. **Test token** with curl commands above
4. **Generate new token** if needed

## 🎯 Quick Reference

| Step | Action | Details |
|------|--------|---------|
| 1 | Go to Settings | Profile → Settings |
| 2 | Developer Settings | Developer settings → Personal access tokens |
| 3 | Generate Token | Generate new token (classic) |
| 4 | Set Expiration | 90 days recommended |
| 5 | Set Permissions | Contents: Read/write, PRs: Read/write |
| 6 | Copy Token | Save immediately |
| 7 | Use in Editor | Enter in password modal |

---

**🎉 You're all set!** Your live editor can now create real pull requests with your GitHub token. 