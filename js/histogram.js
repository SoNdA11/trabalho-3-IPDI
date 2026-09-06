/* ============================================================
   HISTOGRAM MODULE — Matrix ↔ Histogram + Type Comparison
   ============================================================ */
var HistogramModule = (function () {
  'use strict';

  var DEFAULT_MATRIX = [
    [20, 40, 40, 80, 120],
    [30, 40, 70, 100, 130],
    [20, 50, 90, 110, 150],
    [10, 60, 80, 120, 140],
    [30, 50, 100, 130, 160]
  ];

  var PRESET_VALUES = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 255];

  var TYPE_INFO = {
    'dark': {
      title: 'Escura',
      desc: 'Intensidades concentradas à esquerda (0–80). Tons escuros dominam a imagem.',
      color: '#1a1a1a'
    },
    'bright': {
      title: 'Clara',
      desc: 'Intensidades concentradas à direita (170–255). Tons claros dominam a imagem.',
      color: '#2d6a4f'
    },
    'low-contrast': {
      title: 'Baixo Contraste',
      desc: 'Intensidades numa faixa estreita no meio (90–160). Pouca variação de tons.',
      color: '#bc6c25'
    },
    'high-contrast': {
      title: 'Bom Contraste',
      desc: 'Intensidades bem distribuídas (0–255). Boa utilização de toda a faixa dinâmica.',
      color: '#7b2cbf'
    }
  };

  var matrix = [];
  var gridEl = null;
  var histCanvas = null;

  /* ---------- INIT ---------- */
  function init() {
    buildMatrixGrid();
    buildHistogramTypes();
  }

  /* ==========================================================
     FEATURE 1 — Interactive Matrix → Histogram
     ========================================================== */
  function buildMatrixGrid() {
    gridEl = document.getElementById('matrixGrid');
    histCanvas = document.getElementById('matrixHistCanvas');
    if (!gridEl || !histCanvas) return;

    matrix = DEFAULT_MATRIX.map(function (row) { return row.slice(); });
    renderGrid();
    drawMatrixHistogram();
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    for (var r = 0; r < 5; r++) {
      for (var c = 0; c < 5; c++) {
        var cell = document.createElement('div');
        cell.className = 'mcell';
        var v = matrix[r][c];
        applyCellStyle(cell, v);
        cell.textContent = v;
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', onCellClick);
        gridEl.appendChild(cell);
      }
    }
  }

  function applyCellStyle(cell, val) {
    var t = val / 255;
    var gray = Math.floor(30 + t * 200);
    cell.style.background = 'rgba(' + gray + ',' + gray + ',' + gray + ',0.12)';
    cell.style.color = 'rgb(' + gray + ',' + gray + ',' + gray + ')';
    cell.style.border = '1px solid rgba(' + gray + ',' + gray + ',' + gray + ',0.15)';
    cell.textContent = val;
  }

  function onCellClick() {
    var r = parseInt(this.dataset.row);
    var c = parseInt(this.dataset.col);
    var cur = matrix[r][c];
    var idx = PRESET_VALUES.indexOf(cur);
    var next = (idx !== -1 && idx < PRESET_VALUES.length - 1)
      ? PRESET_VALUES[idx + 1]
      : PRESET_VALUES[0];
    matrix[r][c] = next;
    applyCellStyle(this, next);
    drawMatrixHistogram();
  }

  function drawMatrixHistogram() {
    if (!histCanvas) return;
    var ctx = histCanvas.getContext('2d');
    var w = histCanvas.width;
    var h = histCanvas.height;
    ctx.clearRect(0, 0, w, h);

    var hist = {};
    for (var r = 0; r < 5; r++) {
      for (var c = 0; c < 5; c++) {
        var v = matrix[r][c];
        hist[v] = (hist[v] || 0) + 1;
      }
    }

    var vals = Object.keys(hist).map(Number).sort(function (a, b) { return a - b; });
    if (vals.length === 0) return;

    var maxCount = 0;
    vals.forEach(function (v) { if (hist[v] > maxCount) maxCount = hist[v]; });
    var barW = w / 256;
    var padY = 10;

    vals.forEach(function (v) {
      var barH = (hist[v] / maxCount) * (h - padY * 2);
      var x = v * barW;
      var y = h - padY - barH;
      var gradient = ctx.createLinearGradient(0, y, 0, h - padY);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, 'rgba(26,26,26,0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(barW - 0.5, 1), barH);
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(0, h - 1);
    ctx.lineTo(w, h - 1);
    ctx.stroke();
  }

  function updateMatrixHistogram() {
    drawMatrixHistogram();
  }

  /* ==========================================================
     FEATURE 2 — Histogram Types Comparison
     ========================================================== */
  function buildHistogramTypes() {
    var btns = document.querySelectorAll('.tt-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        showType(btn.dataset.type);
      });
    });

    var activeBtn = document.querySelector('.tt-btn.active');
    var initialType = activeBtn ? activeBtn.dataset.type : 'dark';
    showType(initialType);
  }

  function showType(type) {
    var info = TYPE_INFO[type];
    if (!info) return;

    drawTypeImage(type);
    drawTypeHistogram(type);
    updateTypeInfo(type, info);
  }

  function drawTypeImage(type) {
    var canvas = document.getElementById('typesImageCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var imgData = ctx.createImageData(w, h);

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var n = Math.random();
        var v;
        if (type === 'dark') {
          v = Math.floor(Math.pow(n, 2) * 80);
        } else if (type === 'bright') {
          v = Math.floor(170 + Math.pow(n, 0.5) * 85);
        } else if (type === 'low-contrast') {
          v = Math.floor(90 + n * 70);
        } else {
          v = Math.floor(n * 256);
        }
        v = Math.max(0, Math.min(255, v));
        var idx = (y * w + x) * 4;
        imgData.data[idx] = v;
        imgData.data[idx + 1] = v;
        imgData.data[idx + 2] = v;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function drawTypeHistogram(type) {
    var canvas = document.getElementById('typesHistCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var hist = new Uint32Array(256);
    var imgW = 200;
    var imgH = 200;

    for (var i = 0; i < imgW * imgH; i++) {
      var n = Math.random();
      var v;
      if (type === 'dark') {
        v = Math.floor(Math.pow(n, 2) * 80);
      } else if (type === 'bright') {
        v = Math.floor(170 + Math.pow(n, 0.5) * 85);
      } else if (type === 'low-contrast') {
        v = Math.floor(90 + n * 70);
      } else {
        v = Math.floor(n * 256);
      }
      v = Math.max(0, Math.min(255, v));
      hist[v]++;
    }

    var maxVal = 0;
    for (var j = 0; j < 256; j++) {
      if (hist[j] > maxVal) maxVal = hist[j];
    }
    if (maxVal === 0) return;

    var barW = w / 256;
    var padY = 10;

    for (var k = 0; k < 256; k++) {
      var barH = (hist[k] / maxVal) * (h - padY * 2);
      var x = k * barW;
      var y = h - padY - barH;
      var gradient = ctx.createLinearGradient(0, y, 0, h - padY);
      gradient.addColorStop(0, TYPE_INFO[type].color);
      gradient.addColorStop(1, TYPE_INFO[type].color + '4D');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(barW - 0.5, 1), barH);
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(0, h - 1);
    ctx.lineTo(w, h - 1);
    ctx.stroke();
  }

  function updateTypeInfo(type, info) {
    var el = document.getElementById('typesInfo');
    if (!el) return;
    el.innerHTML = '<h3>' + info.title + '</h3><p>' + info.desc + '</p>';
  }

  /* ---------- PUBLIC API ---------- */
  return {
    init: init,
    updateMatrixHistogram: updateMatrixHistogram
  };
})();
