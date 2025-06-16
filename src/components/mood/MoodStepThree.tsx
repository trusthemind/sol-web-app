"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { EmotionStore } from "@/src/shared/stores/emotion.store";
import { emotionApi } from "@/src/shared/api/emotion.api";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { cn } from "@/lib/utils";
import { ParsedRecommendationData } from "@/src/utils/parseRecommendation";

interface MoodStepThreeProps {
  selectedMood: any;
  onPrev: () => void;
  onSave: () => void;
  recommendationData: ParsedRecommendationData | null;
}

const RecommendationCard = ({
  title,
  items,
  icon: Icon,
  color,
  delay,
}: {
  title: string;
  items: string[];
  icon: any;
  color: string;
  delay: number;
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg",
        color
      )}
    >
      <motion.div
        className="flex items-center gap-3 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.1 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
          className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
        >
          <Icon className="h-5 w-5 text-white" />
        </motion.div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <motion.span
          className="text-sm text-white/70 bg-white/20 px-2 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {items.length}
        </motion.span>
      </motion.div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 + index * 0.1 }}
            className="group"
          >
            <motion.div
              onClick={() => toggleItem(index)}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 cursor-pointer border border-white/10 hover:border-white/30"
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="mt-1 w-2 h-2 rounded-full bg-white/70 flex-shrink-0"
                animate={{
                  scale: expandedItems.has(index) ? [1, 1.3, 1] : 1,
                  backgroundColor: expandedItems.has(index)
                    ? "#22c55e"
                    : "rgba(255,255,255,0.7)",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-white/90 group-hover:text-white transition-colors">
                  {item}
                </p>
                {expandedItems.has(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs text-green-300"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Додано до плану дій
                  </motion.div>
                )}
              </div>
              <ArrowRight
                className={cn(
                  "h-4 w-4 text-white/50 group-hover:text-white/80 transition-all duration-200",
                  expandedItems.has(index) && "rotate-90 text-green-400"
                )}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function MoodStepThree({
  selectedMood,
  onPrev,
  onSave,
  recommendationData,
}: MoodStepThreeProps) {
  const { t } = useTranslation();

  console.log(recommendationData, "recived");
  const {
    selectedValue,
    selectedOverallNumber,
    selectedTriggers,
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
        triggers: Array.isArray(selectedTriggers)
          ? selectedTriggers
          : selectedTriggers
          ? [selectedTriggers]
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

  const hasRecommendations =
    recommendationData &&
    (recommendationData.immediate.length > 0 ||
      recommendationData.shortTerm.length > 0 ||
      recommendationData.longTerm.length > 0 ||
      recommendationData.resources.length > 0 ||
      recommendationData.coping.length > 0);

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
            <p className="font-medium text-white">{selectedOverallNumber}/10</p>
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
            Ваша емоція збережена. Персональні рекомендації будуть доступні в
            наступних записах.
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
