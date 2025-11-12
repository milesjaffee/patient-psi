'use client';
import UsefulPhrasesPage from "@/components/useful-phrases-page";

export default function UsefulPhrases() {
  const oldUsefulPhrases = {
    "en-US": [
      "Hello",
      "Good morning",
      "Good afternoon",
      "Good evening",
      "How are you?",
      "Nice to meet you",
      "Are you close with your parents?",
      "Do you spend a lot of time with your parents? " ,
      "Do you get along well with your siblings?",
      "Do you get along well with your brother?",
      "Do you get along well with your sister?",
      "Do you get along well with your housemates?",
      "Do you get along well with your classmates?",
      "Tell me more why you are worried.",
      "Tell me more why you are always fatigued",
      "Tell me more why you feel hopeless",
      "Tell me more why you cannot focus on your study",
      "Tell me more why you can’t get along well with your boss",
      "What makes you happy?",
    ],
    "es-ES": [
      "Hola",
      "Buenas dias",
      "Buenas tardes",
      "Buenos noches",
      "Como estas?",
      "Mucho gusto",
      "¿Tienes una relación cercana con tus padres?",
      "¿Pasas mucho tiempo con tus padres?",
      "¿Te llevas bien con tus hermanos/as?",
      "¿Te llevas bien con tu hermano?",
      "¿Te llevas bien con tu hermana?",
      "¿Te llevas bien con tus compañeros/as de casa?",
      "¿Te llevas bien con tus compañeros/as?",
      "Dime más por qué estás preocupado.",
      "Cuéntame más por qué siempre estás fatigado.",
      "Cuéntame más por qué te sientes desesperanzado.",
      "Cuéntame más por qué no puedes concentrarte en tus estudios.",
      "Cuéntame más por qué no te llevas bien con tu jefe.",
      "¿Qué te hace feliz?",
    ]
  }
  const relevantVocabulary = {
    "en-US": [
      "Anxiety",
      "To face",
      "Support",
      "Panic Attack",
      "Emotional well-being",
      "Depression",
      "Imbalance",
      "Mood",
      "Good mood",
      "Bad mood",
      "Mood",
      "Disease",
      "Stress",
      "Fear",
      "Person you trust",
      "Friend",
      "Partner",
      "Relative",
      "Disorder",
      "Bipolar Disorder",
      "Anxiety Disorder",
      "Panic Disorder",
      "Personality Disorder",
      "Depressive Disorder",
      "Emotional Disorder",
      "Trauma / Traumatic Experience"
    ],
    "es-ES": [
      "Ansiedad",
      "Afrontar",
      "Apoyo",
      "Ataque (de pánico)",
      "Bienestar emocional",
      "Depresión",
      "Desequilibrio",
      "El humor",
      "Buen humor",
      "Mal humor",
      "Estado de ánimo",
      "Enfermedad",
      "Estrés",
      "Miedo",
      "Personas de confianza",
      "Amigo(a)",
      "Compañero(a)",
      "Familiar / pariente",
      "Trastorno",
      "bipolar",
      "de ansiedad",
      "de pánico",
      "de personalidad",
      "depresivo",
      "emocional",
      "Trauma / experiencia traumática"
    ]
  };

  const feelings = {
    "en-US": [
      "Do you feel…?",
      "Are you…?",
      "I feel…",
      "I am…",
      "Isolated",
      "Threatened",
      "Anxious",
      "Tired",
      "Confused",
      "Weak",
      "Angry",
      "Frustrated",
      "Insecure",
      "Nervous",
      "Lonely",
      "Sad"
    ],
    "es-ES": [
      "¿Se siente…?",
      "¿Está…?",
      "Me siento…",
      "Estoy…",
      "Aislado(a)",
      "Amenazado(a)",
      "Ansioso(a)",
      "Cansado(a)",
      "Confundido(a)",
      "Débil",
      "Enojado(a)",
      "Frustrado(a)",
      "Inseguro(a)",
      "Nervioso(a)",
      "Solitario(a)",
      "Triste"
    ]
  };

  const mentalHealthProfessionals = {
    "en-US": [
      "The Counselor",
      "The Doctor",
      "The General Practice Doctor",
      "The Primary Care Provider",
      "The Neurologist",
      "The Psychologist",
      "The Psychiatrist",
      "The Therapist",
      "The Social Worker"
    ],
    "es-ES": [
      "El (la) Consejero (a)",
      "El (la) Doctor (a)",
      "El (la) Médico (a) de cabecera",
      "El (la) Proveedor (a) de atención primaria",
      "El (la) Neurólogo (a)",
      "El (la) Psicólogo (a)",
      "El/La Psiquiatra",
      "El/La Terapeuta",
      "El (la) Trabajador (a) social"
    ]
  };

  const explainingDepression = {
    "en-US": [
      "It's possible you have depression if:",
      "You have a low mood most of the day",
      "You feel tired or you lack energy almost every day",
      "You feel guilty, worthless, unloved",
      "It's difficult for you to concentrate, remember details, make decisions",
      "You can't sleep or sleep too much most days",
      "You are no longer interested in the activities you liked before",
      "You think a lot about death or suicide",
      "You feel restless and irritable",
      "You feel emptiness inside",
      "You have pain or digestive problems that do not get better"
    ],
    "es-ES": [
      "Es posible que tiene depresión si:",
      "Tiene un estado de ánimo bajo la mayoría del día",
      "Se siente cansado o le falta energía casi todos los días",
      "Se siente culpable, inútil, despreciado",
      "Le cuesta concentrar, recordar detalles, tomar decisiones",
      "No puede dormir o duerme demasiado casi todos los días",
      "Ya no le interesan las actividades que antes le gustaban",
      "Piensa mucho en la muerte o el suicidio",
      "Se siente inquieto e irritable",
      "Siente un vacío dentro de sí mismo",
      "Tiene dolores o problemas digestivos que no se mejoran"
    ]
  };

  const explainingAnxiety = {
    "en-US": [
      "Anxiety is a natural feeling. It is the reaction that your body has when you feel stress, fear, and apprehension about something.",
      "When you have anxiety, you feel:",
      "Elevated heart rate",
      "Fast breathing",
      "Restlessness",
      "Difficulty concentrating",
      "Difficulty falling asleep",
      "Normal anxiety is temporary - it comes and goes but does not interfere with your daily life.",
      "If you feel anxious most of the time, and it's difficult for you to do your daily responsibilities, you may have an anxiety disorder."
    ],
    "es-ES": [
      "La ansiedad es un sentimiento natural. Es la reacción que su cuerpo tiene cuando siente estrés, miedo y aprensión sobre algo.",
      "Cuando tiene ansiedad, siente:",
      "Frecuencia cardíaca elevada",
      "Respiraciones rápidas",
      "Inquietud",
      "Dificultad para concentrar",
      "Dificultad para dormirse",
      "Ansiedad normal es pasajera - va y viene pero no interfiere con su vida diaria.",
      "Si usted se siente ansioso la mayoría del tiempo, y le cuesta realizar sus responsabilidades diarias, es posible que tenga un trastorno de ansiedad"
    ]
  };

  const panicAttacks = {
    "en-US": [
      "A panic attack is very intense or exaggerated anxiety for the current situation. It can be sudden and without explanation.",
      "You feel:",
      "Palpitations",
      "Chest pain",
      "Shortness of breath",
      "Tight chest",
      "That you are drowning",
      "That you are going to die",
      "Dizziness",
      "Nausea",
      "Sweating or chills",
      "Shakiness"
    ],
    "es-ES": [
      "Ataques de pánico son una ansiedad muy intensa o exagerada para la situación actual. Puede ser repentino y sin explicación.",
      "Usted siente:",
      "Palpitaciones",
      "Dolor de pecho",
      "Falta de aire",
      "Pecho apretado",
      "Que se ahoga",
      "Que se va a morir",
      "Mareo",
      "Náusea",
      "Sudores o escalofríos",
      "Temblores"
    ]
  };

  const explainingPTSD = {
    "en-US": [
      "Posttraumatic stress can occur if you go through a violent experience or if you observe a violent experience.",
      "It is common to suffer from posttraumatic stress after:",
      "Military combat",
      "Terrorism",
      "Natural disasters",
      "Vehicle accidents",
      "Personal attacks such as: an assault or rape",
      "It results in: Difficulty sleeping, nightmares and flashbacks that interfere with your daily life (work, relationships, etc)"
    ],
    "es-ES": [
      "El estrés postraumático puede ocurrir si usted pasa por una experiencia violenta o si usted observa una experiencia violenta.",
      "Es común padecer el estrés postraumático después de:",
      "Combate militar",
      "Terrorismo",
      "Desastres naturales",
      "Accidentes vehiculares",
      "Ataques personales como: un asalto o violación",
      "Resulta en: Dificultad para dormir, Pesadillas y Recuerdos repentinos que interfieren con su vida diaria (trabajo, relaciones, etc)"
    ]
  };

  const talkingAboutSuicide = {
    "en-US": [
      "Do you think about hurting yourself?",
      "Think about hurting another person?",
      "Do you think about taking your own life (committing suicide)?",
      "Do you have a plan? / How would I do it?",
      "Have you ever tried to take your own life (hurt yourself, hurt another person)?",
      "What happened after?"
    ],
    "es-ES": [
      "¿Piensa en lastimarse/dañarse/herirse?",
      "¿Piensa en lastimar a otra persona?",
      "¿Piensa en quitarse la vida (suicidarse)?",
      "¿Tiene un plan? / ¿Cómo lo haría?",
      "¿Alguna vez ha intentado quitarse la vida (lastimarse, lastimar a otra persona)?",
      "¿Qué pasó después?"
    ]
  };

  const explainingTherapy = {
    "en-US": [
      "Psychotherapy is also called verbal or conversational therapy.",
      "Your therapist (psychologist, counselor) is a trusted person who helps you eliminate (or at least to control) the symptoms so that you can function better and feel better.",
      "Psychotherapy is very effective in helping you cope with the difficulties of daily life such as:",
      "A disorder",
      "An illness",
      "The loss of a loved one"
    ],
    "es-ES": [
      "La psicoterapia también se llama terapia verbal o conversacional.",
      "Su terapeuta (psicólogo, consejero) es una persona de confianza quien le ayuda eliminar (o por lo menos controlar) los síntomas para que pueda funcionar mejor y sentirse mejor.",
      "La psicoterapia es muy eficaz en ayudarle afrontar las dificultades de la vida diaria como:",
      "Un trastorno",
      "Una enfermedad",
      "La pérdida de un ser querido"
    ]
  };

  const explainingTreatments = {
    "en-US": [
      "Medicines:",
      "Antidepressants: help you control feelings of depression. It may take up to several weeks to work - so you need to take the medicine without fail",
      "Positive behaviors:",
      "Exercise: Regular exercise helps the body reduce stress and reduce symptoms of depression. It can also relax you",
      "Community: Feeling isolated and lonely makes your depression and anxiety worse. Instead, a positive community improves mental health and emotional well-being.",
      "Diet: A diet high in: fruits and vegetables, whole grains, lean and low-fat proteins, sodium and sugar is good for mental health."
    ],
    "es-ES": [
      "Medicamentos:",
      "Antidepresivos: le ayudan controlar los sentimientos de la depresión. Pueden tardar hasta varias semanas en funcionar - así que necesita tomar la medicina sin falta",
      "Conductas positivas:",
      "Ejercicio: Ejercicio regular ayuda al cuerpo bajar el estrés y bajar los síntomas de depresión. También le puede relajar",
      "Comunidad: Sentirse aislado y solitario empeora su depresión y ansiedad. En cambio, una comunidad positiva mejora la salud mental y bienestar emocional.",
      "Dieta: Una dieta alta en: frutas y verduras, granos enteros, proteínas magras y baja en grasa, sodio y azúcar es buena para la salud mental."
    ]
  };

  const empathyAndAssurance = {
    "en-US": [
      "I get it",
      "It's hard",
      "I think that you…",
      "I see that you …",
      "I'm glad",
      "I'm sorry",
      "It's common",
      "It's normal",
      "You don't have to be ashamed",
      "I would be _ too",
      "You can face this",
      "You are able to …",
      "There is a solution",
      "Many people have excelled"
    ],
    "es-ES": [
      "Entiendo",
      "Es difícil",
      "Me parece que usted…",
      "Veo que usted…",
      "Me alegro",
      "Lo siento",
      "Es común",
      "Es normal",
      "No hay que tener vergüenza",
      "Yo estaría _____ también",
      "Ud puede enfrentar esto",
      "Ud es capaz de…",
      "Hay una solución",
      "Muchas personas han sobresalido"
    ]
  };

  const phraseList = [
    oldUsefulPhrases,relevantVocabulary, feelings,
    mentalHealthProfessionals,explainingDepression,explainingAnxiety, panicAttacks,
    explainingPTSD, talkingAboutSuicide, explainingTherapy, explainingTreatments,empathyAndAssurance
  ];
  const phraseListNames = ["Generally Useful","Relevant Vocabulary", "Feelings",
    "Mental Health Professionals","Explaining Depression","Explaining Anxiety", "Panic Attacks",
    "Explaining PTSD", "Self Harm and Suicide", "Explaining Therapy", "Explaining Treatments","Empathy And Assurance"];

  return <UsefulPhrasesPage usefulPhrases={phraseList} phraseListNames={phraseListNames} />
  
}