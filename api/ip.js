// api/ip.js
export default async function handler(req, res) {
  // Lấy IP thật của khách vào web
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : (req.socket.remoteAddress || '');

  const apiKey = 'c5146d8c80c0755e89ba9e44dff0313c';

  try {
    // Gọi endpoint của APILayer với Header apikey
    let targetUrl = clientIp ? `https://api.apilayer.com/ipstack/${clientIp}` : `https://api.apilayer.com/ipstack/check`;
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': apiKey
      }
    });

    const data = await response.json();

    // Nếu APILayer trả về thành công
    if (data && !data.error && (data.country_name || data.city)) {
      return res.status(200).json(data);
    }

    // Dự phòng tự động (Fallback) nếu APILayer có trục trặc để web luôn luôn hiện
    const fallbackRes = await fetch(`https://ipwho.is/${clientIp}`);
    const fallbackData = await fallbackRes.json();
    return res.status(200).json({
      city: fallbackData.city,
      country_name: fallbackData.country,
      location: {
        country_flag_emoji: fallbackData.flag ? fallbackData.flag.emoji : '📍'
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
