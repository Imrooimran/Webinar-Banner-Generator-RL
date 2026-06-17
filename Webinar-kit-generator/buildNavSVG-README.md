# buildNavSVG() - Dynamic Nav Banner Generator

## Overview

`buildNavSVG()` is a JavaScript function that generates dynamic, responsive webinar nav banners by overlaying dynamic content on a Figma SVG template. It handles:

- **Dynamic text rendering** with auto-wrapping for titles
- **Responsive layouts** based on speaker count (1-2 vs 3-4 speakers)
- **Speaker photo management** (shown for 1-2 speakers, hidden for 3+)
- **Date/time display** with positioning optimized for banner width
- **CTA button** with branded styling

## Files

- **`buildNavSVG.js`** - Core function implementation (CommonJS + browser compatible)
- **`buildNavSVG.test.js`** - Node.js test suite with 6 test cases
- **`buildNavSVG-demo.html`** - Interactive HTML demo with live preview
- **`Property 1=Default.svg`** - Figma template (1440×134px background/design elements)

## Function Signature

```javascript
function buildNavSVG(S) {
  // Returns SVG string (1440×134px)
}
```

## State Object (S) Parameters

### Required/Common
```javascript
{
  title: "string",           // Webinar title (auto-wraps to 2 lines)
  date: "string",            // Date (e.g., "Jun 15")
  time: "string",            // Time (e.g., "2:00 PM EST")
  buttonText: "string",      // CTA button text (default: "Register now!")
  speakers: [                // Speaker array (controls layout)
    {
      name: "string",
      photo: "string",       // URL to speaker photo
      imageUrl: "string",    // Alternative photo URL field
      url: "string"          // Alternative photo URL field
    }
  ]
}
```

### Optional
```javascript
{
  bgPattern: "string"        // Custom SVG pattern defs (HTML-encoded)
}
```

## Key Features

### 1. **Layout Variants**

#### 1-2 Speakers (Photo Shown)
- Speaker photo displayed at position (109.5, 17) with size 100×100px
- Title starts at x=220 with max-width of 900px
- Photo creates visual anchor on left side

```javascript
buildNavSVG({
  title: "Webinar Title",
  speakers: [
    { name: "John Doe", photo: "https://..." }
  ]
})
```

#### 3-4 Speakers (Photo Hidden)
- Photo element completely hidden
- Title expands to x=150 with max-width of 950px
- More horizontal space for longer titles

```javascript
buildNavSVG({
  title: "Very Long Webinar Title",
  speakers: [
    { name: "Speaker 1", photo: "..." },
    { name: "Speaker 2", photo: "..." },
    { name: "Speaker 3", photo: "..." }
  ]
})
```

### 2. **Text Wrapping**

Titles automatically wrap to 2 lines:
- Estimated ~22-25 characters per line (depending on font metrics)
- Text longer than 2 lines gets truncated with ellipsis (`...`)
- Formula: `charsPerLine = floor(maxWidth / (fontSize * 0.5))`

Example:
```
Input:  "This is a very long webinar title that should..."
Output: Line 1: "This is a very long webinar title..."
        Line 2: "that should..." (truncated with ellipsis)
```

### 3. **Responsive Positioning**

All element positions scale relative to canvas (1440×134):
- **Webinar pill**: (302.7, 28.5) - branded label
- **Button**: (1182.4, 46.4) - CTA with arrow icon
- **Date/Time**: Right-aligned before button (1142.4, 38-54)
- **Divider**: Vertical line at x=832.8
- **Speaker photo**: (109.5, 17) - rounded clip-path

### 4. **SVG Structure**

```svg
<svg width="1440" height="134" viewBox="0 0 1440 134">
  <defs>
    <!-- Gradients, patterns, clip-paths -->
  </defs>
  
  <!-- Background -->
  <rect fill="url(#bgGradient)" />
  
  <!-- Speaker photo (conditional) -->
  <g clip-path="url(#speakerPhotoClip)">
    <image href="..." />
  </g>
  
  <!-- Webinar pill badge -->
  <rect ... />
  <text>WEBINAR</text>
  
  <!-- Dynamic title (2 lines) -->
  <text>Line 1</text>
  <text>Line 2</text>
  
  <!-- Date/Time (right-aligned) -->
  <text>Jun 15</text>
  <text>2:00 PM EST</text>
  
  <!-- CTA Button -->
  <rect ... />
  <text>Register now!</text>
  <circle fill="#0F62FE" />
  <text>→</text>
  
  <!-- Divider line -->
  <line ... />
</svg>
```

## Usage Examples

### Example 1: Simple Usage with Defaults

```javascript
const svg = buildNavSVG({
  title: "My Webinar Title"
});

// Output: Full SVG string with defaults:
// - Date: "Jun 15"
// - Time: "2:00 PM EST"
// - Button: "Register now!"
// - No speaker photo (no speakers provided)
```

### Example 2: With Speaker Photo

```javascript
const svg = buildNavSVG({
  title: "Advanced React Workshop",
  date: "Jun 22",
  time: "3:00 PM EST",
  buttonText: "Join Now",
  speakers: [
    {
      name: "Sarah Chen",
      photo: "https://example.com/sarah.jpg"
    }
  ]
});
```

### Example 3: Multiple Speakers (Photo Hidden)

