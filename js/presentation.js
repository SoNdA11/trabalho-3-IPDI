(function() {
  'use strict';

  function init() {
    PresentationNav.init();
    HistogramModule.init();
    EqualizationModule.init();
    FiltersModule.init();
    EdgesModule.init();
    LaplacianModule.init();
    ApplicationsModule.init();
    AnimationsModule.init();

    setupSlideCallbacks();
  }

  function setupSlideCallbacks() {
    var originalGoTo = PresentationNav.goTo.bind(PresentationNav);

    PresentationNav.goTo = function(idx, animate) {
      originalGoTo(idx, animate);
      onSlideEnter(idx);
    };
  }

  function onSlideEnter(idx) {
    var slides = PresentationNav.getSlides();
    var slide = slides[idx];
    if (!slide) return;

    AnimationsModule.onSlideEnter(slide);

    switch (idx) {
      case 5:
        FiltersModule.onSlideEnter();
        break;
      case 6:
        EdgesModule.onSlideEnter();
        break;
      case 7:
        LaplacianModule.onSlideEnter();
        break;
      case 9:
        LaplacianModule.onSlideEnter();
        break;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
