# Vercel Deployment Protection - Bypass Setup

## 🎯 Quick Solution for Testing

Based on your Vercel settings page, you have **two options**:

---

## Option 1: Disable Vercel Authentication (Easiest for Testing)

**If you see a toggle switch for "Vercel Authentication":**

1. **Turn OFF** the toggle for "Vercel Authentication"
2. Click **Save**
3. Wait 1-2 minutes
4. Test: `curl https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/`

This will make your preview deployments publicly accessible (good for testing).

---

## Option 2: Use Protection Bypass for Automation (Recommended)

This allows automation (like our health checks) to access protected deployments.

### Steps:

1. **In the "Protection Bypass for Automation" section:**
   - Click **"Add a secret"** or similar button
   - Vercel will generate a bypass token for you
   - Copy the generated secret value

2. **Use the bypass token in health checks:**

```powershell
# Set your bypass token
$bypassToken = "your-generated-token-here"

# Test with bypass token (Query Parameter method)
Invoke-WebRequest -Uri "https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/?x-vercel-protection-bypass=$bypassToken"

# OR Test with bypass token (Header method)
$headers = @{
    "x-vercel-protection-bypass" = $bypassToken
}
Invoke-WebRequest -Uri "https://frontend-azexz908h-brandons-projects-7c6e25ca.vercel.app/" -Headers $headers
```

3. **Update test script:**

Once you have the token, I can update `test-deployment.ps1` to use it automatically.

---

## Option 3: OPTIONS Allowlist (For CORS)

If you're getting CORS errors specifically:

1. In **"OPTIONS Allowlist"** section
2. Add paths like:
   - `/api/*`
   - `/`
3. Click **Save**

This allows CORS preflight requests to bypass protection.

---

## 🎯 Recommended Approach

**For Development/Testing:**
- Use **Option 1** (Disable Vercel Authentication)
- Makes testing much easier
- Can re-enable before production launch

**For Production with CI/CD:**
- Use **Option 2** (Protection Bypass for Automation)
- Keeps deployments protected
- Allows automated testing with the bypass token

---

## 📝 After You Choose

Let me know which option you choose:

1. **If you disabled authentication:** 
   - Wait 2 minutes
   - Run: `.\test-deployment.ps1`
   - Should see green checkmarks!

2. **If you created bypass token:**
   - Share the token with me
   - I'll update the test script to use it
   - Run: `.\test-deployment.ps1`

---

## 🔐 Security Note

**Vercel Authentication** protects your preview deployments from public access. It's fine to disable for testing, but consider re-enabling when:
- You have sensitive data
- You're ready for production
- You want to control who sees previews

For now (testing phase), disabling is totally fine! 👍
