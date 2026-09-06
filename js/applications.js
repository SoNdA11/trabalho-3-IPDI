/* ============================================================
   PROCESSAMENTO DIGITAL DE IMAGENS — APPLICATIONS MODULE
   ============================================================ */
var ApplicationsModule = (function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var apps = {
    cv:  { name: 'Visão Computacional', desc: 'Extração de características para reconhecimento de padrões usando histogramas e bordas.', stages: ['Histograma', 'Detecção de Bordas'] },
    obj: { name: 'Reconhecimento de Objetos', desc: 'Detecção e classificação em tempo real, combinando filtragem e detecção de bordas.', stages: ['Filtragem', 'Detecção de Bordas'] },
    ocr: { name: 'OCR', desc: 'Reconhecimento óptico de caracteres depende de bordas bem definidas e contraste adequado.', stages: ['Detecção de Bordas', 'Equalização'] },
    sec: { name: 'Segurança', desc: 'Câmeras de vigilância usam equalização e detecção de bordas para reconhecimento.', stages: ['Equalização', 'Detecção de Bordas'] },
    med: { name: 'Imagens Médicas', desc: 'Raio-X e ressonância magnética requerem equalização adaptativa (CLAHE) e filtragem.', stages: ['Equalização Adaptativa', 'Filtragem'] },
    sat: { name: 'Satélite', desc: 'Monitoramento ambiental usa filtragem e segmentação por bordas.', stages: ['Filtragem', 'Segmentação'] },
    rob: { name: 'Robótica', desc: 'Navegação autônoma depende de detecção de bordas e limpeza de ruído.', stages: ['Detecção de Bordas', 'Filtragem'] },
    car: { name: 'Veículos Autônomos', desc: 'Detecção de faixas, sinais e pedestres usa Sobel/Canny em tempo real.', stages: ['Sobel', 'Canny'] },
    ml:  { name: 'Machine Learning', desc: 'Pré-processamento com equalização e filtragem melhora acurácia de modelos.', stages: ['Equalização', 'Filtragem'] },
    ind: { name: 'Inspeção Industrial', desc: 'Detecção de defeitos em linhas de produção usa bordas e limpeza.', stages: ['Detecção de Bordas', 'Filtragem'] },
    ar:  { name: 'Realidade Aumentada', desc: 'Sobreposição de informações virtuais requer detecção de bordas em tempo real.', stages: ['Detecção de Bordas', 'Filtragem'] }
  };

  function init() {
    initAppCards();
  }

  function initAppCards() {
    $$('.ag-item').forEach(function (item) {
      item.addEventListener('click', function () {
        $$('.ag-item').forEach(function (c) { c.classList.remove('active'); });
        item.classList.add('active');
        var key = item.dataset.app;
        var data = apps[key];
        if (!data) return;
        var detail = $('#appDetail');
        if (detail) {
          detail.innerHTML = '<h3>' + data.name + '</h3><p>' + data.desc + '</p><div class="stages-list">' + data.stages.map(function (s) {
            return '<span class="stage-badge">' + s + '</span>';
          }).join('') + '</div>';
          detail.classList.add('visible');
        }
      });
    });
  }

  return { init: init };
})();
