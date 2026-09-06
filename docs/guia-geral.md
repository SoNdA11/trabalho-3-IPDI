# Guia Geral da Apresentação

## 1. Resumo Rápido

- **Tema:** Processamento Digital de Imagens
- **Duração estimada:** ~18 minutos
- **Total de slides:** 11
- **Narrativa:** Pipeline lógico — de diagnóstico → solução → limpeza → extração → aplicação
- **Estilo visual:** Tema light profissional, ícones SVG minimalistas, interações Canvas

---

## 2. Pipeline de Apresentação

```
┌─────────┐   ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────┐   ┌────────────┐
│  IMAGEM │ → │ ANÁLISE │ → │ MELHORIA │ → │ LIMPEZA │ → │ EXTRAÇÃO │ → │ INFORMAÇÃO │
│  (Capa) │   │(Histgr.)│   │(Equaliz.)│   │(Filtros)│   │ (Bordas) │   │(Aplicações)│
└─────────┘   └─────────┘   └──────────┘   └─────────┘   └──────────┘   └────────────┘
   Slides       Slides         Slide          Slide         Slides         Slides
   1-2          3-4             5              6            7-8            9-11
```

---

## 3. Mapeamento Completo: Slides × Apresentadores

| Slide | Título | Apresentador | Pipeline | Tempo estimado |
|---|---|---|---|---|
| 1 | Capa | Todos | — | ~30s |
| 2 | Do Pixel à Informação | Todos | — | ~1min |
| 3 | Histograma de Imagens | Ana Beatriz | ANÁLISE | ~2min |
| 4 | Tipos de Histograma | Ana Beatriz | ANÁLISE | ~2min |
| 5 | Equalização de Histograma | Cindy Vitória | MELHORIA | ~3min |
| 6 | Filtragem para Redução de Ruído | Eduardo Marinho | LIMPEZA | ~3min |
| 7 | Detecção de Bordas | Luis Jerônimo | EXTRAÇÃO | ~3min |
| 8 | Operador Laplaciano | Paulo Sérgio | EXTRAÇÃO | ~2min |
| 9 | Pipeline Completo e Aplicações | Paulo Sérgio | INFORMAÇÃO | ~2min |
| 10 | Conclusão | Paulo Sérgio | — | ~1min |
| 11 | Encerramento | Todos | — | ~30s |

---

## 4. Conteúdo de Cada Slide

### Slides 1-2 — Abertura (Todos)

**Slide 1 — Capa:**
- Título: "Processamento Digital de Imagens"
- Subtítulo: "Histograma, Equalização, Filtragem e Detecção de Bordas"
- Lista de apresentadores com seus tópicos
- Animação de partículas no canvas (`#coverCanvas`)
- Pipeline visual lateral: PIXELS → ANÁLISE → PROCESSAMENTO → BORDAS → INFORMAÇÃO

**Slide 2 — Roadmap:**
- Pipeline de 6 etapas com ícones SVG minimalistas
- Etapas: IMAGEM DIGITAL → ANALISAR → MELHORAR → LIMPAR → EXTRAIR → INTERPRETAR
- Blocos maiores (130px min-width, 100px min-height) para melhor visibilidade
- Bloco contextual: "O que já sabemos" (amostragem e quantização)

### Slides 3-4 — Histograma (Ana Beatriz)

**Slide 3 — Histograma de Imagens:**
- Definição: contagem de pixels por nível de intensidade
- Fórmula: `p(rₖ) = nₖ / (M × N)`
- Grid 5×5 com células maiores (38px) e histograma maior (220×160)

**Slide 4 — Tipos de Histograma:**
- 4 tabs: Escura / Clara / Baixo Contraste / Bom Contraste
- Cada tab mostra imagem + histograma correspondente

### Slide 5 — Equalização (Cindy Vitória)

- Problema: histograma concentrado = baixo contraste
- Solução: redistribuir para uniformidade
- Fórmula: `sₖ = (L − 1) · Σ p(rⱼ)`
- Vantagens e limitações **empilhadas verticalmente** com fonte maior
- Pipeline de 5 etapas animadas

### Slide 6 — Filtragem (Eduardo Marinho)

- Fontes de ruído com ícones SVG
- Toggle entre Filtro da Média / Filtro da Mediana
- Filtro da Média: kernel + animação de convolução lado a lado
- Filtro da Mediana: ordenação visual + resultado

### Slide 7 — Detecção de Bordas (Luis Jerônimo)

- Gradiente com barra visual de mudança de intensidade
- Kernels Sobel (Gx/Gy) com células menores para caber
- Tabs de Sobel (Original/Gx/Gy/Magnitude)
- Canny com 5 etapas clicáveis (itens compactos)
- **Tabela comparativa sempre visível** (sem necessidade de scroll)

### Slide 8 — Laplaciano (Paulo Sérgio)

- Comparação 1ª vs 2ª derivada
- Tabs de visualização (Original/Básico/Diagonais)
- Kernels Laplaciano
- Aviso de sensibilidade ao ruído com ícone SVG
- Layout compacto com `.lp-bottom` para kernels + aviso

### Slide 9 — Pipeline e Aplicações (Paulo Sérgio)

- Pipeline visual com ícones SVG minimalistas
- Canvas do pipeline (`#pipelineCanvas`) — visualização gráfica
- Grid de 11 aplicações com ícones SVG
- Box de detalhe da aplicação selecionada

### Slide 10 — Conclusão (Paulo Sérgio)

- Layout em 2 colunas:
  - Esquerda: Perguntas/respostas + mensagem final + equação
  - Direita: Canvas circular (`#concCanvas`) com pipeline + referências
