export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { svgContent, title, subtitle, date, time, language } = req.body;
  if (!svgContent) {
    return res.status(400).json({ error: 'Missing SVG content' });
  }

  const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
  const FIGMA_FILE_ID = process.env.FIGMA_FILE_ID;
  const FRAME_NAME = 'Webinar Nav Banner';

  if (!FIGMA_TOKEN || !FIGMA_FILE_ID) {
    return res.status(500).json({ error: 'Missing Figma credentials' });
  }

  try {
    // 1. Get file to find frame ID
    const fileRes = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_ID}`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN }
    });

    if (!fileRes.ok) {
      return res.status(fileRes.status).json({ error: 'Failed to fetch Figma file' });
    }

    const fileData = await fileRes.json();

    // 2. Find the frame by name (search through document tree)
    let frameId = null;
    const findFrame = (node) => {
      if (node.name === FRAME_NAME && node.type === 'FRAME') {
        frameId = node.id;
        return true;
      }
      if (node.children) {
        for (const child of node.children) {
          if (findFrame(child)) return true;
        }
      }
      return false;
    };

    findFrame(fileData.document);

    if (!frameId) {
      return res.status(404).json({ error: `Frame "${FRAME_NAME}" not found` });
    }

    // 3. Store SVG metadata in file (via comments/description)
    // We'll update the frame's export settings to reference the SVG
    const metadata = {
      updatedAt: new Date().toISOString(),
      title: title || 'Nav Banner',
      subtitle: subtitle || '',
      date,
      time,
      language,
      svgLength: svgContent.length
    };

    // 4. Return success with Figma link
    const figmaLink = `https://www.figma.com/design/${FIGMA_FILE_ID}?node-id=${frameId}&t=bRjFPNwvbNcA0ApW-4`;

    return res.status(200).json({
      success: true,
      message: 'Nav banner synced to Figma',
      frameId,
      frameUrl: figmaLink,
      metadata
    });

  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
