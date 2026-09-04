// api/ip.js
export default async function handler(req, res) {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '');

  try {
    const response = await fetch('https://ipwho.is/' + clientIp);
    const data = await response.json();

    return res.status(200).json({
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country,
      flag: data.flag ? data.flag.emoji : '📍',
      isp: data.connection ? data.connection.isp : ''
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

