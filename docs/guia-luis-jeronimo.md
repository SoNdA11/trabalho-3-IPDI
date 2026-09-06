# Guia de Estudo — Luis Jerônimo

## 1. Objetivo da Parte

Sua parte é a **quarta seção da apresentação**. Você é responsável por explicar a **detecção de bordas**, cobrindo o **operador de Sobel** e o **detector de bordas de Canny**.

Você é o elo entre a filtragem (limpeza de ruído, parte do Eduardo) e o Laplaciano + aplicações (parte do Paulo Sérgio). Depois que a imagem foi equalizada e filtrada, a próxima etapa natural é **extrair informações importantes** — e as bordas são uma das informações mais fundamentais em processamento de imagens.

---

## 2. Seu Slide

### Slide 7 — Detecção de Bordas (Pipeline: EXTRAÇÃO)

**O que tem neste slide:**

**Coluna esquerda (`ed-left`) — Gradiente e Sobel:**
- Bloco "Gradiente": explicação de mudanças de intensidade
- Fórmula: `|∇f| = √(Gx² + Gy²)`
- Visualização de gradiente: barra com transição escura→clara
- **Dois kernels Sobel visuais:**
  - Gx (detecta bordas verticais): [-1, 0, 1; -2, 0, 2; -1, 0, 1]
  - Gy (detecta bordas horizontais): [-1, -2, -1; 0, 0, 0; 1, 2, 1]
- **Tabs interativas de Sobel** (`sv-tabs`):
  - Original → Gx → Gy → Magnitude
  - Canvas `#sobelCanvas` atualiza conforme o tab

**Coluna direita (`ed-right`) — Canny:**
- Título + badge "5 etapas" (roxo)
- **5 etapas clicáveis** (`ed-csi`):
  1. Suavização — Filtro Gaussiano
  2. Gradiente — Magnitude e direção
  3. Supressão de Não Máximos — Non-maximum suppression
  4. Limiar Duplo — Thresholding
  5. Histerese — Conexão de bordas
- Canvas `#cannyCanvas` — visualização do resultado do Canny
- Descrição dinâmica (`#cannyDesc`) — muda conforme a etapa selecionada
- **Tabela comparativa Sobel vs Canny:**

| Aspecto | Sobel | Canny |
|---|---|---|
| Espessura | Grossa | Fina (1px) |
| Ruído | Sensível ✗ | Robusto ✓ |
| Uso | Educacional | Produção ✓ |

---

## 3. Explicação da Fala

### Roteiro sugerido

**Slide 7 (Gradiente):**
> "Para detectar bordas, precisamos entender o conceito de gradiente. O gradiente mede a 'velocidade' da mudança de intensidade. Onde a mudança é abrupta — onde o gradiente é alto — temos uma borda."

**Slide 7 (Sobel — tabs):**
> "O operador de Sobel usa dois kernels 3×3 para detectar mudanças nas direções horizontal e vertical. [Clique no tab Gx] Repare como o kernel Gx detecta bordas verticais. [Clique no tab Gy] O Gy detecta bordas horizontais. [Clique no tab Magnitude] A magnitude final é a combinação dos dois — que nos diz onde estão as bordas."
>
> [Mostre os kernels visuais] "Cada kernel é um detector de bordas em uma direção específica. Quando combinamos os dois resultados, temos a magnitude do gradiente."

**Slide 7 (Canny — etapas):**
> "O detector de Canny é mais sofisticado. Ele usa 5 etapas: [Clique na etapa 1] primeiro suaviza a imagem (reduzindo ruído), [Clique na etapa 2] depois calcula o gradiente, [Clique na etapa 3] depois suprime pixels que não são máximos locais (fazendo bordas finas), [Clique na etapa 4] depois aplica um limiar duplo, e [Clique na etapa 5] finalmente usa histerese para conectar bordas fortes e eliminar bordas fracas isoladas."

**Slide 7 (Comparação):**
> "A diferença entre Sobel e Canny é como comparar um lápis grosso com um caneta de precisão. O Sobel dá uma ideia geral das bordas, enquanto o Canny produz bordas limpas, finas e estruturadas — por isso é o mais usado na prática."

