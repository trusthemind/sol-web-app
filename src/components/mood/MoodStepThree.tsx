"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import {
  ChevronUp,
  Save,
  Sparkles,
  Target,
  Loader2,
  Clock,
  Calendar,
  TrendingUp,
  BookOpen,
  Heart,
  Flame,
  Trophy,
} from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { EmotionStore } from "@/src/shared/stores/emotion.store";
import { emotionApi } from "@/src/shared/api/emotion.api";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { ParsedRecommendationData } from "@/src/utils/parseRecommendation";
import { RecommendationCard } from "../ui/RecomendationCard";

interface MoodStepThreeProps {
  selectedMood: any;
  onPrev: () => void;
  recommendationData: ParsedRecommendationData | null;
}

export default function MoodStepThree({
  selectedMood,
  onPrev,
  recommendationData,
}: MoodStepThreeProps) {
  const { t } = useTranslation();

  const {
    selectedValue,
    selectedOverallNumber,
    selectedTriggers,
    adictionalNote,
    clearAll: resetStore,
  } = EmotionStore();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [streakInfo, setStreakInfo] = useState<any>(null);

  const handleSaveEmotion = async () => {
    if (!user?.id) {
      toast.error("Користувач не знайдений");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedIntensity = Math.max(
        1,
        Math.min(10, selectedOverallNumber || 5)
      );

      const triggersArray = Array.isArray(selectedTriggers)
        ? selectedTriggers.map((trigger) => trigger.toString())
        : selectedTriggers
        ? [selectedTriggers]
        : [];

      const emotionData = {
        userId: user.id,
        emotion: selectedValue,
        intensity: normalizedIntensity,
        description: adictionalNote || "",
        triggers: triggersArray,
        tags: [
          ...(selectedMood?.category ? [selectedMood.category] : []),
          ...(selectedMood?.tags || []),
          normalizedIntensity >= 8
            ? "high-intensity"
            : normalizedIntensity <= 3
            ? "low-intensity"
            : "medium-intensity",
        ],
        activities: [],
      };

      console.log("Sending emotion data:", emotionData);

      const response = await emotionApi.createEmotion(emotionData);

      if (response.data.success) {
        if (response.data.data.streak) setStreakInfo(response.data.data.streak);

        toast.success(
          t("moodTracker.emotionSaved") || "Емоція збережена успішно!"
        );

        setTimeout(() => {
          resetStore();
        }, 5 * 1000);
      } else {
        throw new Error("Failed to save emotion");
      }
    } catch (error: any) {
      console.error("Error saving emotion:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        t("moodTracker.emotionSaveError") ||
        "Не вдалося зберегти емоцію. Спробуйте знову.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRecommendations =
    recommendationData &&
    (recommendationData.immediate.length > 0 ||
      recommendationData.shortTerm.length > 0 ||
      recommendationData.longTerm.length > 0 ||
      recommendationData.resources.length > 0 ||
      recommendationData.coping.length > 0);

  if (streakInfo) {
    return (
      <motion.div
        key="streak-celebration"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, ease: "linear" }}
        >
          <Flame className="h-20 w-20 text-orange-400 mx-auto" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">🎉 Вітаємо!</h2>
          <p className="text-white/80">
            Ваша емоція збережена і стрік оновлено
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-6 rounded-2xl border border-orange-300/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Flame className="h-8 w-8 text-orange-400" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {streakInfo.currentStreak}
              </div>
              <div className="text-sm text-white/70">днів поспіль</div>
            </div>
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {streakInfo.longestStreak}
              </div>
              <div className="text-white/60">Найдовший стрік</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">
                {streakInfo.totalMoodTracked}
              </div>
              <div className="text-white/60">Всього записів</div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/70 text-sm"
        >
          Продовжуйте відстежувати емоції щодня для підтримки стріка! 🔥
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6 max-h-[80vh] overflow-y-auto pr-2"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.h2
          className="text-3xl font-bold mb-2 flex items-center justify-center gap-3"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>
          Персональні рекомендації
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/80 text-sm"
        >
          Створені спеціально для вашого емоційного стану
        </motion.p>
      </motion.div>

      {/* Emotion Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Target className="h-5 w-5 text-white/80" />
          <h3 className="font-semibold text-white">Ваш емоційний запис</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-white/60">Емоція:</span>
            <p className="font-medium text-white">
              {selectedMood?.name || selectedValue}
            </p>
          </div>
          <div>
            <span className="text-white/60">Інтенсивність:</span>
            <p className="font-medium text-white">
              {Math.max(1, Math.min(10, selectedOverallNumber || 5))}/10
            </p>
          </div>
          {selectedTriggers &&
            Array.isArray(selectedTriggers) &&
            selectedTriggers.length > 0 && (
              <div className="col-span-2">
                <span className="text-white/60">Тригери:</span>
                <p className="font-medium text-white">
                  {selectedTriggers.join(", ")}
                </p>
              </div>
            )}
          {adictionalNote && (
            <div className="col-span-2">
              <span className="text-white/60">Нотатка:</span>
              <p className="font-medium text-white text-xs leading-relaxed">
                {adictionalNote.slice(0, 100)}
                {adictionalNote.length > 100 && "..."}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recommendations Section */}
      {hasRecommendations ? (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-2 text-white">
              🎯 План дій для вас
            </h3>
            <p className="text-sm text-white/70">
              Оберіть рекомендації, які резонують з вами
            </p>
          </motion.div>

          <div className="space-y-4">
            <RecommendationCard
              title="⚡ Зараз (негайні дії)"
              items={recommendationData.immediate}
              icon={Clock}
              color="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-300/30"
              delay={0.5}
            />

            <RecommendationCard
              title="📅 Цього тижня"
              items={recommendationData.shortTerm}
              icon={Calendar}
              color="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-300/30"
              delay={0.6}
            />

            <RecommendationCard
              title="🚀 Довгостроково"
              items={recommendationData.longTerm}
              icon={TrendingUp}
              color="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-300/30"
              delay={0.7}
            />

            <RecommendationCard
              title="📚 Ресурси та інструменти"
              items={recommendationData.resources}
              icon={BookOpen}
              color="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-300/30"
              delay={0.8}
            />

            <RecommendationCard
              title="💪 Стратегії подолання"
              items={recommendationData.coping}
              icon={Heart}
              color="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-300/30"
              delay={0.9}
            />
          </div>
        </div>
      ) : (
        /* Fallback when no recommendations */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <Sparkles className="h-12 w-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-white">
            Дякуємо за ваш запис!
          </h3>
          <p className="text-white/70 text-sm">
            Ваша емоція буде збережена. Персональні рекомендації будуть доступні
            в наступних записах.
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex gap-3 pt-4"
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
            Назад
          </Button>
        </motion.div>

        {/* Save Button */}
        <motion.div
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="flex-2"
        >
          <Button
            onClick={handleSaveEmotion}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-to-r from-green-500/40 to-emerald-500/40 hover:from-green-500/50 hover:to-emerald-500/50 text-white border border-green-400/40 w-full py-3 rounded-xl backdrop-blur-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            <motion.span className="flex items-center">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Збереження...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Зберегти запис
                </>
              )}
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
