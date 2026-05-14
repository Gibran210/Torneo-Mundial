export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const params = new URLSearchParams(req.query)
  const url    = `${process.env.VITE_SHEET_URL}?${params.toString()}`

  try {
    const response = await fetch(url)
    const text     = await response.text()

    // Extraer JSON del wrapper JSONP si viene con callback
    const cb    = req.query.callback
    let json    = text
    if (cb && text.startsWith(cb + '(')) {
      json = text.slice(cb.length + 1, -1)
    }

    res.status(200).json(JSON.parse(json))
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}