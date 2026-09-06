/* ============================================================
   PROCESSAMENTO DIGITAL DE IMAGENS — ANIMATIONS MODULE
   ============================================================ */
var AnimationsModule = (function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.from((c || document).querySelectorAll(s)); };

  var coverCanvas, coverCtx, coverAnimId;
  var endCanvas, endCtx, endAnimId;
  var coverPixels = [];
  var coverWords = [];

  var CYAN = '#00d4ff';
  var BLUE = '#0077cc';
  var PURPLE = '#7b2cbf';

  function init() {
    initCoverCanvas();
    initCoverWords();
    initEndCanvas();
    initCoverVisualFlow();
  }

  /* ---------- FEATURE 1: COVER CANVAS ---------- */
  function initCoverCanvas() {
    coverCanvas = document.getElementById('coverCanvas');
    if (!coverCanvas) return;
    coverCtx = coverCanvas.getContext('2d');
    var cols = 14;
    var rows = 14;
    var cellW = coverCanvas.width / cols;
    var cellH = coverCanvas.height / rows;

    coverPixels = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var colors = [CYAN, BLUE, PURPLE];
        coverPixels.push({
          x: c * cellW,
          y: r * cellH,
          w: cellW,
          h: cellH,
          baseColor: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.5,
          offset: Math.random() * 100
        });
      }
    }
    animateCover();
  }

  function animateCover() {
    if (!coverCtx) return;
    var time = Date.now() * 0.001;
    var w = coverCanvas.width;
    var h = coverCanvas.height;
    coverCtx.fillStyle = '#0a0e1a';
    coverCtx.fillRect(0, 0, w, h);

    for (var i = 0; i < coverPixels.length; i++) {
      var p = coverPixels[i];
      var brightness = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(time * p.speed + p.phase));
      coverCtx.globalAlpha = brightness;
      coverCtx.fillStyle = p.baseColor;
      coverCtx.fillRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2);
    }
    coverCtx.globalAlpha = 1;
    coverAnimId = requestAnimationFrame(animateCover);
  }

  function initCoverWords() {
    coverWords = $$('.cv-word');
    if (coverWords.length === 0) return;
    coverWords.forEach(function (w) { w.style.opacity = '0'; w.style.transform = 'translateY(8px)'; });
    coverWords.forEach(function (w, i) {
      setTimeout(function () {
        w.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }, 400 + i * 300);
    });
  }

  /* ---------- FEATURE 2: PIPELINE INDICATOR ---------- */
  function updatePipelineIndicator(slide) {
    var steps = $$('.pi-step');
    if (!steps.length) return;
    var idx = parseInt(slide.getAttribute('data-pipeline'));
    if (isNaN(idx)) idx = -1;

    steps.forEach(function (step) {
      var stepNum = parseInt(step.getAttribute('data-step'));
      if (stepNum === idx) {
        step.style.color = CYAN;
        step.style.opacity = '1';
        step.style.textShadow = '0 0 8px ' + CYAN + '66';
      } else {
        step.style.color = '';
        step.style.opacity = '0.35';
        step.style.textShadow = 'none';
      }
    });

    var dots = $$('.pi-dot');
    dots.forEach(function (dot, i) {
      var leftStep = parseInt(steps[i] && steps[i].getAttribute('data-step'));
      var rightStep = parseInt(steps[i + 1] && steps[i + 1].getAttribute('data-step'));
      if (!isNaN(leftStep) && !isNaN(rightStep) && leftStep <= idx && rightStep >= idx) {
        dot.style.background = CYAN;
        dot.style.opacity = '0.7';
      } else if (!isNaN(leftStep) && leftStep < idx) {
        dot.style.background = CYAN;
        dot.style.opacity = '0.4';
      } else {
        dot.style.background = '';
        dot.style.opacity = '';
      }
    });
  }

  /* ---------- FEATURE 3: COVER VISUAL FLOW ---------- */
  function initCoverVisualFlow() {
    var flow = $$('.cv-flow .cv-word, .cv-flow .cv-arrow');
    flow.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
    });
    flow.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 600 + i * 200);
    });
  }

  /* ---------- FEATURE 4: SLIDE ENTER ANIMATIONS ---------- */
  function onSlideEnter(slide) {
    var reveals = $$('.reveal', slide);
    reveals.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(function () {
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 120);
    });

    var grids = $$('.roadmap-grid, .tg-grid, .filter-compare', slide);
    grids.forEach(function (grid) {
      var children = Array.from(grid.children);
      children.forEach(function (child, i) {
        child.style.opacity = '0';
        child.style.transform = 'scale(0.95)';
        setTimeout(function () {
          child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          child.style.opacity = '1';
          child.style.transform = 'scale(1)';
        }, 300 + i * 150);
      });
    });

    var nodes = $$('.rm-node', slide);
    nodes.forEach(function (node, i) {
      node.style.opacity = '0';
      node.style.transform = 'translateY(10px)';
      setTimeout(function () {
        node.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, 400 + i * 250);
    });

    if (slide.classList.contains('s-end')) {
      animateEndCanvas();
      animateEndFlow();
    }

    updatePipelineIndicator(slide);
  }

  /* ---------- FEATURE 5: END CANVAS ---------- */
  function initEndCanvas() {
    endCanvas = document.getElementById('endCanvas');
    if (!endCanvas) return;
    endCtx = endCanvas.getContext('2d');
  }

  function animateEndCanvas() {
    if (!endCtx) return;
    var words = ['PIXELS', 'IMAGEM', 'CARACTERÍSTICAS', 'INFORMAÇÃO'];
    var w = endCanvas.width;
    var h = endCanvas.height;
    var phase = 0;

    if (endAnimId) cancelAnimationFrame(endAnimId);

    function draw() {
      var t = Date.now() * 0.001;
      endCtx.fillStyle = '#0a0e1a';
      endCtx.fillRect(0, 0, w, h);

      var colW = w / words.length;
      for (var i = 0; i < words.length; i++) {
        var cx = colW * i + colW / 2;
        var cy = h / 2;
        var pulse = 0.6 + 0.4 * Math.sin(t * 1.5 + i * 0.8);
        var glow = 2 + 6 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.2));

        endCtx.save();
        endCtx.globalAlpha = pulse * 0.15;
        endCtx.fillStyle = CYAN;
        endCtx.shadowColor = CYAN;
        endCtx.shadowBlur = glow;
        endCtx.fillRect(cx - 30, cy - 20, 60, 40);
        endCtx.restore();

        endCtx.save();
        endCtx.globalAlpha = 0.5 + 0.5 * pulse;
        endCtx.fillStyle = '#e0e0e0';
        endCtx.font = '600 11px "JetBrains Mono", monospace';
        endCtx.textAlign = 'center';
        endCtx.textBaseline = 'middle';
        endCtx.fillText(words[i], cx, cy);
        endCtx.restore();

        if (i < words.length - 1) {
          var ax = colW * (i + 1);
          endCtx.save();
          endCtx.globalAlpha = 0.3 + 0.3 * Math.sin(t * 1.8 + i);
          endCtx.strokeStyle = PURPLE;
          endCtx.lineWidth = 1.5;
          endCtx.beginPath();
          endCtx.moveTo(ax - colW * 0.2, cy);
          endCtx.lineTo(ax - colW * 0.05, cy);
          endCtx.stroke();
          endCtx.restore();
        }
      }
      endAnimId = requestAnimationFrame(draw);
    }
    draw();
  }

  function animateEndFlow() {
    var flow = $$('.end-flow span');
    flow.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(6px)';
    });
    flow.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 500 + i * 250);
    });
  }

  return {
    init: init,
    onSlideEnter: onSlideEnter,
    updatePipelineIndicator: updatePipelineIndicator
  };
})();
