/* ============================================================
   FILTRAGE SECTION — MEAN & MEDIAN INTERACTIVE
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };

  var meanValues = [120, 135, 128, 140, 125, 130, 118, 122, 132];
  var medianValues = [12, 15, 200, 14, 16, 13, 18, 11, 17];
  var sortedValues = medianValues.slice().sort(function (a, b) { return a - b; });

  function init() {
    buildKernelGrid();
    buildNeighborhoodViz();
    buildMedianNeighborhood();
    buildMedianSorted();
    bindFilterToggle();
  }

  /* ---------- FEATURE 1: FILTER TOGGLE ---------- */
  function bindFilterToggle() {
    var buttons = $$('.fl-tbtn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        var panelMean = $('#panelMean');
        var panelMedian = $('#panelMedian');
        if (filter === 'mean') {
          if (panelMean) panelMean.classList.add('active');
          if (panelMedian) panelMedian.classList.remove('active');
        } else {
          if (panelMedian) panelMedian.classList.add('active');
          if (panelMean) panelMean.classList.remove('active');
        }
      });
    });
  }

  /* ---------- FEATURE 2: MEAN FILTER ---------- */
  function buildKernelGrid() {
    var grid = $('#kernelGridMean');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('div');
      cell.className = 'kg';
      cell.textContent = '1';
      cell.dataset.idx = i;
      grid.appendChild(cell);
    }
  }

  function buildNeighborhoodViz() {
    var canvas = $('#kernelVizCanvas');
    if (!canvas) return;
    canvas.width = 120;
    canvas.height = 120;
    var ctx = canvas.getContext('2d');
    drawNeighborhoodGrid(ctx, 120, 120, meanValues, -1);
  }

  function drawNeighborhoodGrid(ctx, w, h, values, highlightIdx) {
    var cellW = w / 3;
    var cellH = h / 3;
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < 9; i++) {
      var row = Math.floor(i / 3);
      var col = i % 3;
      var v = values[i];
      var x = col * cellW;
      var y = row * cellH;
      if (i === highlightIdx) {
        ctx.fillStyle = '#7b2cbf';
      } else {
        ctx.fillStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
      }
      ctx.fillRect(x, y, cellW, cellH);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellW, cellH);
      ctx.fillStyle = i === highlightIdx ? '#fff' : (v > 140 ? '#000' : '#fff');
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(v, x + cellW / 2, y + cellH / 2);
    }
  }

  function animateKernelMean() {
    var cells = $$('.kg', $('#kernelGridMean'));
    var canvas = $('#kernelVizCanvas');
    var kbSum = $('#kbSum');
    var kbMean = $('#kbMean');
    var step = 0;
    var sum = 0;

    function doStep() {
      if (step >= cells.length) {
        var avg = Math.round(sum / cells.length);
        if (kbSum) kbSum.textContent = sum;
        if (kbMean) kbMean.textContent = avg;
        return;
      }
      cells.forEach(function (c) { c.classList.remove('active'); });
      cells[step].classList.add('active');
      sum += meanValues[step];
      if (kbSum) kbSum.textContent = sum;
      if (kbMean) kbMean.textContent = '—';
      if (canvas) {
        var ctx = canvas.getContext('2d');
        drawNeighborhoodGrid(ctx, 120, 120, meanValues, step);
      }
      step++;
      setTimeout(doStep, 300);
    }
    doStep();
  }

  /* ---------- FEATURE 3: MEDIAN FILTER ---------- */
  function buildMedianNeighborhood() {
    var grid = $('#medianNeighborhood');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 0; i < 9; i++) {
      var cell = document.createElement('div');
      cell.className = 'mb';
      var v = medianValues[i];
      cell.textContent = v;
      cell.dataset.idx = i;
      if (v > 200) cell.style.color = '#d62828';
      grid.appendChild(cell);
    }
  }

  function buildMedianSorted() {
    var grid = $('#medianSorted');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 0; i < sortedValues.length; i++) {
      var cell = document.createElement('div');
      cell.className = 'mb';
      var v = sortedValues[i];
      cell.textContent = v;
      cell.dataset.idx = i;
      if (v > 200) cell.style.color = '#d62828';
      if (i === 4) cell.classList.add('sel');
      grid.appendChild(cell);
    }
    var medianResult = $('#medianResultVal');
    if (medianResult) medianResult.textContent = sortedValues[4];
  }

  function animateMedian() {
    var sortedCells = $$('.mb', $('#medianSorted'));
    var step = 0;
    function doStep() {
      if (step >= sortedCells.length) {
        sortedCells.forEach(function (c) { c.classList.remove('sel'); });
        sortedCells[4].classList.add('sel');
        return;
      }
      sortedCells.forEach(function (c) { c.classList.remove('sel'); });
      sortedCells[step].classList.add('sel');
      step++;
      setTimeout(doStep, 200);
    }
    setTimeout(doStep, 500);
  }

  /* ---------- PUBLIC API ---------- */
  function onSlideEnter(slide) {
    var section = slide.dataset.section;
    if (section === 'mean-filter') animateKernelMean();
    if (section === 'median-filter') animateMedian();
  }

  window.FiltersModule = { init: init, onSlideEnter: onSlideEnter };
})();
