# buildNavSVG() - Quick Reference Card

## One-Line Usage
```javascript
const svg = buildNavSVG({ title: "My Webinar", date: "Jun 15", time: "2:00 PM EST", speakers: [{photo: "url"}] });
```

## State Object Minimal → Full

```javascript
// Minimal (all defaults)
buildNavSVG({ title: "Title" })

// With 1-2 speakers (shows photo)
buildNavSVG({
  title: "Title",
  date: "Jun 15",
  time: "2:00 PM EST",
  buttonText: "Register now!",
  speakers: [{ name: "John", photo: "url" }]
})

// With 3-4 speakers (hides photo, expands title)
buildNavSVG({
  title: "Extended Title For More Speakers",
  speakers: [
    { name: "Speaker 1", photo: "url1" },
    { name: "Speaker 2", photo: "url2" },
    { name: "Speaker 3", photo: "url3" }
  ]
})
```

## Key Defaults
| Field | Default |
|-------|---------|
| date | "Jun 15" |
| time | "2:00 PM EST" |
| buttonText | "Register now!" |
| speakers | [] |

## Layout Rules
| Speakers | Photo | Title Width | Title X |
|----------|-------|-------------|---------|
| 0-2 | Shown | 900px | 220 |
| 3-4 | Hidden | 950px | 150 |

## Element Positions (from Figma)
```
Webinar Pill:    x=302.7  y=28.5  w=69.3  h=21px
Button:          x=1182.4 y=46.4  w=161   h=41.2px
Button Icon:     x=1304.4 y=51    w=31.9  h=31.9px
Speaker Photo:   x=109.5  y=17    w=100   h=100px
Date/Time:       x=1142.4 y=38-54 (right-aligned)
Divider:         x=832.8  (vertical line)
```

## Colors
```
Background:      #1F2937 → #374151 (gradient)
Title Text:      #FFFFFF (white)
Button Text:     #0F62FE (IBM blue)
Button Icon:     #0F62FE (IBM blue)
```

## Typography
```
Title:           24px, 700 weight, system-ui
Date:            12px, 500 weight
Time:            11px, 400 weight
Button:          14px, 600 weight
```

## Title Auto-Wrapping
- Wraps to max 2 lines
- ~22-25 chars per line (depends on font)
- Truncates with "..." if exceeds 2 lines

## Photo Support
Works with multiple URL fields:
```javascript
{ photo: "url" }          // Preferred
{ imageUrl: "url" }       // Alternative 1
{ url: "url" }            // Alternative 2
```

## HTML Integration
```html
<div id="banner"></div>

<script src="buildNavSVG.js"></script>
<script>
  const svg = buildNavSVG({...});
  document.getElementById('banner').innerHTML = svg;
</script>
```

## React Integration
```jsx
import { buildNavSVG } from './buildNavSVG';

export const Banner = ({ webinar }) => (
  <div dangerouslySetInnerHTML={{ 
    __html: buildNavSVG(webinar) 
  }} />
);
```

## Vue Integration
```vue
<div v-html="buildNavSVG(webinar)" />

<script>
import { buildNavSVG } from './buildNavSVG';
export default { methods: { buildNavSVG } }
</script>
```

## Make it Clickable
```javascript
const container = document.getElementById('banner');
container.innerHTML = buildNavSVG({...});
container.onclick = () => window.location.href = '/register';
```

## Add Shadow Effect
```css
.webinar-banner svg {
  filter: drop-shadow(0 10px 25px rgba(0,0,0,0.15));
}
```

## SVG Output Structure
```
<svg viewBox="0 0 1440 134">
  <defs>gradients, patterns, clip-paths</defs>
  <rect/><!-- background -->
  <g clip-path><!-- photo with clip --></g>
  <rect/><text/><!-- webinar pill -->
  <text/><text/><!-- title (2 lines) -->
  <text/><text/><!-- date/time -->
  <rect/><text/><circle/><text/><!-- button -->
  <line/><!-- divider -->
</svg>
```

## Testing
```bash
# Browser demo
open buildNavSVG-demo.html

# Node.js tests (if Node available)
node buildNavSVG.test.js
```

## Validation Checks
The output SVG has:
- ✓ Valid SVG root element
- ✓ ViewBox="0 0 1440 134"
- ✓ Proper defs section
- ✓ XML escaped text
- ✓ All required elements

## File Sizes
- buildNavSVG.js: ~9.6KB
- SVG output: ~3-5KB
- Compressed (gzip): ~1-2KB

## Performance
- Generation: ~1-2ms
- Rendering: Native SVG (instant)
- Image load: Depends on CDN

## Browser Support
- ✓ Chrome, Firefox, Safari, Edge
- ✓ Mobile browsers
- ✓ IE 11+ (with fallback)

## Common Gotchas
| Issue | Solution |
|-------|----------|
| Photo not showing | Use CORS-enabled URLs (https) |
| Text overlapping | Reduce speaker count or shorten title |
| Wrong dimensions | Use speaker count to auto-switch layout |
| Special chars broken | Function auto-escapes XML |

## Docs Navigation
- **Full API** → `buildNavSVG-README.md`
- **Integration Examples** → `INTEGRATION_GUIDE.md`
- **Architecture** → `buildNavSVG-SUMMARY.md`
- **Interactive Demo** → `buildNavSVG-demo.html`
- **Test Cases** → `buildNavSVG.test.js`

## Quick Examples

### Static Banner
```js
const svg = buildNavSVG({
  title: "Cloud Infrastructure Masterclass",
  date: "Jun 22",
  time: "3:00 PM EST",
  speakers: [{ photo: "https://..." }]
});
```

### From API
```js
const webinar = await fetch('/api/webinar/123').then(r => r.json());
const svg = buildNavSVG({
  title: webinar.title,
  date: formatDate(webinar.date),
  time: formatTime(webinar.time),
  speakers: webinar.speakers
});
```

### Dynamic Updates
```js
function updateBanner(webinarId) {
  const svg = buildNavSVG(getWebinarState(webinarId));
  document.getElementById('banner').innerHTML = svg;
}
```

---

**Need more?** See full documentation in the other .md files.
