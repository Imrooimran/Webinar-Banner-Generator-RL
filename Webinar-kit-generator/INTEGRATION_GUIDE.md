# Quick Integration Guide: buildNavSVG()

## 60-Second Setup

### 1. Copy the Function
```bash
# Copy buildNavSVG.js to your project
cp buildNavSVG.js /path/to/your/project/
```

### 2. Import & Use
```javascript
// Node.js
const { buildNavSVG } = require('./buildNavSVG.js');

// ES Modules
import { buildNavSVG } from './buildNavSVG.js';

// Browser (as script tag)
<script src="buildNavSVG.js"></script>
```

### 3. Generate Banner
```javascript
const svg = buildNavSVG({
  title: "Your Webinar Title",
  date: "Jun 15",
  time: "2:00 PM EST",
  buttonText: "Register now!",
  speakers: [
    { 
      name: "Speaker Name",
      photo: "https://example.com/photo.jpg"
    }
  ]
});
```

### 4. Render to Page
```html
<!-- HTML -->
<div id="banner"></div>

<script>
  document.getElementById('banner').innerHTML = svg;
</script>
```

## Common Use Cases

### Use Case 1: Static Webinar Banner
```javascript
const banner = buildNavSVG({
  title: "Advanced React Workshop",
  date: "Jun 22",
  time: "3:00 PM EST",
  speakers: [{
    name: "Sarah Chen",
    photo: "https://cdn.example.com/speakers/sarah.jpg"
  }]
});

document.querySelector('.webinar-header').innerHTML = banner;
```

### Use Case 2: Dynamic Banner from API
```javascript
async function updateBanner(webinarId) {
  const response = await fetch(`/api/webinars/${webinarId}`);
  const webinar = await response.json();
  
  const banner = buildNavSVG({
    title: webinar.title,
    date: webinar.startDate.format('MMM D'),
    time: webinar.startDate.format('h:mm A z'),
    buttonText: "Register Now",
    speakers: webinar.speakers.map(s => ({
      name: s.name,
      photo: s.photoUrl
    }))
  });
  
  document.getElementById('webinar-banner').innerHTML = banner;
}
```

### Use Case 3: React Component
```jsx
import { buildNavSVG } from './buildNavSVG.js';

export function WebinarBanner({ webinar }) {
  const svg = buildNavSVG({
    title: webinar.title,
    date: formatDate(webinar.date),
    time: formatTime(webinar.time),
    buttonText: webinar.ctaText || "Register now!",
    speakers: webinar.speakers || []
  });
  
  return (
    <div className="webinar-banner" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function formatTime(time) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(time);
}
```

### Use Case 4: Vue Component
```vue
<template>
  <div v-html="bannerSvg" class="webinar-banner"></div>
</template>

<script>
import { buildNavSVG } from './buildNavSVG.js';

export default {
  props: {
    webinar: {
      type: Object,
      required: true
    }
  },
  computed: {
    bannerSvg() {
      return buildNavSVG({
        title: this.webinar.title,
        date: this.formatDate(this.webinar.date),
        time: this.formatTime(this.webinar.time),
        buttonText: this.webinar.cta,
        speakers: this.webinar.speakers
      });
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },
    formatTime(time) {
      return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  }
}
</script>
```

### Use Case 5: Express/Node Server
```javascript
// routes/webinars.js
app.get('/webinars/:id/banner', (req, res) => {
  const webinar = db.getWebinar(req.params.id);
  
  const svg = buildNavSVG({
    title: webinar.title,
    date: formatDate(webinar.startDate),
    time: formatTime(webinar.startDate),
    speakers: webinar.speakers
  });
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});
```

### Use Case 6: Export as PNG/Image
```javascript
// Using puppeteer to convert SVG to PNG
const puppeteer = require('puppeteer');

async function svgToPng(svg, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 134 });
  await page.setContent(`<html><body>${svg}</body></html>`);
  await page.screenshot({ path: outputPath });
  
  await browser.close();
}

// Usage
const svg = buildNavSVG({ /* ... */ });
await svgToPng(svg, './banner.png');
```

## State Object Cheat Sheet

### Minimal (all defaults)
```javascript
buildNavSVG({ title: "Title" })
```

### Standard (1-2 speakers)
```javascript
buildNavSVG({
  title: "Title",
  date: "Jun 15",
  time: "2:00 PM EST",
  buttonText: "Register now!",
  speakers: [{ name: "Speaker", photo: "url" }]
})
```

### Multiple Speakers (3-4, photo hidden)
```javascript
buildNavSVG({
  title: "Extended title for more speakers",
  speakers: [
    { name: "Speaker 1", photo: "url1" },
    { name: "Speaker 2", photo: "url2" },
    { name: "Speaker 3", photo: "url3" }
  ]
})
```

