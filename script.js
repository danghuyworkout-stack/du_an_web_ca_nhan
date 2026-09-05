/**
 * NGUYỄN ĐĂNG HUY - EDITORIAL ATELIER PORTFOLIO SCRIPT
 * Lightweight, accessible, zero-dependency client logic.
 * Fixed single warm European theme.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigationScroll();
  initCopyEmail();
  initMobileMenu();
});

// ==========================================================================
// 1. COPY EMAIL TO CLIPBOARD WITH TOAST NOTICE
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
// 2. NAVIGATION ACTIVE SCROLL SPY
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
// 3. MOBILE HAMBURGER MENU
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
// 4. CONTACT FORM HANDLER (MAILTO DISPATCH)
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