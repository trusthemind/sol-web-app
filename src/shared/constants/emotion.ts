import {
  Activity,
  Bed,
  Briefcase,
  Cloud,
  CloudRain,
  DollarSign,
  Dumbbell,
  Flame,
  Heart,
  Home,
  Moon,
  Newspaper,
  Smartphone,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Users,
  Utensils,
  Waves,
  Wind,
  Zap,
} from "lucide-react";

import {
  alarming,
  angry,
  exited,
  happy,
  neutral,
  sad,
  satistied,
  sleepy,
} from "./emotion-files";

// Translation keys for mood tracker
export const translations = {
  en: {
    moodTracker: {
      moods: {
        joyful: {
          name: "Joyful",
          description: "Feeling energetic, happy, and full of life",
          activities: [
            "Take a walk in nature",
            "Call a friend or loved one",
            "Listen to upbeat music",
            "Dance or move your body",
          ],
          affirmation: "I embrace the joy in my life and share it with others.",
        },
        content: {
          name: "Content",
          description: "Peaceful, satisfied, and at ease with yourself",
          activities: [
            "Practice meditation",
            "Read a good book",
            "Write in a gratitude journal",
            "Enjoy a warm cup of tea",
          ],
          affirmation: "I am at peace with myself and my surroundings.",
        },
        neutral: {
          name: "Neutral",
          description: "Feeling balanced, neither particularly good nor bad",
          activities: [
            "Practice mindfulness",
            "Do light stretching",
            "Journal your thoughts",
            "Take a mindful walk",
          ],
          affirmation:
            "I accept my current state and remain open to what comes next.",
        },
        anxious: {
          name: "Anxious",
          description: "Feeling worried, stressed, or overwhelmed",
          activities: [
            "Practice deep breathing",
            "Try progressive muscle relaxation",
            "Use grounding techniques",
            "Listen to calming music",
          ],
          affirmation:
            "This feeling is temporary. I am safe and I can handle this moment.",
        },
        sad: {
          name: "Sad",
          description: "Feeling down, melancholy, or emotionally low",
          activities: [
            "Practice self-care",
            "Gentle movement or yoga",
            "Talk to someone you trust",
            "Watch something comforting",
          ],
          affirmation:
            "It's okay to feel sad. My emotions are valid and will pass with time.",
        },
        angry: {
          name: "Angry",
          description: "Feeling frustrated, irritated, or mad",
          activities: [
            "Physical exercise",
            "Write out your feelings",
            "Count to ten slowly",
            "Take a cold shower",
          ],
          affirmation:
            "I acknowledge my anger and choose how to respond to it constructively.",
        },
        excited: {
          name: "Excited",
          description: "Feeling enthusiastic, eager, and full of anticipation",
          activities: [
            "Channel energy into creativity",
            "Share your excitement with others",
            "Plan your next steps",
            "Start a new project",
          ],
          affirmation:
            "I embrace this positive energy and direct it purposefully.",
        },
        tired: {
          name: "Tired",
          description: "Feeling fatigued, exhausted, or low on energy",
          activities: [
            "Take a short nap",
            "Gentle stretching",
            "Prioritize rest and recovery",
            "Practice relaxation techniques",
          ],
          affirmation: "I honor my body's need for rest and recovery.",
        },
      },
      triggers: {
        work: "Work",
        relationships: "Relationships",
        health: "Health",
        finances: "Finances",
        socialMedia: "Social Media",
        news: "News",
        weather: "Weather",
        sleep: "Sleep",
        exercise: "Exercise",
        food: "Food",
        family: "Family",
        friends: "Friends",
      },
    },
  },
  ua: {
    moodTracker: {
      moods: {
        joyful: {
          name: "Радісний",
          description: "Відчуваю енергію, щастя та повноту життя",
          activities: [
            "Прогулятися на природі",
            "Подзвонити другу або коханій людині",
            "Послухати бадьору музику",
            "Потанцювати або порухатися",
          ],
          affirmation:
            "Я приймаю радість у своєму житті та ділюся нею з іншими.",
        },
        content: {
          name: "Задоволений",
          description: "Спокійний, задоволений та в гармонії з собою",
          activities: [
            "Практикувати медитацію",
            "Читати хорошу книгу",
            "Писати у щоденнику вдячності",
            "Насолоджуватися теплою чашкою чаю",
          ],
          affirmation: "Я у мирі з собою та своїм оточенням.",
        },
        neutral: {
          name: "Нейтральний",
          description: "Відчуваю баланс, ні особливо добре, ні погано",
          activities: [
            "Практикувати усвідомленість",
            "Робити легку розтяжку",
            "Записувати свої думки",
            "Гуляти усвідомлено",
          ],
          affirmation:
            "Я приймаю свій поточний стан та залишаюся відкритим до того, що буде далі.",
        },
        anxious: {
          name: "Тривожний",
          description: "Відчуваю занепокоєння, стрес або перевантаження",
          activities: [
            "Практикувати глибоке дихання",
            "Спробувати прогресивну м'язову релаксацію",
            "Використовувати техніки заземлення",
            "Слухати заспокійливу музику",
          ],
          affirmation:
            "Це почуття тимчасове. Я в безпеці і можу впоратися з цим моментом.",
        },
        sad: {
          name: "Сумний",
          description: "Відчуваю пригніченість, меланхолію або емоційний спад",
          activities: [
            "Практикувати самотурботу",
            "Легкі рухи або йога",
            "Поговорити з тим, кому довіряю",
            "Подивитися щось заспокійливе",
          ],
          affirmation:
            "Нормально відчувати сум. Мої емоції важливі та з часом пройдуть.",
        },
        angry: {
          name: "Сердитий",
          description: "Відчуваю фрустрацію, роздратування або злість",
          activities: [
            "Фізичні вправи",
            "Записати свої почуття",
            "Порахувати до десяти повільно",
            "Прийняти холодний душ",
          ],
          affirmation:
            "Я визнаю свою злість та обираю, як конструктивно на неї реагувати.",
        },
        excited: {
          name: "Збуджений",
          description: "Відчуваю ентузіазм, нетерпіння та повний очікування",
          activities: [
            "Спрямувати енергію на творчість",
            "Поділитися своїм збудженням з іншими",
            "Спланувати наступні кроки",
            "Почати новий проект",
          ],
          affirmation:
            "Я приймаю цю позитивну енергію та спрямовую її цілеспрямовано.",
        },
        tired: {
          name: "Втомлений",
          description: "Відчуваю втому, виснаження або низький рівень енергії",
          activities: [
            "Коротко подрімати",
            "Легка розтяжка",
            "Пріоритет відпочинку та відновлення",
            "Практикувати техніки релаксації",
          ],
          affirmation:
            "Я поважаю потребу свого тіла у відпочинку та відновленні.",
        },
      },
      triggers: {
        work: "Робота",
        relationships: "Стосунки",
        health: "Здоров'я",
        finances: "Фінанси",
        socialMedia: "Соціальні мережі",
        news: "Новини",
        weather: "Погода",
        sleep: "Сон",
        exercise: "Фізичні вправи",
        food: "Їжа",
        family: "Сім'я",
        friends: "Друзі",
      },
    },
  },
};

