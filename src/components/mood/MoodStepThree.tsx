"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronUp, Save, Sparkles, Target, Loader2 } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { EmotionStore } from "@/src/shared/stores/emotion.store";
import { emotionApi } from "@/src/shared/api/emotion.api";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/src/shared/stores/context/AuthContext";

interface MoodStepThreeProps {
  selectedMood: any;
  onPrev: () => void;
  onSave: () => void;
}

export default function MoodStepThree({
  selectedMood,
  onPrev,
  onSave,
}: MoodStepThreeProps) {
  const { t } = useTranslation();
  const {
    selectedValue,
    selectedOverallNumber,
    selectedTrigggers,
    adictionalNote,
    clearAll: resetStore,
  } = EmotionStore();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEmotion = async () => {
    setIsLoading(true);

    try {
      const rawIntensity = selectedOverallNumber || 5;

      const emotionData = {
        userId: user?.id,
        emotion: selectedMood?.name || selectedValue,
        intensity: rawIntensity,
        triggers: Array.isArray(selectedTrigggers)
          ? selectedTrigggers
          : selectedTrigggers
          ? [selectedTrigggers]
          : [],
        notes: adictionalNote ?? "",
        tags: [
          ...(selectedMood?.category ? [selectedMood.category] : []),
          ...(selectedMood?.tags || []),
          rawIntensity >= 8
            ? "high-intensity"
            : rawIntensity <= 3
            ? "low-intensity"
            : "medium-intensity",
        ],
        recordedAt: new Date(),
      };

      console.log("Sending emotion data:", emotionData);

      const response = await emotionApi.createEmotion(emotionData as any);

      if (response.data.success) {
        toast.success(
          t("moodTracker.emotionSaved") || "Emotion saved successfully!"
        );

        onSave();
        setTimeout(() => {
          resetStore();
        }, 200);
      } else {
        throw new Error("Failed to save emotion");
      }
    } catch (error: any) {
      console.error("Error saving emotion:", error);

      toast.error(
        error.response?.data?.message ||
          t("moodTracker.emotionSaveError") ||
          "Failed to save emotion. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
        {t("moodTracker.recommendations")}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
      >
        <p className="text-sm font-medium mb-2 opacity-70">
          {t("moodTracker.summary")}
        </p>
        <div className="space-y-1 text-sm opacity-90">
          <p>
            <strong>{t("moodTracker.emotion")}:</strong>{" "}
            {selectedMood?.name || selectedValue || "Not selected"}
          </p>
          <p>
            <strong>{t("moodTracker.intensity")}:</strong>{" "}
            {selectedOverallNumber || 0}/10
          </p>
          {selectedTrigggers &&
            (Array.isArray(selectedTrigggers)
              ? selectedTrigggers.length > 0
              : selectedTrigggers) && (
              <p>
                <strong>{t("moodTracker.triggers")}:</strong>{" "}
                {Array.isArray(selectedTrigggers)
                  ? selectedTrigggers.join(", ")
                  : selectedTrigggers}
              </p>
            )}
          {adictionalNote && (
            <p>
              <strong>{t("moodTracker.notes")}:</strong> {adictionalNote}
            </p>
          )}
          {selectedMood?.category && (
            <p>
              <strong>{t("moodTracker.category")}:</strong>{" "}
              {selectedMood.category}
            </p>
          )}
        </div>
      </motion.div>

      {/* Affirmation Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
      >
        <p className="text-lg font-medium mb-2 opacity-90 flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t("moodTracker.affirmation")}
        </p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="italic text-white/90 leading-relaxed"
        >
          "{selectedMood.affirmation}"
        </motion.p>
      </motion.div>

      {/* Suggested Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <p className="text-lg font-medium mb-3 opacity-90">
          {t("moodTracker.tryActivities")}
        </p>
        <div className="grid grid-cols-1 gap-2">
          {selectedMood.suggestedActivities.map(
            (activity: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                {/* Animated Bullet Point */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                />
                <span className="text-sm leading-relaxed">{activity}</span>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        {/* Back Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            onClick={onPrev}
            disabled={isLoading}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full py-3 rounded-xl backdrop-blur-sm disabled:opacity-50"
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            {t("moodTracker.back")}
          </Button>
        </motion.div>

        {/* Save Button */}
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="flex-1"
        >
          <Button
            onClick={handleSaveEmotion}
            disabled={isLoading}
            size="lg"
            className="bg-white/40 hover:bg-white/50 text-white border border-white/40 w-full py-3 rounded-xl backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <motion.span className="flex items-center">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isLoading
                ? t("moodTracker.saving") || "Saving..."
                : t("moodTracker.saveEntry")}
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
