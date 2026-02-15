export interface NumberMeaning {
  name: string;
  energy: string;
  positive: string;
  negative: string;
  learning: string;
}

export const NUMBER_MEANINGS: Record<number, NumberMeaning> = {
  1: {
    name: 'El Líder',
    energy: 'Energía de inicio, independencia y voluntad. El 1 representa la chispa creadora, el impulso de manifestar ideas en la realidad.',
    positive: 'Determinación, originalidad, coraje y capacidad de liderazgo. Las personas con este número inspiran a otros con su visión y confianza.',
    negative: 'Terquedad, egoísmo y tendencia al aislamiento. Puede volverse autoritario cuando siente que pierde el control.',
    learning: 'Aprender a liderar sin dominar. Encontrar el equilibrio entre la independencia y la colaboración con los demás.',
  },
  2: {
    name: 'El Diplomático',
    energy: 'Energía de cooperación, sensibilidad y equilibrio. El 2 busca la armonía en todas las relaciones y situaciones.',
    positive: 'Empatía, paciencia, intuición y habilidad para mediar conflictos. Excelente compañero y consejero natural.',
    negative: 'Indecisión, dependencia emocional y tendencia a evitar confrontaciones necesarias. Puede perderse en las necesidades de otros.',
    learning: 'Aprender a establecer límites saludables sin perder la capacidad de conexión. Valorar su propia voz tanto como la de los demás.',
  },
  3: {
    name: 'El Comunicador',
    energy: 'Energía de expresión, creatividad y alegría. El 3 vibra con la necesidad de comunicar y crear belleza en el mundo.',
    positive: 'Carisma, optimismo, talento artístico y facilidad para conectar con las personas a través de las palabras.',
    negative: 'Dispersión, superficialidad y tendencia a la exageración. Puede usar el humor para evitar profundizar en emociones.',
    learning: 'Canalizar la creatividad con disciplina. Aprender que la verdadera expresión viene de la autenticidad, no de la performance.',
  },
  4: {
    name: 'El Constructor',
    energy: 'Energía de estructura, estabilidad y trabajo duro. El 4 construye bases sólidas para que los sueños se materialicen.',
    positive: 'Confiabilidad, meticulosidad, lealtad y una ética de trabajo excepcional. Es el pilar sobre el que otros pueden apoyarse.',
    negative: 'Rigidez, resistencia al cambio y tendencia al exceso de control. Puede volverse obsesivo con los detalles.',
    learning: 'Encontrar flexibilidad dentro de la estructura. Aceptar que el cambio es parte natural de la construcción.',
  },
  5: {
    name: 'El Aventurero',
    energy: 'Energía de libertad, cambio y experiencia. El 5 busca vivir la vida intensamente a través de los sentidos y la exploración.',
    positive: 'Adaptabilidad, versatilidad, curiosidad y magnetismo personal. Tiene la capacidad de reinventarse constantemente.',
    negative: 'Impulsividad, inconsistencia y adicción a la novedad. Puede huir de compromisos y responsabilidades.',
    learning: 'Encontrar libertad en el compromiso. Descubrir que la verdadera aventura está en profundizar, no solo en explorar.',
  },
  6: {
    name: 'El Protector',
    energy: 'Energía de amor, responsabilidad y servicio. El 6 está conectado con el hogar, la familia y el cuidado de los demás.',
    positive: 'Generosidad, compasión, sentido estético y capacidad de crear ambientes armoniosos. Es un sanador natural.',
    negative: 'Perfeccionismo, tendencia a controlar por amor y sacrificio excesivo. Puede cargar responsabilidades que no le corresponden.',
    learning: 'Aprender que cuidar de uno mismo no es egoísmo. Permitir que otros asuman sus propias responsabilidades.',
  },
  7: {
    name: 'El Buscador',
    energy: 'Energía de análisis, espiritualidad e introspección. El 7 busca la verdad más allá de las apariencias.',
    positive: 'Sabiduría, intuición profunda, mente analítica y conexión espiritual. Tiene la capacidad de ver lo que otros no ven.',
    negative: 'Aislamiento, desconfianza, frialdad emocional y tendencia al escepticismo extremo. Puede desconectarse del mundo.',
    learning: 'Integrar la sabiduría intelectual con la emocional. Aprender a confiar en los demás tanto como confía en su propia mente.',
  },
  8: {
    name: 'El Poderoso',
    energy: 'Energía de abundancia, autoridad y manifestación material. El 8 tiene una conexión natural con el poder y los recursos.',
    positive: 'Visión estratégica, capacidad ejecutiva, resiliencia y talento para generar prosperidad. Líder nato en el mundo material.',
    negative: 'Obsesión con el poder, materialismo y tendencia a medir el valor propio por los logros externos.',
    learning: 'Usar el poder como herramienta de servicio. Entender que la verdadera abundancia incluye la riqueza espiritual y emocional.',
  },
  9: {
    name: 'El Humanitario',
    energy: 'Energía de compasión universal, completitud y trascendencia. El 9 cierra ciclos y abraza una visión global del amor.',
    positive: 'Altruismo, sabiduría emocional, creatividad elevada y capacidad de inspirar transformación colectiva.',
    negative: 'Tendencia al martirio, dificultad para soltar el pasado y expectativas poco realistas sobre la humanidad.',
    learning: 'Aprender a soltar con gracia. Aceptar que no puede salvar al mundo, pero puede iluminar su parte de él.',
  },
  10: {
    name: 'La Rueda del Destino',
    energy: 'Energía de totalidad, reinicio y potencial infinito. El 10 combina la fuerza del 1 con la amplificación del 0, creando un ciclo completo.',
    positive: 'Potencial ilimitado, capacidad de liderazgo elevado, visión clara del propósito y conexión con ciclos universales.',
    negative: 'Presión interna por alcanzar la perfección, sensación de cargar un peso cósmico y dificultad para sentirse "normal".',
    learning: 'Abrazar el viaje completo: inicio, desarrollo y cierre. Entender que cada final es un nuevo comienzo con mayor sabiduría.',
  },
};

export const NUMBER_LABELS: Record<string, string> = {
  soul: 'Alma',
  personality: 'Personalidad',
  pastLife: 'Vida Pasada',
  gift: 'Don',
  path: 'Camino',
};