type TranslationType = typeof translations;

const getTranslation = (
  translations: TranslationType | any,
  locale: string,
  key: any
) => {
  const keys = key.split(".");
  let value = translations[locale];

  for (const k of keys) {
    if (value && value[k]) value = value[k];
    else {
      value = translations["en"];
      for (const fallbackKey of keys) {
        if (value && value[fallbackKey]) value = value[fallbackKey];
        else return key;
      }

      break;
    }
  }

  return value || key;
};

export const moods = (t: any, locale = "ua") => [
  {
    id: 1,
    name: getTranslation(translations, locale, "moodTracker.moods.joyful.name"),
    icon: happy,
    color: "from-yellow-300 via-orange-400 to-pink-500",
    bgColor:
      "bg-gradient-to-br from-yellow-300 via-orange-400 via-pink-400 to-rose-500",
    lightBg: "bg-gradient-to-br from-yellow-100 to-orange-100",
    iconColor: "text-orange-600",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.joyful.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.joyful.activities"
    ),
    breathingPattern: "normal",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.joyful.affirmation"
    ),
    particles: "sunshine",
    animation: "bounce",
    primaryColor: "#F59E0B",
    secondaryColor: "#FDE68A",
    effectIcon: Star,
  },
  {
    id: 2,
    name: getTranslation(
      translations,
      locale,
      "moodTracker.moods.content.name"
    ),
    icon: satistied,
    color: "from-green-400 to-blue-500",
    bgColor: "bg-gradient-to-br from-green-400 via-emerald-400 to-blue-500",
    lightBg: "bg-green-50",
    iconColor: "text-green-500",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.content.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.content.activities"
    ),
    breathingPattern: "calm",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.content.affirmation"
    ),
    particles: "gentle",
    animation: "float",
    primaryColor: "#10B981",
    secondaryColor: "#A7F3D0",
    effectIcon: Waves,
  },
  {
    id: 3,
    name: getTranslation(
      translations,
      locale,
      "moodTracker.moods.neutral.name"
    ),
    icon: neutral,
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gradient-to-br from-gray-400 via-slate-400 to-gray-600",
    lightBg: "bg-gray-50",
    iconColor: "text-gray-500",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.neutral.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.neutral.activities"
    ),
    breathingPattern: "normal",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.neutral.affirmation"
    ),
    particles: "minimal",
    animation: "steady",
    primaryColor: "#6B7280",
    secondaryColor: "#D1D5DB",
    effectIcon: Wind,
  },
  {
    id: 4,
    name: getTranslation(
      translations,
      locale,
      "moodTracker.moods.anxious.name"
    ),
    icon: alarming,
    color: "from-orange-400 to-red-500",
    bgColor: "bg-gradient-to-br from-orange-400 via-red-400 to-red-500",
    lightBg: "bg-orange-50",
    iconColor: "text-orange-500",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.anxious.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.anxious.activities"
    ),
    breathingPattern: "calming",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.anxious.affirmation"
    ),
    particles: "electric",
    animation: "pulse",
    primaryColor: "#F97316",
    secondaryColor: "#FDBA74",
    effectIcon: Zap,
  },
  {
    id: 5,
    name: getTranslation(translations, locale, "moodTracker.moods.sad.name"),
    icon: sad,
    color: "from-sky-400 via-blue-500 to-indigo-600",
    bgColor:
      "bg-gradient-to-br from-sky-400 via-blue-500 via-indigo-500 to-purple-600",
    lightBg: "bg-gradient-to-br from-sky-100 to-blue-100",
    iconColor: "text-blue-600",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.sad.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.sad.activities"
    ),
    breathingPattern: "deep",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.sad.affirmation"
    ),
    particles: "rain",
    animation: "drift",
    primaryColor: "#3B82F6",
    secondaryColor: "#93C5FD",
    effectIcon: CloudRain,
  },
  {
    id: 6,
    name: getTranslation(translations, locale, "moodTracker.moods.angry.name"),
    icon: angry,
    color: "from-red-500 via-rose-600 to-pink-700",
    bgColor:
      "bg-gradient-to-br from-red-500 via-rose-600 via-pink-600 to-fuchsia-700",
    lightBg: "bg-gradient-to-br from-red-100 to-rose-100",
    iconColor: "text-red-700",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.angry.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.angry.activities"
    ),
    breathingPattern: "releasing",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.angry.affirmation"
    ),
    particles: "fire",
    animation: "shake",
    primaryColor: "#EF4444",
    secondaryColor: "#FCA5A5",
    effectIcon: Flame,
  },
  {
    id: 7,
    name: getTranslation(
      translations,
      locale,
      "moodTracker.moods.excited.name"
    ),
    icon: exited,
    color: "from-yellow-300 to-pink-500",
    bgColor: "bg-gradient-to-br from-yellow-300 via-pink-400 to-pink-500",
    lightBg: "bg-pink-50",
    iconColor: "text-pink-500",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.excited.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.excited.activities"
    ),
    breathingPattern: "energizing",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.excited.affirmation"
    ),
    particles: "sparkle",
    animation: "vibrate",
    primaryColor: "#EC4899",
    secondaryColor: "#F9A8D4",
    effectIcon: Sparkles,
  },
  {
    id: 8,
    name: getTranslation(translations, locale, "moodTracker.moods.tired.name"),
    icon: sleepy,
    color: "from-violet-400 via-indigo-500 to-purple-600",
    bgColor:
      "bg-gradient-to-br from-violet-400 via-indigo-500 via-purple-500 to-blue-700",
    lightBg: "bg-gradient-to-br from-violet-100 to-indigo-100",
    iconColor: "text-indigo-700",
    description: getTranslation(
      translations,
      locale,
      "moodTracker.moods.tired.description"
    ),
    suggestedActivities: getTranslation(
      translations,
      locale,
      "moodTracker.moods.tired.activities"
    ),
    breathingPattern: "restful",
    affirmation: getTranslation(
      translations,
      locale,
      "moodTracker.moods.tired.affirmation"
    ),
    particles: "dreamy",
    animation: "slow",
    primaryColor: "#6366F1",
    secondaryColor: "#C7D2FE",
    effectIcon: Snowflake,
  },
];

