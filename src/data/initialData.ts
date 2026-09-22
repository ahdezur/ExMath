import { Course, Question } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-calc-101',
    code: 'MAT-201',
    name: 'Cálculo Diferencial e Integral',
    description: 'Conceptos fundamentales de límites, derivadas, teoremas de valor medio e integración con aplicaciones en ciencias e ingeniería.',
    color: 'from-blue-600 to-cyan-500',
    slides: [
      {
        id: 'slide-c1-1',
        courseId: 'course-calc-101',
        title: 'Límites Fundamentales y Continuidad',
        subtitle: 'Unidad 1: Análisis de Comportamiento Asintótico',
        layout: 'title',
        content: 'Bienvenido al curso de **Cálculo Diferencial e Integral**.\nEn esta presentación interactiva estudiaremos la noción rigurosa de límite $\\lim_{x \\to a} f(x) = L$ según Cauchy ($\\varepsilon - \\delta$) y sus aplicaciones directas.',
        notes: 'Bienvenida a los alumnos. Enfatizar la definición epsilon-delta antes de hacer ejercicios.'
      },
      {
        id: 'slide-c1-2',
        courseId: 'course-calc-101',
        title: 'Límite Trascendental Notable',
        subtitle: 'Demostración Geométrica',
        layout: 'theorem',
        content: '### Teorema del Sándwich o Encaje\nSi $g(x) \\leq f(x) \\leq h(x)$ en un entorno de $a$ y $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$, entonces:\n$$\\lim_{x \\to a} f(x) = L$$\n\nUn resultado fundamental obtenido por este método es:\n$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$',
        questionId: 'q-tf-1'
      },
      {
        id: 'slide-c1-3',
        courseId: 'course-calc-101',
        title: 'Derivación de Funciones compuestas',
        subtitle: 'Regla de la Cadena y del Producto',
        layout: 'split_question',
        content: 'Dada una función $h(x) = f(g(x))$, la derivada con respecto a $x$ viene dada por la expresión:\n$$h\'(x) = f\'(g(x)) \\cdot g\'(x)$$\n\nRevisemos la regla del producto combinada con exponenciales:',
        questionId: 'q-mc-1'
      },
      {
        id: 'slide-c1-4',
        courseId: 'course-calc-101',
        title: 'Propiedades de la Integral Definida',
        subtitle: 'Propiedades Lineales y Teorema del Valor Medio',
        layout: 'split_question',
        content: 'La integral definida de Riemann $\\int_a^b f(x) dx$ representa el área signada bajo la curva y satisface propiedades de linealidad y aditividad sobre intervalos.',
        questionId: 'q-cb-1'
      },
      {
        id: 'slide-c1-5',
        courseId: 'course-calc-101',
        title: 'Teorema Fundamental del Cálculo',
        subtitle: 'Conexión entre Derivación e Integración',
        layout: 'split_question',
        content: 'El Teorema Fundamental del Cálculo establece que si $f$ es continua en $[a, b]$ y $F(x) = \\int_a^x f(t) dt$, entonces $F\'(x) = f(x)$. Completa los conceptos clave a continuación:',
        questionId: 'q-fb-1'
      },
      {
        id: 'slide-c1-6',
        courseId: 'course-calc-101',
        title: 'Optimización y Puntos Críticos',
        subtitle: 'Ejercicio Práctico de Desarrollo',
        layout: 'full_exercise',
        content: 'Dada la función polinómica $f(x) = \\frac{1}{3}x^3 - 2x^2 + 3x + 5$, analiza sus puntos críticos y clasifícalos como máximos o mínimos locales utilizando el criterio de la segunda derivada.',
        questionId: 'q-dev-1'
      }
    ]
  },
  {
    id: 'course-algebra-201',
    code: 'MAT-301',
    name: 'Álgebra Lineal y Espacios Vectoriales',
    description: 'Preparación integral para Certamen 1: Sistemas parametrizados, Subespacios vectoriales, Combinaciones lineales, Span e Independencia lineal.',
    color: 'from-emerald-600 to-teal-500',
    slides: [
      {
        id: 'slide-alg-1',
        courseId: 'course-algebra-201',
        title: 'Álgebra Lineal: Preparación para Certamen 1',
        subtitle: 'Modelamiento matemático para problemas de ingeniería (logística, redes, aerodinámica)',
        layout: 'title',
        content: '### Objetivos de la Sesión:\n\n1. **Módulo 1:** Despeje matricial y análisis de sistemas parametrizados.\n2. **Módulo 2:** Comprobación formal de Subespacios Vectoriales.\n3. **Módulo 3:** Combinaciones Lineales (Generadores) e Independencia Lineal.',
        notes: 'Dar la bienvenida y enmarcar la sesión en problemas aplicados de ingeniería.'
      },
      {
        id: 'slide-alg-2',
        courseId: 'course-algebra-201',
        title: 'El Terreno de Juego (Repaso Rápido)',
        subtitle: 'Los Espacios Vectoriales Usuales',
        layout: 'theorem',
        content: 'Para modelar la realidad, nuestros "vectores" tomarán distintas formas:\n\n- $\\mathbb{R}^n$: Listas de datos (ej. coordenadas, demandas).\n- $\\mathcal{M}_{n\\times m}(\\mathbb{R})$: Matrices (ej. filtros de imagen, redes logísticas). **¡Cada matriz completa es un solo vector en su espacio!**\n- $\\mathcal{P}_n(\\mathbb{R})$: Polinomios $a_0 + a_1x + \\dots + a_nx^n$ (ej. curvas de costo, trayectorias).'
      },
      {
        id: 'slide-alg-3',
        courseId: 'course-algebra-201',
        title: 'Módulo 1: Ecuaciones y Sistemas Parametrizados',
        subtitle: 'Problema de Aplicación: Redes Eléctricas',
        layout: 'split_question',
        content: 'Un equipo modela una red donde el flujo central $X$ obedece a la ecuación:\n$$A X B^T - 2C = D$$\n*(Donde $A, B, C, D$ son matrices invertibles)*.\n\nPor otro lado, la distribución de voltajes en los nodos, dependiente de la resistencia $\\alpha$ y tolerancia $\\beta$, está dada por:\n$$\\begin{aligned} x + y - z &= 1 \\\\ 2x + 3y + \\alpha z &= 3 \\\\ x + \\alpha y + 3z &= \\beta \\end{aligned}$$\n\n**Misión:**\na) Despejar algebraicamente $X$.\nb) Hallar condiciones para $\\alpha$ y $\\beta$ de modo que el sistema tenga: solución única, infinitas soluciones, o ninguna.',
        questionId: 'q-alg-m1-despeje'
      },
      {
        id: 'slide-alg-4',
        courseId: 'course-algebra-201',
        title: 'Desarrollo Módulo 1 (Pizarra)',
        subtitle: 'Guía de Resolución Guiada',
        layout: 'full_exercise',
        content: '*(Desarrollo guiado por el profesor en pizarra)*\n\n- **Parte a):** Énfasis en el orden de multiplicación por inversas. Recordatorio vital: $(B^T)^{-1} = (B^{-1})^T$.\n- **Parte b):** Escalonamiento de la matriz ampliada y análisis de los ceros en la diagonal principal respecto a los parámetros $\\alpha$ y $\\beta$.',
        questionId: 'q-alg-m1-pauta'
      },
      {
        id: 'slide-alg-5',
        courseId: 'course-algebra-201',
        title: 'Teoría: Subespacios Vectoriales',
        subtitle: 'Definición Rápida y Axiomas Estructurales',
        layout: 'theorem',
        content: 'Para que un subconjunto $\\mathcal{W}$ sea un "espacio dentro del espacio", debe cumplir **3 axiomas estructurales**:\n\n1. **Vector Nulo:** Contiene al elemento neutro ($\\mathbf{0} \\in \\mathcal{W}$).\n2. **Cerradura bajo la suma:** Si $u, v \\in \\mathcal{W} \\implies (u+v) \\in \\mathcal{W}$.\n3. **Cerradura por ponderación:** Si $u \\in \\mathcal{W}$ y $\\lambda \\in \\mathbb{R} \\implies (\\lambda u) \\in \\mathcal{W}$.'
      },
      {
        id: 'slide-alg-6',
        courseId: 'course-algebra-201',
        title: 'Aplicación de Subespacios Vectoriales',
        subtitle: 'Problema de Aplicación: Aerodinámica',
        layout: 'split_question',
        content: 'Se analizan perfiles de tensión en el espacio de polinomios $\\mathcal{P}_2(\\mathbb{R})$.\nPor seguridad, la tensión en el extremo ($x=1$) debe igualar a la tasa de cambio en el origen ($x=0$):\n$$\\mathcal{W} = \\{p(x) = ax^2 + bx + c \\in \\mathcal{P}_2(\\mathbb{R}) : p(1) = p\'(0)\\}$$\n\n**Misión:** Demuestre formalmente que $\\mathcal{W}$ es un subespacio de $\\mathcal{P}_2(\\mathbb{R})$.',
        questionId: 'q-alg-m2-concept'
      },
      {
        id: 'slide-alg-7',
        courseId: 'course-algebra-201',
        title: 'Desarrollo Módulo 2 (Pizarra)',
        subtitle: 'Demostración Formal de los 3 Axiomas',
        layout: 'full_exercise',
        content: '*(Desarrollo guiado por el profesor en pizarra)*\n\n- **Paso 0 (Traducción):** $p(1) = a+b+c$. Además, $p\'(x)=2ax+b \\implies p\'(0)=b$.\n  Condición real: $a+b+c = b \\implies a+c = 0 \\implies c = -a$.\n- **Demostración de los 3 axiomas.**\n\n*(Nota: Pausa recomendada de 10 minutos)*.',
        questionId: 'q-alg-m2-pauta'
      },
      {
        id: 'slide-alg-8',
        courseId: 'course-algebra-201',
        title: 'Teoría: Combinación Lineal y Espacio Generado',
        subtitle: 'Construyendo Vectores a partir de una Base (Span)',
        layout: 'theorem',
        content: '### Construyendo Vectores:\nUna **Combinación Lineal** es la construcción de un nuevo vector a partir de un conjunto base, multiplicándolos por escalares y sumándolos:\n$$v = \\alpha_1 v_1 + \\alpha_2 v_2 + \\dots + \\alpha_k v_k$$\n*(Donde $\\alpha_1, \\alpha_2 \\dots$ son números reales y $v_1, v_2 \\dots$ son los vectores base)*.\n\n### Espacio Generado (Span):\nEs el conjunto de todos los vectores posibles que se pueden construir usando combinaciones lineales de un conjunto dado. Si logramos demostrar que cualquier vector de un espacio $\\mathcal{W}$ se puede escribir usando los vectores $S = \\{v_1, v_2\\}$, decimos que $S$ genera a $\\mathcal{W}$.'
      },
      {
        id: 'slide-alg-9',
        courseId: 'course-algebra-201',
        title: 'Aplicación de Combinaciones Lineales',
        subtitle: 'El Ejemplo del Subespacio Aerodinámico',
        layout: 'split_question',
        content: '**Continuación del Problema Aerodinámico:**\nSabemos que los perfiles seguros del subespacio $\\mathcal{W}$ cumplen que $c = -a$.\nEl manual propone dos curvas base: $q_1(x) = x^2 - 1$ y $q_2(x) = x$.\n\n**Misión:** Demuestre que cualquier perfil seguro $p(x) \\in \\mathcal{W}$ puede escribirse como combinación lineal de $q_1$ y $q_2$ (es decir, demuestre que $q_1$ y $q_2$ son generadores).\n\n*(Desarrollo: Tomar la forma genérica de $\\mathcal{W}$, $ax^2 + bx - a$, y factorizar por $a$ y $b$ para revelar los generadores $q_1$ y $q_2$).*',
        questionId: 'q-alg-m2-span'
      },
      {
        id: 'slide-alg-10',
        courseId: 'course-algebra-201',
        title: 'Teoría: Independencia y Dependencia Lineal',
        subtitle: 'Buscando Redundancias en los Datos',
        layout: 'theorem',
        content: 'Dado un conjunto de vectores $S = \\{v_1, v_2, \\dots, v_k\\}$, planteamos la **Ecuación Fundamental**:\n$$\\alpha_1 v_1 + \\alpha_2 v_2 + \\dots + \\alpha_k v_k = \\mathbf{0}$$\n\n- **Linealmente Independientes (L.I.):** No hay información redundante. La única forma de llegar al vector nulo es apagar todo.\n  - *Condición:* La única solución es $\\alpha_1 = \\alpha_2 = \\dots = \\alpha_k = 0$ (Solución Trivial).\n- **Linealmente Dependientes (L.D.):** Hay vectores redundantes (se pueden construir a partir de los otros).\n  - *Condición:* Existen soluciones distintas de cero (Infinitas soluciones).'
      },
      {
        id: 'slide-alg-11',
        courseId: 'course-algebra-201',
        title: 'El Mapa Conceptual de Sistemas',
        subtitle: 'Espacio Generado y Dependencia/Independencia Lineal',
        layout: 'content',
        content: '### Resumen Estructural de Sistemas de Ecuaciones\n\n- **Generación (¿Puedo crear este vector?):**\n  Sistema No Homogéneo ($A \\vec{\\alpha} = \\vec{b}$). Puede ser Compatible Determinado o Indeterminado.\n\n- **Independencia Lineal (¿Hay redundancia en mi conjunto?):**\n  Sistema Homogéneo ($A \\vec{\\alpha} = \\vec{0}$).\n  - **L.I. = Compatible Determinado** (Rango máximo, $\\det(A) \\neq 0$).\n  - **L.D. = Compatible Indeterminado** (Hay variables libres, $\\det(A) = 0$).'
      },
      {
        id: 'slide-alg-12',
        courseId: 'course-algebra-201',
        title: 'Módulo 3: Independencia Lineal con Parámetros',
        subtitle: 'Problema de Aplicación: Compresión de Video',
        layout: 'split_question',
        content: 'Se analiza un conjunto de matrices de transformación de color en $\\mathcal{M}_{2\\times 2}(\\mathbb{R})$ dependiente de un factor de saturación $m$:\n$$T = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix}, \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} \\right\\}$$\n\n**Misión:** Usando la definición y analizando el sistema asociado, determine los valores exactos de $m$ para los cuales el conjunto $T$ procesa información redundante (es decir, es Linealmente Dependiente).',
        questionId: 'q-alg-m3-mc'
      },
      {
        id: 'slide-alg-13',
        courseId: 'course-algebra-201',
        title: 'Desarrollo Módulo 3 y Cierre (Pizarra)',
        subtitle: 'Guía de Resolución y Criterio de Redundancia',
        layout: 'full_exercise',
        content: '*(Desarrollo guiado por el profesor en pizarra)*\n\n1. Plantear $\\alpha_1 M_1 + \\alpha_2 M_2 + \\alpha_3 M_3 = \\mathbf{0}_{2\\times2}$.\n2. Armar el sistema de ecuaciones homogéneo.\n3. **Conexión con Slide 11:** Como nos piden que sea L.D., buscamos infinitas soluciones (o determinante igual a cero).\n4. Escalonar buscando que la última fila se anule completamente, lo que permitirá despejar el valor crítico de $m$.',
        questionId: 'q-alg-m3-pauta'
      }
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // CÁLCULO QUESTIONS
  {
    id: 'q-tf-1',
    courseId: 'course-calc-101',
    type: 'true_false',
    title: 'Pregunta 1: Límite de trigonométricas',
    prompt: '¿Es verdadero o falso que el límite $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3$?',
    correctAnswer: true,
    explanation: 'Por la propiedad de sustitución $u = 3x$, tenemos $\\lim_{x \\to 0} \\frac{\\sin(3x)}{x} = 3 \\cdot \\lim_{u \\to 0} \\frac{\\sin(u)}{u} = 3 \\cdot 1 = 3$.'
  },
  {
    id: 'q-mc-1',
    courseId: 'course-calc-101',
    type: 'multiple_choice',
    title: 'Pregunta 2: Derivada con regla del producto',
    prompt: 'Calcule la primera derivada con respecto a $x$ de la función $f(x) = x^3 e^x$:',
    options: [
      { id: 'opt-1', text: '$f\'(x) = 3x^2 e^x$' },
      { id: 'opt-2', text: '$f\'(x) = x^3 e^x$' },
      { id: 'opt-3', text: '$f\'(x) = x^2 e^x (3 + x)$' },
      { id: 'opt-4', text: '$f\'(x) = 3x^2 + e^x$' }
    ],
    correctOptionId: 'opt-3',
    explanation: 'Aplicando la regla del producto: $(u \\cdot v)\' = u\'v + uv\'$.\n$$f\'(x) = (x^3)\' e^x + x^3 (e^x)\' = 3x^2 e^x + x^3 e^x = x^2 e^x(3 + x)$$'
  },
  {
    id: 'q-cb-1',
    courseId: 'course-calc-101',
    type: 'checkboxes',
    title: 'Pregunta 3: Propiedades de Integrales Definidas',
    prompt: 'Seleccione **todas** las afirmativas que sean verdaderas para funciones continuas $f, g$ en $[a, b]$:',
    options: [
      { id: 'cb-1', text: '$\\int_a^b (f(x) + g(x)) dx = \\int_a^b f(x) dx + \\int_a^b g(x) dx$' },
      { id: 'cb-2', text: '$\\int_a^b f(x) \\cdot g(x) dx = \\left(\\int_a^b f(x) dx\\right) \\cdot \\left(\\int_a^b g(x) dx\\right)$' },
      { id: 'cb-3', text: 'Si $f(x) \\geq 0$ en $[a, b]$, entonces $\\int_a^b f(x) dx \\geq 0$' },
      { id: 'cb-4', text: '$\\int_a^b f(x) dx = -\\int_b^a f(x) dx$' }
    ],
    correctOptionIds: ['cb-1', 'cb-3', 'cb-4'],
    explanation: 'La integral definida es lineal para la suma y productos escalares, invierte su signo al cambiar los límites de integración, y preserva la positividad.'
  },
  {
    id: 'q-fb-1',
    courseId: 'course-calc-101',
    type: 'fill_blanks',
    title: 'Pregunta 4: Conceptos del Teorema Fundamental',
    prompt: 'Complete la oración seleccionando el término o símbolo correcto en cada desplegable:',
    templateText: 'Si $f$ es una función continua en el intervalo cerrado $[a, b]$, la función $F(x) = \\int_a^x f(t) dt$ es {0} en $[a, b]$ y su derivada satisface $F\'(x) =$ {1} para todo $x \\in (a, b)$. Además, si $G$ es cualquier antiderivada de $f$, entonces $\\int_a^b f(x) dx =$ {2}.',
    blanks: [
      { index: 0, options: ['continua', 'discontinua', 'no acotada'], correctValue: 'continua' },
      { index: 1, options: ['$f(x)$', '$f\'(x)$', '$\\int f(x)dx$'], correctValue: '$f(x)$' },
      { index: 2, options: ['$G(b) - G(a)$', '$G(a) - G(b)$', '$G\'(b) \\cdot G\'(a)$'], correctValue: '$G(b) - G(a)$' }
    ],
    explanation: 'Este es el enunciado directo del Teorema Fundamental del Cálculo (Partes I y II).'
  },
  {
    id: 'q-dev-1',
    courseId: 'course-calc-101',
    type: 'development',
    title: 'Ejercicio de Desarrollo: Análisis de Puntos Críticos',
    prompt: 'Dada la función $f(x) = \\frac{1}{3}x^3 - 2x^2 + 3x + 5$, determine los puntos críticos y su clasificación.',
    solutionPauta: {
      steps: [
        { title: 'Paso 1: Primera Derivada', content: '$$f\'(x) = x^2 - 4x + 3$$' },
        { title: 'Paso 2: Puntos Críticos', content: '$$x^2 - 4x + 3 = 0 \\implies (x - 1)(x - 3) = 0 \\implies x_1 = 1, x_2 = 3$$' },
        { title: 'Paso 3: Segunda Derivada', content: '$$f\'\'(x) = 2x - 4 \\implies f\'\'(1) = -2 < 0 \\text{ (Máximo)}, f\'\'(3) = +2 > 0 \\text{ (Mínimo)}$$' }
      ],
      finalAnswer: 'El punto $(1, 19/3)$ es un **Máximo Local** y $(3, 5)$ es un **Mínimo Local**.'
    }
  },

  // PREGUNTAS DEL CURSO DE ÁLGEBRA LINEAL (CERTAMEN 1)
  {
    id: 'q-alg-m1-despeje',
    courseId: 'course-algebra-201',
    type: 'multiple_choice',
    title: 'Módulo 1: Despeje Matricial',
    prompt: 'Dada la ecuación matricial $AXB^T - 2C = D$ con $A, B, C, D$ invertibles, la solución despejada para $X$ es:',
    options: [
      { id: 'm1-opt1', text: '$X = A^{-1}(D + 2C)(B^T)^{-1}$' },
      { id: 'm1-opt2', text: '$X = (D + 2C)A^{-1}B^T$' },
      { id: 'm1-opt3', text: '$X = A^{-1}D + 2CB^{-1}$' },
      { id: 'm1-opt4', text: '$X = B^T(D + 2C)A^{-1}$' }
    ],
    correctOptionId: 'm1-opt1',
    explanation: 'Sumando $2C$: $AXB^T = D + 2C$. Multiplicando por la izquierda por $A^{-1}$ y por la derecha por $(B^T)^{-1}$: $X = A^{-1}(D + 2C)(B^T)^{-1} = A^{-1}(D + 2C)(B^{-1})^T$.'
  },
  {
    id: 'q-alg-m1-pauta',
    courseId: 'course-algebra-201',
    type: 'development',
    title: 'Módulo 1: Pauta Oficial de Despeje y Análisis Paramétrico',
    prompt: 'Resuelva:\na) Despejar la matriz $X$ en $AXB^T - 2C = D$.\nb) Analizar los valores de $\\alpha, \\beta$ para el sistema de voltajes:\n$$\\begin{aligned} x + y - z &= 1 \\\\ 2x + 3y + \\alpha z &= 3 \\\\ x + \\alpha y + 3z &= \\beta \\end{aligned}$$',
    hints: [
      'Recuerde que para matrices $P Q = R \\implies Q = P^{-1} R$.',
      'Escalone la matriz ampliada hasta la forma triangular superior.'
    ],
    solutionPauta: {
      steps: [
        {
          title: 'Parte a): Despeje Matricial',
          content: '$$AXB^T - 2C = D \\implies AXB^T = D + 2C$$\nMultiplicando por la izquierda por $A^{-1}$ y por la derecha por $(B^T)^{-1}$:\n$$X = A^{-1}(D + 2C)(B^T)^{-1} = A^{-1}(D + 2C)(B^{-1})^T$$'
        },
        {
          title: 'Parte b): Escalonamiento de Matriz Ampliada',
          content: 'Matriz ampliada asociada al sistema:\n$$\\begin{pmatrix} 1 & 1 & -1 & | & 1 \\\\ 2 & 3 & \\alpha & | & 3 \\\\ 1 & \\alpha & 3 & | & \\beta \\end{pmatrix} \\xrightarrow[F_3 - F_1]{F_2 - 2F_1} \\begin{pmatrix} 1 & 1 & -1 & | & 1 \\\\ 0 & 1 & \\alpha+2 & | & 1 \\\\ 0 & \\alpha-1 & 4 & | & \\beta-1 \\end{pmatrix}$$\n\nAplicando $F_3 - (\\alpha-1)F_2$:\n$$\\begin{pmatrix} 1 & 1 & -1 & | & 1 \\\\ 0 & 1 & \\alpha+2 & | & 1 \\\\ 0 & 0 & 4 - (\\alpha-1)(\\alpha+2) & | & (\\beta-1) - (\\alpha-1) \\end{pmatrix}$$\nEl coeficiente en posición $(3,3)$ es $4 - (\\alpha^2 + \\alpha - 2) = 6 - \\alpha - \\alpha^2 = (2 - \\alpha)(3 + \\alpha)$.'
        },
        {
          title: 'Parte c): Análisis de Casos de Solución',
          content: '- **Solución Única:** $\\alpha \\neq 2$ y $\\alpha \\neq -3$ (para cualquier $\\beta \\in \\mathbb{R}$).\n- **Infinitas Soluciones:** Si $\\alpha = 2$, el lado derecho debe ser cero: $(\\beta - 1) - (2 - 1) = \\beta - 2 = 0 \\implies \\beta = 2$.\n- **Sin Solución (Incompatible):** Si $\\alpha = 2$ y $\\beta \\neq 2$, o si $\\alpha = -3$ y $\\beta \\neq -3$.'
        }
      ],
      finalAnswer: 'Solución Única: $\\alpha \\notin \\{-3, 2\\}$. Infinitas Soluciones: $\\alpha = 2$ y $\\beta = 2$. Sin Solución: $\\alpha = 2, \\beta \\neq 2$ ó $\\alpha = -3, \\beta \\neq -3$.'
    }
  },
  {
    id: 'q-alg-m2-concept',
    courseId: 'course-algebra-201',
    type: 'checkboxes',
    title: 'Módulo 2: Axiomas de Subespacios Vectoriales',
    prompt: 'Para el conjunto de perfiles aerodinámicos $\\mathcal{W} = \\{p(x) = ax^2 + bx + c \\in \\mathcal{P}_2(\\mathbb{R}) : p(1) = p\'(0)\\}$, seleccione los axiomas y condiciones equivalentes verdaderas:',
    options: [
      { id: 'm2-1', text: 'La condición de pertenencia equivale a $a + c = 0 \\implies c = -a$' },
      { id: 'm2-2', text: 'El polinomio nulo $p(x) = 0$ pertenece a $\\mathcal{W}$ pues $a=0, b=0, c=0$ cumple $0+0=0$' },
      { id: 'm2-3', text: '$\\mathcal{W}$ es cerrado bajo la suma de polinomios $p(x) + q(x)$' },
      { id: 'm2-4', text: '$\\mathcal{W}$ no es un subespacio porque tiene dimensión mayor a 3' }
    ],
    correctOptionIds: ['m2-1', 'm2-2', 'm2-3'],
    explanation: 'Un polinomio $p(x) = ax^2 + bx + c$ cumple $p(1) = p\'(0) \\iff a+b+c = b \\iff a+c=0$. Al cumplir los 3 axiomas, $\\mathcal{W}$ es formalmente un subespacio de $\\mathcal{P}_2(\\mathbb{R})$.'
  },
  {
    id: 'q-alg-m2-pauta',
    courseId: 'course-algebra-201',
    type: 'development',
    title: 'Módulo 2: Pauta Oficial de Demostración de Subespacio',
    prompt: 'Demuestre formalmente que $\\mathcal{W} = \\{p(x) = ax^2 + bx + c \\in \\mathcal{P}_2(\\mathbb{R}) : p(1) = p\'(0)\\}$ es un subespacio de $\\mathcal{P}_2(\\mathbb{R})$.',
    solutionPauta: {
      steps: [
        {
          title: 'Paso 0: Traducción de la Condición Estructural',
          content: '$$p(1) = a(1)^2 + b(1) + c = a + b + c$$\nDerivada: $p\'(x) = 2ax + b \\implies p\'(0) = b$.\nCondición: $a + b + c = b \\implies a + c = 0 \\implies c = -a$.\nPor lo tanto: $\\mathcal{W} = \\{ax^2 + bx - a : a, b \\in \\mathbb{R}\\}$.'
        },
        {
          title: 'Axioma 1: Vector Nulo',
          content: 'Para el polinomio nulo $0(x) = 0x^2 + 0x + 0$, tenemos $a=0, c=0 \\implies a+c = 0+0 = 0$. Luego $\\mathbf{0} \\in \\mathcal{W}$.'
        },
        {
          title: 'Axioma 2: Cerradura bajo la Suma',
          content: 'Sean $p(x) = a_1 x^2 + b_1 x - a_1$ y $q(x) = a_2 x^2 + b_2 x - a_2 \\in \\mathcal{W}$.\n$$(p + q)(x) = (a_1 + a_2)x^2 + (b_1 + b_2)x - (a_1 + a_2)$$\nEl término constante es del tipo $c = -(a_1 + a_2)$, luego $(p + q) \\in \\mathcal{W}$.'
        },
        {
          title: 'Axioma 3: Cerradura bajo Ponderación Escalar',
          content: 'Sea $\\lambda \\in \\mathbb{R}$ y $p(x) = ax^2 + bx - a \\in \\mathcal{W}$.\n$$(\\lambda p)(x) = (\\lambda a)x^2 + (\\lambda b)x - (\\lambda a)$$\nSu término constante es $-(\\lambda a)$, por lo tanto $(\\lambda p) \\in \\mathcal{W}$.'
        }
      ],
      finalAnswer: 'Se verifican los 3 axiomas estructurales. Por consiguiente, $\\mathcal{W} \\le \\mathcal{P}_2(\\mathbb{R})$.'
    }
  },
  {
    id: 'q-alg-m2-span',
    courseId: 'course-algebra-201',
    type: 'fill_blanks',
    title: 'Módulo 2: Generadores del Subespacio Aerodinámico',
    prompt: 'Complete la descomposición de un elemento arbitrario $p(x) = ax^2 + bx - a \\in \\mathcal{W}$ en término de las curvas base $q_1(x) = x^2 - 1$ y $q_2(x) = x$:',
    templateText: 'Dado $p(x) = ax^2 + bx - a$, podemos factorizar los coeficientes como $p(x) = a \\cdot$ {0} $+ b \\cdot$ {1}. Por consiguiente, el conjunto $S = \\{x^2 - 1, x\\}$ es un conjunto {2} del subespacio $\\mathcal{W}$.',
    blanks: [
      { index: 0, options: ['$x^2 - 1$', '$x^2 + 1$', '$x^2$'], correctValue: '$x^2 - 1$' },
      { index: 1, options: ['$x$', '$x - 1$', '$1$'], correctValue: '$x$' },
      { index: 2, options: ['generador (Span)', 'linealmente dependiente', 'vacío'], correctValue: 'generador (Span)' }
    ],
    explanation: 'Todo vector $p(x) \\in \\mathcal{W}$ se escribe como $a(x^2 - 1) + b(x)$, probando que $S = \\{x^2-1, x\\}$ genera $\\mathcal{W}$.'
  },
  {
    id: 'q-alg-m3-mc',
    courseId: 'course-algebra-201',
    type: 'multiple_choice',
    title: 'Módulo 3: Independencia Lineal con Parámetros',
    prompt: 'Para qué valor del parámetro de saturación $m$ el conjunto de matrices $T = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix}, \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} \\right\\}$ es Linealmente Dependiente (L.D.):',
    options: [
      { id: 'm3-opt1', text: '$m = -3$' },
      { id: 'm3-opt2', text: '$m = 0$' },
      { id: 'm3-opt3', text: '$m = 5$' },
      { id: 'm3-opt4', text: '$m = 2$' }
    ],
    correctOptionId: 'm3-opt1',
    explanation: 'Al plantear $\\alpha_1 M_1 + \\alpha_2 M_2 + \\alpha_3 M_3 = \\mathbf{0}$, obtenemos el sistema:\n$$\\begin{aligned} \\alpha_1 + 2\\alpha_3 &= 0 \\\\ \\alpha_2 - \\alpha_3 &= 0 \\\\ -\\alpha_1 + \\alpha_2 + m\\alpha_3 &= 0 \\\\ 2\\alpha_1 - \\alpha_2 + 5\\alpha_3 &= 0 \\end{aligned}$$\nSustituyendo $\\alpha_1 = -2\\alpha_3$ y $\\alpha_2 = \\alpha_3$ en la tercera ecuación: $-(-2\\alpha_3) + \\alpha_3 + m\\alpha_3 = (3 + m)\\alpha_3 = 0$. Para tener infinitas soluciones (L.D.), se requiere $3 + m = 0 \\implies m = -3$.'
  },
  {
    id: 'q-alg-m3-pauta',
    courseId: 'course-algebra-201',
    type: 'development',
    title: 'Módulo 3: Pauta Oficial de Independencia Lineal y Redundancia',
    prompt: 'Determine el valor del parámetro $m$ para que el conjunto $T$ de matrices en $\\mathcal{M}_{2\\times 2}(\\mathbb{R})$ sea Linealmente Dependiente.',
    solutionPauta: {
      steps: [
        {
          title: 'Paso 1: Ecuación Fundamental de Independencia Lineal',
          content: 'Planteamos la combinación lineal nula:\n$$\\alpha_1 \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix} + \\alpha_2 \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix} + \\alpha_3 \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$$'
        },
        {
          title: 'Paso 2: Sistema de Ecuaciones Homogéneo',
          content: 'Igualando componente a componente:\n$$\\begin{cases} \\alpha_1 + 2\\alpha_3 = 0 & \\text{(Posición 1,1)} \\\\ \\alpha_2 - \\alpha_3 = 0 & \\text{(Posición 1,2)} \\\\ -\\alpha_1 + \\alpha_2 + m\\alpha_3 = 0 & \\text{(Posición 2,1)} \\\\ 2\\alpha_1 - \\alpha_2 + 5\\alpha_3 = 0 & \\text{(Posición 2,2)} \\end{cases}$$'
        },
        {
          title: 'Paso 3: Resolución por Sustitución / Escalonamiento',
          content: 'De la ecuación (1): $\\alpha_1 = -2\\alpha_3$.\nDe la ecuación (2): $\\alpha_2 = \\alpha_3$.\n\nVerificando en la ecuación (4):\n$$2(-2\\alpha_3) - (\\alpha_3) + 5\\alpha_3 = -4\\alpha_3 - \\alpha_3 + 5\\alpha_3 = 0 \\quad \\checkmark$$\n\nSustituyendo en la ecuación (3):\n$$-(-2\\alpha_3) + \\alpha_3 + m\\alpha_3 = 0 \\implies (2 + 1 + m)\\alpha_3 = 0 \\implies (3 + m)\\alpha_3 = 0$$'
        },
        {
          title: 'Paso 4: Criterio de Dependencia Lineal (Redundancia)',
          content: 'Para que el conjunto sea **Linealmente Dependiente (L.D.)**, debemos tener soluciones no triviales ($\\alpha_3 \\neq 0$).\nPor lo tanto, el coeficiente debe anularse:\n$$3 + m = 0 \\implies m = -3$$'
        }
      ],
      finalAnswer: 'El valor crítico para que el conjunto $T$ sea Linealmente Dependiente es **$m = -3$**.'
    }
  }
];