**Slide 7 (Transição para Paulo):**
> "A detecção de bordas é apenas uma das técnicas de extração de características. O Paulo Sérgio vai mostrar o operador Laplaciano — que usa a segunda derivada — e depois conectar todos os conteúdos em um pipeline completo de processamento."

---

## 4. Pontos Importantes

### Conceitos que NÃO podem ser explicados errados

1. **O gradiente é um vetor** — tem magnitude E direção. A magnitude sozinha não é suficiente para Canny (precisa da direção para supressão de não-máximos).
2. **O Sobel não é um detector de bordas completo** — é apenas um operador de gradiente. O Canny é um detector completo com múltiplas etapas.
3. **A supressão de não-máximos é o que faz o Canny gerar bordas finas** — sem ela, as bordas seriam grossas como no Sobel.
4. **A histerese é o que conecta bordas** — ela usa a informação de vizinhança para decidir se uma borda fraca deve ser mantida.

### Diferenças importantes

- **Primeira derivada** (Sobel, Canny) detecta a magnitude da mudança.
- **Segunda derivada** (Laplaciano) detecta a mudança da mudança (zero-crossing).
- **Limiar** é uma escolha do usuário — não existe valor universal.

### Possíveis dúvidas do professor

- "Como escolher os limiares do Canny?" → Métodos automáticos como Otsu ou baseados no histograma do gradiente.
- "Qual a complexidade do Canny?" → O(n) para cada etapa (linear no número de pixels), mas com constante maior que o Sobel.
- "O Canny funciona em imagens coloridas?" → Sim, convertendo para tons de cinza primeiro ou aplicando em cada canal.

---

## 5. Perguntas que Podem Surgir

### Da turma

1. **"Por que o Sobel usa os pesos 1, 2, 1 e não 1, 1, 1?"** → O peso 2 no centro dá mais importância ao pixel central, tornando o operador mais robusto a ruído de alta frequência.

2. **"O que acontece se não usarmos o filtro gaussiano no Canny?"** → O ruído gera muitas bordas falsas. O gaussiano é essencial para suavizar antes de calcular o gradiente.

3. **"Existe um detector de bordas melhor que o Canny?"** → Existem variantes (Canny adaptativo, operadores baseados em machine learning), mas o Canny original continua sendo o padrão.

4. **"As bordas detectadas podem ser usadas para quê?"** → Segmentação, reconhecimento de formas, OCR, detecção de objetos, entre outros.

### Do professor

1. **"Demonstre a supressão de não-máximos com um exemplo."** → Considere um pixel com magnitude 100 e direção 0°. Seus vizinhos na direção 0° têm magnitude 80 e 90. O pixel 100 é mantido; os outros são suprimidos.

2. **"Qual a relação entre o Canny e a visão computacional moderna?"** → O Canny é um componente fundamental em pipelines de detecção de objetos, même que les réseaux de neurones apprennent aussi à détecter les bords.

3. **"Como o Canny lida com bordas curvas?"** → A supressão de não-máximos e a histerese funcionam localmente, então bordas curvas são detectadas corretamente.

---

## 6. Resumo Final

### Antes da apresentação, revise:

- [ ] O que é gradiente e como ele se relaciona com bordas
- [ ] Os kernels Gx e Gy do Sobel e o que cada um detecta
- [ ] As 5 etapas do algoritmo de Canny
- [ ] O que é supressão de não-máximos e por que ela é importante
- [ ] O que é limiar duplo e histerese
- [ ] As diferenças entre Sobel e Canny
- [ ] Como conectar sua parte com a filtragem (Eduardo) e com o Laplaciano (Paulo)
- [ ] Teste as tabs de Sobel: Original → Gx → Gy → Magnitude
- [ ] Clique nas 5 etapas do Canny e veja a descrição e o canvas atualizarem

### Referências para estudo

- Gonzalez & Woods, *Digital Image Processing*, Cap. 10 (Image Segmentation), Seção 10.2 (Edge Detection)
- CANNY, J. A Computational Approach to Edge Detection. IEEE PAMI, 1986.
- SOBEL, I.; FELDMAN, G. A 3x3 Isotropic Gradient Operator for Image Processing, 1973.
