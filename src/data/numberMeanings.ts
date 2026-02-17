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
  aspectos: string;
  positivo: string;
  negativo: string;
  mision: string;
}

export const NUMBER_PROFILES: Record<number, NumberProfile> = {
  1: {
    title: 'El Creador',
    subtitles: 'El Pionero, El Independiente',
    energyType: 'Energía Yang',
    aspectos: 'Libertad e Independencia: necesita espacio para decidir, actuar y crecer. Fortaleza y Determinación: avanza con claridad, persistencia y poder interior. Creador e Innovador: inicia, propone y transforma; abre caminos donde no los hay. Justicia y Claridad: brújula moral firme, busca actuar con rectitud.',
    positivo: 'Lógico y Directo: Piensa con claridad, actúa con precisión. Su energía Yang le da dirección y capacidad de acción inmediata. Ambicioso y Seguro: Es un ser orientado a metas, con una fuerte confianza en sí mismo. Se ve como el líder de su vida.',
    negativo: 'Terquedad e Imposición: Puede volverse obstinado, queriendo tener siempre la razón. Fuerza Mal Canalizada: Su energía intensa puede perturbar si no está en su centro. Frustración y Autocastigo: Si se siente bloqueado, puede caer en estados de mal carácter o depresión.',
    mision: 'Abrir caminos con conciencia. Liderar desde el poder interior, equilibrando fuerza con sensibilidad, acción con escucha. No viene a imponer, sino a guiar.',
  },
  2: {
    title: 'La Madre',
    subtitles: 'La Protectora, La Diplomática',
    energyType: 'Energía Yin',
    aspectos: 'Sensibilidad y Empatía: percibe con claridad las emociones. Paz y Armonía: promueve el equilibrio, calma tensiones. Perdón y Arrepentimiento: reconoce errores, aprende y perdona. Cuidado y Protección: protege desde el amor, brinda contención emocional.',
    positivo: 'Complementaria y Amorosa: Su presencia suave sostiene y equilibra. Diplomática y Serena: Escucha y media con empatía, buscando la armonía. Obediencia y Fe: Es obediente desde la confianza en un orden superior.',
    negativo: 'Indecisión y Dependencia: Puede ceder su poder personal por miedo a equivocarse. Ansiedad y Miedo: Lo nuevo puede paralizarlo emocionalmente. Inseguridad: Busca aprobación y evita molestar, limitando su expresión auténtica.',
    mision: 'Sanar, acompañar y mediar. Su misión es complementar con dulzura, cuidar desde el amor y facilitar relaciones sanas y armónicas. Crear entornos de paz y suavizar tensiones con energía receptiva y sabia.',
  },
  3: {
    title: 'El Artista',
    subtitles: 'El Hijo, El Comunicador',
    energyType: 'Energía Yin/Yang',
    aspectos: 'Creatividad y Expresión: don de comunicar y crear con alegría. Simpatía y Carisma: energía social y amable que crea vínculos naturales. Idealismo y Positividad: ve lo mejor en los demás, contagia entusiasmo. Flexibilidad: se adapta con gracia.',
    positivo: 'Creador por naturaleza: Su expresión es vital, necesita comunicar, inspirar y compartir su mundo interior. Carismático y Entusiasta: Su presencia alegra, encanta y motiva con energía contagiosa y luminosa.',
    negativo: 'Tristeza y Soledad Interna: Puede sentirse vacío si no logra expresarse auténticamente. Dispersión: Se pierde en ideas sin concretar, le cuesta enfocarse. Desequilibrio de Energías: Puede volverse pasivo o impulsivo.',
    mision: 'Expresarse de manera creativa y compartir su energía positiva. Ser un canal para la creatividad y la comunicación, transmitiendo alegría y visión idealista del mundo. Equilibrar su energía para ser constante en sus esfuerzos.',
  },
  4: {
    title: 'El Constructor',
    subtitles: 'La Estructura, La Tierra',
    energyType: 'Energía Yang – Número Tierra',
    aspectos: 'Estabilidad y Estructura: crea bases firmes. Trabajo y Responsabilidad: práctico, detallista y comprometido. Lógica y Realismo: toma decisiones desde lo tangible. Fuerza Interna: perseverante, enfocado y determinado. Conexión con la Tierra.',
    positivo: 'Templanza y Control: Sabe mantenerse firme en la adversidad. Confiabilidad y Orden: Su presencia organiza, pone estructura donde otros ven caos. Voluntad y Perseverancia: Sigue adelante pase lo que pase.',
    negativo: 'Rigidez y Resistencia al Cambio: Le cuesta adaptarse a lo nuevo o incierto. Explosividad: Puede estallar cuando pierde el control. Miedo a Empezar de Cero: Ve el fracaso como ruina total.',
    mision: 'Crear una base sólida para sí mismo y para los demás. Organizar, estructurar y traer estabilidad en medio del caos. Aprender que la vida no es una tragedia si algo no funciona. Adaptarse y reiniciar manteniendo el equilibrio.',
  },
  5: {
    title: 'El Libertador',
    subtitles: 'El Explorador, El Viajero',
    energyType: 'Energía Yang',
    aspectos: 'Libertad y Aventuras: espíritu curioso y libre. Adaptabilidad: flexible y resiliente. Versatilidad y Multitarea: se desenvuelve en muchas áreas. Carisma y Comunicación: magnético, expresivo e inspirador.',
    positivo: 'Energía Dinámica: Vive en movimiento, con entusiasmo. Creatividad e Independencia: Piensa diferente, transforma lo cotidiano. Vocación de Servicio: Usa su fuerza para apoyar desde su corazón aventurero.',
    negativo: 'Desorganización e Impulsividad: Cambia de rumbo sin planificación. Falta de Compromiso: Su amor por la libertad puede alejarlo de compromisos duraderos. Crítica y Soberbia: Si se desconecta, se vuelve frío o autoritario. Desconexión Emocional.',
    mision: 'Encontrar el equilibrio entre la libertad y la responsabilidad. Usar su poder de transformación para crear cambios positivos y duraderos. Establecer una base sólida para que sus exploraciones no se vuelvan caóticas.',
  },
  6: {
    title: 'El Amor',
    subtitles: 'La Familia, El Servicio',
    energyType: 'Energía Yin',
    aspectos: 'Amor incondicional: Ama desde el corazón con entrega silenciosa. Protección y familia: Encuentra propósito en cuidar. Servicio desinteresado: Ayuda con compasión. Armonía y belleza: Busca equilibrio emocional y estético. Conciliador y Sensible.',
    positivo: 'Humildad y Don de Invisibilidad: Sirve sin esperar reconocimiento. Alta Vibración: Aspira a lo mejor espiritual y estéticamente. Capacidad de Amar y Perdonar: Su corazón amplio le permite comprender y conectar desde la empatía.',
    negativo: 'Sobreprotección y Control: Puede volverse asfixiante. Código de Mártir: Tiende a sacrificarse y olvidarse de sí. Culpa y Autoexigencia. Dependencia Emocional: Mide su valor por lo que da. Idealización: Puede idealizar al amor, provocando desilusiones.',
    mision: 'Aprender a amar sin perderse, a servir sin olvidarse. Construir relaciones equilibradas y vínculos nutritivos, comenzando por sí mismo. Distinguir entre servicio genuino y sacrificio por aprobación.',
  },
  7: {
    title: 'El Sabio',
    subtitles: 'El Solitario, El Místico',
    energyType: 'Energía Yang',
    aspectos: 'Conexión espiritual profunda. Sabiduría y mente analítica. Independencia y soledad elegida. Intuición desarrollada: combina lógica con percepción intuitiva. Intelectual y observador.',
    positivo: 'Aura fuerte y energía elevada: Su presencia impone, su energía es magnética y espiritual. Capacidad de enseñar e inspirar: Es guía natural, su sabiduría fluye de forma genuina. Visión interior: Habilidad de visualizar su camino y alinear su energía.',
    negativo: 'Aislamiento emocional: Puede encerrarse en su mundo interno. Frialdad y desconfianza. Desconexión terrenal: Olvida lo práctico. Rigidez mental. Soledad dolorosa. Nerviosismo y sobrepensamiento.',
    mision: 'Unir cielo y tierra. Encontrar equilibrio entre su profundidad espiritual y su vida humana. Confiar en los demás, abrir su mundo interior y compartir su sabiduría sin imponerla. Inspirar con humildad y compasión.',
  },
  8: {
    title: 'El Líder',
    subtitles: 'El Poder, El Maestro del Mundo Material',
    energyType: 'Energía Yang',
    aspectos: 'Líder estratégico: dirigir, organizar y construir con visión. Poder equilibrado: integra lo espiritual y lo material. Ética y justicia. Gran soporte. Concretador nato. Perseverante e inspirador. Transformador: como el Ave Fénix.',
    positivo: 'Infinito y evolución: Equilibrio entre dar y recibir, crecimiento constante. Dominio interior: Su verdadera fuerza está en gobernarse a sí mismo. Organización y claridad: Eficiente, productivo y capaz de liderar con enfoque.',
    negativo: 'Controlador y rígido: Puede volverse autoritario e inflexible. Ambición desmedida: Puede obsesionarse con el éxito o el dinero. Frialdad emocional. Desconfianza y falta de delegación. Huida y evasión. Desconexión espiritual.',
    mision: 'Aprender a usar su poder con conciencia. Equilibrar lo material con lo espiritual, liderar con ética y responsabilidad. Transformar cada crisis en oportunidad de evolución. Su grandeza no está en lo que posee, sino en cómo resurge y transforma.',
  },
  9: {
    title: 'El Humanitario',
    subtitles: 'El Sabio, El Maestro Espiritual',
    energyType: 'Energía Yin',
    aspectos: 'Altruista y compasivo: viene a amar, sanar y acompañar. Espiritual y conectado: sabiduría intuitiva. Universal e inclusivo. Creativo y sensible. Sanador desde la experiencia. Amoroso desde el alma.',
    positivo: 'Guía espiritual y sanador: Inspira desde su ejemplo, su presencia aporta calma y claridad. Entrega auténtica: Da sin buscar aplausos. Puente entre dimensiones: Traduce lo espiritual en acciones humanas.',
    negativo: 'Mártir o salvador: Puede vaciarse ayudando a todos sin poner límites. Melancolía y sufrimiento interno. Desapego o evasión de lo práctico. Aislamiento e invisibilidad. Crítica y dureza si no perdona. Idealismo frustrado.',
    mision: 'Amar sin sacrificarse. Sanar su historia, cerrar ciclos con amor y aprender que también merece cuidarse, recibir y ser visto. El camino del amor consciente que no se olvida de sí mismo.',
  },
  10: {
    title: 'El Canal',
    subtitles: 'El Líder de Nueva Era, El Iniciado',
    energyType: 'Energía Yin/Yang',
    aspectos: 'Maestría interior: Integra acción (1) y unidad (0). Canal divino: Recibe inspiración espiritual y la transforma en acciones. Líder visionario: basado en autenticidad y ejemplo. Transformador resiliente. Conciencia clara. Propósito diario.',
    positivo: 'Equilibrio y poder consciente: Cuando armoniza su polaridad interna, actúa con sabiduría y poder transformador. Visibilidad con propósito: Le gusta enseñar, inspirar y guiar desde un lugar auténtico. Destructor de obstáculos: Tiene fuerza para abrir caminos.',
    negativo: 'Confusión de identidad: Puede sentir que no encaja o que su poder lo abruma. Soberbia espiritual o mental: Si se descentra, puede volverse dominante. Evasión de su misión. Desequilibrio interno. Autocastigo: Puede apagar su luz y caer en confusión.',
    mision: 'Reconocerse como canal entre lo divino y lo humano. Equilibrar su liderazgo con humildad, mantenerse en el centro de su energía y actuar desde el propósito consciente. Aceptar su poder sin miedo para transformar desde la luz.',
  },
};

/** Simplified meanings for the number detail screen (kept for backwards compatibility) */
export const NUMBER_MEANINGS: Record<number, NumberMeaning> = Object.fromEntries(
  Object.entries(NUMBER_PROFILES).map(([key, p]) => [
    Number(key),
    {
      name: p.title,
      energy: p.aspectos,
      positive: p.positivo,
      negative: p.negativo,
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