export const emotionTriggers = (t: any, locale = "ua") => [
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.work"),
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
    category: "external",
  },
  {
    label: getTranslation(
      translations,
      locale,
      "moodTracker.triggers.relationships"
    ),
    icon: Heart,
    color: "text-pink-600",
    bg: "bg-pink-50",
    category: "social",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.health"),
    icon: Activity,
    color: "text-green-600",
    bg: "bg-green-50",
    category: "physical",
  },
  {
    label: getTranslation(
      translations,
      locale,
      "moodTracker.triggers.finances"
    ),
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    category: "external",
  },
  {
    label: getTranslation(
      translations,
      locale,
      "moodTracker.triggers.socialMedia"
    ),
    icon: Smartphone,
    color: "text-purple-600",
    bg: "bg-purple-50",
    category: "digital",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.news"),
    icon: Newspaper,
    color: "text-orange-600",
    bg: "bg-orange-50",
    category: "digital",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.weather"),
    icon: Cloud,
    color: "text-sky-600",
    bg: "bg-sky-50",
    category: "environmental",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.sleep"),
    icon: Bed,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    category: "physical",
  },
  {
    label: getTranslation(
      translations,
      locale,
      "moodTracker.triggers.exercise"
    ),
    icon: Dumbbell,
    color: "text-red-600",
    bg: "bg-red-50",
    category: "physical",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.food"),
    icon: Utensils,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    category: "physical",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.family"),
    icon: Home,
    color: "text-teal-600",
    bg: "bg-teal-50",
    category: "social",
  },
  {
    label: getTranslation(translations, locale, "moodTracker.triggers.friends"),
    icon: Users,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    category: "social",
  },
];
