const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Base de conocimiento numerológico ───────────────────────────────────────
const NUM_DESC: Record<number, { titulo: string; virtudes: string; sombra: string; mision: string }> = {
  1: {
    titulo: "El Creador, El Pionero, El Independiente",
    virtudes:
      "Abre caminos donde no los hay. Pionero, fuerte, valiente, libre, decidido y seguro." +
      " Muy protector con quienes lo rodean. Logico, directo, ambicioso, orientado a metas." +
      " Lider natural. Justicia y claridad moral firme.",
    sombra:
      "Si no bebe de su numero: egocentrico, autoritario, dominante y conflictivo." +
      " Irascible, terco, impulsivo. Frustracion y autocastigo cuando se siente bloqueado.",
    mision:
      "Abrir caminos con conciencia. Liderar desde el poder interior equilibrando fuerza con sensibilidad." +
      " No viene a imponer, sino a guiar.",
  },
  2: {
    titulo: "La Madre, La Protectora, La Diplomatica",
    virtudes:
      "Complementa a los demas con sensibilidad y flexibilidad. Amoroso y suave, atiende y cuida con gusto." +
      " Capta el dolor ajeno con facilidad. Hogare\u00f1o. Diplomatico, sereno, puente entre visiones." +
      " Gran obediencia a un orden superior.",
    sombra:
      "Si no bebe de su numero: dubitativo, se subestima, espera que los demas decidan." +
      " Hipersensible, sufre por todo, se siente culpable. Miedo e inseguridad. Se deja manipular.",
    mision:
      "Sanar, acompa\u00f1ar y mediar. Complementar con dulzura, cuidar desde el amor y facilitar relaciones sanas." +
      " Sostener sin dominar; unir sin imponer.",
  },
  3: {
    titulo: "El Hijo, El Artista, El Comunicador",
    virtudes:
      "Alegre por naturaleza; el numero del ni\u00f1o que quiere y se deja querer." +
      " Respeta la igualdad; considera a todos como iguales. Bondadoso, compasivo." +
      " Creativo, carismatico, contagia entusiasmo y optimismo. Flexible, se adapta con gracia.",
    sombra:
      "Si no bebe: racista, clasista, mentiroso, depresivo. Tiende a aislarse, intolerante." +
      " Tristeza interna si no se expresa autenticamente. Dispersion, le cuesta enfocarse.",
    mision:
      "Expresarse creativamente y compartir su energia positiva. Ser canal de creatividad y comunicacion." +
      " Elevar lo humano hacia lo espiritual.",
  },
  4: {
    titulo: "El Constructor, El Organizador, El Fundamento",
    virtudes:
      "Solidifica lo sutil: hace vida humana los principios espirituales, no habla de lo que no hace." +
      " Palabra de honor: jamas olvida la palabra empe\u00f1ada." +
      " Quiere ser libre y dejar libres a los demas. Templanza, confiabilidad, orden, voluntad y perseverancia.",
    sombra:
      "Si no bebe: vive con dolor sus contradicciones internas, habla sin certeza." +
      " No escucha a los demas, terco, agresivo. Le cuesta adaptarse a lo nuevo. Miedo a empezar de cero.",
    mision:
      "Crear una base solida para si mismo y para los demas. Organizar, estructurar y traer estabilidad." +
      " Aprender que la vida no es una tragedia si algo no funciona bien; adaptarse y reiniciar.",
  },
  5: {
    titulo: "El Libertador, El Explorador, El Viajero",
    virtudes:
      "Buscador incansable de la libertad; no le afectan demasiado los golpes del destino." +
      " Ama los desafios y la aventura. Atractivo, con encanto personal." +
      " Energia dinamica, creativa, independiente. Balancea libertad y fortaleza con sensibilidad y nobleza.",
    sombra:
      "Si no bebe: egolatra, soberbio, autoritario." +
      " Su animo de libertad se convierte en libertinaje o esclavitud de malos habitos." +
      " Irresponsable, desorganizado, impulsivo.",
    mision:
      "Encontrar el equilibrio entre la libertad y la responsabilidad." +
      " Usar su poder de transformacion como alquimista para crear cambios positivos y duraderos.",
  },
  6: {
    titulo: "El Amor, La Familia, El Servicio",
    virtudes:
      "El Angel de la Guarda: protege en forma permanente y busca pasar desapercibido." +
      " Gran fortaleza para orar y meditar. Muy leal con familia, amigos y comunidad." +
      " Intuitivo. Busca la alta vibracion en personas, situaciones y palabras. Humildad como virtud central.",
    sombra:
      "Si no bebe: errante, no sabe lo que quiere, cambia permanentemente." +
      " Se queda en los propositos de los demas y no encuentra el suyo." +
      " Sobreproteccion, codigo de martir, culpa, dependencia emocional.",
    mision:
      "Amar sin perderse, servir sin olvidarse. Aprender a servir por conviccion, no por aprobacion." +
      " Su tarea es distinguir entre el servicio genuino y el sacrificio por necesidad de ser visto.",
  },
  7: {
    titulo: "El Sabio, El Solitario, El Mistico",
    virtudes:
      "Numero sagrado en todas las culturas. Viene a UNIR CIELO Y TIERRA en su propio interior." +
      " Cuando bebe de su numero es sumamente intuitivo, casi clarividente." +
      " Tiene aura fuerte e independiente. Su tema es LA MAGIA: su presencia impone, magnetica e intensa.",
    sombra:
      "Si no bebe: debil, inseguro, influenciable. Se vuelve tirano y nervioso." +
      " Inflexible si las cosas no le cierran. Cierra con la razon y se queda rumiando el mismo asunto." +
      " Aislamiento emocional, frialdad, desconfianza.",
    mision:
      "Unir cielo y tierra. Confiar en los demas, abrir su mundo interior y compartir su sabiduria sin imponerla." +
      " El conocimiento no es solo para el, sino para inspirar con humildad y compasion.",
  },
  8: {
    titulo: "El Poder, El Lider, El Maestro del Mundo Material",
    virtudes:
      "El numero del delfin. Capaz de CERRAR mientras INICIA lo que sigue." +
      " Gran habilidad para organizar lo nuevo. Numero de la ESPERANZA: gran fortaleza interior, no se da por vencido." +
      " Como el Ave Fenix, se reconstruye tras cada caida. Lider estrategico, etico, perseverante.",
    sombra:
      "Si no bebe: materialista, pierde el camino espiritual, se vuelve inestable, temeroso, intolerante." +
      " Sus proyectos fracasan por miedos internos. Controlador, rigido, dominante. Frialdad emocional.",
    mision:
      "Usar su poder con conciencia. Equilibrar lo material con lo espiritual. Liderar con etica." +
      " Demostrar que es posible construir desde el corazon, no desde el control.",
  },
  9: {
    titulo: "El Sabio, El Humanitario, El Maestro Espiritual",
    virtudes:
      "Sus virtudes se toman desde un lugar distinto: no desde la propia realizacion sino desde el bien de la humanidad." +
      " Se cura para que otros tambien lo logren. Trabaja por amor universal, no por interes." +
      " Altruista, compasivo, espiritual, sanador desde la experiencia.",
    sombra:
      "Si no bebe: intolerante, no saben AMAR. Inconstantes e inestables." +
      " Fuerte individualismo. Cuando no esta en amor, no se mezcla con nadie." +
      " LA VIRTUD PRINCIPAL A TRABAJAR ES EL AMOR. Melancolia, sufrimiento interno, resentimiento.",
    mision:
      "Amar sin sacrificarse. Sanar su historia, cerrar ciclos con amor." +
      " Su camino es el del amor consciente que no se olvida de si mismo al entregarse a los demas.",
  },
  10: {
    titulo: "El Lider de Nueva Era, El Canal, El Iniciado",
    virtudes:
      "Une al UNO (el Padre) con el CERO (la humanidad y la vida eterna). Su sentido primero son los otros." +
      " UNE EL AMOR CON LA SABIDURIA y la FORTALEZA. Su presencia proyecta LUZ al lugar donde entra." +
      " Canal divino, liderazgo visionario, transformador resiliente.",
    sombra:
      "Si no bebe: cobarde, sin dignidad. Debil y extremadamente orgulloso. Depresivo y solitario." +
      " Gran capacidad autodestructiva. Confusion de identidad, soberbia espiritual, evasion de su mision.",
    mision:
      "Reconocerse como canal entre lo divino y lo humano. Equilibrar su liderazgo con humildad." +
      " Aceptar su poder sin miedo para transformar desde la luz, no desde el control ni la evasion.",
  },
};

