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
  selectedTriggers: EmotionTriggers[];
  setSelectedTriggers: (selectedTriggers: EmotionTriggers[]) => void;
  addTrigger: (trigger: EmotionTriggers) => void;
  removeTrigger: (trigger: EmotionTriggers) => void;
  toggleTrigger: (trigger: EmotionTriggers) => void;
  adictionalNote: string;
  setAdictionNote: (v: string) => void;
  clearAll: () => void;
};

export const EmotionStore = create<EmotionStoreType>()(
  persist(
    (set, get) => ({
      step: 0,
      setStep: (v: number) => set({ step: v }),
      selectedValue: "",
      setSelectedValue: (selectedValue) => set({ selectedValue }),
      selectedOverallNumber: 0,
      setSelectedOverallNumber: (selectedOverallNumber) =>
        set({ selectedOverallNumber }),
      selectedTriggers: [],
      setSelectedTriggers: (selectedTriggers) => set({ selectedTriggers }),
      addTrigger: (trigger: EmotionTriggers) =>
        set((state) => ({
          selectedTriggers: state.selectedTriggers.includes(trigger)
            ? state.selectedTriggers
            : [...state.selectedTriggers, trigger],
        })),
      removeTrigger: (trigger: EmotionTriggers) =>
        set((state) => ({
          selectedTriggers: state.selectedTriggers.filter((t) => t !== trigger),
        })),
      toggleTrigger: (trigger: EmotionTriggers) =>
        set((state) => ({
          selectedTriggers: state.selectedTriggers.includes(trigger)
            ? state.selectedTriggers.filter((t) => t !== trigger)
            : [...state.selectedTriggers, trigger],
        })),
      adictionalNote: "",
      setAdictionNote: (adictionalNote) => set({ adictionalNote }),
      clearAll: () =>
        set({
          step: 0,
          selectedValue: "",
          selectedOverallNumber: 0,
          selectedTriggers: [],
          adictionalNote: "",
        }),
    }),
    {
      name: "emotion-storage",
    }
  )
);
