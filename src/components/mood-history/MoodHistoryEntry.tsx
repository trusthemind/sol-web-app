"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Activity, Clock, AlertTriangle, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { EmotionData } from "@/src/shared/api/emotion.api";

interface MoodHistoryEntryProps {
  entry: EmotionData;
  index: number;
  formatDisplayDate: (date: string) => string;
  formatDisplayTime: (date: string) => string;
  formatRelativeTime: (date: string) => string;
  getIntensityDescription: (intensity: number) => string;
}

const intensityConfig = {
  1: { label: "Very Low", color: "bg-green-200" },
  2: { label: "Low", color: "bg-green-300" },
  3: { label: "Low-Medium", color: "bg-green-400" },
  4: { label: "Medium-Low", color: "bg-yellow-300" },
  5: { label: "Medium", color: "bg-yellow-400" },
  6: { label: "Medium-High", color: "bg-yellow-500" },
  7: { label: "High", color: "bg-orange-400" },
  8: { label: "Very High", color: "bg-orange-500" },
  9: { label: "Extreme", color: "bg-red-500" },
  10: { label: "Maximum", color: "bg-red-600" },
};

export default function MoodHistoryEntry({
  entry,
  index,
  formatDisplayDate,
  formatDisplayTime,
  formatRelativeTime,
  getIntensityDescription
}: MoodHistoryEntryProps) {
  const { locale } = useTranslation();

  const getEmotionLabel = (emotion: string) => {
    const emotionLabels: { [key: string]: string } = {
      'happy': locale === "ua" ? "Щасливий" : "Happy",
      'joyful': locale === "ua" ? "Радісний" : "Joyful", 
      'content': locale === "ua" ? "Задоволений" : "Content",
      'satisfied': locale === "ua" ? "Задоволений" : "Satisfied",
      'neutral': locale === "ua" ? "Нейтральний" : "Neutral",
      'anxious': locale === "ua" ? "Тривожний" : "Anxious",
      'worried': locale === "ua" ? "Стурбований" : "Worried",
      'sad': locale === "ua" ? "Сумний" : "Sad",
      'angry': locale === "ua" ? "Сердитий" : "Angry",
      'excited': locale === "ua" ? "Збуджений" : "Excited",
      'tired': locale === "ua" ? "Втомлений" : "Tired",
      'sleepy': locale === "ua" ? "Сонний" : "Sleepy",
      'stressed': locale === "ua" ? "Стресовий" : "Stressed",
      'calm': locale === "ua" ? "Спокійний" : "Calm",
      'overwhelmed': locale === "ua" ? "Перевантажений" : "Overwhelmed",
    };

    return emotionLabels[emotion.toLowerCase()] || emotion;
  };

  const getEmotionConfig = (emotion: string) => {
    const normalizedEmotion = emotion.toLowerCase();
    
    const emotionConfigs: { [key: string]: any } = {
      'happy': { iconColor: "text-yellow-600", bgColor: "bg-gradient-to-br from-yellow-100 to-orange-100" },
      'joyful': { iconColor: "text-orange-600", bgColor: "bg-gradient-to-br from-orange-100 to-pink-100" },
      'excited': { iconColor: "text-pink-600", bgColor: "bg-gradient-to-br from-pink-100 to-rose-100" },
      'content': { iconColor: "text-green-600", bgColor: "bg-gradient-to-br from-green-100 to-emerald-100" },
      'satisfied': { iconColor: "text-green-600", bgColor: "bg-gradient-to-br from-green-100 to-emerald-100" },
      'calm': { iconColor: "text-teal-600", bgColor: "bg-gradient-to-br from-teal-100 to-cyan-100" },
      'peaceful': { iconColor: "text-cyan-600", bgColor: "bg-gradient-to-br from-cyan-100 to-blue-100" },
      'neutral': { iconColor: "text-slate-600", bgColor: "bg-gradient-to-br from-slate-100 to-gray-100" },
      'confused': { iconColor: "text-indigo-600", bgColor: "bg-gradient-to-br from-indigo-100 to-blue-100" },
      'anxious': { iconColor: "text-orange-700", bgColor: "bg-gradient-to-br from-orange-100 to-yellow-100" },
      'worried': { iconColor: "text-amber-700", bgColor: "bg-gradient-to-br from-amber-100 to-orange-100" },
      'stressed': { iconColor: "text-red-700", bgColor: "bg-gradient-to-br from-red-100 to-pink-100" },
      'overwhelmed': { iconColor: "text-purple-700", bgColor: "bg-gradient-to-br from-purple-100 to-indigo-100" },
      'frustrated': { iconColor: "text-rose-700", bgColor: "bg-gradient-to-br from-rose-100 to-red-100" },
      'sad': { iconColor: "text-blue-700", bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100" },
      'angry': { iconColor: "text-red-800", bgColor: "bg-gradient-to-br from-red-100 to-rose-100" },
      'tired': { iconColor: "text-indigo-700", bgColor: "bg-gradient-to-br from-indigo-100 to-purple-100" },
      'sleepy': { iconColor: "text-violet-700", bgColor: "bg-gradient-to-br from-violet-100 to-purple-100" }
    };

    return emotionConfigs[normalizedEmotion] || {
      iconColor: "text-slate-600",
      bgColor: "bg-gradient-to-br from-slate-100 to-gray-100"
    };
  };

  const intensity = intensityConfig[entry.intensity as keyof typeof intensityConfig];
  const emotionConfig = getEmotionConfig(entry.emotion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * Math.min(index, 5) }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 bg-white border-gray-200 group">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Emotion Icon */}
            <motion.div 
              className={`w-16 h-16 rounded-full flex items-center justify-center ${emotionConfig.bgColor} shadow-sm group-hover:shadow-md transition-shadow`}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Activity className={`h-8 w-8 ${emotionConfig.iconColor}`} />
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold capitalize text-gray-900 group-hover:text-blue-600 transition-colors">
                    {getEmotionLabel(entry.emotion)}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`${intensity?.color || 'bg-gray-300'} text-white flex items-center space-x-1 shadow-sm`}
                  >
                    <span>{entry.intensity || 0}/10</span>
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDisplayDate(entry.createdAt?.toString() || "")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDisplayTime(entry.createdAt?.toString() || "")}
                  </div>
                </div>
              </div>

              {entry.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{entry.description}"
                </p>
              )}

              {!entry.description && (
                <p className="text-sm text-gray-500 italic">
                  {locale === "ua" ? 
                    `${getIntensityDescription(entry.intensity)} емоційний стан` :
                    getIntensityDescription(entry.intensity)}
                </p>
              )}

              {/* Stress Level */}
              {entry.stressLevel && entry.stressLevel > 0 && (
                <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-700 font-medium">
                    {locale === "ua" ? "Рівень стресу" : "Stress Level"}: {entry.stressLevel}/10
                  </span>
                </div>
              )}

              {/* Triggers */}
              {entry.triggers && entry.triggers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {locale === "ua" ? "Тригери:" : "Triggers:"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.triggers.map((trigger, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {locale === "ua" ? "Теги:" : "Tags:"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Entry Info */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(entry.createdAt?.toString() || "")}
                  </span>
                </div>
                {entry.activities && entry.activities.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {locale === "ua" ? "Активності" : "Activities"}: {entry.activities.length}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}