# Processamento Digital de Imagens — Apresentação 3

## Objetivo

Apresentação web interativa sobre **processamento digital de imagens**, cobrindo histogramas, equalização de histograma, filtragem para redução de ruído e detecção de bordas.

Esta é a **3ª apresentação** da disciplina de Processamento Digital de Imagens — Ciência da Computação.

## Tópicos Abordados

1. **Histograma de imagens** — Ana Beatriz
2. **Equalização de histograma** — Cindy Vitória
3. **Filtro da média e filtro da mediana** — Eduardo Marinho
4. **Detector de bordas de Canny e operador de Sobel** — Luis Jerônimo
5. **Operador Laplaciano, pipeline completo e aplicações práticas** — Paulo Sérgio

## Integrantes

| Ordem | Nome | Parte |
|---|---|---|
| 1 | Ana Beatriz | Histograma (Slides 3 e 4) |
| 2 | Cindy Vitória | Equalização (Slide 5) |
| 3 | Eduardo Marinho | Filtragem (Slide 6) |
| 4 | Luis Jerônimo | Detecção de Bordas (Slide 7) |
| 5 | Paulo Sérgio | Laplaciano & Aplicações (Slides 8 e 9) |

## Estrutura do Projeto

```
trab-3/
├── index.html              # Apresentação principal (11 slides)
├── css/
│   └── style.css           # Design system escuro + estilos
├── js/
│   ├── navigation.js       # Navegação, sidebar, teclado, touch
│   ├── histogram.js        # Matriz interativa + tipos de histograma
│   ├── equalization.js     # Animação de equalização
│   ├── filters.js          # Filtro da média e mediana
│   ├── edges.js            # Sobel e Canny
│   ├── laplacian.js        # Laplaciano e canvas final
│   ├── applications.js     # Cards de aplicações + comparação
│   ├── animations.js       # Animações de cobertura e pipeline
│   └── presentation.js     # Orquestrador principal
├── assets/
│   ├── images/
│   ├── icons/
│   └── examples/
├── docs/
│   ├── guia-geral.md
│   ├── guia-ana-beatriz.md
│   ├── guia-cindy-vitoria.md
│   ├── guia-eduardo-marinho.md
│   ├── guia-luis-jeronimo.md
│   ├── guia-paulo-sergio.md
│   └── referencias.md
└── README.md
```

## Slides

| # | Título | Apresentador | Pipeline |
|---|---|---|---|
| 1 | Capa | Todos | — |
| 2 | Do Pixel à Informação | Todos | — |
| 3 | Histograma de Imagens | Ana Beatriz | Análise |
| 4 | O que o Histograma Revela? | Ana Beatriz | Análise |
| 5 | Equalização de Histograma | Cindy Vitória | Melhoria |
| 6 | Filtragem para Redução de Ruído | Eduardo Marinho | Limpeza |
| 7 | Detecção de Bordas | Luis Jerônimo | Extração |
| 8 | Operador Laplaciano | Paulo Sérgio | Extração |
| 9 | Do Pixel à Aplicação | Paulo Sérgio | Informação |
| 10 | Conclusão | Todos | — |
| 11 | Encerramento | Todos | — |

## Como Executar

1. Abra o terminal na pasta `trab-3/`
2. Execute um dos comandos abaixo:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

3. Acesse `http://localhost:8000` no navegador

**Ou** simplesmente abra o arquivo `index.html` diretamente no navegador.

## Como Navegar

| Tecla / Ação | Função |
|---|---|
| `→` (seta direita) | Próximo slide |
| `←` (seta esquerda) | Slide anterior |
| `Espaço` | Próximo slide |
| `Home` | Primeiro slide |
| `End` | Último slide |
| `F` | Tela cheia |
| `Esc` | Fechar menu lateral |
| Botão `☰` (canto superior esquerdo) | Abrir sumário |
| Toque + deslizar (mobile) | Navegar entre slides |

## Funcionalidades

- **Navegação por teclado** e toque
- **Barra de progresso** visual
- **Indicador de pipeline** (topo central)
- **Menu lateral** com sumário e etapas do pipeline
- **Matriz 5×5 interativa** com histograma em tempo real
- **Comparação de tipos de histograma** (escuro, claro, baixo/bom contraste)
- **Equalização passo a passo** com animação
- **Filtro da média** com animação do kernel
- **Filtro da mediana** com ordenação visual
- **Sobel interativo** (Original / Gx / Gy / Magnitude)
- **Pipeline do Canny** com 5 etapas clicáveis
- **Laplaciano interativo** (Básico / Diagonais)
- **Cards de aplicações** com descrições
- **Comparação entre técnicas** (selecionar 2 para comparar)
- **Canvas HTML5** para todas as demonstrações visuais
- **Design responsivo** (funciona em telas menores)
- **Tela cheia** nativa do navegador

## Design

- **Tema escuro** moderno e tecnológico
- **Fontes:** Inter (texto) e JetBrains Mono (código)
- **Paleta:** fundo escuro (#0a0e1a), ciano (#00d4ff), azul (#3b82f6), roxo (#8b5cf6)
- **Variáveis CSS** para design system consistente
- **Animações CSS** suaves entre slides
- **Indicador de pipeline** discreto no topo

## Arquitetura do Código

O JavaScript foi organizado em módulos responsáveis:

- `navigation.js` — Gerencia navegação, sidebar, teclado e touch
- `histogram.js` — Matriz interativa e tipos de histograma
- `equalization.js` — Animação de equalização de histograma
- `filters.js` — Filtros da média e mediana
- `edges.js` — Operadores Sobel e Canny
- `laplacian.js` — Operador Laplaciano
- `applications.js` — Cards de aplicações e comparação
- `animations.js` — Animações de cobertura e pipeline
- `presentation.js` — Orquestrador que inicializa todos os módulos
