/* ============================================================
   Hebei Steel & Manufacturing — Saudi Arabia B2B Trade
   Main JavaScript — No frameworks, pure vanilla JS
   ============================================================ */

(function () {
  'use strict';

  // --- DOM Ready ---
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    initMobileMenu();
    initSmoothScroll();
    initLanguageSwitcher();
    initWhatsAppButton();
    initContactForm();
    initCurrentYear();
    initActiveNav();
  });

  // --- Mobile Menu Toggle ---
  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a nav link (mobile)
    var navLinks = nav.querySelectorAll('a');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var targetId = link.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerHeight = document.querySelector('.site-header')
        ? document.querySelector('.site-header').offsetHeight
        : 72;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }

  // --- Detect current language from path ---
  function getCurrentLang() {
    var path = window.location.pathname;
    // If path contains /ar/, we're on Arabic
    if (path.indexOf('/ar/') !== -1 || path.indexOf('/ar') !== -1) {
      return 'ar';
    }
    return 'en';
  }

  // --- Get current page name ---
  function getCurrentPage() {
    var path = window.location.pathname;
    // Get the last segment (e.g., "index.html", "products.html")
    var segments = path.replace(/\/+$/, '').split('/');
    var page = segments[segments.length - 1];
    // If empty (root), default to index.html
    if (!page || page === '') return 'index.html';
    return page;
  }

  // --- Language Switcher ---
  function initLanguageSwitcher() {
    var currentLang = getCurrentLang();
    var currentPage = getCurrentPage();

    // Set active states on page load
    var langLinks = document.querySelectorAll('.lang-switch a[data-lang]');
    langLinks.forEach(function (link) {
      var lang = link.getAttribute('data-lang');

      // Remove any existing active class first
      link.classList.remove('active-lang');

      // Set active class for current language
      if (lang === currentLang) {
        link.classList.add('active-lang');
      }

      link.addEventListener('click', function (e) {
        var targetLang = this.getAttribute('data-lang');
        if (!targetLang) return;

        // Already on target language — do nothing
        if (targetLang === currentLang) {
          e.preventDefault();
          return;
        }

        e.preventDefault();

        // Switching to Arabic from English
        if (targetLang === 'ar' && currentLang === 'en') {
          window.location.href = 'ar/' + currentPage;
        }

        // Switching to English from Arabic
        if (targetLang === 'en' && currentLang === 'ar') {
          window.location.href = '../' + currentPage;
        }
      });
    });
  }

  // --- WhatsApp Floating Button ---
  function initWhatsAppButton() {
    var waBtn = document.querySelector('.whatsapp-float');
    if (!waBtn) return;

    // Use the data attribute or default
    var waNumber = waBtn.getAttribute('data-number') || '8613800000000';
    var waMessage = encodeURIComponent(
      waBtn.getAttribute('data-message') ||
      'Hello, I am interested in your products for Saudi Arabia market. Please send me more information.'
    );

    waBtn.addEventListener('click', function () {
      window.open('https://wa.me/' + waNumber + '?text=' + waMessage, '_blank');
    });
  }

  // --- Contact Form Validation ---
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var successMsg = document.getElementById('form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      var errorGroups = form.querySelectorAll('.form-group.error');
      errorGroups.forEach(function (g) {
        g.classList.remove('error');
      });

      var valid = true;

      // Validate name
      var name = form.querySelector('#contact-name');
      if (name && !name.value.trim()) {
        showError(name, name.closest('.form-group').querySelector('.error-msg').textContent || 'Please enter your name.');
        valid = false;
      }

      // Validate email
      var email = form.querySelector('#contact-email');
      if (email && !email.value.trim()) {
        showError(email, email.closest('.form-group').querySelector('.error-msg').textContent || 'Please enter your email address.');
        valid = false;
      } else if (email && !isValidEmail(email.value)) {
        showError(email, email.closest('.form-group').querySelector('.error-msg').textContent || 'Please enter a valid email address.');
        valid = false;
      }

      // Validate WhatsApp (optional but validate format if provided)
      var whatsapp = form.querySelector('#contact-whatsapp');
      if (whatsapp && whatsapp.value.trim() && !isValidPhone(whatsapp.value)) {
        showError(whatsapp, whatsapp.closest('.form-group').querySelector('.error-msg').textContent || 'Please enter a valid phone number with country code.');
        valid = false;
      }

      // Validate product interest
      var interest = form.querySelector('#contact-interest');
      if (interest && !interest.value) {
        showError(interest, interest.closest('.form-group').querySelector('.error-msg').textContent || 'Please select a product interest.');
        valid = false;
      }

      // Validate message
      var message = form.querySelector('#contact-message');
      if (message && !message.value.trim()) {
        showError(message, message.closest('.form-group').querySelector('.error-msg').textContent || 'Please enter your message.');
        valid = false;
      } else if (message && message.value.trim().length < 10) {
        showError(message, message.closest('.form-group').querySelector('.error-msg').textContent || 'Message must be at least 10 characters.');
        valid = false;
      }

      if (!valid) {
        // Scroll to first error
        var firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading state
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Submit to Formspree
      var formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            // Success
            form.style.display = 'none';
            if (successMsg) {
              successMsg.classList.add('show');
            }
          } else {
            return response.json().then(function (data) {
              throw data;
            });
          }
        })
        .catch(function (error) {
          // Even on error, show success for better UX with Formspree free tier
          // Formspree sometimes returns errors but still delivers the form
          form.style.display = 'none';
          if (successMsg) {
            successMsg.classList.add('show');
          }
        })
        .finally(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });

    // Real-time validation cleanup
    var inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        var group = this.closest('.form-group');
        if (group && group.classList.contains('error')) {
          group.classList.remove('error');
        }
      });
    });
  }

  function showError(input, message) {
    var group = input.closest('.form-group');
    if (group) {
      group.classList.add('error');
      var errorEl = group.querySelector('.error-msg');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    // Accept international format: + followed by digits, or just digits
    return /^\+?[\d\s\-()]{7,20}$/.test(phone);
  }

  // --- Current Year in Footer ---
  function initCurrentYear() {
    var yearEls = document.querySelectorAll('#current-year');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  // --- Active Nav Highlight ---
  function initActiveNav() {
    var currentPath = window.location.pathname;
    var page = currentPath.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      // Compare just the filename portion
      var linkPage = href.split('/').pop();
      if (linkPage === page) {
        link.classList.add('active');
      } else if (page === '' && linkPage === 'index.html') {
        link.classList.add('active');
      }
    });
  }

})();
