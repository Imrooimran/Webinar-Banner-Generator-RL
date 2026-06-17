/**
 * Vercel Serverless Function: Create Figma Nav Banner
 *
 * Workflow:
 * 1. Receive webinar data + speaker image URL
 * 2. Copy NAV_TEMPLATE file (never modify original)
 * 3. Update text layers (title, date, time, CTA)
 * 4. Replace speaker photo
 * 5. Return Figma link
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
  const TEMPLATE_FILE_ID = process.env.FIGMA_FILE_ID || 'I1vDFEvLzUgdHWvWKnzUoh';
  const TEAM_ID = process.env.FIGMA_TEAM_ID;

  if (!FIGMA_TOKEN) {
    return res.status(500).json({
      error: 'Missing Figma credentials',
      hint: 'Set FIGMA_TOKEN in vercel.json environment variables'
    });
  }

  if (!TEMPLATE_FILE_ID) {
    return res.status(500).json({
      error: 'Missing Figma template file ID',
      hint: 'Set FIGMA_FILE_ID in vercel.json environment variables'
    });
  }

  try {
    const {
      title,
      date,
      time,
      cta,
      speakerPhoto,
      partnerLogo,
      variant = 'Default'
    } = req.body;

    // Validate required fields
    if (!title || !date || !time || !cta) {
      return res.status(400).json({ error: 'Missing required fields: title, date, time, cta' });
    }

    console.log(`[Create Banner] Copying template for: ${title}`);

    // ============ STEP 1: Copy Template File ============
    const copyResponse = await figmaApiCall(
      'POST',
      `/files/${TEMPLATE_FILE_ID}/copy`,
      FIGMA_TOKEN,
      {
        name: `NavBanner_${title.substring(0, 30).replace(/\s+/g, '_')}_${Date.now()}`,
        team_id: TEAM_ID
      }
    );

    if (!copyResponse.ok) {
      throw new Error(`Failed to copy template: ${copyResponse.statusText}`);
    }

    const copyData = await copyResponse.json();
    const newFileId = copyData.file.id;
    const figmaUrl = copyData.file.url;

    console.log(`[Create Banner] Template copied: ${newFileId}`);

    // ============ STEP 2: Update Text Content ============
    // Layer IDs for Default variant
    const TEXT_LAYERS = {
      title: '35272:7749',      // Event Title
      date: '35272:7752',        // Event Date
      cta: '35272:7755',         // CTA Button Text
      badge: '35272:7745'        // Webinar Badge
    };

    // Build text update requests
    const textUpdates = [];

    textUpdates.push({
      id: TEXT_LAYERS.title,
      characters: title
    });

    textUpdates.push({
      id: TEXT_LAYERS.date,
      characters: date
    });

    textUpdates.push({
      id: TEXT_LAYERS.cta,
      characters: cta
    });

    // Badge text stays "Webinar" (no update needed)

    console.log(`[Create Banner] Updating ${textUpdates.length} text layers...`);

    // Send text updates
    const textUpdateResponse = await figmaApiCall(
      'PUT',
      `/files/${newFileId}/text`,
      FIGMA_TOKEN,
      { requests: textUpdates }
    );

    if (!textUpdateResponse.ok) {
      const error = await textUpdateResponse.json();
      console.error('Text update error:', error);
      throw new Error(`Failed to update text: ${textUpdateResponse.statusText}`);
    }

    console.log(`[Create Banner] Text layers updated`);

    // ============ STEP 3: Update Speaker Photo ============
    if (speakerPhoto) {
      console.log(`[Create Banner] Updating speaker photo...`);

      // Get the file to find image nodes
      const fileResponse = await figmaApiCall(
        'GET',
        `/files/${newFileId}`,
        FIGMA_TOKEN
      );

      if (fileResponse.ok) {
        const fileData = await fileResponse.json();
        const speakerImageNodeId = '35272:7757'; // Speaker Photo layer

        // Update image fill
        const paintUpdates = [
          {
            id: speakerImageNodeId,
            paint: {
              type: 'IMAGE',
              scaleMode: 'FILL',
              imageRef: speakerPhoto
            }
          }
        ];

        const paintResponse = await figmaApiCall(
          'PUT',
          `/files/${newFileId}/paint`,
          FIGMA_TOKEN,
          { requests: paintUpdates }
        );

        if (paintResponse.ok) {
          console.log(`[Create Banner] Speaker photo updated`);
        } else {
          console.warn('Could not update speaker photo (non-blocking)');
        }
      }
    }

    // ============ STEP 4: Return Success ============
    const result = {
      success: true,
      message: 'Figma banner created successfully',
      fileId: newFileId,
      figmaUrl: figmaUrl,
      editUrl: `${figmaUrl}?node-id=35272-7721`, // Direct to NavBanner frame
      metadata: {
        title,
        date,
        time,
        cta,
        variant,
        createdAt: new Date().toISOString(),
        templateFileId: TEMPLATE_FILE_ID
      }
    };

    console.log(`[Create Banner] Success: ${figmaUrl}`);
    return res.status(200).json(result);

  } catch (error) {
    console.error('[Create Banner] Error:', error.message);
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

/**
 * Helper: Make authenticated requests to Figma API
 */
async function figmaApiCall(method, path, token, body = null) {
  const options = {
    method,
    headers: {
      'X-Figma-Token': token,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(`https://api.figma.com/v1${path}`, options);
}