function numInfo(n: number): string {
  const d = NUM_DESC[n] ?? NUM_DESC[9];
  return (
    `NUMERO ${n} - ${d.titulo}\n` +
    `Virtudes (cuando bebe del numero): ${d.virtudes}\n` +
    `Sombra (cuando no bebe): ${d.sombra}\n` +
    `Mision: ${d.mision}`
  );
}

// ─── Rol de cada numero en el mapa pitagorico ────────────────────────────────
const ROLE_ALMA =
  "El ALMA (dia de nacimiento) es la esencia inmortal que evoluciona. Es ESTABLE." +
  " Revela los deseos mas profundos y autenticos del ser.";
const ROLE_PASADA =
  "La VIDA PASADA (suma del año de nacimiento) es ESTABLE." +
  " Representa lecciones karmicas ya aprendidas que se traen como base.";
const ROLE_DON =
  "El DON (suma de los 2 ultimos digitos del año) es ESTABLE." +
  " Es la tendencia genetica heredada de alguien en la familia que ya lo aprendio." +
  " Es una herramienta extraordinaria del alma plasmada en la personalidad.";
const ROLE_PERSONALIDAD =
  "La PERSONALIDAD (mes de nacimiento) es lo que se VINO A APRENDER Y TRABAJAR." +
  " NO indica que ya se tengan esas caracteristicas," +
  " sino que la vida pondra situaciones para ejercitarlas.";
