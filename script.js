/**
 * NGUYỄN ĐĂNG HUY - EDITORIAL ATELIER PORTFOLIO SCRIPT
 * Lightweight, accessible, zero-dependency client logic.
 * Automated 24/7 Visitor Tracking (Telegram Bot & Google Sheets).
 */

// ==========================================================================
// 1. CÁC THÔNG SỐ CẤU HÌNH (TELEGRAM BOT & GOOGLE SHEETS)
// ==========================================================================
const TELEGRAM_BOT_TOKEN = "8984299883:AAFvFMAS8-HYqXife-d5Z0OZJqyxBZwtneQ";
const TELEGRAM_CHAT_ID = "6233693040";
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzw1516EMiKIpIyWZXbcD2m7-ytTL5y9zz5EDLX056bqEwmydhsRx9RA2xAmq7Oi5c/exec";

// ==========================================================================
// 2. KHỞI CHẠY KHI DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigationScroll();
  initCopyEmail();
  initMobileMenu();
  trackVisitor(); // Kích hoạt tự động thu thập thông tin khách truy cập
});

// ==========================================================================
// 3. TỰ ĐỘNG THU THẬP THÔNG TIN & GỬI DỮ LIỆU ĐỒNG THỜI (24/7)
// ==========================================================================
async function trackVisitor() {
  try {
    // 1. Thời gian truy cập định dạng chuẩn giờ Việt Nam (UTC+7)
    const now = new Date();
    const timeVN = now.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // 2. Thông tin thiết bị, trình duyệt, màn hình và trang truy cập
    const userAgent = navigator.userAgent || 'Không rõ';
    const screenWidth = window.screen ? window.screen.width : window.innerWidth;
    const screenHeight = window.screen ? window.screen.height : window.innerHeight;
    const screenResolution = `${screenWidth}x${screenHeight}`;
    const currentUrl = window.location.href;
    const referrer = document.referrer ? document.referrer : 'Trực tiếp (Direct / Bookmark)';

    // 3. Lấy thông tin vị trí, IP, nhà mạng với cơ chế đa tầng (Multi-tier Fallback)
    // Giúp khắc phục triệt để lỗi RateLimited (429) của ipapi.co
    let geo = await fetchGeoData();

    const coordinates = `${geo.latitude}, ${geo.longitude}`;

    // 4. GỬI TIN NHẮN ĐỊNH DẠNG HTML ĐẾN TELEGRAM BOT
    const telegramMessage = 
`🔔 <b>CÓ KHÁCH TRUY CẬP WEBSITE!</b>
━━━━━━━━━━━━━━━━━━━━
🌐 <b>Địa chỉ IP:</b> <code>${geo.ip}</code>
📍 <b>Vị trí:</b> ${geo.flag} ${geo.city}, ${geo.region}, ${geo.country}
📡 <b>Nhà mạng (ISP):</b> ${geo.isp}
🗺️ <b>Tọa độ:</b> <a href="https://www.google.com/maps?q=${geo.latitude},${geo.longitude}">${coordinates}</a>
━━━━━━━━━━━━━━━━━━━━
💻 <b>Thiết bị:</b> <code>${userAgent}</code>
🖥️ <b>Màn hình:</b> ${screenResolution}
🔗 <b>Trang xem:</b> ${currentUrl}
🚪 <b>Nguồn tới:</b> ${referrer}
⏰ <b>Thời gian:</b> ${timeVN}`;

    try {
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      }).catch(e => console.warn('Lỗi fetch Telegram:', e));
    } catch (tgErr) {
      console.warn('Lỗi gọi Telegram API:', tgErr);
    }

    // 5. GỬI DỮ LIỆU POST JSON ĐỒNG THỜI ĐẾN GOOGLE SHEETS
    try {
      const sheetPayload = {
        timestamp: timeVN,
        ip: geo.ip,
        city: geo.city,
        region: geo.region,
        country: geo.country,
        isp: geo.isp,
        coordinates: coordinates,
        device: userAgent,
        screen: screenResolution,
        url: currentUrl,
        referrer: referrer
      };

      fetch(GOOGLE_SHEETS_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors', // Tránh lỗi CORS từ Google Apps Script WebApp
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(sheetPayload)
      }).catch(e => console.warn('Lỗi fetch Google Sheets:', e));
    } catch (sheetErr) {
      console.warn('Lỗi gọi Google Sheets WebApp:', sheetErr);
    }

  } catch (err) {
    // Bọc toàn bộ trong try-catch, đảm bảo an toàn 100% cho trải nghiệm người dùng
    console.error('Lỗi trackVisitor:', err);
  }
}

