// Bilingual functionality - default Arabic
let currentLang = localStorage.getItem('lang') || 'ar';

const langToggleBtn = document.getElementById('langToggle');
const navMenu = document.querySelector('nav ul');
const hamburger = null;

// Gallery modal elements
let galleryModal, modalImg, prevBtn, nextBtn, galleryImages = [];

// Update text and attributes
function updateText() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-ar', currentLang === 'ar');

  document.querySelectorAll('[data-en][data-ar]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });

  const titleEl = document.querySelector('title');
  if (titleEl && titleEl.hasAttribute(`data-${currentLang}`)) {
    titleEl.textContent = titleEl.getAttribute(`data-${currentLang}`);
  }

  document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
  });

  if (langToggleBtn) {
    langToggleBtn.textContent = currentLang === 'en' ? 'ع' : 'EN';
  }

  document.querySelectorAll('button[type="submit"]').forEach(btn => {
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

function toggleMobileNav() {
  navMenu.classList.toggle('active');
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "393d754f-0028-4a51-bc21-b230ba5cb8d0");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 100);
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
}

function prevGallery() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  modalImg.src = galleryImages[currentGalleryIndex].src;
}

// Scroll animation
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('fade-in');
    });
  });

  document.querySelectorAll('.fade-section, .gallery-item').forEach(el => {
    observer.observe(el);
  });
}

// Events
document.addEventListener('click', (e) => {
  if (e.target.id === 'langToggle') toggleLang();

  if (e.target.matches('.gallery-item img')) {
    const index = Array.from(galleryImages).indexOf(e.target);
    openGallery(index);
  }

  if (e.target.classList.contains('modal-close') || e.target === galleryModal) {
    closeGallery();
  }

  if (e.target.matches('.gallery-nav-next')) nextGallery();
  if (e.target.matches('.gallery-nav-prev')) prevGallery();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') nextGallery();
  if (e.key === 'ArrowLeft') prevGallery();
});

// Active nav
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.bottom-nav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateText();
  updateActiveNav();

  galleryImages = document.querySelectorAll('.gallery-item img');

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
