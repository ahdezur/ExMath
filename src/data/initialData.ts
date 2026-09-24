import { Course, Question } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-algebra-201',
    code: 'MAT-301',
    name: 'Introducción al Álgebra y Geometría',
    description: 'Técnicas avanzadas de factorización de polinomios, raíces racionales, raíces complejas conjugadas y resolución sistemática de certámenes.',
    color: 'from-emerald-600 to-teal-500',
    targetUniversity: 'all',
    slides: [
      {
        id: 'slide-alg-1',
        courseId: 'course-algebra-201',
        title: 'Técnicas Avanzadas de Factorización de Polinomios',
        subtitle: 'Herramientas algorítmicas para la búsqueda de raíces',
        layout: 'title',
        content: `### Temas a revisar en esta sesión:

1. **Inspección Básica y Productos Notables**
2. **Técnicas para Trinomios Cuadráticos**
3. **Teorema de las Raíces Racionales (Búsqueda sistemática)**
4. **Teorema de la Raíz Compleja Conjugada**
5. **Estrategia General de Factorización**
6. **Resolución de Ejercicios Aplicados (P27 a P38)**`,
        notes: 'Bienvenida a los estudiantes. Revisar el temario y enfatizar la degradación progresiva del grado polinómico.'
      },
      {
        id: 'slide-alg-2',
        courseId: 'course-algebra-201',
        title: '1. Inspección Básica y Productos Notables',
        subtitle: 'Factor Común, Agrupación e Identidades Clásicas',
        layout: 'content',
        content: `Antes de aplicar teoremas complejos, siempre debemos intentar reducir el grado del polinomio mediante herramientas algebraicas directas.

### Factor Común y Agrupación
> **Ejemplo:**
> Extraer la variable de menor exponente:
> $$x^4 - 2x^3 + x^2 - 2x = x(x^3 - 2x^2 + x - 2)$$
> Luego agrupar en pares:
> $$x[x^2(x-2) + 1(x-2)] = x(x^2+1)(x-2)$$

### Identidades Clásicas
- **Diferencia de cuadrados:** $a^2 - b^2 = (a-b)(a+b)$
- **Trinomio Cuadrado Perfecto:** $a^2 \\pm 2ab + b^2 = (a \\pm b)^2$
- **Suma y diferencia de cubos:** $a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)$

*Nota clave:* El factor cuadrático resultante de una suma/diferencia de cubos siempre es irreducible en $\\mathbb{R}$.`
      },
      {
        id: 'slide-alg-3',
        courseId: 'course-algebra-201',
        title: '2. Técnicas para Trinomios Cuadráticos',
        subtitle: 'Inspección, Completación y Fórmula Cuadrática',
        layout: 'content',
        content: `Una vez degradado el polinomio a la forma $ax^2 + bx + c$, disponemos de tres herramientas principales:

- **Factorización directa (Inspección):** En casos mónicos ($a=1$), buscamos dos números que sumados den $b$ y multiplicados den $c$.
- **Completación de cuadrados:** Transformación a la forma $a(x-h)^2 + k$. Esencial no solo para factorizar, sino para futuras aplicaciones en cálculo integral:
$$x^2 + bx + c = \\left(x + \\frac{b}{2}\\right)^2 + c - \\left(\\frac{b}{2}\\right)^2$$

- **Fórmula Cuadrática:** Cuando las raíces no son evidentes (irracionales o complejas), forzamos la factorización utilizando el discriminante ($\\Delta = b^2 - 4ac$):
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\implies a(x-r_1)(x-r_2)$$`
      },
      {
        id: 'slide-alg-4',
        courseId: 'course-algebra-201',
        title: '3. Teorema de las Raíces Racionales',
        subtitle: 'Procedimiento Sistemático y División Sintética (Ruffini)',
        layout: 'theorem',
        content: `### Enunciado Formal
Si $P(x) = a_n x^n + \\dots + a_1 x + a_0$ tiene coeficientes enteros, cualquier raíz racional expresada como fracción irreducible $\\frac{p}{q}$ debe cumplir que:
- $p$ es un divisor exacto del término independiente $a_0$.
- $q$ es un divisor exacto del coeficiente principal $a_n$.

### Procedimiento Sistemático
1. Listar todos los divisores enteros de $a_0$ (valores de $p$) y de $a_n$ (valores de $q$).
2. Construir el conjunto de todas las combinaciones posibles $\\pm \\frac{p}{q}$.
3. **Fase Crítica (Degradación):** Probar los candidatos usando *División Sintética (Ruffini)*.
4. Si el resto es cero, el candidato es raíz. **¡Importante!** No volvemos al polinomio original; continuamos iterando sobre el *polinomio cociente* degradado para buscar las raíces restantes.`
      },
      {
        id: 'slide-alg-5',
        courseId: 'course-algebra-201',
        title: '4. Teorema de la Raíz Compleja Conjugada',
        subtitle: 'Propiedades de Polinomios a Coeficientes Reales',
        layout: 'theorem',
        content: `### Enunciado Formal
Si un polinomio $P(x)$ tiene coeficientes exclusivamente **reales** y admite una raíz compleja $z = a + bi$ (con $b \\neq 0$), entonces su conjugado $\\bar{z} = a - bi$ es obligatoriamente también una raíz del polinomio.

### Consecuencia en la Factorización
Estas raíces siempre aparecen en pares. Al multiplicar sus factores lineales asociados, originan un divisor cuadrático irreducible con coeficientes reales:
$$(x - (a+bi))(x - (a-bi)) = (x-a)^2 - (bi)^2 = x^2 - 2ax + (a^2 + b^2)$$

> **Aplicación Estratégica:**
> Si el problema te entrega una raíz compleja, automáticamente conoces la segunda. Construyes el trinomio cuadrático mostrado arriba y aplicas división euclidiana larga para reducir el grado del polinomio original en 2 unidades de inmediato.`
      },
      {
        id: 'slide-alg-6',
        courseId: 'course-algebra-201',
        title: '5. Estrategia General de Factorización',
        subtitle: 'Diagrama de Flujo Algorítmico de Resolución',
        layout: 'content',
        content: `Diagrama de flujo mental para enfrentarse a polinomios de orden superior:

1. **Paso 1:** ¿Hay factor común? Extraerlo inmediatamente.
2. **Paso 2:** Si se proporciona una raíz compleja, usar el Teorema del Conjugado para armar el divisor cuadrático y hacer división larga.
3. **Paso 3:** Si quedan polinomios de grado $\\ge 3$, aplicar el Teorema de las Raíces Racionales y Ruffini para seguir degradando.
4. **Paso 4:** Repetir el proceso iterando siempre sobre los *cocientes obtenidos*.
5. **Paso 5:** Al llegar a un polinomio de grado 2, aplicar factorización directa o la fórmula cuadrática para obtener las raíces finales.`
      },
      {
        id: 'slide-alg-7',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P27',
        subtitle: 'Raíces Complejas con Módulo Dado',
        layout: 'full_exercise',
        content: `### Problema P27
Sabiendo que el polinomio $p(z) = z^4 - 4z^3 + 10z^2 - 12z + 8$ posee sólo raíces complejas y que una de ellas tiene módulo 2, encuentre todas las raíces de $p$.

*Sugerencia de resolución:* Plantear la raíz genérica $a+bi$, usar la condición de módulo $\\sqrt{a^2+b^2} = 2$ y aplicar el Teorema de la Raíz Compleja Conjugada.`,
        questionId: 'q-alg-m1-despeje'
      },
      {
        id: 'slide-alg-8',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P28',
        subtitle: 'Raíces Complejas y Restos de División',
        layout: 'full_exercise',
        content: `### Problema P28
Considere $p(x) = x^3 + ax^2 + bx + c$ un polinomio a coeficientes en $\\mathbb{R}$. Sea $r(x)$ el resto de la división de $p(x)$ por $(x-1)$. Si $r(4) = 0$ y $x = i$ es raíz de $p(x)$, calcular las constantes $a, b, c$.

*Sugerencia de resolución:* Si $x=i$ es raíz y los coeficientes son reales, $x=-i$ también es raíz. Formar el factor cuadrático irreducible y relacionarlo con el resto para armar un sistema de ecuaciones.`
      },
      {
        id: 'slide-alg-9',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P29',
        subtitle: 'Ecuaciones en el Campo Complejo',
        layout: 'full_exercise',
        content: `### Problema P29
Sabiendo que la ecuación $z^3 - 9z^2 + 33z = 65$ admite una solución en $\\mathbb{C}\\setminus\\mathbb{R}$ de módulo $\\sqrt{13}$, determinar todas las soluciones complejas de la ecuación anterior.`
      },
      {
        id: 'slide-alg-10',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P30',
        subtitle: 'Análisis de Restos y Grados Polinómicos',
        layout: 'full_exercise',
        content: `### Problema P30
Sean $p(x)$ un polinomio a coeficientes complejos tal que $gr(p(x)) \\ge 4$ y las constantes $a, b, c \\in \\mathbb{R}$ con $b \\neq 0$. Se sabe que:
(i) El resto de dividir $p(x)$ por $(x^2 - b^2)$ es $cx$.
(ii) El resto $r(x)$ de dividir $(x^2 - b^2)(x - a)$ es un polinomio mónico, es decir, el coeficiente asociado a $x^n$ es igual a 1, donde $gr(r(x)) = n$.

(a) Calcular los valores de $p(b)$ y $p(-b)$.
(b) Justificar que $gr(r(x)) \\le 2$.
(c) Determinar los posibles restos $r(x)$.`
      },
      {
        id: 'slide-alg-11',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P31',
        subtitle: 'Transformación y Homotecia de Raíces',
        layout: 'full_exercise',
        content: `### Problema P31
(a) Se sabe que $1+i$ es una raíz del polinomio $p(x) = x^4 + x^3 + x^2 - 4x + 10$. Determinar las restantes raíces de $p(x)$.
(b) Considere el polinomio $p(x) = a_0 x^n + a_1 x^{n-1} + \\dots + a_{n-1} x + a_n$, sean $x_i$ con $i=1,2,...,n$ las raíces de $p$. Determinar las raíces de $g(x) = a_0 \\mu^n x^n + a_1 \\mu^{n-1} x^{n-1} + \\dots + a_n$ donde $\\mu \\neq 0$ es constante real.
(c) Determinar las raíces del polinomio: $p(x) = 16x^4 + 8x^3 + 4x^2 - 8x + 10$.`
      },
      {
        id: 'slide-alg-12',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P32',
        subtitle: 'Relación entre Raíces Opuestas',
        layout: 'full_exercise',
        content: `### Problema P32
Encontrar las 3 raíces $\\alpha_1, \\alpha_2, \\alpha_3$ del polinomio $p(x) = 2x^3 - x^2 - 18x + 9$, sabiendo que $\\alpha_1 + \\alpha_2 = 0$.`
      },
      {
        id: 'slide-alg-13',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P33',
        subtitle: 'Construcción de Polinomios por Restos Igualados',
        layout: 'full_exercise',
        content: `### Problema P33
Determinar un polinomio real de grado 3 que admita raíces 0 y 2 tal que los restos que se obtienen al dividirlo por $(x-1)$ y $(x-3)$ sean iguales.`
      },
      {
        id: 'slide-alg-14',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P34',
        subtitle: 'Teorema del Resto y Sistemas de Restos',
        layout: 'full_exercise',
        content: `### Problema P34
Sea $p(x)$ un polinomio con $gr(p) \\ge 3$. Se sabe que los restos de dividir $p(x)$ por $(x-1)$, $(x-2)$ y $(x-3)$ son 3, 5 y 7 respectivamente. Calcular el resto de dividir $p(x)$ por $(x-1)(x-2)(x-3)$.`
      },
      {
        id: 'slide-alg-15',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P35',
        subtitle: 'Polinomios Complejos con Raíz Real',
        layout: 'full_exercise',
        content: `### Problema P35
Sabiendo que el polinomio $p \\in \\mathbb{C}[z]$ dado por:
$$p(z) = 2z^3 - (5+6i)z^2 + 9iz - 3i + 1$$
tiene una raíz real $a$, determinar alguna de las raíces de $p(z)$. 
*Indicación:* Estudiar la parte real e imaginaria de $p(a)$.`
      },
      {
        id: 'slide-alg-16',
        courseId: 'course-algebra-201',
        title: 'Ejercicio Aplicado: P36',
        subtitle: 'Caracterización de Polinomios Mónicos',
        layout: 'full_exercise',
        content: `### Problema P36
Sea $p(x)$ un polinomio mónico de grado 2 con coeficientes reales. Demostrar que: 
$p$ tiene una raíz en $\\mathbb{C}\\setminus\\mathbb{R}$ de módulo 1 $\\iff p(x) = x^2 + \\alpha x + 1$ con $\\alpha \\in (-2,2)$.`
      },
      {
        id: 'slide-alg-17',
        courseId: 'course-algebra-201',
        title: 'Ejercicios Aplicados: P37 y P38',
        subtitle: 'Factorización Completa y Puntos Fijos',
        layout: 'full_exercise',
        content: `### Problema P37
Determinar todas las raíces del polinomio $p(x) = x^5 - 2x^4 - x + 2$ y factorícelo en $\\mathbb{C}[x]$ y en $\\mathbb{R}[x]$.

---

### Problema P38
Sea $p(x)$ un polinomio que satisface $p(a)=a$, $p(b)=b$ y $p(c)=c$, donde $a, b, c$ son números distintos entre sí. Determinar el resto de la división de $p$ por $(x-a)(x-b)(x-c)$.`
      }
    ]
  },
  {
    id: 'course-calc-101',
    code: 'MAT-201',
    name: 'Cálculo Diferencial e Integral',
    description: 'Conceptos fundamentales de límites, derivadas, teoremas de valor medio e integración con aplicaciones en ciencias e ingeniería.',
    color: 'from-blue-600 to-cyan-500',
    targetUniversity: 'all',
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
      }
    ]
  },
  {
    id: 'course-algebra-lineal-udd',
    code: 'MAT-AL-UDD',
    name: 'Álgebra Lineal - Preparación Certamen 1',
    description: 'Despeje matricial, sistemas parametrizados, subespacios vectoriales, combinaciones lineales, espacio generado e independencia lineal.',
    color: 'from-blue-700 to-indigo-600',
    targetUniversity: 'udd',
    slides: [
      {
        id: 'slide-udd-1',
        courseId: 'course-algebra-lineal-udd',
        title: 'Álgebra Lineal',
        subtitle: 'Preparación para Certamen 1',
        layout: 'title',
        content: `### Prof. Álvaro Hernández U.
**Universidad del Desarrollo**

---

#### Objetivos de la sesión:
1. **Despeje matricial y análisis de sistemas parametrizados.**
2. **Comprobación formal de Subespacios Vectoriales.**
3. **Combinaciones Lineales e Independencia Lineal.**`,
        notes: 'Bienvenida a los estudiantes. Presentar los 3 ejes centrales del certamen.'
      },
      {
        id: 'slide-udd-2',
        courseId: 'course-algebra-lineal-udd',
        title: 'El Terreno de Juego',
        subtitle: 'Los Espacios Vectoriales Usuales',
        layout: 'content',
        content: `Para modelar la realidad, nuestros "vectores" tomarán distintas formas según el contexto:

- **$\\mathbb{R}^n$ (Vectores columna/datos):** Listas de datos (ej. coordenadas, demandas, estados de sistemas).
- **$\\mathcal{M}_{n \\times m}(\\mathbb{R})$ (Matrices):** Filtros de imagen, redes logísticas. *¡Cada matriz completa es un solo vector!*
- **$\\mathcal{P}_n(\\mathbb{R})$ (Polinomios):** Funciones de la forma $a_0 + a_1x + \\dots + a_nx^n$ (ej. curvas de costo, trayectorias aerodinámicas).`,
        notes: 'Enfatizar que las matrices y polinomios también son vectores cuando satisfacen los axiomas de espacio vectorial.'
      },
      {
        id: 'slide-udd-3',
        courseId: 'course-algebra-lineal-udd',
        title: 'Módulo 1: Sistemas Parametrizados',
        subtitle: 'Problema de Aplicación (Redes Eléctricas)',
        layout: 'split_question',
        content: `### Contexto
Un equipo modela una red eléctrica donde el flujo central $X$ obedece a la ecuación matricial:
$$A X B^T - 2C = D$$

La distribución de voltajes en los nodos, dependiente de la resistencia $\\alpha$ y tolerancia $\\beta$, está dada por:
$$\\begin{aligned}
x + y - z &= 1 \\\\
2x + 3y + \\alpha z &= 3 \\\\
x + \\alpha y + 3z &= \\beta
\\end{aligned}$$

---

### Misión:
a) **Despejar algebraicamente** la matriz $X$.
b) **Hallar condiciones** para $\\alpha$ y $\\beta$ para que el sistema tenga solución única, infinitas soluciones o ninguna solución.`,
        questionId: 'q-udd-m1-despeje'
      },
      {
        id: 'slide-udd-4',
        courseId: 'course-algebra-lineal-udd',
        title: 'Desarrollo Módulo 1 (Pizarra)',
        subtitle: 'Ecuación Matricial y Escalonamiento del Sistema',
        layout: 'content',
        content: `### Parte a) Ecuación Matricial
1. Sumar $2C$ a ambos lados: $A X B^T = D + 2C$
2. Multiplicar por $A^{-1}$ por la izquierda: $X B^T = A^{-1} (D + 2C)$
3. Multiplicar por $(B^T)^{-1}$ por la derecha:
$$X = A^{-1} (D + 2C) (B^T)^{-1} = A^{-1} (D + 2C) (B^{-1})^T$$

---

### Parte b) Escalonamiento de la Matriz Ampliada
$$\\left[\\begin{array}{ccc|c} 1 & 1 & -1 & 1 \\\\ 2 & 3 & \\alpha & 3 \\\\ 1 & \\alpha & 3 & \\beta \\end{array}\\right] \\xrightarrow{\\substack{F_2 \\leftarrow F_2 - 2F_1 \\\\ F_3 \\leftarrow F_3 - F_1}} \\left[\\begin{array}{ccc|c} 1 & 1 & -1 & 1 \\\\ 0 & 1 & \\alpha+2 & 1 \\\\ 0 & \\alpha-1 & 4 & \\beta-1 \\end{array}\\right]$$

$$F_3 \\leftarrow F_3 - (\\alpha-1)F_2 \\implies \\left[\\begin{array}{ccc|c} 1 & 1 & -1 & 1 \\\\ 0 & 1 & \\alpha+2 & 1 \\\\ 0 & 0 & -(\\alpha+3)(\\alpha-2) & \\beta - \\alpha \\end{array}\\right]$$`
      },
      {
        id: 'slide-udd-5',
        courseId: 'course-algebra-lineal-udd',
        title: 'Teoría: Subespacios Vectoriales',
        subtitle: 'Axiomas Estructurales',
        layout: 'theorem',
        content: `### Definición Formal
Para que un subconjunto no vacío $\\mathcal{W} \\subseteq V$ sea un **Subespacio Vectorial** de $V$ (manteniendo la misma estructura algebraica), debe cumplir **3 axiomas esenciales**:

1. **Vector Nulo (Contiene el origen):**
   $$\\mathbf{0} \\in \\mathcal{W}$$

2. **Cerradura bajo la Suma:**
   $$\\forall u, v \\in \\mathcal{W} \\implies (u + v) \\in \\mathcal{W}$$

3. **Cerradura por Ponderación (Multiplicación por escalar):**
   $$\\forall u \\in \\mathcal{W}, \\forall \\lambda \\in \\mathbb{R} \\implies (\\lambda u) \\in \\mathcal{W}$$`,
        notes: 'Recordar a los alumnos que si falla el vector nulo (0 no pertenece a W), se descarta inmediatamente que sea subespacio.'
      },
      {
        id: 'slide-udd-6',
        courseId: 'course-algebra-lineal-udd',
        title: 'Módulo 2: Subespacios Vectoriales',
        subtitle: 'Problema de Aplicación (Aerodinámica)',
        layout: 'split_question',
        content: `### Contexto
Se analizan perfiles de tensión en el espacio de polinomios $\\mathcal{P}_2(\\mathbb{R})$. Por seguridad estructural, la tensión en el extremo ($x=1$) debe igualar a la tasa de cambio en el origen ($x=0$).

$$\\mathcal{W} = \\{p(x) = ax^2 + bx + c \\in \\mathcal{P}_2(\\mathbb{R}) : p(1) = p'(0)\\}$$

---

### Misión:
Demuestre formalmente que $\\mathcal{W}$ es un **subespacio vectorial** de $\\mathcal{P}_2(\\mathbb{R})$.`,
        questionId: 'q-udd-m2-subespacio'
      },
      {
        id: 'slide-udd-7',
        courseId: 'course-algebra-lineal-udd',
        title: 'Desarrollo Módulo 2 (Pizarra)',
        subtitle: 'Demostración Rigurosa',
        layout: 'content',
        content: `### Paso 0: Traducción de la Condición
- $p(1) = a(1)^2 + b(1) + c = a + b + c$
- $p'(x) = 2ax + b \\implies p'(0) = b$
- $p(1) = p'(0) \\implies a + b + c = b \\implies a + c = 0 \\implies \\mathbf{c = -a}$

Por lo tanto: $\\mathcal{W} = \\{ax^2 + bx - a : a, b \\in \\mathbb{R}\\}$.

---

### Demostración de los 3 Axiomas:
1. **Vector Nulo:** Si $a=0, b=0 \\implies p(x) = 0$. Cumple $c = 0 = -0$. $\\therefore \\mathbf{0} \\in \\mathcal{W} \\quad \\checkmark$
2. **Suma:** Dados $p_1(x) = a_1x^2 + b_1x - a_1$ y $p_2(x) = a_2x^2 + b_2x - a_2 \\in \\mathcal{W}$:
   $$(p_1 + p_2)(x) = (a_1+a_2)x^2 + (b_1+b_2)x - (a_1+a_2) \\in \\mathcal{W} \\quad \\checkmark$$
3. **Ponderación:** Dado $\\lambda \\in \\mathbb{R}$:
   $$(\\lambda p_1)(x) = (\\lambda a_1)x^2 + (\\lambda b_1)x - (\\lambda a_1) \\in \\mathcal{W} \\quad \\checkmark$$

$$\\therefore \\mathcal{W} \\text{ es un subespacio vectorial de } \\mathcal{P}_2(\\mathbb{R}).$$`
      },
      {
        id: 'slide-udd-8',
        courseId: 'course-algebra-lineal-udd',
        title: 'Teoría: Combinación Lineal y Span',
        subtitle: 'Construyendo Vectores y Espacio Generado',
        layout: 'theorem',
        content: `### Combinación Lineal
Una **Combinación Lineal** es la construcción de un nuevo vector $v$ a partir de un conjunto base $\\{v_1, v_2, \\dots, v_k\\}$ usando escalares $\\alpha_i \\in \\mathbb{R}$:
$$v = \\alpha_1 v_1 + \\alpha_2 v_2 + \\dots + \\alpha_k v_k$$

---

### Espacio Generado (Span)
El **Espacio Generado** por $S = \\{v_1, \\dots, v_k\\}$, denotado $\\operatorname{Span}(S)$ o $\\langle S \\rangle$, es el conjunto de *todas las combinaciones lineales posibles*:
$$\\operatorname{Span}(S) = \\{ \\alpha_1 v_1 + \\dots + \\alpha_k v_k : \\alpha_1, \\dots, \\alpha_k \\in \\mathbb{R} \\}$$

> Si todo elemento de un subespacio $\\mathcal{W}$ puede escribirse usando $S$, decimos que $S$ **genera** a $\\mathcal{W}$.`
      },
      {
        id: 'slide-udd-9',
        courseId: 'course-algebra-lineal-udd',
        title: 'Aplicación: Generadores',
        subtitle: 'Continuación del Problema Aerodinámico',
        layout: 'full_exercise',
        content: `### Contexto
Sabemos que los perfiles seguros del subespacio $\\mathcal{W}$ satisfacen $c = -a$, por lo que todo elemento es de la forma:
$$p(x) = ax^2 + bx - a$$

El manual de diseño propone dos curvas base:
$$q_1(x) = x^2 - 1 \\quad \\text{y} \\quad q_2(x) = x$$

---

### Misión:
Demuestre que cualquier perfil seguro $p(x) \\in \\mathcal{W}$ se puede escribir como combinación lineal de $q_1$ y $q_2$.

**Demostración:**
Agrupando por coeficientes $a$ y $b$:
$$p(x) = a(x^2 - 1) + b(x) = a \\cdot q_1(x) + b \\cdot q_2(x)$$
$$\\therefore \\mathcal{W} = \\operatorname{Span}(\\{x^2 - 1, x\\})$$`
      },
      {
        id: 'slide-udd-10',
        courseId: 'course-algebra-lineal-udd',
        title: 'Teoría: Independencia Lineal',
        subtitle: 'Buscando Redundancias en los Datos',
        layout: 'theorem',
        content: `Dado un conjunto de vectores $S = \\{v_1, v_2, \\dots, v_k\\}$, planteamos la **Ecuación Fundamental**:
$$\\alpha_1 v_1 + \\alpha_2 v_2 + \\dots + \\alpha_k v_k = \\mathbf{0}$$

---

### Clasificación:
- **Linealmente Independientes (L.I.):**
  No existe información redundante. La única forma de formar el vector nulo es con todos los escalares iguales a cero:
  $$\\alpha_1 = \\alpha_2 = \\dots = \\alpha_k = 0 \\quad (\\text{Solución Trivial})$$

- **Linealmente Dependientes (L.D.):**
  Existe al menos un vector que se puede expresar como combinación lineal de los demás.
  $$\\exists \\alpha_i \\neq 0 \\implies \\text{Existen infinitas soluciones.}$$`
      },
      {
        id: 'slide-udd-11',
        courseId: 'course-algebra-lineal-udd',
        title: 'Mapa Conceptual de Sistemas',
        subtitle: 'Relación entre Conceptos Vectoriales y Clasificación de Sistemas',
        layout: 'content',
        content: `### Cuadro Resumen de Equivalencias (Teorema de Rouché-Frobenius)

| Concepto Vectorial | Sistema Asociado | Clasificación del Sistema | Condición Matricial / Rango |
| :--- | :--- | :--- | :--- |
| **Pertenencia**<br>$\\vec{b} \\in \\langle S \\rangle$ | No Homogéneo<br>$A \\vec{\\alpha} = \\vec{b}$ | **Compatible**<br>(Determinado o Indeterminado) | $\\operatorname{rango}(A) = \\operatorname{rango}(A \\| \\vec{b})$ |
| **No Pertenencia**<br>$\\vec{b} \\notin \\langle S \\rangle$ | No Homogéneo<br>$A \\vec{\\alpha} = \\vec{b}$ | **Incompatible**<br>(Sin solución) | $\\operatorname{rango}(A) < \\operatorname{rango}(A \\| \\vec{b})$ |
| **Independencia (L.I.)**<br>$S = \\{\\vec{v}_1, \\dots, \\vec{v}_k\\}$ | Homogéneo<br>$A \\vec{\\alpha} = \\vec{0}$ | **Compatible Determinado**<br>(Única sol: $\\vec{\\alpha} = \\vec{0}$) | $\\operatorname{rango}(A) = k$<br>Si $k=n \\implies \\det(A) \\neq 0$ |
| **Dependencia (L.D.)**<br>$S = \\{\\vec{v}_1, \\dots, \\vec{v}_k\\}$ | Homogéneo<br>$A \\vec{\\alpha} = \\vec{0}$ | **Compatible Indeterminado**<br>(Infinitas soluciones) | $\\operatorname{rango}(A) < k$<br>Si $k=n \\implies \\det(A) = 0$ |`
      },
      {
        id: 'slide-udd-12',
        courseId: 'course-algebra-lineal-udd',
        title: 'Módulo 3: Independencia Lineal',
        subtitle: 'Problema de Aplicación (Compresión de Video)',
        layout: 'split_question',
        content: `### Contexto
Se analiza un conjunto de matrices de transformación dependiente de un factor de saturación $m \\in \\mathbb{R}$:

$$T = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix}, \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} \\right\\}$$

---

### Misión:
Utilizando la definición formal, determine el valor exacto de $m$ para el cual el conjunto $T$ es **Linealmente Dependiente**.`,
        questionId: 'q-udd-m3-independencia'
      },
      {
        id: 'slide-udd-13',
        courseId: 'course-algebra-lineal-udd',
        title: 'Desarrollo Módulo 3 (Pizarra)',
        subtitle: 'Resolución de Sistemas Homogéneos',
        layout: 'content',
        content: `### Planteamiento Formal
$$\\alpha_1 \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix} + \\alpha_2 \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix} + \\alpha_3 \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} = \\begin{bmatrix} 0 & 0 \\\\ 0 & 0 \\end{bmatrix}$$

### Sistema Homogéneo Resultante ($4 \\times 3$):
$$\\begin{aligned}
(1,1): \\quad \\alpha_1 + 2\\alpha_3 &= 0 \\\\
(1,2): \\quad \\alpha_2 - \\alpha_3 &= 0 \\\\
(2,1): \\quad -\\alpha_1 + \\alpha_2 + m\\alpha_3 &= 0 \\\\
(2,2): \\quad 2\\alpha_1 - \\alpha_2 + 5\\alpha_3 &= 0
\\end{aligned}$$

---

### Análisis de Solución:
1. De la 1ª ecu.: $\\alpha_1 = -2\\alpha_3$
2. De la 2ª ecu.: $\\alpha_2 = \\alpha_3$
3. Sustituyendo en la 4ª ecu.: $2(-2\\alpha_3) - (\\alpha_3) + 5\\alpha_3 = 0 \\implies 0 = 0$ (Consistente para todo $\\alpha_3$).
4. Sustituyendo en la 3ª ecu.:
$$-(-2\\alpha_3) + (\\alpha_3) + m\\alpha_3 = 0 \\implies (3 + m)\\alpha_3 = 0$$

Para que sea **Linealmente Dependiente**, exigimos que existan soluciones no triviales (es decir, $\\alpha_3 \\neq 0$).
$$\\implies 3 + m = 0 \\implies \\mathbf{m = -3}$$`
      }
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
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
    id: 'q-alg-m1-despeje',
    courseId: 'course-algebra-201',
    type: 'multiple_choice',
    title: 'Ejercicio P27: Análisis de Raíces Complejas',
    prompt: 'Para el polinomio $p(z) = z^4 - 4z^3 + 10z^2 - 12z + 8$, si una raíz compleja tiene módulo 2, sus 4 raíces son:',
    options: [
      { id: 'm1-opt1', text: '$z_{1,2} = 1 \\pm i, \\quad z_{3,4} = 1 \\pm i\\sqrt{3}$' },
      { id: 'm1-opt2', text: '$z_{1,2} = \\pm 2i, \\quad z_{3,4} = 2 \\pm i$' },
      { id: 'm1-opt3', text: '$z_{1,2} = 1 \\pm 2i, \\quad z_{3,4} = 1 \\pm i$' },
      { id: 'm1-opt4', text: '$z_{1,2} = \\pm i, \\quad z_{3,4} = 2 \\pm 2i$' }
    ],
    correctOptionId: 'm1-opt1',
    explanation: 'Con la raíz de módulo 2 $z = 1+i\\sqrt{3}$ y su conjugada $1-i\\sqrt{3}$, dividimos $p(z)$ por $(z^2 - 2z + 4)$ obteniendo el factor cuadrático $(z^2 - 2z + 2)$, de donde $z_{3,4} = 1 \\pm i$.'
  },
  {
    id: 'q-udd-m1-despeje',
    courseId: 'course-algebra-lineal-udd',
    type: 'multiple_choice',
    title: 'Módulo 1: Despeje Matricial',
    prompt: 'Dada la ecuación matricial $A X B^T - 2C = D$, asumiendo que todas las matrices involucradas son invertibles del orden adecuado, ¿cuál es el despeje correcto de $X$?',
    options: [
      { id: 'opt-udd-1', text: '$X = A^{-1}(D + 2C)(B^{-1})^T$' },
      { id: 'opt-udd-2', text: '$X = (D + 2C) A^{-1} (B^T)^{-1}$' },
      { id: 'opt-udd-3', text: '$X = A^{-1} D B^{-1} + 2C$' },
      { id: 'opt-udd-4', text: '$X = A(D - 2C)B^T$' }
    ],
    correctOptionId: 'opt-udd-1',
    explanation: 'Multiplicando por $A^{-1}$ por la izquierda: $X B^T = A^{-1}(D+2C)$. Multiplicando por $(B^T)^{-1}$ por la derecha: $X = A^{-1}(D+2C)(B^T)^{-1}$. Usando $(B^T)^{-1} = (B^{-1})^T$, resulta $X = A^{-1}(D+2C)(B^{-1})^T$.'
  },
  {
    id: 'q-udd-m2-subespacio',
    courseId: 'course-algebra-lineal-udd',
    type: 'true_false',
    title: 'Módulo 2: Condición de Subespacio',
    prompt: 'Para el conjunto $\\mathcal{W} = \\{p(x) = ax^2 + bx + c \\in \\mathcal{P}_2(\\mathbb{R}) : p(1) = p\'(0)\\}$, ¿es verdadero que la relación entre coeficientes es $c = -a$?',
    correctAnswer: true,
    explanation: 'Evaluando $p(1) = a + b + c$ y $p\'(0) = b$. Igualando $a + b + c = b \\implies a + c = 0 \\implies c = -a$.'
  },
  {
    id: 'q-udd-m3-independencia',
    courseId: 'course-algebra-lineal-udd',
    type: 'multiple_choice',
    title: 'Módulo 3: Independencia Lineal de Matrices',
    prompt: '¿Para qué valor de $m$ el conjunto de matrices $T = \\left\\{ \\begin{bmatrix} 1 & 0 \\\\ -1 & 2 \\end{bmatrix}, \\begin{bmatrix} 0 & 1 \\\\ 1 & -1 \\end{bmatrix}, \\begin{bmatrix} 2 & -1 \\\\ m & 5 \\end{bmatrix} \\right\\}$ es Linealmente Dependiente?',
    options: [
      { id: 'opt-m3-1', text: '$m = -3$' },
      { id: 'opt-m3-2', text: '$m = 3$' },
      { id: 'opt-m3-3', text: '$m = 0$' },
      { id: 'opt-m3-4', text: '$m = 5$' }
    ],
    correctOptionId: 'opt-m3-1',
    explanation: 'Planteando $\\alpha_1 M_1 + \\alpha_2 M_2 + \\alpha_3 M_3 = 0$, resulta $\\alpha_1 = -2\\alpha_3$, $\\alpha_2 = \\alpha_3$ y la ecuación de consistencia $(3+m)\\alpha_3 = 0$. Para soluciones no triviales ($\\alpha_3 \\neq 0$), debe ser $3+m=0 \\implies m = -3$.'
  }
];