## Styling & CSS

The SVG is inline and can be styled with CSS:

```css
/* Container */
.webinar-banner {
  max-width: 1440px;
  margin: 0 auto;
}

/* Adjust size (responsive) */
@media (max-width: 768px) {
  .webinar-banner svg {
    max-width: 100%;
    height: auto;
  }
}

/* Shadow effect */
.webinar-banner svg {
  filter: drop-shadow(0 10px 25px rgba(0, 0, 0, 0.15));
}

/* Cursor on button area */
.webinar-banner:hover {
  cursor: pointer;
}
```

## Event Handling

Make the banner clickable:

```javascript
const container = document.getElementById('banner');
container.innerHTML = buildNavSVG({ /* ... */ });

container.addEventListener('click', (e) => {
  // Navigate to registration page
  window.location.href = '/register';
});

// Or make button area specific
container.querySelector('svg').addEventListener('click', (e) => {
  const buttonX = 1182.42;
  const buttonW = 160.999;
  const clickX = e.offsetX;
  
  if (clickX >= buttonX && clickX <= buttonX + buttonW) {
    window.location.href = '/register';
  }
});
```

## Data Format Examples

### From Webinar API
```javascript
const webinar = {
  id: "123",
  title: "Advanced React Patterns",
  startDate: "2024-06-15T14:00:00-05:00",
  endDate: "2024-06-15T15:00:00-05:00",
  speakers: [
    {
      id: "speaker-1",
      name: "Sarah Chen",
      photoUrl: "https://api.example.com/speakers/sarah.jpg",
      bio: "..."
    }
  ]
};

// Convert to buildNavSVG format
const state = {
  title: webinar.title,
  date: new Date(webinar.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  time: new Date(webinar.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }),
  speakers: webinar.speakers.map(s => ({
    name: s.name,
    photo: s.photoUrl
  }))
};

const svg = buildNavSVG(state);
```

### From Calendar Event
```javascript
const event = {
  summary: "Webinar: Cloud Infrastructure",
  description: "Expert panel discussion",
  start: { dateTime: "2024-07-10T10:00:00" },
  attendees: [
    { displayName: "Alice", email: "alice@example.com" },
    { displayName: "Bob", email: "bob@example.com" }
  ]
};

const speakers = event.attendees.slice(0, 2).map(a => ({
  name: a.displayName,
  photo: `https://gravatar.com/avatar/${md5(a.email)}`
}));

const svg = buildNavSVG({
  title: event.summary,
  date: new Date(event.start.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  time: new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  speakers
});
```

## Troubleshooting

### Issue: Speaker photo not showing
**Solution**: Check that:
1. Photo URL is valid and publicly accessible
2. CORS is configured on the image server
3. URL is not malformed (use https://)

```javascript
// ✓ Good
{ photo: "https://cdn.example.com/photo.jpg" }

// ✗ Bad
{ photo: "photo.jpg" }           // Relative path
{ photo: "/api/photo" }          // Likely CORS issue
{ photo: "http://blocked.com" }  // Insecure mixed content
```

### Issue: Text overlapping/truncating
**Solution**: Adjust title or reduce speaker count:

```javascript
// Too long for 1 speaker layout
buildNavSVG({
  title: "This is an extremely long title that will definitely not fit properly",
  speakers: [{ /* ... */ }]  // Only 1 speaker, limited space
})

// Better: More speakers = expanded title area
buildNavSVG({
  title: "This is an extremely long title that will fit better with expanded layout",
  speakers: [/* 3-4 speakers */]  // Hidden photo, more width
})
```

### Issue: Date/Time format looks wrong
**Solution**: Format before passing to function:

```javascript
// Custom format
const date = new Date("2024-06-15");
const formatted = {
  date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), // "Jun 15"
  time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + " EST" // "2:00 PM EST"
};

buildNavSVG({
  title: "...",
  date: formatted.date,
  time: formatted.time
})
```

## Performance Tips

1. **Cache SVG output**: Store generated SVG in database if it doesn't change frequently
2. **Lazy load images**: Let browser handle image loading with `preserveAspectRatio`
3. **Preload fonts**: Ensure system fonts are available before rendering
4. **Minimize speaker count**: 1-2 speakers is optimal for layout

## Next Steps

- [ ] Review `buildNavSVG-README.md` for detailed API docs
- [ ] Open `buildNavSVG-demo.html` to test interactively
- [ ] Integrate into your webinar platform
- [ ] Connect to your webinar/speaker data API
- [ ] Add click handlers for registration flow
- [ ] Monitor performance with production data

---

**Questions?** See `buildNavSVG-README.md` for comprehensive documentation.
