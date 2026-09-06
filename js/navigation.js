/* ============================================================
   NAVIGATION MODULE — Slide nav, sidebar, keyboard, touch
   ============================================================ */
(function () {
  'use strict';

  var current = 0;
  var slides = [];
  var total = 0;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  var presentation, progressFill, slideCounter, navPrev, navNext;
  var menuBtn, sidebar, sidebarClose, sidebarList;

  var pipelineSteps = ['IMAGEM', 'ANÁLISE', 'MELHORIA', 'LIMPEZA', 'EXTRAÇÃO', 'INFORMAÇÃO'];

  var sectionLabels = {
    'histogram': 'Ana Beatriz — Histograma',
    'histogram-types': 'Ana Beatriz — Tipos',
    'equalization': 'Cindy Vitória — Equalização',
    'filtering': 'Eduardo Marinho — Filtragem',
    'edges': 'Luis Jerônimo — Bordas',
    'laplacian': 'Paulo Sérgio — Laplaciano',
    'pipeline': 'Paulo Sérgio — Pipeline',
  };

  function init() {
    presentation = $('#presentation');
    progressFill = $('#progressFill');
    slideCounter = $('#slideCounter');
    navPrev = $('#navPrev');
    navNext = $('#navNext');
    menuBtn = $('#menuBtn');
    sidebar = $('#sidebar');
    sidebarClose = $('#sidebarClose');
    sidebarList = $('#sidebarList');

    slides = $$('.slide', presentation);
    total = slides.length;

    buildSidebar();
    goTo(0, false);
    bindEvents();
  }

  /* ---------- NAVIGATION ---------- */
  function goTo(idx, animate) {
    if (animate === undefined) animate = true;
    if (idx < 0 || idx >= total) return;

    var prev = slides[current];
    var next = slides[idx];

    if (prev && prev !== next) {
      prev.classList.remove('active');
      prev.classList.add('exit-left');
      setTimeout(function () { prev.classList.remove('exit-left'); }, 500);
    }

    current = idx;
    next.classList.add('active');

    updateProgress();
    updateCounter();
    updateNav();
    updateSidebar();
    if (animate) triggerSlideAnimations(next);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function getCurrent() { return current; }
  function getSlides() { return slides; }
  function getTotal() { return total; }

  /* ---------- PROGRESS / COUNTER / NAV ---------- */
  function updateProgress() {
    if (progressFill) {
      progressFill.style.width = ((current + 1) / total * 100) + '%';
    }
  }

  function updateCounter() {
    if (slideCounter) {
      slideCounter.textContent = (current + 1) + ' / ' + total;
    }
  }

  function updateNav() {
    if (navPrev) navPrev.disabled = current === 0;
    if (navNext) navNext.disabled = current === total - 1;
  }

  /* ---------- SIDEBAR ---------- */
  function buildSidebar() {
    if (!sidebarList) return;
    sidebarList.innerHTML = '';

    var usedSections = {};

    slides.forEach(function (s, i) {
      var sec = s.dataset.section || '';

      if (sectionLabels[sec] && !usedSections[sec]) {
        usedSections[sec] = true;
        var lbl = document.createElement('li');
        lbl.className = 'sl-label';
        lbl.textContent = sectionLabels[sec];
        sidebarList.appendChild(lbl);
      }

      var li = document.createElement('li');
      var h2 = $('h2', s);
      var h1 = $('h1', s);
      var title = '';
      if (h1) title = h1.textContent.trim();
      else if (h2) title = h2.textContent.trim();
      else title = 'Slide ' + (i + 1);

      var num = i + 1;
      var display = num + '. ' + title;
      li.textContent = display.length > 50 ? display.slice(0, 48) + '…' : display;
      li.dataset.idx = i;

      li.addEventListener('click', (function (idx) {
        return function () {
          goTo(idx);
          sidebar.classList.remove('open');
        };
      })(i));

      sidebarList.appendChild(li);
    });
  }

  function updateSidebar() {
    $$('.sidebar-list li:not(.sl-label)', sidebarList).forEach(function (li) {
      li.classList.toggle('active', parseInt(li.dataset.idx, 10) === current);
    });
  }

  /* ---------- KEYBOARD EVENTS ---------- */
  function handleKeydown(e) {
    var tag = (e.target || {}).tagName || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
    else if (e.key === 'f' || e.key === 'F') { toggleFullscreen(); }
    else if (e.key === 'Escape') { sidebar.classList.remove('open'); }
  }

  /* ---------- TOUCH EVENTS ---------- */
  var touchStartX = 0;
  var touchStartY = 0;

  function handleTouchstart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchend(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  }

  /* ---------- FULLSCREEN ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      var el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  /* ---------- SLIDE ANIMATIONS ---------- */
  function triggerSlideAnimations(slide) {
    $$('.step-item', slide).forEach(function (el, i) {
      setTimeout(function () { el.classList.add('active'); }, 300 + i * 200);
    });
    $$('.eq-step', slide).forEach(function (el, i) {
      setTimeout(function () { el.classList.add('active'); }, 300 + i * 250);
    });
  }

  /* ---------- EVENTS ---------- */
  function bindEvents() {
    document.addEventListener('keydown', handleKeydown);

    if (navPrev) navPrev.addEventListener('click', prev);
    if (navNext) navNext.addEventListener('click', next);

    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
      });
    }

    if (sidebarClose) {
      sidebarClose.addEventListener('click', function () {
        sidebar.classList.remove('open');
      });
    }

    if (presentation) {
      presentation.addEventListener('touchstart', handleTouchstart, { passive: true });
      presentation.addEventListener('touchend', handleTouchend, { passive: true });
    }
  }

  /* ---------- EXPORT ---------- */
  window.PresentationNav = {
    init: init,
    goTo: goTo,
    next: next,
    prev: prev,
    getCurrent: getCurrent,
    getSlides: getSlides,
    getTotal: getTotal,
  };
})();
