export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const params = new URLSearchParams(req.query)
  const url    = `${process.env.VITE_SHEET_URL}?${params.toString()}`

  try {
    // Petición sin callback (server-side no necesita JSONP)
    const response = await fetch(url)
    const text     = await response.text()

    // Si viene con wrapper JSONP, extraer el JSON
    let json = text
    const match = text.match(/^[^(]+\((.+)\)$/)
    if (match) json = match[1]

    res.status(200).json(JSON.parse(json))
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}