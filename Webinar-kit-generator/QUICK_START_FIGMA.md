# Quick Start: Figma Banner Auto-Generator

Get the feature working in **5 minutes**.

## ✅ Checklist

### 1. Create Cloudinary Account (Free Tier)
- [ ] Sign up: https://cloudinary.com/users/register/free
- [ ] Note your **Cloud Name** (e.g., `d1234567890`)

### 2. Create Upload Preset
- [ ] Log in to Cloudinary Dashboard
- [ ] Settings → Upload → Add upload preset
- [ ] Name: `webinar_banners`
- [ ] Signing Mode: **Unsigned**
- [ ] Save

### 3. Update Vercel Environment
- [ ] Go to: https://vercel.com/dashboard
- [ ] Select your project
- [ ] Settings → Environment Variables
- [ ] Add:
  ```
  CLOUDINARY_CLOUD_NAME = your_cloud_name_here
  CLOUDINARY_PRESET = webinar_banners
  ```
- [ ] Save & Redeploy

### 4. Update HTML (if running locally)
Edit `webinar-banner-generator.html` line ~1260:
```javascript
window.CLOUDINARY_CLOUD_NAME='your_cloud_name_here';
```

### 5. Test Locally
```bash
cd /Users/admin/Downloads/Webinar-kit-generator
npx vercel dev
```

Visit `http://localhost:3000`

### 6. Test in App
- [ ] Fill webinar form (Title, Date, Time, CTA, Speaker photo)
- [ ] Click **"Nav banner"** placement
- [ ] See **"✨ Create in Figma"** section
- [ ] Click **"🚀 Create Figma Banner"**
- [ ] Confirm Figma link appears
- [ ] Click link to view generated banner in Figma

## 🎯 Expected Result

✓ New Figma file created automatically  
✓ Banner text updated (title, date, time, CTA)  
✓ Speaker photo inserted  
✓ Ready to share with design agency  
✓ Zero manual Figma editing  

## 🚀 Deploy to Production

```bash
vercel
```

That's it! The feature is live.

## 📞 Need Help?

See `FIGMA_SETUP_GUIDE.md` for detailed troubleshooting.

---

**Current Setup Status:**
- ✅ Figma API endpoint created: `/api/create-figma-banner.js`
- ✅ UI button added to form
- ✅ JavaScript handlers implemented
- ⏳ Cloudinary config needed (your action)
- ⏳ Deploy to Vercel (your action)
