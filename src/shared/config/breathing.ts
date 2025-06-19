export interface BreathingExercise {
  id: string;
  name: string;
  nameUkrainian: string;
  description: string;
  descriptionUkrainian: string;
  duration: number; // in minutes
  inhaleTime: number; // in seconds
  holdTime: number; // in seconds
  exhaleTime: number; // in seconds
  holdAfterExhale?: number; // in seconds
  cycles: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  benefits: string[];
  benefitsUkrainian: string[];
  color: string;
  bgGradient: string;
  iconColor: string;
  category: "calming" | "energizing" | "focus" | "sleep" | "anxiety";
  instructions: string[];
  instructionsUkrainian: string[];
}

export const breathingExercises: BreathingExercise[] = [
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    nameUkrainian: "Дихання 4-7-8",
    description: "A powerful technique to reduce anxiety and promote sleep",
    descriptionUkrainian: "Потужна техніка для зменшення тривоги та покращення сну",
    duration: 5,
    inhaleTime: 4,
    holdTime: 7,
    exhaleTime: 8,
    cycles: 8,
    difficulty: "beginner",
    benefits: ["Reduces anxiety", "Improves sleep", "Calms nervous system", "Lowers stress"],
    benefitsUkrainian: ["Зменшує тривогу", "Покращує сон", "Заспокоює нервову систему", "Знижує стрес"],
    color: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-100",
    iconColor: "text-blue-600",
    category: "calming",
    instructions: [
      "Sit comfortably with your back straight",
      "Place tongue tip behind upper front teeth",
      "Exhale completely through your mouth",
      "Inhale through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale through mouth for 8 counts"
    ],
    instructionsUkrainian: [
      "Сядьте зручно з прямою спиною",
      "Розмістіть кінчик язика за верхніми передніми зубами",
      "Повністю видихніть через рот",
      "Вдихніть через ніс на 4 рахунки",
      "Затримайте дихання на 7 рахунків",
      "Видихніть через рот на 8 рахунків"
    ]
  },
  {
    id: "box-breathing",
    name: "Box Breathing",
    nameUkrainian: "Квадратне дихання",
    description: "Equal breathing pattern used by Navy SEALs for focus and calm",
    descriptionUkrainian: "Рівний ритм дихання, який використовують морські котики для концентрації та спокою",
    duration: 10,
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 4,
    holdAfterExhale: 4,
    cycles: 15,
    difficulty: "intermediate",
    benefits: ["Improves focus", "Reduces stress", "Enhances performance", "Balances nervous system"],
    benefitsUkrainian: ["Покращує концентрацію", "Знижує стрес", "Підвищує продуктивність", "Балансує нервову систему"],
    color: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-100",
    iconColor: "text-emerald-600",
    category: "focus",
    instructions: [
      "Sit with your spine straight",
      "Breathe out slowly to empty your lungs",
      "Inhale through nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale through mouth for 4 counts",
      "Hold empty for 4 counts"
    ],
    instructionsUkrainian: [
      "Сядьте з прямим хребтом",
      "Повільно видихніть, щоб спорожнити легені",
      "Вдихніть через ніс на 4 рахунки",
      "Затримайте дихання на 4 рахунки",
      "Видихніть через рот на 4 рахунки",
      "Затримайтеся на порожніх легенях 4 рахунки"
    ]
  },
  {
    id: "triangle-breathing",
    name: "Triangle Breathing",
    nameUkrainian: "Трикутне дихання",
    description: "Simple three-part breathing for beginners",
    descriptionUkrainian: "Просте тричастинне дихання для початківців",
    duration: 6,
    inhaleTime: 3,
    holdTime: 3,
    exhaleTime: 3,
    cycles: 12,
    difficulty: "beginner",
    benefits: ["Easy to learn", "Reduces tension", "Improves breathing awareness", "Quick stress relief"],
    benefitsUkrainian: ["Легко вивчити", "Зменшує напругу", "Покращує усвідомлення дихання", "Швидке зняття стресу"],
    color: "from-yellow-500 to-orange-600",
    bgGradient: "from-yellow-50 to-orange-100",
    iconColor: "text-yellow-600",
    category: "calming",
    instructions: [
      "Find a comfortable seated position",
      "Place one hand on chest, one on belly",
      "Inhale slowly for 3 counts",
      "Hold breath gently for 3 counts",
      "Exhale slowly for 3 counts",
      "Focus on the rhythm and flow"
    ],
    instructionsUkrainian: [
      "Знайдіть зручне положення сидячи",
      "Покладіть одну руку на груди, іншу на живіт",
      "Повільно вдихніть на 3 рахунки",
      "М'яко затримайте дихання на 3 рахунки",
      "Повільно видихніть на 3 рахунки",
      "Зосередьтеся на ритмі та потоці"
    ]
  },
  {
    id: "energizing-breath",
    name: "Energizing Breath",
    nameUkrainian: "Енергетичне дихання",
    description: "Quick breathing technique to boost energy and alertness",
    descriptionUkrainian: "Швидка техніка дихання для підвищення енергії та пильності",
    duration: 3,
    inhaleTime: 2,
    holdTime: 1,
    exhaleTime: 2,
    cycles: 20,
    difficulty: "intermediate",
    benefits: ["Increases energy", "Improves alertness", "Boosts metabolism", "Enhances mood"],
    benefitsUkrainian: ["Підвищує енергію", "Покращує пильність", "Прискорює метаболізм", "Поліпшує настрій"],
    color: "from-red-500 to-pink-600",
    bgGradient: "from-red-50 to-pink-100",
    iconColor: "text-red-600",
    category: "energizing",
    instructions: [
      "Stand or sit with good posture",
      "Take quick, shallow breaths",
      "Inhale sharply through nose for 2 counts",
      "Hold briefly for 1 count",
      "Exhale quickly through mouth for 2 counts",
      "Maintain a steady, energizing rhythm"
    ],
    instructionsUkrainian: [
      "Стійте або сідьте з гарною поставою",
      "Робіть швидкі, неглибокі вдихи",
      "Різко вдихніть через ніс на 2 рахунки",
      "Коротко затримайтеся на 1 рахунок",
      "Швидко видихніть через рот на 2 рахунки",
      "Підтримуйте стабільний, енергетичний ритм"
    ]
  },
  {
    id: "sleep-breathing",
    name: "Sleep Breathing",
    nameUkrainian: "Дихання для сну",
    description: "Gentle breathing pattern to prepare for restful sleep",
    descriptionUkrainian: "М'який ритм дихання для підготовки до спокійного сну",
    duration: 8,
    inhaleTime: 6,
    holdTime: 2,
    exhaleTime: 8,
    cycles: 10,
    difficulty: "beginner",
    benefits: ["Promotes sleep", "Reduces racing thoughts", "Relaxes muscles", "Calms mind"],
    benefitsUkrainian: ["Сприяє сну", "Зменшує нав'язливі думки", "Розслабляє м'язи", "Заспокоює розум"],
    color: "from-purple-500 to-indigo-600",
    bgGradient: "from-purple-50 to-indigo-100",
    iconColor: "text-purple-600",
    category: "sleep",
    instructions: [
      "Lie down comfortably in bed",
      "Close your eyes gently",
      "Inhale slowly and deeply for 6 counts",
      "Hold breath gently for 2 counts",
      "Exhale very slowly for 8 counts",
      "Let your body sink deeper with each breath"
    ],
    instructionsUkrainian: [
      "Зручно лягте в ліжко",
      "М'яко заплющте очі",
      "Повільно і глибоко вдихніть на 6 рахунків",
      "М'яко затримайте дихання на 2 рахунки",
      "Дуже повільно видихніть на 8 рахунків",
      "Дозвольте тілу глибше розслабитися з кожним диханням"
    ]
  },
  {
    id: "anxiety-relief",
    name: "Anxiety Relief",
    nameUkrainian: "Зняття тривоги",
    description: "Specialized breathing to quickly reduce anxiety and panic",
    descriptionUkrainian: "Спеціалізоване дихання для швидкого зменшення тривоги та паніки",
    duration: 7,
    inhaleTime: 5,
    holdTime: 3,
    exhaleTime: 7,
    cycles: 12,
    difficulty: "intermediate",
    benefits: ["Reduces anxiety", "Stops panic attacks", "Calms heart rate", "Restores control"],
    benefitsUkrainian: ["Зменшує тривогу", "Зупиняє панічні атаки", "Заспокоює серцебиття", "Відновлює контроль"],
    color: "from-teal-500 to-cyan-600",
    bgGradient: "from-teal-50 to-cyan-100",
    iconColor: "text-teal-600",
    category: "anxiety",
    instructions: [
      "Find a quiet, safe space",
      "Sit comfortably with feet on floor",
      "Focus on your breath, not your thoughts",
      "Inhale slowly through nose for 5 counts",
      "Hold breath calmly for 3 counts",
      "Exhale slowly through mouth for 7 counts"
    ],
    instructionsUkrainian: [
      "Знайдіть тихе, безпечне місце",
      "Сядьте зручно, поставивши ноги на підлогу",
      "Зосередьтеся на диханні, а не на думках",
      "Повільно вдихніть через ніс на 5 рахунків",
      "Спокійно затримайте дихання на 3 рахунки",
      "Повільно видихніть через рот на 7 рахунків"
    ]
  }
];

