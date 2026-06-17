/**
 * buildNavSVG() - Generate dynamic nav banner SVG using Figma template
 *
 * Uses the Figma SVG structure as background/template and overlays dynamic:
 * - Title text (auto-wrapped to 2 lines if needed)
 * - Date/Time
 * - Button text
 * - Speaker photo (1-2 speakers only, hidden for 3-4)
 *
 * Layout variants:
 * - 1-2 speakers: show speaker photo at x=109.5, y=17, w=100, h=100
 * - 3-4 speakers: hide photo, more space for title
 *
 * @param {Object} S - State object containing:
 *   {string} S.title - Webinar title
 *   {string} S.date - Date (e.g., "Jun 15")
 *   {string} S.time - Time (e.g., "2:00 PM EST")
 *   {string} S.buttonText - Button CTA text (default: "Register now!")
 *   {Array<Object>} S.speakers - Speaker objects with photo URLs
 *   {string} S.bgPattern - Optional custom background pattern (default: use embedded Figma pattern)
 * @returns {string} SVG string
 */
function buildNavSVG(S) {
  // SVG canvas dimensions from Figma template
  const SVG_WIDTH = 1440;
  const SVG_HEIGHT = 134;

  // Key element positions from Figma design (scaled as needed)
  const ELEMENTS = {
    speakerPhoto: { x: 109.5, y: 17, w: 100, h: 100, rx: 4.98 },
    webinarPill: { x: 302.695, y: 28.4879, w: 69.2506, h: 21.0249 },
    button: { x: 1182.42, y: 46.4198, w: 160.999, h: 41.1596, rx: 20.5798 },
    buttonIcon: { x: 1304.36, y: 51.0391, w: 31.9197, h: 31.9197, rx: 15.9598 },
  };

  // Determine layout based on speaker count
  const speakerCount = S.speakers ? S.speakers.length : 0;
  const showSpeakerPhoto = speakerCount > 0 && speakerCount <= 2;

  // Title layout calculations
  // With speaker photo: title starts after photo (~220px) with reduced width
  // Without photo: title spans wider across canvas
  let titleConfig = {
    x: 220,
    y: 30,
    maxWidth: 900,
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', sans-serif",
    fill: "#FFFFFF",
    lineHeight: 32,
  };

  if (!showSpeakerPhoto) {
    // 3-4 speakers: expand title to use speaker photo area
    titleConfig.x = 150;
    titleConfig.maxWidth = 950;
  }

  // Helper: Wrap text to ~2 lines based on font size and container width
  function wrapText(text, maxWidth, charWidthEstimate = 0.5) {
    // Very rough estimate: monospace-ish at ~60% font-size width per character
    const charsPerLine = Math.floor(maxWidth / (titleConfig.fontSize * charWidthEstimate));
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let word of words) {
      if ((currentLine + word).length <= charsPerLine) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Force to max 2 lines (truncate/ellipsis if needed)
    if (lines.length > 2) {
      lines[1] = lines.slice(1).join(" ");
      lines.length = 2;
      // Add ellipsis if truncated
      if (lines[1].length > charsPerLine * 0.9) {
        lines[1] = lines[1].substring(0, charsPerLine - 3) + "...";
      }
    }

    return lines;
  }

  const titleLines = wrapText(S.title || "Webinar Title");

  // Build the SVG string
  // Start with SVG root element and minimal defs for gradients/patterns
  let svg = `<svg width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;

  // Definitions section
  svg += `<defs>`;

  // Include a simple gradient or pattern (placeholder for Figma pattern)
  // In production, you'd embed the actual Figma pattern from the original SVG
  svg += `<linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" style="stop-color:#1F2937;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#374151;stop-opacity:1" />
  </linearGradient>`;

  // If custom background pattern provided, include it
  if (S.bgPattern) {
    svg += S.bgPattern;
  }

  svg += `</defs>`;

  // Background layer (use gradient or Figma pattern)
  const bgFill = S.bgPattern ? "url(#figmaPattern)" : "url(#bgGradient)";
  svg += `<rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="${bgFill}" />`;

  // Optional: Add a subtle overlay rect for additional styling
  svg += `<rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="rgba(0,0,0,0.15)" />`;

  // ============ SPEAKER PHOTO ============
  if (showSpeakerPhoto && S.speakers && S.speakers[0]) {
    const photo = S.speakers[0];
    const photoUrl = photo.photo || photo.imageUrl || photo.url;

    if (photoUrl) {
      svg += `<g clip-path="url(#speakerPhotoClip)">`;
      svg += `<defs>
        <clipPath id="speakerPhotoClip">
          <rect x="${ELEMENTS.speakerPhoto.x}" y="${ELEMENTS.speakerPhoto.y}"
                width="${ELEMENTS.speakerPhoto.w}" height="${ELEMENTS.speakerPhoto.h}"
                rx="${ELEMENTS.speakerPhoto.rx}" />
        </clipPath>
      </defs>`;
      svg += `<image x="${ELEMENTS.speakerPhoto.x}" y="${ELEMENTS.speakerPhoto.y}"
              width="${ELEMENTS.speakerPhoto.w}" height="${ELEMENTS.speakerPhoto.h}"
              href="${photoUrl}" preserveAspectRatio="xMidYMid slice" />`;
      svg += `</g>`;
    }
  }

  // ============ WEBINAR PILL ============
  svg += `<rect x="${ELEMENTS.webinarPill.x}" y="${ELEMENTS.webinarPill.y}"
           width="${ELEMENTS.webinarPill.w}" height="${ELEMENTS.webinarPill.h}"
           rx="${ELEMENTS.webinarPill.w / 2}" fill="white" fill-opacity="0.2" />`;
  svg += `<rect x="${ELEMENTS.webinarPill.x}" y="${ELEMENTS.webinarPill.y}"
           width="${ELEMENTS.webinarPill.w}" height="${ELEMENTS.webinarPill.h}"
           rx="${ELEMENTS.webinarPill.w / 2}" stroke="white" stroke-width="0.61" />`;

  // "WEBINAR" text inside pill
  svg += `<text x="${ELEMENTS.webinarPill.x + ELEMENTS.webinarPill.w / 2}"
          y="${ELEMENTS.webinarPill.y + ELEMENTS.webinarPill.h / 2 + 3}"
          text-anchor="middle" dominant-baseline="middle"
          font-size="9" font-weight="600" fill="white" font-family="system-ui, sans-serif">
    WEBINAR
  </text>`;

  // ============ DYNAMIC TITLE TEXT ============
  // Line 1
  if (titleLines[0]) {
    svg += `<text x="${titleConfig.x}" y="${titleConfig.y}"
            font-size="${titleConfig.fontSize}" font-weight="${titleConfig.fontWeight}"
            fill="${titleConfig.fill}" font-family="${titleConfig.fontFamily}"
            text-anchor="start" dominant-baseline="hanging">
      ${escapeXml(titleLines[0])}
    </text>`;
  }

  // Line 2
  if (titleLines[1]) {
    svg += `<text x="${titleConfig.x}" y="${titleConfig.y + titleConfig.lineHeight}"
            font-size="${titleConfig.fontSize}" font-weight="${titleConfig.fontWeight}"
            fill="${titleConfig.fill}" font-family="${titleConfig.fontFamily}"
            text-anchor="start" dominant-baseline="hanging">
      ${escapeXml(titleLines[1])}
    </text>`;
  }

  // ============ DATE & TIME ============
  const dateTimeX = ELEMENTS.button.x - 40;
  const dateTimeY = ELEMENTS.button.y - 8;

  svg += `<text x="${dateTimeX}" y="${dateTimeY}"
          font-size="12" font-weight="500" fill="rgba(255,255,255,0.9)"
          font-family="system-ui, sans-serif" text-anchor="end">
    ${escapeXml(S.date || "Jun 15")}
  </text>`;

  svg += `<text x="${dateTimeX}" y="${dateTimeY + 16}"
          font-size="11" font-weight="400" fill="rgba(255,255,255,0.7)"
          font-family="system-ui, sans-serif" text-anchor="end">
    ${escapeXml(S.time || "2:00 PM EST")}
  </text>`;

  // ============ CTA BUTTON ============
  // Button background (white)
  svg += `<rect x="${ELEMENTS.button.x}" y="${ELEMENTS.button.y}"
           width="${ELEMENTS.button.w}" height="${ELEMENTS.button.h}"
           rx="${ELEMENTS.button.rx}" fill="white" />`;
  svg += `<rect x="${ELEMENTS.button.x}" y="${ELEMENTS.button.y}"
           width="${ELEMENTS.button.w}" height="${ELEMENTS.button.h}"
           rx="${ELEMENTS.button.rx}" stroke="white" stroke-width="0.84" />`;

  // Button text (dark blue, left-aligned inside button)
  const buttonTextX = ELEMENTS.button.x + 15;
  const buttonTextY = ELEMENTS.button.y + ELEMENTS.button.h / 2;

  svg += `<text x="${buttonTextX}" y="${buttonTextY}"
          font-size="14" font-weight="600" fill="#0F62FE"
          font-family="system-ui, sans-serif" dominant-baseline="middle">
    ${escapeXml(S.buttonText || "Register now!")}
  </text>`;

  // Button icon (arrow circle on right)
  svg += `<circle cx="${ELEMENTS.buttonIcon.x + ELEMENTS.buttonIcon.w / 2}"
           cy="${ELEMENTS.buttonIcon.y + ELEMENTS.buttonIcon.h / 2}"
           r="${ELEMENTS.buttonIcon.w / 2}" fill="#0F62FE" />`;

  // Arrow icon inside circle (→)
  svg += `<text x="${ELEMENTS.buttonIcon.x + ELEMENTS.buttonIcon.w / 2}"
          y="${ELEMENTS.buttonIcon.y + ELEMENTS.buttonIcon.h / 2 + 1}"
          text-anchor="middle" dominant-baseline="middle"
          font-size="16" font-weight="bold" fill="white"
          font-family="system-ui, sans-serif">
    →
  </text>`;

  // ============ VERTICAL DIVIDER (optional style element) ============
  const dividerX = 832.792;
  svg += `<line opacity="0.3" x1="${dividerX}" y1="44" x2="${dividerX}" y2="90"
          stroke="white" stroke-width="0.89" />`;

  // Close SVG tag
  svg += `</svg>`;

  return svg;
}

/**
 * Helper: Escape XML special characters in text
 */
function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Export for use in Node.js or bundlers
if (typeof module !== "undefined" && module.exports) {
  module.exports = { buildNavSVG, escapeXml };
}