```javascript
const svg = buildNavSVG({
  title: "Cloud Infrastructure Masterclass with Industry Experts",
  date: "Jul 10",
  time: "10:00 AM PST",
  buttonText: "Reserve Spot",
  speakers: [
    { name: "Alice", photo: "..." },
    { name: "Bob", photo: "..." },
    { name: "Charlie", photo: "..." }
  ]
});

// Photo will be hidden, title will use expanded layout
```

### Example 4: HTML Integration

```html
<div id="nav-banner"></div>

<script src="buildNavSVG.js"></script>
<script>
  const svg = buildNavSVG({
    title: "Webinar Title",
    speakers: [{ name: "Expert", photo: "url" }]
  });
  
  document.getElementById("nav-banner").innerHTML = svg;
</script>
```

### Example 5: React Component

```jsx
import { buildNavSVG } from './buildNavSVG.js';

export function WebinarBanner({ webinar }) {
  const svg = buildNavSVG({
    title: webinar.title,
    date: webinar.date,
    time: webinar.time,
    buttonText: webinar.cta,
    speakers: webinar.speakers
  });
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: svg }}
      className="webinar-banner"
    />
  );
}
```

## Styling & Customization

### Colors & Fonts

All colors and fonts are hardcoded in the function (can be parameterized):

| Element | Color | Font |
|---------|-------|------|
| Background | Dark gray gradient `#1F2937→#374151` | — |
| Title text | White `#FFFFFF` | system-ui, sans-serif, 24px, 700 |
| Webinar pill | White with 0.2 opacity | — |
| Date/Time | White with 0.9/0.7 opacity | 12px/11px |
| Button text | IBM Blue `#0F62FE` | 14px, 600 weight |
| Button icon circle | IBM Blue `#0F62FE` | — |

### Modifying Colors

To customize colors, modify the buildNavSVG() function:

```javascript
// Change title color from white to light blue
titleConfig.fill = "#E0F2FE";

// Change button color from IBM blue
buttonColor = "#6366F1"; // Indigo
```

### Background Pattern

To use the actual Figma pattern instead of a gradient:

```javascript
const figmaPattern = `
  <pattern id="figmaPattern" patternContentUnits="objectBoundingBox" width="1" height="1">
    <!-- Figma pattern defs from Property 1=Default.svg -->
  </pattern>
`;

const svg = buildNavSVG({
  title: "...",
  bgPattern: figmaPattern
});
```

## Technical Details

### Canvas Size
- **Width**: 1440px (standard web width)
- **Height**: 134px (compact banner height)
- **ViewBox**: `0 0 1440 134` (responsive scaling)

### Speaker Photo Clip
The speaker photo uses an SVG `<clipPath>` with rounded corners (4.98px radius):
```svg
<clipPath id="speakerPhotoClip">
  <rect x="109.5" y="17" width="100" height="100" rx="4.98" />
</clipPath>
```

### Text Rendering
- Lines are positioned with `dominant-baseline="hanging"` for top-alignment
- `text-anchor="start"` for left-alignment, `"middle"` for centered, `"end"` for right
- XML special characters are escaped (`<`, `>`, `&`, `"`, `'`)

### Image Preservation
- `preserveAspectRatio="xMidYMid slice"` ensures photos fill the space while maintaining aspect ratio
- Works with any image URL (CORS must allow cross-origin)

## Testing

### Interactive Demo
Open `buildNavSVG-demo.html` in a browser to:
1. **Live preview** the SVG output
2. **Configure** title, date, time, button text, speaker count
3. **Test preset cases** (6 built-in test scenarios)
4. **Copy SVG code** to clipboard
5. **Validate** the output structure

### Test Cases

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | 1 speaker | Photo shown, title at x=220 |
| 2 | 2 speakers | Photo shown, title at x=220 |
| 3 | 3 speakers | Photo hidden, title at x=150 |
| 4 | 4 speakers | Photo hidden, title at x=150 |
| 5 | Long title | Text wraps to 2 lines + ellipsis |
| 6 | Minimal state | All defaults applied |

### Running Tests (Node.js)

```bash
node buildNavSVG.test.js
```

Output shows:
- ✓/✗ status for each test
- SVG length
- Feature presence (photo, title, button)
- Sample output file path

## Browser Compatibility

- ✓ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✓ SVG 1.1 features (all major browsers)
- ✓ Works with inline SVG or `<img>` tags
- ⚠ Image CORS: Photos must be from same origin or CORS-enabled

## Performance

- **SVG Generation**: ~1-2ms (fast enough for real-time updates)
- **File Size**: ~3-5KB SVG output (larger if speaker photos are base64-encoded)
- **Rendering**: Native SVG rendering in browser (no canvas overhead)

## Integration Checklist

- [ ] Import `buildNavSVG()` function
- [ ] Prepare speaker data with photo URLs
- [ ] Build state object with title, date, time, speakers
- [ ] Call `buildNavSVG(state)` to get SVG string
- [ ] Insert SVG into DOM via `innerHTML` or native SVG element
- [ ] Test with 1-2 and 3-4 speaker configurations
- [ ] Verify date/time formatting matches your needs
- [ ] Test responsive scaling on different screen sizes

## Future Enhancements

Potential improvements:
- [ ] Parameterize colors/fonts in state object
- [ ] Support custom "Register" button URL/onclick handler
- [ ] Add speaker name display below photo
- [ ] Support for multiple speaker photos (grid layout)
- [ ] Animated gradient backgrounds
- [ ] Dark/light theme variants
- [ ] Custom logo/branding in pill

## License & Attribution

- Figma template: `Property 1=Default.svg`
- Function: Webinar Kit Generator
- Dependencies: None (vanilla JavaScript)