export const difficultyLevels = {
  beginner: {
    label: "Beginner",
    labelUkrainian: "Початковий",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Perfect for those new to breathing exercises",
    descriptionUkrainian: "Ідеально для тих, хто вперше займається дихальними вправами"
  },
  intermediate: {
    label: "Intermediate", 
    labelUkrainian: "Середній",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    description: "For those with some breathing exercise experience",
    descriptionUkrainian: "Для тих, хто має деякий досвід дихальних вправ"
  },
  advanced: {
    label: "Advanced",
    labelUkrainian: "Просунутий", 
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "For experienced practitioners seeking challenge",
    descriptionUkrainian: "Для досвідчених практиків, які шукають виклик"
  }
};

export const categories = {
  calming: {
    label: "Calming",
    labelUkrainian: "Заспокійливі",
    icon: "Heart",
    description: "Exercises to reduce stress and promote relaxation",
    descriptionUkrainian: "Вправи для зменшення стресу та сприяння розслабленню"
  },
  energizing: {
    label: "Energizing", 
    labelUkrainian: "Енергетичні",
    icon: "Zap",
    description: "Breathing techniques to boost energy and alertness",
    descriptionUkrainian: "Техніки дихання для підвищення енергії та пильності"
  },
  focus: {
    label: "Focus",
    labelUkrainian: "Концентрація",
    icon: "Target",
    description: "Exercises to improve concentration and mental clarity",
    descriptionUkrainian: "Вправи для покращення концентрації та ясності розуму"
  },
  sleep: {
    label: "Sleep",
    labelUkrainian: "Для сну",
    icon: "Moon",
    description: "Gentle breathing to prepare for restful sleep",
    descriptionUkrainian: "М'яке дихання для підготовки до спокійного сну"
  },
  anxiety: {
    label: "Anxiety Relief",
    labelUkrainian: "Зняття тривоги", 
    icon: "Shield",
    description: "Specialized techniques for anxiety and panic management",
    descriptionUkrainian: "Спеціалізовані техніки для управління тривогою та панікою"
  }
};