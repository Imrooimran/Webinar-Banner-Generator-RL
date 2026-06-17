# Troubleshooting Guide: Figma Banner Auto-Generator

## Common Issues & Solutions

### 🔴 "Create in Figma" Section Not Showing

**Problem**: The "✨ Create in Figma" section doesn't appear

**Causes & Solutions**:
1. **Not selected "Nav banner" placement**
   - ✅ Click the "Nav banner" button in the Placement section
   - The Figma section should appear below the video section

2. **Browser cache issue**
   - ✅ Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - ✅ Clear browser cache for localhost/your domain

3. **JavaScript error**
   - ✅ Open browser dev tools: `F12`
   - ✅ Check Console tab for red errors
   - ✅ Report error message to support

---

### 🔴 "Missing required fields: Title, Date, Time, or CTA"

**Problem**: Button is clicked but error appears

**Solutions**:
- ✅ Fill ALL required fields:
  - [ ] Event Title (not empty)
  - [ ] Date (e.g., "29th April, 2026")
  - [ ] Time (e.g., "2:00 PM EST")
  - [ ] CTA (e.g., "Save your spot")
- ✅ Speaker photo is optional (but recommended)
- ✅ Check fields don't have leading/trailing spaces

---

### 🔴 "Image upload not configured"

**Problem**: Error appears when creating banner

**Causes & Solutions**:

1. **Cloudinary not set up**
   - ✅ Follow QUICK_START_FIGMA.md Step 1-3
   - ✅ Create Cloudinary account
   - ✅ Create upload preset `webinar_banners`
   - ✅ Add to vercel.json

2. **Wrong cloud name**
   - ✅ Check your Cloudinary dashboard
   - ✅ Copy exact cloud name (e.g., `d1234567890`)
   - ✅ Update in vercel.json:
     ```json
     "CLOUDINARY_CLOUD_NAME": "your_actual_cloud_name"
     ```

3. **Upload preset doesn't exist**
   - ✅ Log into Cloudinary dashboard
   - ✅ Settings → Upload → Find "webinar_banners" preset
   - ✅ If missing, create it:
     - Name: `webinar_banners`
     - Signing Mode: **Unsigned**
     - Click Save

4. **Running locally?**
   - ✅ Make sure `npx vercel dev` is running
   - ✅ Environment variables load from vercel.json when using `vercel dev`
   - ✅ Or manually add to your code:
     ```javascript
     window.CLOUDINARY_CLOUD_NAME='your_cloud_name_here';
     ```

---

### 🔴 "Failed to copy template"

**Problem**: Figma file copy fails

**Causes & Solutions**:

1. **Figma token missing or invalid**
   - ✅ Check vercel.json has `FIGMA_TOKEN`
   - ✅ Verify token is valid: https://figma.com/account/tokens
   - ✅ Re-generate token if needed
   - ✅ Update vercel.json with new token
   - ✅ Redeploy: `vercel`

2. **Template file ID is wrong**
   - ✅ Should be: `I1vDFEvLzUgdHWvWKnzUoh`
   - ✅ Check vercel.json has correct ID
   - ✅ Don't modify this value

3. **Template file was deleted**
   - ✅ Check your Figma account: https://www.figma.com/design/I1vDFEvLzUgdHWvWKnzUoh/RL-design-assets
   - ✅ If missing, contact admin to restore

4. **Figma API rate limit**
   - ✅ Wait a few seconds
   - ✅ Try again
   - ✅ Figma allows 100 requests/sec per token

---

### 🔴 "Failed to update text" or Text doesn't change in Figma

**Problem**: Banner is created but text isn't updated

**Causes & Solutions**:

1. **Template layer names changed**
   - ✅ Check Figma template layer names match:
     - `Event Title` (not "Title" or "event-title")
     - `Event Date` (not "Date" or "date")
     - `CTA Button Text` (not "Button" or "CTA")
   - ✅ Don't rename these layers in Figma

2. **Template was modified**
   - ✅ Don't edit the original template!
   - ✅ Only edit copies created by the tool
   - ✅ If template is broken, restore from backup

3. **Layer IDs don't match**
   - ✅ This is rare but can happen if Figma structure changed
   - ✅ Contact admin to verify template structure

---

### 🔴 "Speaker photo not updating" or Image is missing

**Problem**: Banner creates but speaker photo doesn't appear

**Causes & Solutions**:

1. **Speaker photo upload failed**
   - ✅ Check browser console (F12)
   - ✅ Look for Cloudinary errors
   - ✅ Try with a smaller image (<5MB)
   - ✅ Verify image format: JPG, PNG, or WebP

2. **Cloudinary upload preset not unsigned**
   - ✅ Open Cloudinary dashboard
   - ✅ Settings → Upload → webinar_banners preset
   - ✅ Check "Signing Mode" = "Unsigned"
   - ✅ Save and try again