- Mensagem: `PIXELS + PROCESSAMENTO = INFORMAÇÃO`

### Slide 11 — Encerramento (Todos)

- Canvas de partículas (`#endCanvas`)
- "Obrigado!" + "Perguntas?"
- Pipeline visual: PIXELS → IMAGEM → CARACTERÍSTICAS → INFORMAÇÃO
- Nomes de todos os integrantes

---

## 5. Interações Interativas

| Slide | Interação | Como usar |
|---|---|---|
| 1 | Canvas de partículas | Animação automática |
| 3 | Grid 5×5 | Clique em células para alterar valores — histograma atualiza |
| 4 | Tabs de tipos | Clique para ver cada tipo de histograma |
| 5 | Botão "Executar Equalização" | Clique para animar os 5 passos |
| 6 | Toggle Média/Mediana | Clique para alternar entre os filtros |
| 7 | Tabs Sobel | Clique para ver Gx, Gy, Magnitude |
| 7 | Etapas Canny | Clique nas 5 etapas para ver descrição e canvas |
| 8 | Tabs Laplaciano | Clique para ver básico/com diagonais |
| 9 | Cards de aplicação | Clique para ver detalhe de cada aplicação |

---

## 6. Controles de Navegação

### Teclado
| Tecla | Ação |
|---|---|
| `→` ou `Espaço` | Próximo slide |
| `←` | Slide anterior |
| `Home` | Primeiro slide |
| `End` | Último slide |
| `F` | Tela cheia |
| `Esc` | Sair da tela cheia / fechar menu |

### Mouse
- Setas laterais (`←` `→`) → Navegação
- Botão `☰` (canto superior esquerdo) → Abre sidebar com índice
- Clique em itens da sidebar → Vai para o slide

### Indicadores visuais
- **Barra de progresso** — topo da tela
- **Indicador de pipeline** — topo central, mostra a etapa atual
- **Contador de slides** — canto inferior direito (ex: "3 / 11")

---

## 7. Conexões entre as Partes

| De | Para | Transição sugerida |
|---|---|---|
| Ana Beatriz | Cindy Vitória | "Agora que sabemos interpretar o histograma, o que fazer quando ele mostra um problema? A equalização propõe a solução." |
| Cindy Vitória | Eduardo Marinho | "Agora que melhoramos o contraste, o próximo passo é lidar com o ruído. A filtragem remove o ruído antes do processamento posterior." |
| Eduardo Marinho | Luis Jerônimo | "Depois de remover o ruído, a imagem está pronta para a detecção de características. As bordas são informações fundamentais para visão computacional." |
| Luis Jerônimo | Paulo Sérgio | "Sobel/Canny usam primeira derivada. O Laplaciano usa segunda derivada — uma abordagem complementar." |

---

## 8. Dicas para o Grupo

1. **Ensaiem as transições** — a narrativa é contínua, não blocos isolados.
2. **Referenciem-se mutuamente** — cada apresentador deve mencionar o anterior e o próximo.
3. **Cuidado com o tempo** — cada parte tem ~2-3 minutos.
4. **Usem os exemplos visuais** — clique nas interações durante a apresentação.
5. **Preparem-se para dúvidas** — cada guia individual contém perguntas prováveis e respostas.
6. **Use a sidebar** — o menu lateral (`☰`) mostra todos os slides.
7. **Atalho F para fullscreen** — apresentem em tela cheia.

---

## 9. Arquivos do Projeto

```
trab-3/
├── index.html          ← Apresentação principal (11 slides)
├── css/style.css       ← Tema light profissional
├── js/
│   ├── navigation.js   ← Navegação, sidebar, teclado, progresso
│   ├── histogram.js    ← Slides 3-4: matrix grid + histograma + tipos
│   ├── equalization.js ← Slide 5: animação de equalização (5 passos)
│   ├── filters.js      ← Slide 6: filtros média/mediana + kernels
│   ├── edges.js        ← Slide 7: Sobel (tabs) + Canny (5 etapas)
│   ├── laplacian.js    ← Slide 8: Laplaciano + slide 10: concCanvas + slide 11: endCanvas
│   ├── applications.js ← Slide 9: cards de aplicações
│   ├── animations.js   ← Slide 1: cover particles
│   └── presentation.js ← Orquestrador: init modules, patch goTo
└── docs/
    ├── guia-geral.md           ← Este arquivo
    ├── guia-ana-beatriz.md     ← Slides 3-4
    ├── guia-cindy-vitoria.md   ← Slide 5
    ├── guia-eduardo-marinho.md ← Slide 6
    ├── guia-luis-jeronimo.md   ← Slide 7
    ├── guia-paulo-sergio.md    ← Slides 8-10
    └── referencias.md          ← Referências bibliográficas
```

---

## 10. Perguntas Frequentes do Professor

| Pergunta | Resposta rápida |
|---|---|
| "Qual a diferença entre histograma e histograma normalizado?" | O normalizado divide cada contagem pelo total de pixels, resultando em uma probabilidade. |
| "A equalização pode piorar uma imagem?" | Sim, se já tiver bom contraste ou muito ruído. |
| "Por que o filtro da média borra bordas?" | Porque mistura o pixel da borda com os vizinhos, reduzindo o contraste. |
| "Qual a complexidade do Canny?" | O(n) por etapa, linear no número de pixels. |
| "O que é zero-crossing?" | Ponto onde o sinal muda de positivo para negativo — corresponde a bordas no Laplaciano. |
| "Como as CNNs se relacionam com tudo isso?" | CNNs aprendem kernels equivalentes a filtros de borda/média de forma adaptativa. |
