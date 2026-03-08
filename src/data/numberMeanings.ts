export interface NumberMeaning {
  name: string;
  energy: string;
  positive: string;
  negative: string;
  learning: string;
}

/** Extended data from the PDF — used by Mentor AI for Camino-centric advice */
export interface NumberProfile {
  title: string;
  subtitles: string;
  energyType: string;
  esencia: string;
  luz: string;
  sombra: string;
  mision: string;
}

export const NUMBER_PROFILES: Record<number, NumberProfile> = {
  1: {
    title: 'El Creador',
    subtitles: 'El Pionero, El Independiente',
    energyType: 'Energía Yang',
    esencia: 'Tu vibración es la fuerza pura del inicio y la energía Yang en su máxima expresión. Eres un alma diseñada para abrir caminos donde antes no existía nada, poseyendo una independencia y una determinación naturales que te impulsan a avanzar siempre hacia adelante.',
    luz: 'Liderazgo visionario: Posees una capacidad innata para guiar a otros mediante tu ejemplo de valentía y autonomía.\n\nOriginalidad sin límites: Tu mente es un manantial de ideas nuevas; tienes el don de encontrar soluciones creativas donde otros solo ven muros.\n\nValentía para iniciar: No temes al riesgo de ser el primero en dar el paso en nuevos proyectos, mudanzas o rumbos de vida significativos.',
    sombra: 'Para mantener tu sintonía y permitir que tu voz interior te guíe hacia tu mejor versión, observa estos matices:\n\nLa trampa de la terquedad: Cuidado con cerrar tus oídos a las perspectivas de los demás; el verdadero sabio sabe cuándo escuchar para fortalecer su propia visión.\n\nEl impulso de la imposición: No permitas que tu determinación se convierta en una forma de dominar a otros; recuerda que la voz que acompaña es más poderosa que la que ordena.\n\nEl aislamiento del "Yo": Evita caer en un individualismo que te desconecte de tu entorno; tu poder creativo se multiplica cuando se ejerce con justicia y empatía.',
    mision: 'Tu tarea fundamental es aprender a liderar con conciencia plena. Vienes a abrir caminos desde la justicia y la libertad, demostrando que ser el primero es una oportunidad para servir de guía a quienes buscan su propio rastro. Tu evolución se alcanza cuando tu fuerza creadora no solo te eleva a ti, sino que ilumina el sendero para que otros también puedan caminar con seguridad.',
  },
  2: {
    title: 'La Madre',
    subtitles: 'La Protectora, La Diplomática',
    energyType: 'Energía Yin',
    esencia: 'Tu vibración es la del alma que percibe con absoluta claridad las mareas emocionales, acompañando siempre con ternura y una comprensión profunda. Eres la energía que promueve el equilibrio natural, calmando tensiones y mediando en conflictos con una nobleza que nace del perdón y el aprendizaje.',
    luz: 'Diplomacia serena: Tienes el don de escuchar y mediar con una empatía que te convierte en el puente perfecto entre visiones opuestas, buscando siempre la comprensión mutua.\n\nSoporte compasivo: Tu presencia suave no solo sostiene, sino que equilibra cualquier entorno, siendo un apoyo firme y amoroso que nace directamente del corazón.\n\nConfianza y fe: Posees una nobleza basada en la confianza en un orden superior, lo que te permite fluir con serenidad y seguridad en el camino de la vida.',
    sombra: 'Para mantener tu sintonía y permitir que tu voz interior te guíe hacia tu mejor versión, observa estos matices:\n\nLa trampa de la dependencia: Cuidado con ceder tu poder personal o tu capacidad de decisión por miedo a equivocarte o por buscar aprobación externa.\n\nLa parálisis ante lo nuevo: No permitas que la ansiedad o el miedo a lo desconocido te paralicen; tu evolución requiere que te atrevas a salir de lo conocido.\n\nInseguridad silenciosa: Evita limitar tu expresión auténtica solo por el deseo de no incomodar; tu voz es necesaria para crear una armonía real, no solo aparente.',
    mision: 'Vienes a este mundo a sanar, acompañar y mediar con dulzura consciente. Tu tarea fundamental es cuidar desde el amor y facilitar la creación de relaciones sanas y entornos de paz. Tu evolución se alcanza cuando logras sostener sin dominar y unir sin imponer, recordando que tu mayor don es suavizar las tensiones del mundo con tu energía receptiva, sabia y protectora.',
  },
  3: {
    title: 'El Artista',
    subtitles: 'El Hijo, El Comunicador',
    energyType: 'Energía Yin/Yang',
    esencia: 'Tu vibración es la de la creatividad pura y la comunicación que nace del corazón. Posees el don de fluir a través del arte, la palabra y la emoción, contagiando un optimismo natural que ilumina cualquier espacio que habitas. Tu esencia es ver lo mejor en los demás y resolver los desafíos de la vida con una ligereza y buen humor que resultan sanadores.',
    luz: 'Creador por naturaleza: Tu expresión es vital; posees la necesidad y el don de compartir tu mundo interior para inspirar a quienes te rodean.\n\nEntusiasmo contagioso: Tu presencia amable y carismática crea vínculos naturales, motivando a otros a través de una energía luminosa y encantadora.\n\nFlexibilidad y gracia: Tienes la capacidad de adaptarte con fluidez a diversos ambientes y personas, encontrando siempre el lado positivo de cada situación.',
    sombra: 'Para mantener tu sintonía y evitar que tu luz se disperse, observa estos matices:\n\nEl vacío de la superficialidad: Cuidado con perderte en las apariencias; si no logras expresarte de forma auténtica, podrías experimentar una profunda soledad interna.\n\nLa trampa de la dispersión: Tu mente llena de ideas puede dificultar el enfoque; recuerda que un proyecto necesita constancia y arraigo para llegar a materializarse.\n\nDesequilibrio emocional: Observa tus polos; evita caer en la pasividad o la impulsividad extrema buscando siempre el equilibrio entre tu dar y recibir.',
    mision: 'Vienes a este mundo a ser un canal de alegría y comunicación consciente. Tu tarea fundamental es compartir tu visión idealista y tu energía positiva, recordándole al mundo la belleza de la expresión creativa. Tu evolución se alcanza cuando aprendes a ser constante en tus esfuerzos y a equilibrar tu energía para que tu brillo nazca de una paz interior sólida y no de una búsqueda constante de estímulos externos.',
  },
  4: {
    title: 'El Constructor',
    subtitles: 'El Organizador, El Fundamento',
    energyType: 'Energía Yang – Número Tierra',
    esencia: 'Tu vibración es la del alma que viene a manifestar orden y seguridad en el mundo tangible. Posees un enfoque práctico y una responsabilidad innata que te permite ser el cimiento sobre el cual se construyen grandes proyectos y relaciones. Eres la fuerza que trae estructura al caos, actuando con una honestidad y disciplina que generan confianza absoluta en quienes te rodean.',
    luz: 'Disciplina inquebrantable: Tienes una capacidad de trabajo y perseverancia admirables, lo que te permite concretar metas de largo aliento con precisión.\n\nGenerador de seguridad: Tu don natural es crear bases sólidas y entornos estables, ofreciendo un refugio de calma y orden en momentos de incertidumbre.\n\nIntegridad estructural: Eres una persona de palabra y principios claros, cuya honestidad actúa como la piedra angular de tu desarrollo personal.',
    sombra: 'Para mantener tu sintonía y fluir hacia tu mejor versión, observa estos desafíos:\n\nLa trampa de la rigidez: Cuidado con volverte inflexible o testarudo ante el cambio; recuerda que incluso las estructuras más fuertes necesitan cierta elasticidad para no quebrarse.\n\nMiedo a lo inesperado: No permitas que tu necesidad de control o seguridad te impida dar pasos hacia lo desconocido o explorar nuevas formas de vivir.\n\nPerfeccionismo excesivo: Evita que tu nivel de exigencia se convierta en una carga que te impida disfrutar del proceso o que juzgue con dureza los errores propios y ajenos.',
    mision: 'Tu tarea fundamental es manifestar estabilidad y traer orden al caos con propósito. Vienes a aprender que la verdadera estructura no es una limitación, sino el soporte necesario para que tu espíritu pueda elevarse con libertad. Tu evolución se alcanza cuando logras construir estructuras sólidas para el futuro que sean, al mismo tiempo, espacios de crecimiento y apertura.',
  },
  5: {
    title: 'El Libertador',
    subtitles: 'El Explorador, El Viajero',
    energyType: 'Energía Yang',
    esencia: 'Tu vibración es la del espíritu que busca la libertad en todas sus formas y niveles. Posees una curiosidad insaciable y una capacidad de adaptación asombrosa que te permite fluir con los cambios de la vida como un navegante experto. Eres el puente entre lo conocido y lo nuevo, aportando una energía dinámica y versátil que impulsa la evolución constante.',
    luz: 'Versatilidad y adaptabilidad: Tienes el don de reinventarte rápidamente ante cualquier situación, convirtiendo los imprevistos en oportunidades de crecimiento.\n\nElocuencia inspiradora: Tu capacidad de comunicación es una herramienta poderosa para transmitir ideas nuevas y motivar a quienes te rodean a romper sus propias barreras.\n\nEspíritu libre: Tu naturaleza aventurera te permite vivir el presente con intensidad, trayendo frescura y vitalidad a cualquier entorno.',
    sombra: 'Para mantener tu sintonía y no dispersar tu poder interior, observa estos matices:\n\nLa trampa de la impulsividad: Cuidado con tomar decisiones apresuradas buscando escapar de la rutina; recuerda que la verdadera libertad requiere una base de consciencia.\n\nEl temor al compromiso: No permitas que el miedo a sentirte atrapado te impida construir relaciones o proyectos profundos; a veces, el mayor viaje es el que se hace hacia adentro.\n\nDispersión y excesos: Evita perderte en la búsqueda constante de estímulos externos; tu equilibrio depende de aprender a canalizar tu energía hacia un propósito claro.',
    mision: 'Tu tarea fundamental es aprender a equilibrar tu libertad personal con la responsabilidad consciente. Vienes a vivir el cambio no como una huida, sino como una evolución con propósito. Tu maestría se alcanza cuando logras ser libre en tu interior, permitiendo que tu curiosidad te guíe hacia experiencias que enriquezcan tu alma y la de los demás.',
  },
  6: {
    title: 'El Amor',
    subtitles: 'La Familia, El Servicio',
    energyType: 'Energía Yin',
    esencia: 'Tu vibración es la del amor incondicional y la protección profunda. Eres como un guía invisible que cuida, sostiene y crea hogar sin buscar protagonismo. Eres una alma capaz de transformar cualquier entorno en un espacio de paz y belleza, actuando siempre con una responsabilidad afectiva que nace de la humildad.',
    luz: 'Servicio genuino: Tienes el don de ayudar desde el silencio. Tu fortaleza no necesita aplausos porque tu propósito es el bienestar colectivo.\n\nConciliador del corazón: Posees una capacidad única para unir y perdonar, convirtiéndote en un canal de calma y equilibrio emocional para quienes te rodean.\n\nSensibilidad estética: Tu alta vibración te permite buscar y crear belleza en lo cotidiano, elevando la frecuencia de tu hogar y de tu comunidad.',
    sombra: 'Para mantener tu centro y evolucionar hacia tu mejor versión, observa estos matices:\n\nEl código de mártir: Cuidado con olvidarte de ti mismo por intentar salvar a otros; recuerda que para cuidar a los demás, primero debes estar habitado por ti.\n\nLa trampa del control: No permitas que tu deseo de protección se convierta en sobreprotección asfixiante. Confía en que los demás también tienen su propio camino de aprendizaje.\n\nLa idealización del vínculo: Evita medir tu valor solo por lo que das. Tu valor es intrínseco, independientemente de cuánto logres resolver por los demás.',
    mision: 'Vienes a este mundo a aprender a amar sin perderte y a servir sin olvidarte. Tu tarea fundamental es construir vínculos nutritivos y equilibrados, empezando por el que tienes contigo mismo. Tu evolución se alcanza cuando logras distinguir el servicio amoroso del sacrificio por aprobación, encontrando un propósito propio que te permita brillar con luz propia mientras sostienes a los demás.',
  },
  7: {
    title: 'El Sabio',
    subtitles: 'El Solitario, El Místico',
    energyType: 'Energía Yang',
    esencia: 'Tu vibración es la del investigador profundo y el místico analítico. Posees una conexión espiritual natural que te impulsa a comprender los misterios del universo más allá de lo evidente. Encuentras claridad en el silencio y la soledad elegida, donde tu mente reflexiva y tu intuición desarrollada se unen para observar el mundo con una serenidad y visión simbólica únicas.',
    luz: 'Aura y magnetismo: Posees una energía elevada e intensa que impone respeto e inspira calma, incluso desde tu naturaleza reservada.\n\nSabiduría que inspira: Eres un guía natural. Tu conocimiento fluye de forma genuina, permitiéndote enseñar a otros a través del ejemplo y la paz interior.\n\nVisión interior: Tienes la habilidad de alinear tu energía diariamente y conectar con símbolos profundos, lo que te permite actuar con una claridad que trasciende lo cotidiano.',
    sombra: 'Para mantener tu equilibrio y evolucionar hacia tu mejor versión, observa estos matices:\n\nEl muro del aislamiento: Cuidado con encerrarte demasiado en tu mundo interno, volviéndote frío, desconfiado o emocionalmente distante de quienes te rodean.\n\nEl ruido mental: Evita el sobrepensamiento y el nerviosismo que saturan tu mente; no permitas que la búsqueda de entendimiento se convierta en ansiedad o rigidez.\n\nDesconexión terrenal: No olvides lo práctico de la vida diaria. El reto es no perder el interés por lo cotidiano mientras exploras las alturas del espíritu.',
    mision: 'Tu tarea fundamental es unir el cielo con la tierra. Vienes a encontrar el equilibrio perfecto entre tu profundidad espiritual y tu existencia humana. Tu evolución se alcanza cuando aprendes a confiar en los demás, abres tu mundo interior y compartes tu sabiduría con humildad y compasión, comprendiendo que el conocimiento es un regalo para inspirar al mundo, no para guardarlo en soledad.',
  },
  8: {
    title: 'El Líder',
    subtitles: 'El Poder, El Maestro del Mundo Material',
    energyType: 'Energía Yang',
    esencia: 'Tu vibración es la del organizador y el constructor de grandes estructuras. Posees una fuerza interna capaz de asumir desafíos importantes y sostenerlos con visión a largo plazo. Eres un transformador nato que, como el Ave Fénix, tiene la habilidad de reconstruirse tras cada caída, convirtiendo las crisis en evolución y materializando ideas con una eficiencia que genera resultados tangibles y respeto en tu entorno.',
    luz: 'Equilibrio infinito: Representas el flujo constante entre dar y recibir, integrando con maestría el mundo espiritual con el material en un ciclo de crecimiento constante.\n\nDominio interior: Tu verdadera fuerza reside en gobernarte a ti mismo; cuando lideras desde esa conciencia, te conviertes en una figura sabia, confiable e inspiradora.\n\nClaridad y concreción: Eres un ejecutor de alto impacto. Tu capacidad de organización te permite liderar proyectos con un enfoque nítido, ética inquebrantable y un propósito superior.',
    sombra: 'Para mantener tu centro y evolucionar hacia tu mejor versión, observa estos matices:\n\nLa rigidez autoritaria: Cuidado con volverte inflexible o dominante cuando te sientes descentrado; el verdadero poder no necesita imponerse para ser reconocido.\n\nFrialdad y ambición: Evita que la búsqueda de éxito o reconocimiento te desconecte de tus vínculos afectivos o de tu propósito espiritual interior.\n\nLa huida emocional: Aunque aparentes una fortaleza invulnerable, podrías tender a evadir problemas emocionales complejos o a sobrecargarte por desconfianza al delegar.',
    mision: 'Tu tarea fundamental es aprender a usar tu poder con conciencia y corazón. Estás llamado a demostrar que es posible construir y liderar desde la ética, equilibrando lo material con lo espiritual sin caer en el control. Tu evolución se alcanza cuando comprendes que tu verdadera grandeza no reside en lo que posees o en cuánto dominas, sino en cómo resurges de tus propias crisis y cómo guías a otros hacia su propia transformación desde tu dominio interior.',
  },
  9: {
    title: 'El Humanitario',
    subtitles: 'El Sabio, El Maestro Espiritual',
    energyType: 'Energía Yin',
    esencia: 'Tu vibración es la del altruismo puro. Eres un alma que ha transformado su propia historia en una sabiduría intuitiva capaz de sanar y acompañar a otros. Tu presencia actúa como un vínculo entre lo sagrado y lo cotidiano, viendo en cada ser una igualdad profunda y una oportunidad para la generosidad.',
    luz: 'Guía natural: Tu sola presencia aporta calma y claridad; inspiras a los demás a través de tu ejemplo de entrega auténtica.\n\nConexión trascendente: Tienes la capacidad única de traducir lo espiritual en acciones humanas, funcionando como un puente entre dimensiones.\n\nEntrega sin aplausos: Das desde el alma, encontrando tu propósito más elevado en el acto de servir y amar desinteresadamente.',
    sombra: 'Para llegar a tu mejor versión, es vital observar estas tendencias:\n\nEl sacrificio del mártir: Cuidado con vaciar tu energía intentando salvar a todos sin poner límites; recuerda que tú también necesitas ser sostenido.\n\nEl refugio del silencio: En momentos de dolor, podrías tender al aislamiento o la melancolía, volviéndote "invisible" ante los demás.\n\nLa frustración del idealista: No permitas que la dureza del mundo nuble tu visión elevada ni te convierta en alguien crítico o desconfiado.',
    mision: 'Tu tarea en esta vida es aprender a amar sin sacrificarte. Vienes a sanar tu propia historia y a cerrar ciclos con gratitud, comprendiendo que también mereces recibir, ser visto y ser cuidado. Tu evolución se completa cuando tu entrega a los demás no significa olvidarte de ti mismo.',
  },
  10: {
    title: 'El Canal',
    subtitles: 'El Líder de Nueva Era, El Iniciado',
    energyType: 'Energía Yin/Yang',
    esencia: 'Tu vibración es una danza perfecta entre la energía receptiva y la activa (Yin/Yang). No solo vienes a vivir la vida, vienes a transformarla mediante una maestría interior que te permite ver más allá de lo evidente. Eres un líder nato cuya visión trasciende lo común, actuando como un puente entre lo que se sueña y lo que se construye.',
    luz: 'Intuición superior: Posees una capacidad innata para recibir mensajes sutiles y convertirlos en sabiduría práctica.\n\nManifestación real: Tienes el don de conectar ideas elevadas con la realidad tangible, haciendo que lo "imposible" cobre forma.\n\nLiderazgo inspirador: Tu forma de guiar no impone, sino que despierta el potencial en los demás, convirtiéndote en un referente natural.',
    sombra: 'Para mantener tu sintonía y llegar a tu mejor versión, observa estos matices:\n\nLa niebla de identidad: En ocasiones, podrías sentir confusión sobre quién eres realmente ante tanto poder interior; busca siempre tu centro.\n\nEl vértigo espiritual: Cuidado con la soberbia intelectual o espiritual; recuerda que la verdadera maestría reside en la humildad del servicio.\n\nFalta de anclaje: No permitas que tu visión se pierda en las nubes; tu poder solo es real cuando tus pies tocan la tierra y actúas en el presente.',
    mision: 'Tu tarea fundamental es ser un canal puro entre lo divino y lo humano. Vienes a liderar con una visión que inspire a otros, integrando tu sabiduría interior en cada decisión cotidiana. Tu evolución se alcanza cuando comprendes que tu maestría no es para ti, sino para guiar el camino de los demás hacia una nueva conciencia.',
  },
};

/** Simplified meanings for the number detail screen */
export const NUMBER_MEANINGS: Record<number, NumberMeaning> = Object.fromEntries(
  Object.entries(NUMBER_PROFILES).map(([key, p]) => [
    Number(key),
    {
      name: p.title,
      energy: p.esencia,
      positive: p.luz,
      negative: p.sombra,
      learning: p.mision,
    },
  ])
);

export const NUMBER_LABELS: Record<string, string> = {
  soul: 'Alma',
  personality: 'Personalidad',
  pastLife: 'Vida Pasada',
  gift: 'Don',
  path: 'Camino',
};