3. **Image URL not valid**
   - ✅ Check if Cloudinary URL is reachable
   - ✅ In browser, try opening the URL directly
   - ✅ Should show the image

---

### 🔴 "Cloudinary upload failed: Error 400"

**Problem**: Cloudinary rejects the upload

**Causes & Solutions**:

1. **Upload preset not found**
   - ✅ Verify preset name is exactly `webinar_banners`
   - ✅ Check it's set as "Unsigned"

2. **File too large**
   - ✅ Resize image to < 5MB
   - ✅ Optimize image (use TinyPNG before upload)

3. **Wrong file type**
   - ✅ Only JPG, PNG, WebP allowed
   - ✅ Don't try animated GIF

4. **Cloudinary account issue**
   - ✅ Check account is active (not suspended)
   - ✅ Verify you haven't exceeded quota (25GB/month)

---

### 🔴 "Figma link not appearing" or blank link

**Problem**: Success message shows but no clickable link

**Causes & Solutions**:

1. **Backend returned error**
   - ✅ Check browser console (F12) Network tab
   - ✅ Look for response from `/api/create-figma-banner`
   - ✅ Check error message in response

2. **API endpoint not deployed**
   - ✅ Make sure you ran `vercel` to deploy
   - ✅ Check Vercel dashboard that function exists
   - ✅ Try redeploying: `vercel --prod`

3. **CORS issue**
   - ✅ Check browser console for CORS error
   - ✅ api/create-figma-banner.js has CORS headers
   - ✅ Should not be blocked

---

### 🟡 Slow response (10+ seconds)

**Problem**: Creation takes too long

**This is normal!** First time takes 3-5s, but:
- Image upload: 1-2s
- Figma copy: 1-2s
- Text updates: 1s
- Total: 3-5s

**If it's much slower:**
- ✅ Check internet connection
- ✅ Check Vercel function logs
- ✅ Cloudinary upload might be slow (try again)

---

### 🟡 Figma link opens but banner looks wrong

**Problem**: File created but layout/text is misaligned

**Causes & Solutions**:

1. **Text is truncated**
   - ✅ This is a Figma template design issue
   - ✅ Manually fix in Figma (one-time fix)
   - ✅ Make sure text boxes are large enough

2. **Photo doesn't fit**
   - ✅ Check speaker photo aspect ratio
   - ✅ Should be square or close to square
   - ✅ Figma will crop to 100x100px

3. **Font isn't applied**
   - ✅ Check template uses correct fonts
   - ✅ Should be: Geist (title, date), SF Pro (button)
   - ✅ Figma might substitute if font isn't installed

4. **Colors are different**
   - ✅ This is expected - template has specific colors
   - ✅ Don't worry, layout and content are correct

---

## 🔧 Debug Checklist

If something isn't working, check these in order:

1. **Browser Console (F12)**
   - [ ] Any red errors?
   - [ ] Any warning messages?
   - [ ] Copy full error message

2. **Network Tab (F12)**
   - [ ] Check `/api/create-figma-banner` request
   - [ ] Is status 200 (success)?
   - [ ] Look at response JSON
   - [ ] Any error messages in response?

3. **Environment Variables**
   - [ ] vercel.json has all required variables?
   - [ ] `vercel env ls` to list them
   - [ ] Try `vercel dev` locally to test

4. **Cloudinary**
   - [ ] Account active?
   - [ ] Upload preset exists?
   - [ ] Preset is "Unsigned"?
   - [ ] Cloud name correct?

5. **Figma**
   - [ ] Token valid? https://figma.com/account/tokens
   - [ ] Template file accessible?
   - [ ] Template layers not renamed?

---

## 📝 Getting Help

1. **Check these docs first**:
   - QUICK_START_FIGMA.md
   - FIGMA_SETUP_GUIDE.md
   - IMPLEMENTATION_SUMMARY.md

2. **Gather information**:
   - [ ] Screenshot of error
   - [ ] Browser console error (F12)
   - [ ] Full request/response JSON
   - [ ] Environment variables (hide sensitive data)

3. **Contact support with**:
   - Error message
   - Steps to reproduce
   - Environment setup

---

## 🆘 Emergency Fallback

If Figma auto-generation isn't working:

1. **Use traditional export**:
   - Create banner in generator
   - Click "Download SVG" (Nav banner section)
   - Manually import to Figma
   - Done (but requires manual editing)

2. **Contact Imran**:
   - Email: imran@rocketlane.com
   - Include error details from console
   - Include vercel deployment logs

---

**Remember**: Most issues are environment configuration (Cloudinary + Vercel). If env vars are set correctly, the feature works! ✅

