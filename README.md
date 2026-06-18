# Webinar Banner Generator

A powerful tool to create professional webinar banners with automatic Google Sheets sync for CMS integration.

## Features

✨ **Banner Types**
- Square (1080×1080)
- Landscape (1920×1080)
- Post-Event (1920×1080)
- Exit Popup (1440×900)
- Zuddle (1440×1440)
- Nav Banner (1440×134)
- Email (733×98)
- Video (1920×1080)

🎯 **Smart CMS Integration**
- Unique Nav Banner IDs for tracking
- Auto-sync to Google Sheets on download
- Copy Nav Banner ID to clipboard
- Version history in spreadsheet
- Speaker names & image URLs tracked

📊 **Customization**
- Multiple languages (EN, DE, FR, ES, PT, JA)
- Custom backgrounds & gradients
- Speaker photos & info
- Custom CTA buttons
- Partner logos
- Date, time, and event info

💾 **Export Options**
- PNG export (high quality)
- Batch download all formats
- Automatic Google Sheets logging

## Getting Started

1. Open the app
2. Configure banner settings:
   - Title & Subtitle
   - Date & Time
   - Speaker info
   - Background colors
   - CTA button text
3. Select banner type (nav banner recommended for CMS)
4. Click **"Copy ID"** to:
   - Copy Nav Banner ID to clipboard
   - Sync data to Google Sheets
5. Or click **"Download PNG"** to download the banner

## CMS Integration

The Nav Banner ID is a unique identifier for each banner configuration:
- Format: `NAV-ABC1234-DEFGH`
- Automatically logged in Google Sheets
- Tracks: Title, Subtitle, Date, Time, Speaker Names, Images
- Use in your CMS to reference banner configurations

## Google Sheets Tracking

All banner details are automatically logged when you:
- Click "**Copy Nav Banner ID**"
- Click "**Download PNG**"
- Click "**Download All**"

Columns tracked:
- Nav Banner ID
- Image 1 (Speaker 1)
- Image 2 (Speaker 2)
- Title
- Subtitle
- Date
- Time
- Button Text

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Technical Details

- Pure HTML5, CSS3, JavaScript
- Google Apps Script integration (for Sheets sync)
- Canvas API for PNG rendering
- No backend required
- Self-contained single file

## Support

For issues or feature requests, contact the development team.

---

**Deploy on Vercel:** https://webinar-banner-generator.vercel.app