/**
 * Hàm lấy vị trí & IP với cơ chế dự phòng 3 tầng tự động
 * Tầng 1: ipwho.is (CORS mở, thông tin ISP & tọa độ chuẩn, không bị giới hạn)
 * Tầng 2: ipinfo.io (Bổ trợ tọa độ & ISP nhanh)
 * Tầng 3: ipapi.co (Theo yêu cầu gốc)
 */
async function fetchGeoData() {
  // Tầng 1: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    const d = await res.json();
    if (d && d.success !== false && d.ip) {
      return {
        ip: d.ip,
        city: d.city || 'Đà Nẵng',
        region: d.region || 'Đà Nẵng',
        country: d.country || 'Việt Nam',
        flag: (d.flag && d.flag.emoji) ? d.flag.emoji : '🇻🇳',
        isp: (d.connection && (d.connection.isp || d.connection.org)) ? (d.connection.isp || d.connection.org) : 'Internet',
        latitude: d.latitude || '16.0678',
        longitude: d.longitude || '108.2208'
      };
    }
  } catch (e) {
    console.warn('Tầng 1 ipwho.is gặp sự cố, chuyển sang Tầng 2:', e);
  }

  // Tầng 2: ipinfo.io
  try {
    const res = await fetch('https://ipinfo.io/json');
    const d = await res.json();
    if (d && d.ip) {
      const loc = (d.loc || '16.0678,108.2208').split(',');
      return {
        ip: d.ip,
        city: d.city || 'Đà Nẵng',
        region: d.region || 'Đà Nẵng',
        country: d.country === 'VN' ? 'Việt Nam' : (d.country || 'Việt Nam'),
        flag: d.country === 'VN' ? '🇻🇳' : '📍',
        isp: d.org || 'Internet',
        latitude: loc[0] || '16.0678',
        longitude: loc[1] || '108.2208'
      };
    }
  } catch (e) {
    console.warn('Tầng 2 ipinfo.io gặp sự cố, chuyển sang Tầng 3:', e);
  }

  // Tầng 3: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/');
    const d = await res.json();
    if (d && !d.error && d.ip) {
      return {
        ip: d.ip,
        city: d.city || 'Đà Nẵng',
        region: d.region || 'Đà Nẵng',
        country: d.country_name || 'Việt Nam',
        flag: '📍',
        isp: d.org || d.asn || 'Internet',
        latitude: d.latitude || '16.0678',
        longitude: d.longitude || '108.2208'
      };
    }
  } catch (e) {
    console.warn('Tầng 3 ipapi.co gặp sự cố:', e);
  }

  // Fallback an toàn cuối cùng
  return {
    ip: 'Không xác định',
    city: 'Đà Nẵng',
    region: 'Việt Nam',
    country: 'Việt Nam',
    flag: '🇻🇳',
    isp: 'Mạng Việt Nam',
    latitude: '16.0678',
    longitude: '108.2208'
  };
}

// ==========================================================================
// 4. COPY EMAIL TO CLIPBOARD WITH TOAST NOTICE
// ==========================================================================
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'danghuyworkout@gmail.com';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        showToastNotice(`Đã sao chép: ${email}`);
      }).catch(() => {
        fallbackCopyText(email);
      });
    } else {
      fallbackCopyText(email);
    }
  });
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToastNotice(`Đã sao chép: ${text}`);
  } catch (err) {
    showToastNotice(`Hộp thư: ${text}`);
  }
  document.body.removeChild(textarea);
}

// Toast notification helper
let toastTimeout = null;
function showToastNotice(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================================================
// 5. NAVIGATION ACTIVE SCROLL SPY
// ==========================================================================
function initNavigationScroll() {
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 20) {
      if (header) header.style.boxShadow = '0 4px 20px rgba(43, 34, 25, 0.06)';
    } else {
      if (header) header.style.boxShadow = 'none';
    }

    // Scroll spy
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==========================================================================
// 6. MOBILE HAMBURGER MENU
// ==========================================================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

// ==========================================================================
// 7. CONTACT FORM HANDLER (MAILTO DISPATCH)
// ==========================================================================
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('form-name').value.trim();
  const email = document.getElementById('form-email').value.trim();
  const message = document.getElementById('form-message').value.trim();

  const subject = encodeURIComponent(`[Liên hệ tuyển dụng/hợp tác] Lời nhắn từ ${name}`);
  const body = encodeURIComponent(
    `Kính gửi Nguyễn Đăng Huy,\n\n` +
    `Tôi là: ${name}\n` +
    `Email liên hệ: ${email}\n\n` +
    `Nội dung trao đổi:\n${message}\n\n` +
    `Trân trọng.`
  );

  window.location.href = `mailto:danghuyworkout@gmail.com?subject=${subject}&body=${body}`;
}