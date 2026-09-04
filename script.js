// ============================================
// NAVBAR: Scroll effect + Active link spy
// ============================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Scroll: add .scrolled to navbar
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
});

// Active nav link based on scroll position
function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when nav link clicked (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ============================================
// SKILL BARS: Animate on scroll (IntersectionObserver)
// ============================================
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const targetWidth = fill.getAttribute('data-width');
      fill.style.width = targetWidth + '%';
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ============================================
// CONTACT FORM: mailto handler
// ============================================
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value;
  const email   = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent('Lien he tu portfolio - ' + name);
  const body    = encodeURIComponent('Tu: ' + name + '\nEmail: ' + email + '\n\n' + message);
  window.location.href = 'mailto:danghuydangsuy@gmail.com?subject=' + subject + '&body=' + body;
}

// ============================================
// FADE-IN: Sections animate when scrolled into view
// ============================================
const fadeTargets = document.querySelectorAll(
  '.info-card, .skill-card, .timeline-card, .contact-card, .about-text'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeTargets.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// ============================================
// TYPING EFFECT (Page Title & Hero Title)
// ============================================
const typedElement = document.getElementById('typed-text');
const phrases = [
  'Nguyễn Đăng Huy',
  'Fullstack Developer',
  'Python Enthusiast',
  'Creative Web Builder'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseDelay = 1800;

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];
  const currentText = currentPhrase.substring(0, isDeleting ? charIndex - 1 : charIndex + 1);

  if (typedElement) {
    typedElement.textContent = currentText;
  }
  document.title = currentText ? `${currentText} |` : 'Nguyễn Đăng Huy';

  if (!isDeleting) {
    charIndex++;
    if (charIndex === currentPhrase.length) {
      document.title = currentPhrase;
      isDeleting = true;
      setTimeout(typeLoop, pauseDelay);
      return;
    }
    setTimeout(typeLoop, typingSpeed);
  } else {
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, deletingSpeed);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeLoop, 500);
  initRain();
});

