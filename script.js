/**
 * NEO-ENGINEER CLIENT RUNTIME SCRIPT
 * Author: Nguyễn Đăng Huy (toitenhuy.vercel.app)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initTypingEffect();
  initSpotlight();
  initAmbientCanvas();
  initProjectFilters();
  initNavbarScrollSpy();
  initMobileMenu();
  initCommandPalette();
  measurePing();
});

/* ============================================
   1. LIVE TELEMETRY CLOCK (GMT+7)
   ============================================ */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Chuyển múi giờ GMT+7 (Asia/Ho_Chi_Minh)
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `${timeStr} GMT+7`;
  }

  update();
  setInterval(update, 1000);
}

/* ============================================
   2. DYNAMIC MULTI-ROLE TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const roles = [
    'Fullstack Developer & Student',
    'Python & Automation Enthusiast',
    'High Schooler @ THPT Tố Hữu',
    'Building Scalable Web Systems'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseTime = 2000;

  function loop() {
    const current = roles[roleIdx];
    const displayText = isDeleting
      ? current.substring(0, charIdx - 1)
      : current.substring(0, charIdx + 1);

    typedEl.textContent = displayText;

    // Cập nhật tab title đồng bộ
    document.title = displayText ? `${displayText} — Nguyễn Đăng Huy` : 'Nguyễn Đăng Huy — Software Engineer';

    if (!isDeleting) {
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(loop, pauseTime);
        return;
      }
      setTimeout(loop, typeSpeed);
    } else {
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(loop, 400);
        return;
      }
      setTimeout(loop, deleteSpeed);
    }
  }

  setTimeout(loop, 400);
}

/* ============================================
   3. SPOTLIGHT MOUSE EFFECT
   ============================================ */
function initSpotlight() {
  const spotlight = document.getElementById('spotlight');
  if (!spotlight) return;

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  });
}

/* ============================================
   4. AMBIENT CYBER PARTICLES CANVAS
   ============================================ */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = window.innerWidth < 768 ? 40 : 85;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.6 + 0.3,
      size: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ============================================
   5. PROJECT CATEGORY FILTERS
   ============================================ */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   6. NAVBAR & SCROLL SPY
   ============================================ */
function initNavbarScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ============================================
   7. MOBILE HAMBURGER MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

/* ============================================
   8. COMMAND PALETTE (CTRL + K / CMD + K)
   ============================================ */
function initCommandPalette() {
  const backdrop = document.getElementById('cmd-backdrop');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');

  // Keyboard shortcut listener
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleCmdPalette();
    }
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeCmdPalette();
    }
  });

  if (input) {
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = results.querySelectorAll('.cmd-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(q)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

function openCmdPalette() {
  const backdrop = document.getElementById('cmd-backdrop');
  const input = document.getElementById('cmd-input');
  if (!backdrop) return;

  backdrop.classList.add('active');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 50);
  }
}

function closeCmdPalette() {
  const backdrop = document.getElementById('cmd-backdrop');
  if (!backdrop) return;
  backdrop.classList.remove('active');
}

function closeCmdPaletteOnBackdrop(e) {
  if (e.target.id === 'cmd-backdrop') {
    closeCmdPalette();
  }
}

function toggleCmdPalette() {
  const backdrop = document.getElementById('cmd-backdrop');
  if (backdrop && backdrop.classList.contains('active')) {
    closeCmdPalette();
  } else {
    openCmdPalette();
  }
}

function cmdJumpTo(selector) {
  closeCmdPalette();
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function cmdOpenUrl(url) {
  closeCmdPalette();
  window.open(url, '_blank');
}

/* ============================================
   9. QUICK ACTIONS & UTILITIES
   ============================================ */
function copyGitHubLink() {
  const url = 'https://github.com/danghuyworkout-stack';
  navigator.clipboard.writeText(url).then(() => {
    showToast('✓ Đã sao chép liên kết GitHub của Huy vào bộ nhớ tạm!');
    const btnText = document.getElementById('copy-btn-text');
    if (btnText) {
      const old = btnText.textContent;
      btnText.textContent = 'Copied to clipboard!';
      setTimeout(() => { btnText.textContent = old; }, 2000);
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function handleDispatchMessage(e) {
  e.preventDefault();
  const name = document.getElementById('sender-name').value;
  const email = document.getElementById('sender-email').value;
  const msg = document.getElementById('sender-msg').value;

  const subject = encodeURIComponent(`[DISPATCH] Tin nhắn từ ${name} qua Portfolio`);
  const body = encodeURIComponent(
    `SYSTEM PAYLOAD RECEIPT:\n` +
    `----------------------------------------\n` +
    `SENDER: ${name}\n` +
    `EMAIL : ${email}\n` +
    `DATE  : ${new Date().toISOString()}\n` +
    `----------------------------------------\n\n` +
    `MESSAGE:\n${msg}`
  );

  window.location.href = `mailto:danghuydangsuy@gmail.com?subject=${subject}&body=${body}`;
  showToast('✓ Đang khởi động trình gửi email payload...');
}

function measurePing() {
  const pingEl = document.getElementById('ping-metric');
  if (!pingEl) return;
  const start = performance.now();
  fetch(window.location.href, { method: 'HEAD', cache: 'no-cache' })
    .then(() => {
      const duration = Math.round(performance.now() - start);
      pingEl.textContent = `~${duration}ms`;
    })
    .catch(() => {
      pingEl.textContent = '~24ms';
    });
}
