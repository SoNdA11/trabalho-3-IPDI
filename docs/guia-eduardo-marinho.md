# Guia de Estudo — Eduardo Marinho

## 1. Objetivo da Parte

Sua parte é a **terceira seção da apresentação**. Você é responsável por explicar a **filtragem para redução de ruído**, especificamente os **filtros da média e da mediana**.

Você é o elo entre a melhoria de contraste (equalização, parte da Cindy) e a detecção de características (bordas, parte do Luis). Antes de detectar bordas, é necessário remover o ruído da imagem, caso contrário os algoritmos de detecção geram falsos positivos.

Seu papel é deixar claro **por que** a filtragem é necessária, **como** cada filtro funciona, e **quando** usar um em vez do outro.

---

## 2. Seu Slide

### Slide 6 — Filtragem para Redução de Ruído (Pipeline: LIMPEZA)

**O que tem neste slide:**

**Cabeçalho — Fontes de ruído:**
- 4 badges: Sensores, Transmissão, Iluminação, Processamento

**Toggle entre filtros:**
- Dois botões: "Filtro da Média" (ativo por padrão) / "Filtro da Mediana"
- Cada filtro exibe um painel diferente (`#panelMean` / `#panelMedian`)

**Painel — Filtro da Média:**
- Título + badge "Suaviza" (amarelo)
- Fórmula: `g(x,y) = (1/9) · Σ f(x+i, y+j)`
- Kernel 3×3 visual (`#kernelGridMean`) — 9 células com valor 1
- **Animação interativa de convolução:**
  - Canvas de vizinhança (`#kernelVizCanvas`) — mostra os pixels da vizinhança
  - Soma (`#kbSum`) — calcula a soma dos valores
  - Média (`#kbMean`) — resultado da média
- Tags: ✓ Suaviza ruído gaussiano / ✗ Borra bordas

**Painel — Filtro da Mediana:**
- Título + badge "Preserva" (roxo)
- **Visualização interativa de ordenação:**
  - Vizinhança (`#medianNeighborhood`) — 9 células com valores
  - Ordenada (`#medianSorted`) — mesmos valores ordenados
  - Resultado (`#medianResultVal`) — valor mediano destacado
- Tags: ✓ Preserva bordas / ✓ Eficaz contra ruído impulsivo

**Comparação (parte inferior):**
- Dois boxes lado a lado: Média vs Mediana
- Nota: "Filtrar antes de detectar bordas é essencial — ruído gera falsos positivos"

---

## 3. Explicação da Fala

### Roteiro sugerido

**Slide 6 (Introdução ao ruído):**
> "Mesmo com o contraste equalizado, a imagem pode ter ruído — variações indesejadas de intensidade vinda de sensores, transmissão ou iluminação. Esse ruído precisa ser removido antes de qualquer processamento posterior, como detecção de bordas."

**Slide 6 (Filtro da média — toggle no painel):**
> "O filtro da média é o mais simples. Ele olha para a vizinhança de cada pixel — os 8 pixels ao redor — e substitui o pixel central pela média desses 9 valores. É como 'espalhar' o valor do pixel entre seus vizinhos. O resultado é uma imagem mais suave, mas também mais borrada."
>
> [Mostre a animação de convolução] "Repare no kernel 3×3. Cada célula tem peso 1/9. Quando o kernel passa sobre a imagem, cada pixel vira a média de sua vizinhança. Isso reduz o ruído, mas também apaga bordas e detalhes."

**Slide 6 (Filtro da mediana — clique no toggle):**
> "O filtro da mediana resolve parte desse problema. Em vez de calcular a média, ele ordena os valores da vizinhança e escolhe o central. Por exemplo, se a vizinhança tem valores [50, 50, 50, 50, 200, 50, 50, 50, 50], a mediana é 50 — o ruído impulsivo de valor 200 é ignorado."
>
> [Mostre a visualização de ordenação] "Veja como a ordenação funciona: os valores são organizados do menor para o maior, e o valor central é selecionado. Isso preserva bordas porque a mediana é robusta a valores extremos."

