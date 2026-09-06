/* ============================================================
   LAPLACIAN MODULE — Slide 8 + Conclusion canvas
   ============================================================ */
var LaplacianModule = (function () {
  'use strict';

  var W = 200, H = 200;
  var lapCanvas, lapCtx, endCanvas, endCtx;
  var testPixels;
  var currentMode = 'original';

  var KERNEL_BASIC = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0]
  ];

  var KERNEL_DIAGONAL = [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1]
  ];

  function generateTestImage() {
    var pixels = new Float32Array(W * H);
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var v = 100;
        if (x > 50 && x < 150 && y > 50 && y < 150) v = 180;
        var dx = x - 100, dy = y - 100;
        if (Math.sqrt(dx * dx + dy * dy) < 25) v = 220;
        v += (Math.random() - 0.5) * 16;
        v = Math.max(0, Math.min(255, v));
        pixels[y * W + x] = v;
      }
    }
    return pixels;
  }

  function convolve(pixels, kernel) {
    var out = new Float32Array(W * H);
    var kR = 1;
    for (var y = kR; y < H - kR; y++) {
      for (var x = kR; x < W - kR; x++) {
        var sum = 0;
        for (var ky = -kR; ky <= kR; ky++) {
          for (var kx = -kR; kx <= kR; kx++) {
            sum += pixels[(y + ky) * W + (x + kx)] * kernel[ky + kR][kx + kR];
          }
        }
        out[y * W + x] = sum;
      }
    }
    return out;
  }

  function renderGrayscale(pixels) {
    var imgData = lapCtx.createImageData(W, H);
    for (var i = 0; i < pixels.length; i++) {
      var v = Math.max(0, Math.min(255, Math.round(pixels[i])));
      var idx = i * 4;
      imgData.data[idx] = v;
      imgData.data[idx + 1] = v;
      imgData.data[idx + 2] = v;
      imgData.data[idx + 3] = 255;
    }
    lapCtx.putImageData(imgData, 0, 0);
  }

  function renderInverted(pixels) {
    var imgData = lapCtx.createImageData(W, H);
    var maxAbs = 1;
    for (var i = 0; i < pixels.length; i++) {
      var a = Math.abs(pixels[i]);
      if (a > maxAbs) maxAbs = a;
    }
    for (var j = 0; j < pixels.length; j++) {
      var v = Math.min(255, Math.round((Math.abs(pixels[j]) / maxAbs) * 255));
      var inv = 255 - v;
      var idx = j * 4;
      imgData.data[idx] = inv;
      imgData.data[idx + 1] = inv;
      imgData.data[idx + 2] = inv;
      imgData.data[idx + 3] = 255;
    }
    lapCtx.putImageData(imgData, 0, 0);
  }

  function applyMode(mode) {
    currentMode = mode;
    if (mode === 'original') {
      renderGrayscale(testPixels);
    } else if (mode === 'basic') {
      var result = convolve(testPixels, KERNEL_BASIC);
      renderInverted(result);
    } else if (mode === 'diagonal') {
      var result2 = convolve(testPixels, KERNEL_DIAGONAL);
      renderInverted(result2);
    }
    highlightButton(mode);
  }

  function highlightButton(mode) {
    var btns = document.querySelectorAll('.lp-vbtn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-lap') === mode);
    }
  }

  function drawEndAnimation() {
    if (!endCanvas || !endCtx) return;
    var w = endCanvas.width, h = endCanvas.height;
    endCtx.clearRect(0, 0, w, h);

    var steps = ['PIXELS', 'IMAGEM', 'CARACTERÍSTICAS', 'INFORMAÇÃO'];
    var colors = ['#2563eb', '#7c3aed', '#0891b2', '#059669'];

    var itemW = 80;
    var gap = (w - itemW * steps.length) / (steps.length + 1);
    var cy = h / 2;

    for (var i = 0; i < steps.length; i++) {
      var x = gap + i * (itemW + gap);

      endCtx.fillStyle = colors[i];
      endCtx.globalAlpha = 0.1;
      endCtx.beginPath();
      endCtx.roundRect(x - 5, cy - 20, itemW + 10, 40, 6);
      endCtx.fill();

      endCtx.globalAlpha = 1;
      endCtx.fillStyle = colors[i];
      endCtx.font = '600 10px "Inter", sans-serif';
      endCtx.textAlign = 'center';
      endCtx.textBaseline = 'middle';
      endCtx.fillText(steps[i], x + itemW / 2, cy);

      if (i < steps.length - 1) {
        var ax1 = x + itemW + 4;
        var ax2 = gap + (i + 1) * (itemW + gap) - 4;
        endCtx.strokeStyle = '#94a3b8';
        endCtx.lineWidth = 1.5;
        endCtx.globalAlpha = 0.4;
        endCtx.beginPath();
        endCtx.moveTo(ax1, cy);
        endCtx.lineTo(ax2, cy);
        endCtx.stroke();
        endCtx.beginPath();
        endCtx.moveTo(ax2 - 5, cy - 4);
        endCtx.lineTo(ax2, cy);
        endCtx.lineTo(ax2 - 5, cy + 4);
        endCtx.stroke();
        endCtx.globalAlpha = 1;
      }
    }
  }

  function init() {
    lapCanvas = document.getElementById('lapCanvas');
    endCanvas = document.getElementById('endCanvas');

    if (lapCanvas) {
      lapCtx = lapCanvas.getContext('2d');
      testPixels = generateTestImage();
      applyMode('original');

      var btns = document.querySelectorAll('.lp-vbtn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function () {
          applyMode(this.getAttribute('data-lap'));
        });
      }
    }

    if (endCanvas) {
      endCtx = endCanvas.getContext('2d');
      drawEndAnimation();
    }
  }

  function onSlideEnter() {
    if (!lapCanvas) init();
    else applyMode(currentMode);
    if (endCanvas) drawEndAnimation();
  }

  return { init: init, onSlideEnter: onSlideEnter };
})();
