# Confianza, consentimiento y marco institucional de IA (investigación web, 2024-2026)

## 1. Pantallas "antes de empezar" en chatbots públicos

**Hallazgos**
- **GOV.UK Chat (UK)** — etiquetado como *"experimental AI tool"*; página "About" corta (3 secciones: *Double-check your answers / Start new chats / More information*), lenguaje directo: *"AI tools can sometimes make mistakes"*, explica "hallucinations", enlaza fuentes en cada respuesta y remite a una página aparte de datos y privacidad. Antes de preguntar hay una pantalla de limitaciones que el usuario debe confirmar. GDS aprendió que una página "before you start" separada y texto en la página de inicio **no funcionaban bien por sí solos**; funcionó mejor presentar los riesgos como limitaciones inherentes a la IA generativa, no como defectos del producto. [About GOV.UK Chat](https://www.gov.uk/guidance/about-govuk-chat) (act. 20-mar-2026); [How we're designing GOV.UK Chat](https://insidegovuk.blog.gov.uk/2024/11/28/how-were-designing-gov-uk-chat/) (28-nov-2024).
- **Chat.Gov.SG (Beta, Singapur)** — una página de 4 bloques: *qué hace / cómo funciona / qué NO hace*. Frases clave: "Responses are AI-generated", "does not assess eligibility or make decisions", "Do not share personal or sensitive information in the chat", "continuously improving". [PDF oficial](https://supportgowhere.life.gov.sg/learn-more-about-sgw-chatbot.pdf) (30-abr-2026).
- **AI Answers (Canada.ca)** — etiqueta "Beta trial"; microcopy bajo cada respuesta: *"AI can make mistakes, always check your answer"*; aviso: información general, no consejo oficial; enlace plegable "Privacy and AI terms of use"; bloqueo de datos personales identificables. [blog.canada.ca](https://blog.canada.ca/2025/12/17/ai-answers.html) (17-dic-2025).
- **Indiana (EE.UU.)** — "third beta", exige aceptar un disclaimer antes de usar. [getcoai](https://getcoai.com/news/indiana-launches-ai-chatbot-to-enhance-public-information-access) (fecha no confirmada).
- **No confirmado:** no se encontraron ejemplos públicos documentados de España/Chile/México/Colombia con pantalla de consentimiento previa.

**Recomendación**: pantalla única de ~120 palabras antes del chat, con 4 bloques y botón "Entendido, empezar". Chip "Piloto experimental" visible en navbar y en el chat.

> **Antes de empezar**
> **Qué es:** una conversación guiada por IA (~20 min) que construye una *línea base orientativa* del nivel de preparación de tu territorio frente a la movilidad climática.
> **Qué no es:** no sustituye diagnósticos técnicos, procesos participativos ni decisiones de planeación. La IA puede equivocarse: revisa el resultado con tu equipo.
> **Tus datos:** no escribas datos personales de terceros ni información reservada. La conversación se procesa con un modelo de IA de [proveedor] y el resultado se guarda solo en tu navegador. [Ver política de datos]
> **Cómo se evalúa:** solo con lo que tú digas explícitamente; lo no mencionado puntúa 0.

## 2. Marcos oficiales aplicables

- **Colombia – Directiva Conjunta 007 (Procuraduría + Defensoría, 30-sep-2025)**, derivada de la Sentencia T-067/2025 y el CONPES 4144 (14-feb-2025). Aplica a sujetos obligados de la Ley 1712/2014 (entidades públicas, también municipales; y privados que presten función pública). Art. 9 exige publicar como mínimo: nombre, objetivo, función institucional, **estado del sistema (desarrollo/implementación/suspensión)**, si trata datos personales, tipo de datos, **desarrollador**, contacto para objeciones y contacto para información. [PDF AND](https://and.gov.co/sites/default/files/2025-10/ESTANDARES%20SOBRE%20TRANSPARENCIA%20ALGOR%C3%8DTMICA%20PARA%20LOS%20SISTEMAS%20ALGOR%C3%8DTMICOS%20UTILIZADOS%20POR%20EL%20ESTADO.pdf). Si el proyecto no es entidad pública no es obligatorio, pero es la plantilla ideal para "Sobre esta herramienta".
- **Guía Ética DNP/MinTIC (dic-2025, act. 7-ene-2026)**: "Asegurar que los chatbots y asistentes virtuales informen a los usuarios cuando están interactuando con IA y cómo se procesa su información"; supervisión humana; sandboxes y programas piloto como entornos controlados. [PDF MinTIC](https://www.mintic.gov.co/portal/715/articles-425888_recurso_1.pdf).
- **SIC Circular Externa 002 (21-ago-2024)** sobre datos personales en sistemas de IA (Ley 1581/2012): minimización, responsabilidad demostrada, evaluación de impacto, anonimización. [SIC](https://sedeelectronica.sic.gov.co/sites/default/files/normativa/Circular%20Externa%20No.%20002%20del%2021%20de%20agosto%20de%202024.pdf).
- **EU AI Act art. 50(1)**: obligación de informar que se interactúa con IA, aplicable desde 2-ago-2026 (no vincula a Colombia; referencia de buena práctica). [Cooley](https://www.cooley.com/news/insight/2026/2026-08-03-eu-ai-act-transparency-obligations-take-effect-2-august-2026).
- **OECD AI Principles (may-2024)**: divulgar objetivos, limitaciones, riesgos y fuentes de datos. [Cuatrecasas](https://cuatrecasas.com/en/spain/intellectual-property/art/oecd-updates-ai-principles). **UK ATRS** obligatorio para gobierno central desde 2025; registro público por sistema. [GOV.UK blog](https://dataingovernment.blog.gov.uk/2025/05/08/making-the-algorithmic-transparency-recording-standard-atrs-mandatory-across-government/). **UNESCO 2021**: no se pudo verificar el párrafo exacto sobre informar al usuario (no confirmado).
- **Gemini API**: en nivel gratuito Google puede usar prompts y revisores humanos; en nivel pago no se usan para entrenar. Verificar qué nivel usa el proyecto antes de redactar la política. [Simon Willison](https://simonwillison.net/2024/Oct/17/gemini-terms-of-service) (oct-2024; términos actuales no verificados).

**Recomendación**: publicar una "Ficha de transparencia algorítmica" en `/sobre` siguiendo los 9 ítems del Art. 9 de la Directiva 007, y citar explícitamente la Guía Ética DNP y la Circular SIC 002/2024 en la política de datos.

## 3. Autoría y estatus ("Sobre este proyecto")

Patrones encontrados en prototipos académicos: "prototipo creado dentro del proyecto financiado X, disponible gratuitamente hasta nuevo aviso" ([AIT](https://drying-toolbox.ait.ac.at/disclaimer)), crédito de financiador/laboratorio, "se proveen como recurso, sin aval ni garantía". Combinado con el Art. 9 colombiano:

**Estructura recomendada `/sobre`**: (1) Qué es y estatus: "Prototipo piloto — versión 0.x — fecha"; (2) Quién lo desarrolla (institución/equipo) y quién lo financia; (3) Marco metodológico (matriz 18 preguntas / 6 dimensiones, fuente); (4) Tecnología: modelo IA, proveedor, cómo se procesan datos; (5) Limitaciones; (6) Licencia (p.ej. CC BY 4.0 para la matriz, MIT para el código); (7) Contacto para consultas y objeciones; (8) Historial de versiones.

> **Estado:** Prototipo piloto (v0.3, nov-2026). Este recurso no es una herramienta oficial de ninguna entidad del Estado colombiano ni certifica el nivel de un territorio. Desarrollado por [equipo/institución] con apoyo de [financiador].

## 4. AI disclosure, limitaciones y confianza

- **Schilke & Reimann, OBHDP 188 (2025)**, 13 experimentos preregistrados: revelar uso de IA reduce la confianza; peor si se descubre que si se autodeclara; se atenúa (no desaparece) cuando el usuario percibe alta precisión. [Arizona](https://news.arizona.edu/employee-news/being-honest-about-using-ai-work-makes-people-trust-you-less-research-finds), [OBHDP](https://obhdp.substack.com/p/new-article-in-obhdp-may-22nd-2025) (may-2025).
- Estudio de disclosure en chatbots (fecha no confirmada): acompañar el aviso con información sobre **expertise y debilidades** del bot mitiga la pérdida de confianza. [SSRC](https://just-tech.ssrc.org/?p=9822). ACIS 2025 confirma reacción emocional negativa al disclosure de identidad. [ACIS](https://aisel.aisnet.org/acis2025/106).
- Lección GDS: presentar límites como propios de la IA generativa en general, con fuentes verificables.

**Recomendación microcopy**: disclosure + competencia + límite, siempre juntos.
- Encabezado del chat: "Estás conversando con un asistente de IA (piloto). Evalúa solo lo que digas; puede equivocarse."
- Pie de resultado: "Línea base orientativa generada por IA a partir de tu conversación. No sustituye un diagnóstico técnico ni participativo. [Ver evidencia por pregunta]" — mostrar las citas (campo `evidencia`) refuerza verificabilidad, el mecanismo que GOV.UK/Canadá usan para sostener confianza.

## 5. Justificar el paso de cuestionario a conversación con IA

Evidencia reciente para la concept note:
- **Wuttke et al. (arXiv 2410.01824, v2 mar-2025, LaTeCH-CLfL 2025)**: entrevistas conversacionales por IA viables, datos comparables a entrevistador humano, escalables; limitaciones: muestra pequeña de estudiantes, la IA a veces no escucha activamente ni profundiza. [arXiv](https://arxiv.org/abs/2410.01824).
- **Barari et al./NORC (arXiv 2504.13908, v3 dic-2025)**, 1.800 participantes: respuestas abiertas "más detalladas e informativas" que preguntas estáticas, con **ligero costo en experiencia del encuestado** y sesgo de aquiescencia. [arXiv](https://arxiv.org/abs/2504.13908).
- **Jacobsen et al., CHI 2025**: sondas teóricas en chatbots de encuesta porque las respuestas abiertas de formulario suelen ser más pobres que las de entrevista. [arXiv](https://arxiv.org/abs/2503.08582).
- **Chopra & Haaland (CESifo 2023)**: 381 entrevistas por IA, evidencia rica a fracción del costo. [CESifo](https://cesifo.org/en/publications/2023/working-paper/conducting-qualitative-interviews-ai).

**Argumento sugerido (concept note)**: "La matriz de 18 preguntas se mantiene como instrumento de evaluación. Lo que cambia es el modo de captura: un formulario con escala 0-3 pide al funcionario autocalificarse sin evidencia; la entrevista conversacional obtiene descripciones concretas (planes, roles, datos) y un segundo agente puntúa solo con evidencia explícita, reduciendo autoinflación. Se adopta como *funcionalidad experimental del piloto*, con límites conocidos: posible sesgo de aquiescencia, menor profundización que un entrevistador humano y mayor tiempo por sesión; por eso se compara contra el formulario durante el piloto."

## 6. Dos modos (formulario rápido + diagnóstico conversacional)

- **No confirmado**: no se encontró una herramienta pública de preparación climática municipal que ofrezca explícitamente "modo rápido" y "modo conversacional". Lo más cercano: herramientas de autoevaluación por formulario (Climate-Ready Communities, Canadá; Adapt-CA, California) sin modo chat. [GMF](https://greenmunicipalfund.ca/climate-ready-communities-assessment-tool).
- A favor (literatura): el formulario es rápido, predecible, anónimo y sirve de control metodológico; el chat produce evidencia más rica (NORC, Wuttke). En contra: dos vías pueden dar puntajes distintos para el mismo municipio y confundir; el formulario invita a autoinflación; el chat cuesta más tiempo y tiene sesgo de aquiescencia.

**Recomendación**: ofrecer ambos con jerarquía clara. Tarjeta A: "Autoevaluación rápida (10 min) — 18 preguntas, escala 0-3, sin IA. Resultado inmediato." Tarjeta B: "Diagnóstico conversacional (experimental, ~20 min) — una IA te entrevista y puntúa con base en lo que describas." Nota común: "Ambos producen una línea base orientativa, no un diagnóstico oficial. Si haces los dos, usa el conversacional para revisar las diferencias con tu equipo." Esto además da el comparativo que necesita la justificación del punto 5.
