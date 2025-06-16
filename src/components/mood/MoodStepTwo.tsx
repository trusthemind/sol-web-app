"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { emotionTriggers } from "@/src/shared/constants/emotion";
import {
  EmotionStore,
  EmotionTriggers,
} from "@/src/shared/stores/emotion.store";
import { emotionApi } from "@/src/shared/api/emotion.api";
import { useState } from "react";
import {
  ParsedRecommendationData,
  parseRecommendationData,
} from "@/src/utils/parseRecommendation";

interface MoodStepTwoProps {
  onNext: () => void;
  onPrev: () => void;
  setRecommendationData: (
    parsedRecommendations: ParsedRecommendationData
  ) => void;
}

const triggerMap: Record<string, EmotionTriggers> = {
  "Робота/Навчання": EmotionTriggers.WORK_STUDY,
  Стосунки: EmotionTriggers.RELATIONSHIPS,
  "Здоров'я": EmotionTriggers.HEALTH,
  Фінанси: EmotionTriggers.FINANCES,
  "Соціальні мережі": EmotionTriggers.SOCIAL_MEDIA,
  Новини: EmotionTriggers.NEWS,
  Погода: EmotionTriggers.WEATHER,
  "Якість сну": EmotionTriggers.SLEEP_QUALITY,
  "Фізичні вправи": EmotionTriggers.PHYSICAL_ACTIVITY,
  "Їжа та дієта": EmotionTriggers.FOOD_DIET,
  "Сім'я": EmotionTriggers.FAMILY,
  Друзі: EmotionTriggers.FRIENDS,
} as const;

export default function MoodStepTwo({
  onNext,
  onPrev,
  setRecommendationData,
}: MoodStepTwoProps) {
  const { t } = useTranslation();
  const {
    selectedTriggers,
    selectedValue,
    selectedOverallNumber,
    toggleTrigger,
    adictionalNote,
    setAdictionNote,
  } = EmotionStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleTriggerToggle = (triggerLabel: string) => {
    const mappedTrigger = triggerMap[triggerLabel];
    if (mappedTrigger) {
      toggleTrigger(mappedTrigger);
    }
  };

  const isTriggerSelected = (triggerLabel: string): boolean => {
    const mappedTrigger = triggerMap[triggerLabel];
    return mappedTrigger ? selectedTriggers.includes(mappedTrigger) : false;
  };

  const handleNext = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const rawIntensity = selectedOverallNumber || 5;

      const apiResponse = await emotionApi.getInstantRecommedation({
        emotion: selectedValue,
        intensity: rawIntensity,
        triggers: Array.isArray(selectedTriggers)
          ? selectedTriggers
          : selectedTriggers
          ? [selectedTriggers]
          : [],
        notes: adictionalNote,
        tags: [
          rawIntensity >= 8
            ? "critical-intensity"
            : rawIntensity <= 3
            ? "low-intensity"
            : "medium-intensity",
        ],
      });

      console.log(apiResponse);
      // Parse and store the recommendation data
      const parsedRecommendations = parseRecommendationData(apiResponse.data);
      if (parsedRecommendations) {
        setRecommendationData(parsedRecommendations);
        console.log("Parsed recommendations:", parsedRecommendations);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      // Continue anyway since this data is not required
    } finally {
      setIsLoading(false);
      // Always proceed to next step
      onNext();
    }
  };

  const canProceed = true; // Always allow proceeding since data is optional

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Step Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-6"
      >
        {t("moodTracker.triggersQuestion")}
      </motion.h2>

      {/* Selection Info */}
      {selectedTriggers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20"
        >
          <p className="text-sm text-white/80">
            {t("moodTracker.selectedTriggers")}: {selectedTriggers.length}
          </p>
        </motion.div>
      )}

      {/* Triggers Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
      >
        {emotionTriggers(t).map((trigger, index) => {
          const isSelected = isTriggerSelected(trigger.label);

          return (
            <motion.div
              key={trigger.label}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={!isLoading ? { scale: 1.05, y: -2 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className={cn(
                  "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 p-4 h-auto flex flex-col items-center gap-3 relative overflow-hidden w-full",
                  isSelected &&
                    "bg-white/40 border-white/60 shadow-lg ring-2 ring-white/50",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleTriggerToggle(trigger.label)}
              >
                {/* Trigger Icon with Animation */}
                <motion.div
                  className="relative"
                  animate={
                    isSelected
                      ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <trigger.icon className="h-6 w-6" />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </motion.div>
                  )}
                </motion.div>

                <span className="text-xs text-center leading-tight font-medium">
                  {trigger.label}
                </span>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-white/10 rounded-lg"
                  />
                )}

                <motion.div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Note Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <label className="text-sm font-medium opacity-90">
          {t("moodTracker.addNote")}
        </label>
        <Textarea
          placeholder={t("moodTracker.notePlaceholder")}
          value={adictionalNote}
          onChange={(e) => setAdictionNote(e.target.value)}
          disabled={isLoading}
          className={cn(
            "bg-white/20 border border-white/30 placeholder:text-white/60 text-white resize-none backdrop-blur-sm rounded-xl transition-all duration-200 focus:bg-white/30 focus:border-white/50",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          rows={4}
        />
      </motion.div>

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 flex items-center justify-center gap-3"
        >
          <Loader2 className="h-5 w-5 animate-spin text-white" />
          <p className="text-sm text-white/80">
            {t("moodTracker.fetchingRecommendations") ||
              "Отримання рекомендацій..."}
          </p>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3"
      >
        {/* Back Button */}
        <motion.div
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          className="flex-1"
        >
          <Button
            onClick={onPrev}
            size="lg"
            disabled={isLoading}
            className={cn(
              "bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full py-3 rounded-xl backdrop-blur-sm",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            {t("moodTracker.back")}
          </Button>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          whileHover={!isLoading && canProceed ? { scale: 1.02 } : {}}
          whileTap={!isLoading && canProceed ? { scale: 0.98 } : {}}
          className="flex-1"
        >
          <Button
            onClick={handleNext}
            size="lg"
            disabled={isLoading || !canProceed}
            className={cn(
              "bg-white/30 hover:bg-white/40 text-white border border-white/40 w-full py-3 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-200",
              (isLoading || !canProceed) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("moodTracker.loading") || "Завантаження..."}
              </>
            ) : (
              <>
                {t("moodTracker.continue")}
                <motion.div
                  animate={
                    canProceed && !isLoading ? { x: [0, 5, 0] } : { x: 0 }
                  }
                  transition={{
                    duration: 1.5,
                    repeat:
                      canProceed && !isLoading ? Number.POSITIVE_INFINITY : 0,
                  }}
                >
                  <ChevronDown className="ml-2 h-4 w-4" />
                </motion.div>
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
