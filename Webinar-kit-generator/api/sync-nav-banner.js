export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { svgContent } = req.body
  if (!svgContent) {
    return res.status(400).json({ error: 'Missing SVG content' })
  }

  try {
    const figmaLink = `https://www.figma.com/design/I1vDFEvLzUgdHWvWKnzUoh/RL-design-assets?node-id=35250-7962`
    
    return res.status(200).json({
      success: true,
      message: 'Nav banner ready! Open Figma to view.',
      frameUrl: figmaLink,
      svgLength: svgContent.length
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
