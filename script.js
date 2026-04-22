// Bilingual functionality - default Arabic
let currentLang = localStorage.getItem('lang') || 'ar';

const langToggleBtn = document.getElementById('langToggle');
const navMenu = document.querySelector('nav ul');
const hamburger = null; // Will add in HTML/CSS later

// Gallery modal elements (will create dynamically)
let galleryModal, modalImg, prevBtn, nextBtn, galleryImages = [];

// Update text and attributes
function updateText() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-ar', currentLang === 'ar');

  // Update all bilingual elements
  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });

  // Update title correctly
  const titleEl = document.querySelector('title');
  if (titleEl && titleEl.hasAttribute(`data-${currentLang}`)) {
    titleEl.textContent = titleEl.getAttribute(`data-${currentLang}`);
  }

  // Update placeholders
  document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
  });

  // Update button texts
  if (langToggleBtn) {
    langToggleBtn.textContent = currentLang === 'en' ? 'ع' : 'EN';
  }

  // Update form submit button
  document.querySelectorAll('button[type=\"submit\"]').forEach(btn => {
    if (btn.hasAttribute(`data-${currentLang}`)) {
      btn.textContent = btn.getAttribute(`data-${currentLang}`);
    }
  });
}

function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('lang', currentLang);
  updateText();
}

// Mobile nav toggle
function toggleMobileNav() {
  navMenu.classList.toggle('active');
}

// Smooth scrolling
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    }
  });
});

// Enhanced form submission with validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let valid = true;
  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#e74c3c';
    } else {
      input.style.borderColor = '#ddd';
    }
  });
  // Email validation
  const email = form.querySelector('input[type="email"]');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    valid = false;
    email.style.borderColor = '#e74c3c';
  }
  return valid;
}

document.addEventListener('submit', function(e) {
  if (e.target.matches('form')) {
    e.preventDefault();
    if (validateForm(e.target)) {
      const msg = currentLang === 'ar' ? 'شكراً لرسالتك! سنرد عليك قريباً.' : 'Thank you! We will reply soon.';
      alert(msg);
      e.target.reset();
    } else {
      alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول بشكل صحيح' : 'Please fill all fields correctly');
    }
  }
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Gallery lightbox
function openGallery(index) {
  galleryModal.style.display = 'flex';
  modalImg.src = galleryImages[index].src;
  modalImg.alt = galleryImages[index].alt;
  currentGalleryIndex = index;
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  galleryModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

let currentGalleryIndex = 0;

function nextGallery() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  modalImg.src = galleryImages[currentGalleryIndex].src;
  modalImg.alt = galleryImages[currentGalleryIndex].alt;
}

function prevGallery() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  modalImg.src = galleryImages[currentGalleryIndex].src;
  modalImg.alt = galleryImages[currentGalleryIndex].alt;
}

// Scroll fade-in animation
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });
  document.querySelectorAll('.fade-section, .gallery-item').forEach(el => {
    observer.observe(el);
  });
}

// Event listeners
document.addEventListener('click', (e) => {
  if (e.target.id === 'langToggle') {
    toggleLang();
  } else if (e.target.matches('.gallery-item img')) {
    const index = Array.from(galleryImages).indexOf(e.target);
    openGallery(index);
  } else if (e.target.classList.contains('modal-close') || e.target === galleryModal) {
    closeGallery();
  }
});

// Bottom nav active state
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.gallery-nav-next')) nextGallery();
  if (e.target.matches('.gallery-nav-prev')) prevGallery();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') nextGallery();
  if (e.key === 'ArrowLeft') prevGallery();
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateText();
  updateActiveNav();
  // Collect gallery images
  galleryImages = document.querySelectorAll('.gallery-item img');
  // Create modal if gallery exists
  if (galleryImages.length > 0) {
    galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-modal';
    galleryModal.innerHTML = `
      <span class="modal-close">&times;</span>
      <img class="modal-img" id="modalImg">
      <button class="gallery-nav-prev">&#10094;</button>
      <button class="gallery-nav-next">&#10093;</button>
    `;
    document.body.appendChild(galleryModal);
    modalImg = galleryModal.querySelector('#modalImg');
    prevBtn = galleryModal.querySelector('.gallery-nav-prev');
    nextBtn = galleryModal.querySelector('.gallery-nav-next');
  }
  initScrollAnimations();
});
