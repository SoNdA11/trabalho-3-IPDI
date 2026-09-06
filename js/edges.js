/* ============================================================
   EDGES MODULE — Sobel & Canny Visualization (Slide 7)
   ============================================================ */
var EdgesModule = (function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var sobelCanvas, sobelCtx;
  var cannyCanvas, cannyCtx;
  var cannyDesc;

  var sobelData = null;
  var sobelW = 160, sobelH = 160;
  var currentSobelMode = 'original';

  var cannyW = 200, cannyH = 200;
  var cannyImage = null;
  var cannySteps = [];
  var currentCannyStep = 0;

  var SOBEL_GX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  var SOBEL_GY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

  /* ---------- TEST IMAGE GENERATION ---------- */
  function generateSobelTestImage() {
    var w = sobelW, h = sobelH;
    var pixels = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var v = 50;
        if (x >= 50 && x < 110 && y >= 50 && y < 110) v = 200;
        pixels[y * w + x] = v;
      }
    }
    return pixels;
  }

  function generateCannyTestImage() {
    var w = cannyW, h = cannyH;
    var pixels = new Float32Array(w * h);
    var cx1 = 60, cy1 = 70, r1 = 28;
    var rx = 130, ry = 40, rw = 50, rh = 40;

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var v = 60;
        var dx1 = x - cx1, dy1 = y - cy1;
        if (dx1 * dx1 + dy1 * dy1 <= r1 * r1) v = 190;
        if (x >= rx && x < rx + rw && y >= ry && y < ry + rh) v = 200;
        pixels[y * w + x] = v;
      }
    }
    return pixels;
  }

  /* ---------- SOBEL CONVOLUTION ---------- */
  function applySobel(pixels, w, h, kernel) {
    var out = new Float32Array(w * h);
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var sum = 0;
        for (var ky = -1; ky <= 1; ky++) {
          for (var kx = -1; kx <= 1; kx++) {
            sum += pixels[(y + ky) * w + (x + kx)] * kernel[ky + 1][kx + 1];
          }
        }
        out[y * w + x] = sum;
      }
    }
    return out;
  }

  function computeSobelMagnitude(gx, gy, w, h) {
    var out = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) {
      out[i] = Math.min(255, Math.sqrt(gx[i] * gx[i] + gy[i] * gy[i]));
    }
    return out;
  }

  /* ---------- SOBEL CANVAS DRAWING ---------- */
  function drawSobelCanvas() {
    if (!sobelCanvas) return;
    var ctx = sobelCtx;
    var imgData = ctx.createImageData(sobelW, sobelH);
    var pixels = sobelData.pixels;
    var data = imgData.data;

    var display;
    if (currentSobelMode === 'original') {
      display = pixels;
    } else if (currentSobelMode === 'gx') {
      display = sobelData.gx;
    } else if (currentSobelMode === 'gy') {
      display = sobelData.gy;
    } else {
      display = sobelData.magnitude;
    }

    for (var i = 0; i < sobelW * sobelH; i++) {
      var v = Math.max(0, Math.min(255, Math.round(display[i])));
      data[i * 4] = v;
      data[i * 4 + 1] = v;
      data[i * 4 + 2] = v;
      data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function initSobel() {
    sobelCanvas = document.getElementById('sobelCanvas');
    if (!sobelCanvas) return;
    sobelCtx = sobelCanvas.getContext('2d');

    var pixels = generateSobelTestImage();
    var gx = applySobel(pixels, sobelW, sobelH, SOBEL_GX);
    var gy = applySobel(pixels, sobelW, sobelH, SOBEL_GY);
    var magnitude = computeSobelMagnitude(gx, gy, sobelW, sobelH);

    sobelData = { pixels: pixels, gx: gx, gy: gy, magnitude: magnitude };

    var btns = $$('.sv-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentSobelMode = btn.getAttribute('data-mode');
        drawSobelCanvas();
      });
    });

    drawSobelCanvas();
  }

  /* ---------- CANNY PIPELINE ---------- */
  function gaussianBlur3(pixels, w, h) {
    var kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
    var out = new Float32Array(w * h);
    var norm = 1 / 16;
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var sum = 0;
        var ki = 0;
        for (var ky = -1; ky <= 1; ky++) {
          for (var kx = -1; kx <= 1; kx++) {
            sum += pixels[(y + ky) * w + (x + kx)] * kernel[ki++];
          }
        }
        out[y * w + x] = sum * norm;
      }
    }
    return out;
  }

  function nonMaxSuppression(gx, gy, mag, w, h) {
    var out = new Float32Array(w * h);
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var idx = y * w + x;
        var angle = Math.atan2(gy[idx], gx[idx]) * 180 / Math.PI;
        if (angle < 0) angle += 180;

        var n1 = 0, n2 = 0;
        if ((angle >= 0 && angle < 22.5) || (angle >= 157.5 && angle < 180)) {
          n1 = mag[idx - 1];
          n2 = mag[idx + 1];
        } else if (angle >= 22.5 && angle < 67.5) {
          n1 = mag[(y - 1) * w + (x + 1)];
          n2 = mag[(y + 1) * w + (x - 1)];
        } else if (angle >= 67.5 && angle < 112.5) {
          n1 = mag[(y - 1) * w + x];
          n2 = mag[(y + 1) * w + x];
        } else {
          n1 = mag[(y - 1) * w + (x - 1)];
          n2 = mag[(y + 1) * w + (x + 1)];
        }
        out[idx] = (mag[idx] >= n1 && mag[idx] >= n2) ? mag[idx] : 0;
      }
    }
    return out;
  }

  function doubleThreshold(suppressed, w, h) {
    var low = 30, high = 80;
    var out = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) {
      if (suppressed[i] >= high) out[i] = 255;
      else if (suppressed[i] >= low) out[i] = 128;
      else out[i] = 0;
    }
    return out;
  }

  function hysteresis(thresholded, w, h) {
    var out = new Float32Array(w * h);
    for (var i = 0; i < w * h; i++) {
      out[i] = thresholded[i] === 255 ? 255 : 0;
    }
    var changed = true;
    while (changed) {
      changed = false;
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var idx = y * w + x;
          if (out[idx] === 0 && thresholded[idx] === 128) {
            for (var ky = -1; ky <= 1; ky++) {
              for (var kx = -1; kx <= 1; kx++) {
                if (out[(y + ky) * w + (x + kx)] === 255) {
                  out[idx] = 255;
                  changed = true;
                }
              }
            }
          }
        }
      }
    }
    return out;
  }

  function computeCannySteps(pixels) {
    var smoothed = gaussianBlur3(pixels, cannyW, cannyH);
    var gx = applySobel(smoothed, cannyW, cannyH, SOBEL_GX);
    var gy = applySobel(smoothed, cannyW, cannyH, SOBEL_GY);
    var magnitude = computeSobelMagnitude(gx, gy, cannyW, cannyH);
    var suppressed = nonMaxSuppression(gx, gy, magnitude, cannyW, cannyH);
    var thresholded = doubleThreshold(suppressed, cannyW, cannyH);
    var finalEdges = hysteresis(thresholded, cannyW, cannyH);

    return [smoothed, magnitude, suppressed, thresholded, finalEdges];
  }

  function drawCannyCanvas() {
    if (!cannyCanvas || cannySteps.length === 0) return;
    var ctx = cannyCtx;
    var imgData = ctx.createImageData(cannyW, cannyH);
    var step = cannySteps[currentCannyStep];
    var data = imgData.data;

    var isBinary = currentCannyStep >= 3;

    for (var i = 0; i < cannyW * cannyH; i++) {
      var v;
      if (isBinary) {
        v = step[i] === 255 ? 255 : 0;
      } else {
        v = Math.max(0, Math.min(255, Math.round(step[i])));
      }
      data[i * 4] = v;
      data[i * 4 + 1] = v;
      data[i * 4 + 2] = v;
      data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  var CANNY_DESCRIPTIONS = [
    'Suavização Gaussiana — reduz ruído antes do cálculo do gradiente.',
    'Gradiente — calcula magnitude e direção usando Sobel (Gx e Gy).',
    'Supressão de Não Máximos — afina bordas mantendo apenas os máximos locais.',
    'Limiar Duplo — classifica pixels em forte, fraco e não-borda.',
    'Histerese — conecta bordas fracas a fortes vizinhas, descartando isoladas.'
  ];

  function initCanny() {
    cannyCanvas = document.getElementById('cannyCanvas');
    cannyDesc = document.getElementById('cannyDesc');
    if (!cannyCanvas) return;
    cannyCtx = cannyCanvas.getContext('2d');

    var pixels = generateCannyTestImage();
    cannySteps = computeCannySteps(pixels);

    var items = $$('.ed-csi');
    items.forEach(function (el) {
      el.addEventListener('click', function () {
        items.forEach(function (e) { e.classList.remove('active'); });
        el.classList.add('active');
        currentCannyStep = parseInt(el.getAttribute('data-canny'), 10);
        drawCannyCanvas();
        if (cannyDesc) cannyDesc.textContent = CANNY_DESCRIPTIONS[currentCannyStep];
      });
    });

    drawCannyCanvas();
  }

  /* ---------- COMPARISON CANVASES ---------- */
  function initComparison() {
    var sobelComp = document.getElementById('compSobel');
    var cannyComp = document.getElementById('compCanny');
    if (sobelComp) drawCompEdge(sobelComp, 'sobel');
    if (cannyComp) drawCompEdge(cannyComp, 'canny');
  }

  function drawCompEdge(canvas, type) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var imgData = ctx.createImageData(w, h);

    var pixels = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var v = 60;
        var dx = x - w / 2, dy = y - h / 2;
        if (dx * dx + dy * dy < (w * 0.3) * (w * 0.3)) v = 190;
        pixels[y * w + x] = v;
      }
    }

    var gx = applySobel(pixels, w, h, SOBEL_GX);
    var gy = applySobel(pixels, w, h, SOBEL_GY);
    var mag = computeSobelMagnitude(gx, gy, w, h);

    var display;
    if (type === 'sobel') {
      display = mag;
    } else {
      var suppressed = nonMaxSuppression(gx, gy, mag, w, h);
      var thresholded = doubleThreshold(suppressed, w, h);
      display = hysteresis(thresholded, w, h);
    }

    for (var i = 0; i < w * h; i++) {
      var v = Math.max(0, Math.min(255, Math.round(display[i])));
      imgData.data[i * 4] = v;
      imgData.data[i * 4 + 1] = v;
      imgData.data[i * 4 + 2] = v;
      imgData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  }

  /* ---------- PUBLIC ---------- */
  function init() {
    initSobel();
    initCanny();
    initComparison();
  }

  function onSlideEnter() {
    drawSobelCanvas();
    drawCannyCanvas();
  }

  return { init: init, onSlideEnter: onSlideEnter };
})();