**Slide 6 (Comparação):**
> "A grande diferença entre os dois é a preservação de bordas. O filtro da média borra tudo uniformemente. O filtro da mediana preserva bordas porque a mediana é robusta a valores extremos. Para ruído sal e pimenta, a mediana é claramente superior."

**Slide 6 (Transição para Luis):**
> "Depois de remover o ruído, a imagem está pronta para a detecção de características. O Luis vai mostrar como os operadores Sobel e Canny identificam bordas — que são informações cruciais para visão computacional."

---

## 4. Pontos Importantes

### Conceitos que NÃO podem ser explicados errados

1. **Filtragem é uma operação de convolução** — não apenas "substituir valores".
2. **O filtro da média NÃO é eficaz para ruído impulsivo** — ele espalha o valor do pixel de ruído ao invés de removê-lo.
3. **O filtro da mediana NÃO cria novos valores** — ele sempre escolhe um valor existente na vizinhança.
4. **A escolha do tamanho do kernel afeta o resultado** — kernel maior = mais suavização, mais borramento.

### Diferenças importantes

- **Ruído gaussiano** → ambos são eficazes, mas a média é mais rápida.
- **Ruído impulsivo (sal e pimenta)** → mediana é muito superior.
- **Preservação de bordas** → mediana preserva, média borra.

### Possíveis dúvidas do professor

- "Qual a complexidade computacional de cada filtro?" → Média: O(k²) por pixel (k = tamanho do kernel). Mediana: O(k² · log(k²)) por pixel (devido à ordenação).
- "Existem filtros mais avançados?" → Sim: bilateral, não-local means, filtros adaptativos.
- "Qual a relação entre o kernel e a convolução?" → A convolução matemática é a base da filtragem. O kernel define a resposta do filtro.

---

## 5. Perguntas que Podem Surgir

### Da turma

1. **"Por que o filtro da média borra as bordas?"** → Porque a borda é uma mudança abrupta de intensidade. Ao calcular a média, o pixel da borda é "misturado" com os vizinhos, reduzindo o contraste da borda.

2. **"O filtro da mediana funciona para todo tipo de ruído?"** → Não. Para ruído gaussiano, a média pode ser igualmente eficaz. A mediana é especialmente boa para ruído impulsivo.

3. **"Qual o tamanho ideal do kernel?"** → Depende do nível de ruído. Kernel 3×3 é mais conservador. Kernel 5×5 ou 7×7 remove mais ruído, mas borra mais a imagem.

4. **"Existe filtro de mediana para imagens coloridas?"** → Sim, aplica-se a mediana canal por canal, ou usa-se a mediana vetorial.

### Do professor

1. **"Demonstre a diferença entre média e mediana com um exemplo numérico."** → Considere uma vizinhança: [10, 10, 10, 10, 100, 10, 10, 10, 10]. Média = 20, Mediana = 10. O ruído (100) foi removido pela mediana, mas não pela média.

2. **"Qual é a relação entre filtragem e domínio da frequência?"** → O filtro da média é um filtro passa-baixa no domínio da frequência, pois remove altas frequências (detalhes e ruído).

3. **"Em que etapas do pipeline de visão computacional a filtragem é usada?"** → Pré-processamento, antes de segmentação, detecção de bordas, e extração de características.

---

## 6. Resumo Final

### Antes da apresentação, revise

- [ ] Por que o ruído aparece em imagens digitais
- [ ] Como funciona o filtro da média (convolução com kernel uniforme)
- [ ] Como funciona o filtro da mediana (ordenação + seleção do valor central)
- [ ] As diferenças entre média e mediana para diferentes tipos de ruído
- [ ] A relação entre filtragem e convolução
- [ ] Como conectar sua parte com a equalização (Cindy) e com a detecção de bordas (Luis)
- [ ] Teste o toggle entre Média e Mediana para ver os painéis diferentes
- [ ] Observe a animação de convolução e a visualização de ordenação da mediana

### Referências para estudo

- Gonzalez & Woods, *Digital Image Processing*, Cap. 3 (Linear Spatial Filtering) e Cap. 3 (Nonlinear Spatial Filtering)
- Seção 3.5.1: Smoothing (Mean) Filters
- Seção 3.5.2: Order-Statistic (Median) Filters
