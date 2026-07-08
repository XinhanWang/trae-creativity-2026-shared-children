/* ===== Shared Common JS — 共享儿女 · 暖陪伴计划 ===== */
/* Scroll reveal, number counter, scroll progress, ripple effect, toast enhancement */

(function () {
  'use strict';

  /* --- Scroll Progress Bar --- */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.style.width = '0%';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* --- Scroll Reveal (Intersection Observer) --- */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('reveal-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* --- Number Counter Animation --- */
  function animateCounter(el) {
    var target = el.getAttribute('data-target');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = parseInt(el.getAttribute('data-duration')) || 1500;
    var decimals = parseInt(el.getAttribute('data-decimals')) || 0;

    var targetNum = parseFloat(target);
    if (isNaN(targetNum)) return;

    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = targetNum * eased;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + targetNum.toFixed(decimals) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { animateCounter(el); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* --- Ripple Effect --- */
  function initRipple() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('.ripple-btn');
      if (!target) return;

      var rect = target.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      target.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  }

  /* --- Enhanced Toast (global helper) --- */
  window.showEnhancedToast = function (message, type) {
    var existing = document.getElementById('enhanced-toast-container');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'enhanced-toast-container';
      existing.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
      document.body.appendChild(existing);
    }

    var toast = document.createElement('div');
    var bg = 'var(--color-text)';
    var icon = 'check-circle';
    if (type === 'error') { bg = 'var(--state-error)'; icon = 'alert-circle'; }
    else if (type === 'warning') { bg = 'var(--state-warning)'; icon = 'alert-triangle'; }
    else if (type === 'success') { bg = 'var(--state-success)'; icon = 'check-circle'; }

    toast.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px 20px;border-radius:8px;background:' + bg + ';color:#fff;font-size:14px;font-family:var(--font-sans);box-shadow:0 4px 16px rgba(61,46,36,0.15);pointer-events:auto;max-width:320px;';
    toast.className = 'toast-animate';
    toast.innerHTML = '<span style="white-space:nowrap;">' + message + '</span>';
    existing.appendChild(toast);

    setTimeout(function () {
      toast.classList.remove('toast-animate');
      toast.classList.add('toast-animate-out');
      setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
  };

  /* --- Active Nav Highlight --- */
  function initActiveNav() {
    var navLinks = document.querySelectorAll('nav a[href]');
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === '#') || (currentPage === '' && href === '#')) {
        link.style.color = 'var(--color-primary)';
        link.style.fontWeight = '600';
      }
    });
  }

  /* --- Init All --- */
  function init() {
    initScrollProgress();
    initScrollReveal();
    initCounters();
    initRipple();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