// ============================================
// RAIN EFFECT (Canvas Animation)
// ============================================
function initRain() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Tăng số lượng hạt mưa cho rõ và dày hơn
  const maxDrops = window.innerWidth < 768 ? 160 : 320;
  const drops = [];

  for (let i = 0; i < maxDrops; i++) {
    drops.push({
      x: Math.random() * (width + 100),
      y: Math.random() * height,
      length: Math.random() * 24 + 16,
      speed: Math.random() * 8 + 10,
      opacity: Math.random() * 0.5 + 0.4,
      width: Math.random() * 0.8 + 1.2
    });
  }

  function drawRain() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];

      ctx.beginPath();
      // Màu xanh cyan sáng & tím neon phát sáng rõ rệt
      const grad = ctx.createLinearGradient(drop.x, drop.y, drop.x - 2, drop.y + drop.length);
      grad.addColorStop(0, `rgba(108, 99, 255, ${drop.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(0, 242, 254, ${drop.opacity})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = drop.width;
      ctx.lineCap = 'round';

      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x - 2, drop.y + drop.length);
      ctx.stroke();

      drop.y += drop.speed;
      drop.x -= 1;

      if (drop.y > height) {
        drop.y = -30;
        drop.x = Math.random() * (width + 100);
      }
    }

    requestAnimationFrame(drawRain);
  }

  drawRain();
}

// ============================================
// TỰ ĐỘNG ĐỊNH VỊ KHÁCH TRUY CẬP (KHÔNG CẦN POPUP)
// ============================================
async function getVisitorLocation() {
  try {
    const res = await fetch('/api/ip');
    const data = await res.json();

    if (data && (data.country || data.country_name)) {
      const country = data.country || data.country_name;
      const city = data.city;
      const flag = data.flag || (data.location && data.location.country_flag_emoji) || '📍';
      const isp = data.isp ? ` &middot; <span style="opacity: 0.85;">${data.isp}</span>` : '';

      const greetingEl = document.getElementById('visitor-badge');
      if (greetingEl) {
        greetingEl.innerHTML = `${flag} Chào bạn từ <strong>${city ? city + ', ' : ''}${country}</strong>${isp}`;
        greetingEl.style.display = 'inline-flex';
        greetingEl.style.alignItems = 'center';
      }
    }
  } catch (err) {
    console.log("Không thể lấy vị trí khách:", err);
  }
}

// Chạy hàm lấy vị trí
getVisitorLocation();



// ============================================
// HỆ ĐIỀU HÀNH & THÔNG TIN THIẾT BỊ
// ============================================
function detectOS() {
  const ua = navigator.userAgent;
  if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
  if (/Windows NT 6.2/i.test(ua)) return 'Windows 8';
  if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s([0-9\.]*)/);
    return match ? 'Android ' + match[1] : 'Android';
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    const match = ua.match(/OS\s([0-9_]*)/);
    return match ? 'iOS ' + match[1].replace(/_/g, '.') : 'iOS';
  }
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown OS';
}

// ============================================
// TERMINAL INTRO POPUP (Kochehe style)
// ============================================
async function initWelcomeTerminal() {
  const overlay = document.getElementById('welcome-terminal-overlay');
  const termText = document.getElementById('terminal-text');
  const termFooter = document.getElementById('terminal-prompt-footer');
  const enterBtn = document.getElementById('terminal-enter-btn');
  const closeBtn = document.getElementById('term-close');

  if (!overlay || !termText) return;

  function closeTerminal() {
    overlay.classList.add('hidden');
    document.removeEventListener('keydown', onKeyPress);
  }

  function onKeyPress(e) {
    if (e.key === 'Enter' || e.key === 'Escape' || e.code === 'Space') {
      closeTerminal();
    }
  }

  if (enterBtn) enterBtn.addEventListener('click', closeTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  document.addEventListener('keydown', onKeyPress);

  const os = detectOS();
  termText.textContent = '[+] Dang ket noi may chu...\n[+] Kiem tra he thong...\n';

  let locationText = 'Việt Nam';
  let ispText = 'Nhà mạng Việt Nam';
  let ipText = 'Downloading...';
  let flag = '🇩🇰';

  try {
    const res = await fetch('/api/ip');
    const data = await res.json();
    if (data) {
      ipText = data.ip || 'hidden';
      locationText = data.country || 'Việt Nam';
      ispText = data.isp || 'Nhà mạng Việt Nam';
      flag = data.flag || '🇩🇰';

      const greetingEl = document.getElementById('visitor-badge');
      if (greetingEl) {
        greetingEl.innerHTML = flag + ' Chào bạn từ <strong>' + locationText + '</strong> &middot; <span style="opacity: 0.85;">' + ispText + '</span>';
        greetingEl.style.display = 'inline-flex';
        greetingEl.style.alignItems = 'center';
      }
    }
  } catch (err) {
    console.log('API error', err);
  }

  const linesSystem = [
    '==============================================',
    '       NDH SYSTEM SECURITY TERMINAL v2.5      ',
    '==============================================',
    ' > Xin chào người bạn ché thăm toitenhuy.vercel.app!',
    '----------------------------------------------',
    ' [‗] Địa chỉ IP      : ' + ipText,
    ' [‗] Quốc gia        : ' + flag + ' ' + locationText,
    ' [‗] Nhà mạng (ISP)  : ' + ispText,
    ' [‗] Hệ diều hành    : ' + os,
    ' [₂] Trạng thái      : KẺt nối an toàn (200 OK)',
    '----------------------------------------------',
    ' >> Chúc bạn có trải nghiệm tuyệt vời tại website!'
  ];

  let lineIdx = 0;
  let charIdx = 0;
  termText.textContent = '';

  function typeTerminal() {
    if (lineIdx < linesSystem.length) {
      const curLine = linesSystem[lineIdx];
      if (charIdx < curLine.length) {
        termText.textContent += curLine.charAt(charIdx);
        charIdx++;
        setTimeout(typeTerminal, 14);
      } else {
        termText.textContent += '\n';
        lineIdx++;
        charIdx = 0;
        setTimeout(typeTerminal, 60);
      }
    } else {
      if (termFooter) {
        termFooter.innerHTML = '<div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 14px;"><button id="btn-scan-gps" class="btn-enter" style="background: linear-gradient(135deg, #10b981, #06b6d4); font-size: 0.88rem; padding: 10px 18px; cursor: pointer;"><i class="fa-solid fa-crosshairs"></i> Click vào đây để quét vị trí chính xác (GPS)</button><button id="btn-enter-portfolio" class="btn-enter" style="font-size: 0.88rem; padding: 10px 18px; cursor: pointer;"><i class="fa-solid fa-arrow-right-to-bracket"></i> Vào Portfolio</button></div><div id="gps-scan-status" style="font-size: 0.85rem; color: #38bdf8; margin-top: 10px; min-height: 20px;"></div>';
        termFooter.style.display = 'block';

        const enterP = document.getElementById('btn-enter-portfolio');
        if (enterP) enterP.addEventListener('click', closeTerminal);

        const scanBtn = document.getElementById('btn-scan-gps');
        const statusDiv = document.getElementById('gps-scan-status');

        if (scanBtn) {
          scanBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
              statusDiv.innerText = 'Trình duyệt của bạn không hỗ trợ GPS.';
              return;
            }

            statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xin quyền và lấy tọa độ GPS...';

            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                statusDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang giải mã tọa độ bản đồ...';

                try {
                  const geoRes = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=vi');
                  const geoData = await geoRes.json();
                  
                  if (geoData) {
                    const ward = geoData.locality || '';
                    const city = geoData.city || geoData.principalSubdivision || 'Đà Nẵng';
                    const country = geoData.countryName || 'Việt Nam';
                    const accuratePlace = [ward, city, country].filter(Boolean).join(', ');

                    statusDiv.innerHTML = '🎯 <strong>Vị trí chính xác:</strong> ' + accuratePlace;
                    termText.textContent += '\n [✓] GPS Hiện tại     : ' + accuratePlace;

                    const greetingEl = document.getElementById('visitor-badge');
                    if (greetingEl) {
                      greetingEl.innerHTML = '📍 Chào bạn từ <strong>' + accuratePlace + '</strong> &middot; ' + ispText;
                    }
                  } else {
                    statusDiv.innerText = 'Tọa độ GPS: ' + lat.toFixed(4) + ', ' + lon.toFixed(4);
                  }
                } catch (err) {
                  statusDiv.innerText = 'Lỗi kết nối bản đồ: ' + err.message;
                }
              },
              (err) => {
                if (err.code === 1) {
                  statusDiv.innerHTML = '⚠️ Bạn đã từ chối cấp quyền GPS.';
                } else {
                  statusDiv.innerHTML = '⚠️ Không thể lấy tín hiệu GPS: ' + err.message;
                }
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });
        }
      }
    }
  }

  typeTerminal();
}

document.addEventListener('DOMContentLoaded', initWelcomeTerminal);