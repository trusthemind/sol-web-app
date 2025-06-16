import {
  alarming,
  angry,
  exited,
  happy,
  neutral,
  sad,
  satistied,
  sleepy,
} from "@/src/shared/constants/emotion-files";

export enum EmotionType {
  JOYFUL = "joyful", // радісний
  SATISFIED = "satisfied", // задоволений
  NEUTRAL = "neutral", // нейтральний
  ANXIOUS = "anxious", // тривожний
  SAD = "sad", // сумний
  ANGRY = "angry", // злий
  EXCITED = "excited", // збуджений
  TIRED = "tired", // втомлений
}

export enum EmotionTypeUkrainian {
  РАДІСНИЙ = "радісний",
  ЗАДОВОЛЕНИЙ = "задоволений",
  НЕЙТРАЛЬНИЙ = "нейтральний",
  ТРИВОЖНИЙ = "тривожний",
  СУМНИЙ = "сумний",
  ЗЛИЙ = "злий",
  ЗБУДЖЕНИЙ = "збуджений",
  ВТОМЛЕНИЙ = "втомлений",
}

export const emotionConfig = {
  [EmotionType.JOYFUL]: {
    icon: happy,
    color: "from-yellow-300 via-orange-400 to-pink-500",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100",
    lightBg: "bg-gradient-to-br from-yellow-100 to-orange-100",
    textColor: "text-orange-600",
    iconColor: "text-orange-600",
    primaryColor: "#F59E0B",
    secondaryColor: "#FDE68A",
  },
  [EmotionType.SATISFIED]: {
    icon: satistied,
    color: "from-emerald-400 via-teal-500 to-cyan-600",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
    lightBg: "bg-gradient-to-br from-emerald-100 to-teal-100",
    textColor: "text-teal-600",
    iconColor: "text-teal-600",
    primaryColor: "#10B981",
    secondaryColor: "#A7F3D0",
  },
  [EmotionType.NEUTRAL]: {
    icon: neutral,
    color: "from-slate-400 via-gray-500 to-zinc-600",
    bgColor: "bg-gradient-to-br from-slate-100 to-gray-100",
    lightBg: "bg-gradient-to-br from-slate-100 to-gray-100",
    textColor: "text-slate-600",
    iconColor: "text-slate-600",
    primaryColor: "#6B7280",
    secondaryColor: "#D1D5DB",
  },
  [EmotionType.ANXIOUS]: {
    icon: alarming,
    color: "from-amber-400 via-orange-500 to-red-600",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
    lightBg: "bg-gradient-to-br from-amber-100 to-orange-100",
    textColor: "text-red-600",
    iconColor: "text-red-600",
    primaryColor: "#F97316",
    secondaryColor: "#FDBA74",
  },
  [EmotionType.SAD]: {
    icon: sad,
    color: "from-sky-400 via-blue-500 to-indigo-600",
    bgColor: "bg-gradient-to-br from-sky-100 to-blue-100",
    lightBg: "bg-gradient-to-br from-sky-100 to-blue-100",
    textColor: "text-blue-600",
    iconColor: "text-blue-600",
    primaryColor: "#3B82F6",
    secondaryColor: "#93C5FD",
  },
  [EmotionType.ANGRY]: {
    icon: angry,
    color: "from-red-500 via-rose-600 to-pink-700",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-100",
    lightBg: "bg-gradient-to-br from-red-100 to-rose-100",
    textColor: "text-red-700",
    iconColor: "text-red-700",
    primaryColor: "#EF4444",
    secondaryColor: "#FCA5A5",
  },
  [EmotionType.EXCITED]: {
    icon: exited,
    color: "from-lime-400 via-yellow-500 to-pink-600",
    bgColor: "bg-gradient-to-br from-lime-100 to-yellow-100",
    lightBg: "bg-gradient-to-br from-lime-100 to-yellow-100",
    textColor: "text-pink-600",
    iconColor: "text-pink-600",
    primaryColor: "#EC4899",
    secondaryColor: "#F9A8D4",
  },
  [EmotionType.TIRED]: {
    icon: sleepy,
    color: "from-violet-400 via-indigo-500 to-purple-600",
    bgColor: "bg-gradient-to-br from-violet-100 to-indigo-100",
    lightBg: "bg-gradient-to-br from-violet-100 to-indigo-100",
    textColor: "text-indigo-700",
    iconColor: "text-indigo-700",
    primaryColor: "#6366F1",
    secondaryColor: "#C7D2FE",
  },
};

export const legacyEmotionMapping = {
  happy: EmotionType.JOYFUL,
  content: EmotionType.SATISFIED,
  satisfied: EmotionType.SATISFIED,
  neutral: EmotionType.NEUTRAL,
  anxious: EmotionType.ANXIOUS,
  sad: EmotionType.SAD,
  angry: EmotionType.ANGRY,
  excited: EmotionType.EXCITED,
  tired: EmotionType.TIRED,
};

export const ukrainianToEnglishMapping = {
  [EmotionTypeUkrainian.РАДІСНИЙ]: EmotionType.JOYFUL,
  [EmotionTypeUkrainian.ЗАДОВОЛЕНИЙ]: EmotionType.SATISFIED,
  [EmotionTypeUkrainian.НЕЙТРАЛЬНИЙ]: EmotionType.NEUTRAL,
  [EmotionTypeUkrainian.ТРИВОЖНИЙ]: EmotionType.ANXIOUS,
  [EmotionTypeUkrainian.СУМНИЙ]: EmotionType.SAD,
  [EmotionTypeUkrainian.ЗЛИЙ]: EmotionType.ANGRY,
  [EmotionTypeUkrainian.ЗБУДЖЕНИЙ]: EmotionType.EXCITED,
  [EmotionTypeUkrainian.ВТОМЛЕНИЙ]: EmotionType.TIRED,
};

export class EmotionTransformer {
  static getEmotionConfig(emotion: string) {
    if (emotion in emotionConfig) return emotionConfig[emotion as EmotionType];

    if (emotion in legacyEmotionMapping) {
      const mappedEmotion =
        legacyEmotionMapping[emotion as keyof typeof legacyEmotionMapping];
      return emotionConfig[mappedEmotion];
    }

    if (emotion in ukrainianToEnglishMapping) {
      const mappedEmotion =
        ukrainianToEnglishMapping[
          emotion as keyof typeof ukrainianToEnglishMapping
        ];
      return emotionConfig[mappedEmotion];
    }

    return emotionConfig[EmotionType.NEUTRAL];
  }

  static getEmotionIcon(emotion: string) {
    const config = this.getEmotionConfig(emotion);
    return config.icon;
  }

  static normalizeEmotion(emotion: string): EmotionType {
    if (Object.values(EmotionType).includes(emotion as EmotionType))
      return emotion as EmotionType;

    if (emotion in legacyEmotionMapping)
      return legacyEmotionMapping[emotion as keyof typeof legacyEmotionMapping];

    if (emotion in ukrainianToEnglishMapping)
      return ukrainianToEnglishMapping[
        emotion as keyof typeof ukrainianToEnglishMapping
      ];

    return EmotionType.NEUTRAL;
  }

  static getAllEmotions() {
    return Object.entries(emotionConfig).map(([key, config]) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: config.icon,
      config,
    }));
  }

  static isValidEmotion(emotion: string): boolean {
    return (
      emotion in emotionConfig ||
      emotion in legacyEmotionMapping ||
      emotion in ukrainianToEnglishMapping
    );
  }
}

export { emotionConfig as emotionIconConfig };
export default EmotionTransformer;
