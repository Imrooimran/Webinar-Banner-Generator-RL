# Figma Banner Auto-Generator Setup Guide

This guide walks you through setting up the automatic Figma banner creation feature.

## Step 1: Cloudinary Setup (Free Tier - 25 GB/month)

1. **Create a Cloudinary account**: https://cloudinary.com/users/register/free
2. **Get your Cloud Name**:
   - Log in to your Cloudinary dashboard
   - Look for "Cloud Name" in the top-left or account settings
   - It looks like: `d1234567890`

3. **Create an unsigned upload preset** (for public image uploads):
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Name it: `webinar_banners`
   - Set "Signing Mode" to "Unsigned"
   - Leave all other settings as default
   - Click "Save"

4. **Add to your environment**:
   - In `vercel.json`, add:
   ```json
   "env": {
     "FIGMA_TOKEN": "@figma_token",
     "FIGMA_FILE_ID": "I1vDFEvLzUgdHWvWKnzUoh",
     "CLOUDINARY_CLOUD_NAME": "your_cloud_name_here",
     "CLOUDINARY_PRESET": "webinar_banners"
   }
   ```

## Step 2: Update HTML Configuration

In `webinar-banner-generator.html`, find this line (search for `YOUR_CLOUDINARY_CLOUD_NAME`):

```javascript
const cloudName='YOUR_CLOUDINARY_CLOUD_NAME';
```

Replace with your actual Cloudinary cloud name:

```javascript
const cloudName='your_cloud_name_here'; // e.g., 'd1234567890'
```

Or better yet, use environment variable:
```javascript
const cloudName=window.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUDINARY_CLOUD_NAME';
```

## Step 3: Verify Figma Template Setup

Your template is already configured at:
- **File**: RL-design-assets
- **File ID**: `I1vDFEvLzUgdHWvWKnzUoh`
- **Frame**: NavBanner (node-id: 35272-7721)

**Template layer names (DO NOT CHANGE):**
```
Event Title       → Updates with webinar title
Event Date        → Updates with date (e.g., "29th April, 2026")
CTA Button Text   → Updates with CTA (e.g., "Save your spot")
Speaker Photo     → Updates with speaker image
```

## Step 4: Test the Feature

1. **Start the app locally**:
   ```bash
   cd /Users/admin/Downloads/Webinar-kit-generator
   npx vercel dev
   ```

2. **In the web app**:
   - Fill in webinar details (Title, Date, Time, CTA)
   - Upload a speaker photo
   - Click "Nav banner" placement
   - You should see the **"✨ Create in Figma"** section
   - Click **"🚀 Create Figma Banner"**
   - Wait for success message
   - Click **"🔗 Open in Figma"** to view the generated banner

3. **Expected result**: A new file in your Figma account with the banner ready to use

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Missing Figma credentials"** | Make sure `FIGMA_TOKEN` and `FIGMA_FILE_ID` are set in `vercel.json` |
| **"Failed to copy template"** | Verify the template file ID is correct: `I1vDFEvLzUgdHWvWKnzUoh` |
| **"Cloudinary upload failed"** | Check your Cloud Name is correct and upload preset exists |
| **No "Create Figma" button showing** | Make sure you selected **"Nav banner"** placement |
| **Text doesn't update** | Verify template layer names haven't changed in Figma |

## Environment Variables Checklist

```env
FIGMA_TOKEN=<your-figma-personal-token>
FIGMA_FILE_ID=I1vDFEvLzUgdHWvWKnzUoh
FIGMA_TEAM_ID=<optional-for-team-files>
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_PRESET=webinar_banners
```

## How It Works

1. **User fills form** → Selects Nav Banner placement
2. **Clicks "Create Figma Banner"** → Triggers the workflow
3. **Images uploaded** → Speaker photos → Cloudinary CDN
4. **Figma file copied** → Template copied to new unique file
5. **Content updated** → Text layers + speaker photo updated via API
6. **Link returned** → User gets direct Figma link to share with agency

No manual Figma editing needed! 🚀

## Security Notes

- Cloudinary unsigned upload preset is safe for marketing images
- Speaker photos are public (stored on CDN)
- Figma link is shareable but requires Figma account access to edit
- All data flows through secure HTTPS

## Next Steps

- [ ] Create Cloudinary account
- [ ] Get Cloud Name
- [ ] Create unsigned upload preset
- [ ] Update `vercel.json` with credentials
- [ ] Update HTML with Cloud Name
- [ ] Deploy to Vercel: `vercel`
- [ ] Test locally: `npx vercel dev`
