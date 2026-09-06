/* ============================================================
   EQUALIZATION MODULE — Slide 5
   ============================================================ */
var EqualizationModule = (function () {
  'use strict';

  var $ = function (s) { return document.getElementById(s); };

  function drawDarkImage(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var imgData = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var v = Math.floor(40 + Math.random() * 80);
        var idx = (y * w + x) * 4;
        imgData.data[idx] = v;
        imgData.data[idx + 1] = v;
        imgData.data[idx + 2] = v;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function drawEqualizedImage(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var imgData = ctx.createImageData(w, h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var v = Math.floor(40 + Math.random() * 200);
        var idx = (y * w + x) * 4;
        imgData.data[idx] = v;
        imgData.data[idx + 1] = v;
        imgData.data[idx + 2] = v;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  function drawConcentratedHist(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < 50; i++) {
      var barH = Math.max(2, 80 * Math.exp(-Math.pow(i - 12, 2) / 6));
      var barW = w / 50;
      ctx.fillStyle = 'rgba(26,26,26,0.5)';
      ctx.fillRect(i * barW, h - (barH / 100) * h - 10, barW - 1, (barH / 100) * h);
    }
  }

  function drawSpreadHist(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < 50; i++) {
      var barH = 15 + Math.random() * 55;
      var barW = w / 50;
      ctx.fillStyle = 'rgba(45,106,79,0.5)';
      ctx.fillRect(i * barW, h - (barH / 100) * h - 10, barW - 1, (barH / 100) * h);
    }
  }

  function drawCdf(canvas) {
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#2d6a4f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < w; i++) {
      var t = i / w;
      var y = h - 10 - (Math.pow(t, 0.7) * (h - 20));
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.moveTo(0, h - 10);
    ctx.lineTo(w, h - 10);
    ctx.stroke();
  }

  function drawEqHist1(canvas) { drawConcentratedHist(canvas); }
  function drawEqHist2(canvas) { drawSpreadHist(canvas); }

  function init() {
    var img1 = $('eqImg1');
    var hist1 = $('eqHist1');
    if (img1) drawDarkImage(img1);
    if (hist1) drawConcentratedHist(hist1);

    var btn = $('btnRunEq');
    if (btn) btn.addEventListener('click', run);
  }

  function run() {
    var steps = [
      $('eqStep1'),
      $('eqStep2'),
      $('eqStep3'),
      $('eqStep4'),
      $('eqStep5'),
    ];

    steps.forEach(function (s) {
      if (s) s.classList.remove('visible', 'highlight');
    });

    var i = 0;
    function showStep() {
      if (i >= steps.length) return;
      if (i > 0 && steps[i - 1]) steps[i - 1].classList.remove('highlight');
      if (steps[i]) steps[i].classList.add('visible', 'highlight');
      i++;
      if (i < steps.length) {
        setTimeout(showStep, 800);
      } else {
        setTimeout(function () {
          drawEqVizCanvases(true);
        }, 400);
      }
    }
    showStep();
  }

  function drawEqVizCanvases(equalized) {
    var img1 = $('eqImg1');
    var img2 = $('eqImg2');
    var hist1 = $('eqHist1');
    var hist2 = $('eqHist2');
    var cdfCanvas = $('eqCdf');

    if (img1) drawDarkImage(img1);
    if (img2 && equalized) drawEqualizedImage(img2);
    if (hist1) drawConcentratedHist(hist1);
    if (hist2 && equalized) drawSpreadHist(hist2);
    if (cdfCanvas && equalized) drawCdf(cdfCanvas);
  }

  return { init: init, run: run };
})();
