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
});