const ROLE_CAMINO =
  "El CAMINO (suma de toda la fecha) tiene que ver con las DECISIONES que tomamos." +
  " Si una decision nos trae paz y fascinacion, vibra en nuestro camino.";

// ─── Handler principal ────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY") ?? "";
  if (!GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "GROQ_API_KEY no configurada" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const body = await req.json();
  const messages = body.messages;
  const userProfile = body.userProfile;
  const scenario = body.scenario;
  const n = userProfile.numbers;

  const portrait = [
    `MAPA NUMEROLOGICO DE ${userProfile.name.toUpperCase()}`,
    `- Alma (dia): ${n.soul} — ${numInfo(n.soul)}`,
    `- Vida Pasada (año): ${n.pastLife} — ${numInfo(n.pastLife)}`,
    `- Don (ultimos 2 digitos del año): ${n.gift} — ${numInfo(n.gift)}`,
    `- Personalidad (mes): ${n.personality} — ${numInfo(n.personality)}`,
    `- Camino (fecha completa): ${n.path} — ${numInfo(n.path)}`,
    "",
    "ROLES EN EL SISTEMA PITAGORICO:",
    ROLE_ALMA,
    ROLE_PASADA,
    ROLE_DON,
    ROLE_PERSONALIDAD,
    ROLE_CAMINO,
  ].join("\n");

  const base =
    "Eres KYROS, mentor de Numerologia Pitagorica empatico y sabio." +
    " Hablas en español con tono calido y profundo. Eres KYROS, no una IA.\n\n" +
    portrait + "\n\n" +
    `REGLA FUNDAMENTAL: Cada respuesta tuya DEBE conectarse directamente con los numeros de ${userProfile.name}.` +
    ` No des consejos genericos: usa los numeros concretos` +
    ` (Alma ${n.soul}, Vida Pasada ${n.pastLife}, Don ${n.gift}, Personalidad ${n.personality}, Camino ${n.path})` +
    ` para iluminar cada respuesta. Maximo 3 parrafos por respuesta.\n\n`;

  let systemPrompt = base;

  if (scenario === "work") {
    systemPrompt +=
      `CONTEXTO - TRABAJO Y CARRERA:\n` +
      `Analiza la situacion laboral de ${userProfile.name} usando estos tres numeros como lente diagnostico:\n` +
      `1. CAMINO ${n.path}: filtro principal de decision. ¿La situacion que describe vibra en paz y fascinacion, o genera resistencia?\n` +
      `2. DON ${n.gift}: talentos heredados. ¿Los esta activando (virtudes) o viviendo en sombra?\n` +
      `3. PERSONALIDAD ${n.personality}: NUMERO RETO. No lo tiene dominado — la vida laboral le pone situaciones para ejercitarlo.\n\n` +
      `REGLAS DE CALIDAD:\n` +
      `- Lee el historial. Si ya explicaste un angulo de un numero, no lo repitas: busca un aspecto nuevo (virtud vs sombra, mision, implicacion practica).\n` +
      `- Diagnostica siempre: ¿vibra en las virtudes o en la sombra de ese numero segun lo que cuenta?\n` +
      `- Cierra cada respuesta con 1 pregunta de reflexion o 1 accion concreta anclada en sus numeros.\n` +
      `- Menciona los numeros concretos, no solo su significado abstracto.`;
  } else if (scenario === "relocation") {
    systemPrompt +=
      `CONTEXTO DE CONSULTA - MUDANZA Y ENTORNO:\n` +
      `Para orientar a ${userProfile.name} en su cambio de espacio, usa estos tres numeros:\n` +
      `1. CAMINO ${n.path} (el nuevo lugar permite su mision de vida?):` +
      ` Un entorno que vibra en su Camino ${n.path} le traera paz y fascinacion.\n` +
      `2. VIDA PASADA ${n.pastLife} (lecciones karmicas del pasado):` +
      ` Que patrones de su Vida Pasada ${n.pastLife} se repiten en esta decision de mudanza?\n` +
      `3. ALMA ${n.soul} (que necesita genuinamente el corazon):` +
      ` El Alma ${n.soul} tiene deseos autenticos sobre el hogar y el entorno.\n` +
      `Analiza siempre la mudanza desde estos tres planos: mision (Camino), karma (Vida Pasada) y corazon (Alma).`;
  } else if (scenario === "relationship") {
    systemPrompt +=
      `CONTEXTO - RELACIONES Y VINCULOS:\n\n` +
      `MAPA DE ${userProfile.name.toUpperCase()} EN RELACIONES:\n` +
      `- Alma ${n.soul} (deseo profundo del alma en vinculos): ${NUM_DESC[n.soul]?.virtudes?.split(".")[0] ?? ""}\n` +
      `- Vida Pasada ${n.pastLife} (patrones heredados en relaciones): ${NUM_DESC[n.pastLife]?.virtudes?.split(".")[0] ?? ""}\n` +
      `- Don ${n.gift} (lo que aporta naturalmente al vinculo): ${NUM_DESC[n.gift]?.virtudes?.split(".")[0] ?? ""}\n` +
      `- Personalidad ${n.personality} — NUMERO RETO: lo que esta aprendiendo a trabajar en sus vinculos.\n` +
      `- Camino ${n.path} — FILTRO CENTRAL: ¿esta relacion potencia o frena su Camino ${n.path}?\n\n` +
      `REGLA CRITICA: NUNCA analices a la otra persona de forma aislada.\n` +
      `Cada observacion sobre ella debe conectarse directamente con lo que significa para ${userProfile.name} y su Camino ${n.path}.\n\n` +
      `CUANDO ${userProfile.name.toUpperCase()} COMPARTA UNA FECHA DE NACIMIENTO, sigue este proceso:\n` +
      `PASO 1 — Calcula los 5 numeros de la otra persona:\n` +
      `  - Alma = suma de digitos del DIA, reducir a 1-10\n` +
      `  - Personalidad = MES (si tiene 2 digitos, sumarlos)\n` +
      `  - Vida Pasada = suma de los 4 digitos del ANO, reducir a 1-10\n` +
      `  - Don = suma de los 2 ultimos digitos del ANO, reducir a 1-10\n` +
      `  - Camino = suma de TODOS los digitos de la fecha completa (dd+mm+yyyy), reducir a 1-10\n` +
      `PASO 2 — Nombra los 5 numeros calculados claramente.\n` +
      `PASO 3 — Contrasta par a par, priorizando retos:\n` +
      `  1. Camino ${n.path} de ${userProfile.name} vs Camino de la otra persona\n` +
      `  2. Personalidad ${n.personality} de ${userProfile.name} vs Personalidad de la otra persona\n` +
      `  3. Alma ${n.soul} de ${userProfile.name} vs Alma de la otra persona\n` +
      `  4. Don ${n.gift} de ${userProfile.name} vs Don de la otra persona\n` +
      `  5. Vida Pasada ${n.pastLife} de ${userProfile.name} vs Vida Pasada de la otra persona\n` +
      `PASO 4 — Identifica 1-2 puntos de resonancia y 1-2 puntos de tension en la dinamica.\n` +
      `PASO 5 — Respuesta directa: ¿esta relacion potencia o reta el Camino de ${userProfile.name}?\n\n` +
      `EN CADA RESPUESTA: cierra siempre con 1 pregunta de reflexion que ayude a ${userProfile.name} a tomar su propia decision.\n` +
      `Las preguntas deben estar ancladas en sus numeros, no ser genericas.`;
  }

  const userMessageCount = messages.filter((m: { role: string }) => m.role === "user").length;
  if (userMessageCount >= 3) {
    if (scenario === "relationship") {
      systemPrompt +=
        `\n\nEste es el ultimo intercambio de la consulta de hoy.` +
        ` Cierra con 2-3 preguntas de reflexion profunda que ayuden a ${userProfile.name} a decidir sobre esta relacion,` +
        ` usando sus numeros concretos como espejo (especialmente Camino ${n.path} y Alma ${n.soul}).` +
        ` Despidete con calidez indicando que la consulta ha concluido y que manana puede volver.`;
    } else {
      systemPrompt +=
        `\n\nEste es el ultimo intercambio de la consulta de hoy.` +
        ` Cierra con 2-3 preguntas de reflexion profunda basadas en los numeros de ${userProfile.name}.` +
        ` Luego despidete con calidez indicando que la consulta ha concluido y que manana puede volver.`;
    }
  }

  const groqMessages = [{ role: "system", content: systemPrompt }];
  for (const m of messages) {
    groqMessages.push({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    });
  }

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + GROQ_API_KEY,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: groqMessages,
      temperature: 0.8,
      max_tokens: 700,
    }),
  });

  const data = await groqRes.json();

  if (!groqRes.ok) {
    const errMsg = data?.error?.message ?? JSON.stringify(data);
    return new Response(JSON.stringify({ error: errMsg }), {
      status: groqRes.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const text = data?.choices?.[0]?.message?.content ?? "";
  return new Response(JSON.stringify({ text }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
