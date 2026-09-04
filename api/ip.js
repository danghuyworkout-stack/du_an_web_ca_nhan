// api/ip.js
export default async function handler(req, res) {
  // Lấy IP của khách ghé thăm trang web
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '1.1.1.1');

  try {
    // Gọi sang APILayer với Header apikey
    const response = await fetch(`https://api.apilayer.com/ip_to_location/${clientIp}`, {
      method: 'GET',
      headers: {
        'apikey': 'c5146d8c80c0755e89ba9e44dff0313c' // Key APILayer của bạn
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Lỗi khi lấy thông tin IP' });
  }
}
