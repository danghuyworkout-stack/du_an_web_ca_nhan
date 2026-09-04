// api/ip.js
export default async function handler(req, res) {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '');

  try {
    const response = await fetch(`http://api.ipstack.com/${clientIp}?access_key=c5146d8c80c0755e89ba9e44dff0313c`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi tải vị trí' });
  }
}
