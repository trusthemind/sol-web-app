import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum EmotionTypeValue {
  HAPPY = "Радісний",
  SATISFIED = "Задоволений",
  NEUTRAL = "Нейтральний",
  ANXIOUS = "Тривожний",
  SAD = "Сумний",
  ANGRY = "Злий",
  EXCITED = "Збуджений",
  TIRED = "Втомлений",
}

export enum EmotionTriggers {
  WORK_STUDY = "Робота/Навчання",
  RELATIONSHIPS = "Стосунки",
  HEALTH = "Здоров'я",
  FINANCES = "Фінанси",
  SOCIAL_MEDIA = "Соціальні мережі",
  NEWS = "Новини",
  WEATHER = "Погода",
  SLEEP_QUALITY = "Якість сну",
  PHYSICAL_ACTIVITY = "Фізичні вправи",
  FOOD_DIET = "Їжа та дієта",
  FAMILY = "Сім'я",
  FRIENDS = "Друзі",
}

export type EmotionStoreType = {
  step: number;
  setStep: (v: number) => void;
  selectedValue: EmotionTypeValue | "";
  setSelectedValue: (selectedValue: EmotionTypeValue) => void;
  selectedOverallNumber: number;
  setSelectedOverallNumber: (selectedOverallNumber: number) => void;
  selectedTrigggers: EmotionTriggers | "";
  setSelectedTriggers: (selectedTriggers: EmotionTriggers) => void;
  adictionalNote: string;
  setAdictionNote: (v: string) => void;
  clearAll: () => void;
};

export const EmotionStore = create<EmotionStoreType>()(
  persist(
    (set) => ({
      step: 0,
      setStep: (v: number) => set({ step: v }),
      selectedValue: EmotionTypeValue.HAPPY,
      setSelectedValue: (selectedValue) => set({ selectedValue }),
      selectedOverallNumber: 0,
      setSelectedOverallNumber: (selectedOverallNumber) =>
        set({ selectedOverallNumber }),
      selectedTrigggers: EmotionTriggers.WORK_STUDY,
      setSelectedTriggers: (selectedTrigggers) => set({ selectedTrigggers }),
      adictionalNote: "",
      setAdictionNote: (adictionalNote) => set({ adictionalNote }),
      clearAll: () =>
        set({
          step: 0,
          selectedValue: "",
          selectedOverallNumber: 0,
          selectedTrigggers: "",
          adictionalNote: "",
        }),
    }),
    {
      name: "emotion-storage",
    }
  )
);
