# 🔍 GitHub Token Debug Guide

## 🚨 Error: "Failed to get main branch"

This error indicates that the GitHub API call is failing. Let's troubleshoot step by step.

## 🔧 Step-by-Step Debugging

### 1️⃣ **Check Browser Console**
1. **Open browser console** (F12)
2. **Click "Edit Page"** on any page
3. **Enter password:** `984904`
4. **Try to save changes**
5. **Look for error messages** in the console

### 2️⃣ **Test GitHub Token Manually**

Open browser console and run this test:

```javascript
// Test the default token
const token = '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';

// Test 1: Basic authentication
fetch('https://api.github.com/user', {
  headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(response => response.json())
.then(data => console.log('User:', data))
.catch(error => console.error('Auth error:', error));

// Test 2: Repository access
fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io', {
  headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(response => response.json())
.then(data => console.log('Repo:', data))
.catch(error => console.error('Repo error:', error));

// Test 3: Master branch access
fetch('https://api.github.com/repos/upgautamvt/upgautamvt.github.io/git/ref/heads/master', {
  headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json'
  }
})
.then(response => response.json())
.then(data => console.log('Master branch:', data))
.catch(error => console.error('Branch error:', error));
```

### 3️⃣ **Common Issues & Solutions**

#### ❌ **Issue: 401 Unauthorized**
- **Cause:** Token is invalid or expired
- **Solution:** Generate new token with correct permissions

#### ❌ **Issue: 403 Forbidden**
- **Cause:** Token doesn't have required permissions
- **Solution:** Ensure token has:
  - ✅ **Contents:** `Read and write`
  - ✅ **Metadata:** `Read-only`
  - ✅ **Pull requests:** `Read and write`

#### ❌ **Issue: 404 Not Found**
- **Cause:** Repository doesn't exist or token can't access it
- **Solution:** Check repository name and token permissions

#### ❌ **Issue: CORS Error**
- **Cause:** Browser blocking cross-origin requests
- **Solution:** This shouldn't happen with GitHub API

### 4️⃣ **Quick Fix: Generate New Token**

If the default token isn't working:

1. **Go to GitHub Settings**
2. **Developer settings → Personal access tokens → Tokens (classic)**
3. **Generate new token**
4. **Set permissions:**
   - ✅ **Contents:** `Read and write`
   - ✅ **Metadata:** `Read-only`
   - ✅ **Pull requests:** `Read and write`
5. **Copy the new token**
6. **Use it in the live editor**

### 5️⃣ **Alternative: Use Your Own Token**

1. **Generate your own token** (see above)
2. **Click "Edit Page"**
3. **Enter password:** `984904`
4. **Enter your custom token**
5. **Try saving changes**

## 🧪 Manual Testing

### Test Token Permissions:
```bash
# Test with curl (if you have it)
curl -H "Authorization: token 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" \
     https://api.github.com/user

curl -H "Authorization: token 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" \
     https://api.github.com/repos/upgautamvt/upgautamvt.github.io
```

## 📞 Get Help

If you're still having issues:

1. **Check the console output** for specific error messages
2. **Try generating a new token** with the correct permissions
3. **Verify the repository exists** and is accessible
4. **Check if the token has the right scope** for the repository

## 🔒 Security Note

The default token provided should work, but if it doesn't:
- It might be expired
- It might not have the right permissions
- It might be rate-limited

**Generate your own token for the most reliable experience!**