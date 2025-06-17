"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { motion } from "framer-motion";
import { Activity, Eye } from "lucide-react";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { emotionApi } from "@/src/shared/api/emotion.api";
import { moods } from "@/src/shared/constants/emotion";

interface RecentEmotion {
  id: string;
  emotion: string;
  intensity: number;
  time: string;
  description?: string;
}

export default function RecentEmotions() {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const [recentEmotions, setRecentEmotions] = useState<RecentEmotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEmotions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await emotionApi.getAllEmotions({
          userId: user.id,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc"
        });

        const emotions = response.data.data.map(emotion => ({
          id: emotion._id!,
          emotion: emotion.emotion,
          intensity: emotion.intensity,
          time: formatTimeAgo(new Date(emotion.createdAt!)),
          description: emotion.description
        }));

        setRecentEmotions(emotions);
      } catch (error) {
        console.error('Failed to fetch recent emotions:', error);
        setRecentEmotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEmotions();
  }, [user?.id]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return locale === "ua" ? "Щойно" : "Just now";
    } else if (diffInMinutes < 60) {
      return locale === "ua" ? `${diffInMinutes} хв тому` : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return locale === "ua" ? `${diffInHours} год тому` : `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return locale === "ua" ? "1 день тому" : "1 day ago";
    } else {
      return locale === "ua" ? `${diffInDays} днів тому` : `${diffInDays} days ago`;
    }
  };

  const getMoodConfig = (emotion: string) => {
    const normalizedEmotion = emotion.toLowerCase();
    
    // Define emotion-based colors and icons
    const emotionConfigs: { [key: string]: any } = {
      // Positive emotions - warm colors
      'happy': {
        icon: Activity,
        iconColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        lightBg: "bg-gradient-to-br from-yellow-100 to-orange-100"
      },
      'joyful': {
        icon: Activity,
        iconColor: "text-orange-600",
        bgColor: "bg-orange-50", 
        lightBg: "bg-gradient-to-br from-orange-100 to-pink-100"
      },
      'excited': {
        icon: Activity,
        iconColor: "text-pink-600",
        bgColor: "bg-pink-50",
        lightBg: "bg-gradient-to-br from-pink-100 to-rose-100"
      },
      'energetic': {
        icon: Activity,
        iconColor: "text-red-600",
        bgColor: "bg-red-50",
        lightBg: "bg-gradient-to-br from-red-100 to-orange-100"
      },
      'hopeful': {
        icon: Activity,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        lightBg: "bg-gradient-to-br from-emerald-100 to-green-100"
      },

      // Content emotions - green colors
      'content': {
        icon: Activity,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
        lightBg: "bg-gradient-to-br from-green-100 to-emerald-100"
      },
      'satisfied': {
        icon: Activity,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
        lightBg: "bg-gradient-to-br from-green-100 to-emerald-100"
      },
      'calm': {
        icon: Activity,
        iconColor: "text-teal-600",
        bgColor: "bg-teal-50",
        lightBg: "bg-gradient-to-br from-teal-100 to-cyan-100"
      },
      'peaceful': {
        icon: Activity,
        iconColor: "text-cyan-600",
        bgColor: "bg-cyan-50",
        lightBg: "bg-gradient-to-br from-cyan-100 to-blue-100"
      },

      // Neutral emotions - gray/blue colors
      'neutral': {
        icon: Activity,
        iconColor: "text-slate-600",
        bgColor: "bg-slate-50",
        lightBg: "bg-gradient-to-br from-slate-100 to-gray-100"
      },
      'confused': {
        icon: Activity,
        iconColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        lightBg: "bg-gradient-to-br from-indigo-100 to-blue-100"
      },

      // Negative emotions - darker colors
      'anxious': {
        icon: Activity,
        iconColor: "text-orange-700",
        bgColor: "bg-orange-50",
        lightBg: "bg-gradient-to-br from-orange-100 to-yellow-100"
      },
      'worried': {
        icon: Activity,
        iconColor: "text-amber-700",
        bgColor: "bg-amber-50",
        lightBg: "bg-gradient-to-br from-amber-100 to-orange-100"
      },
      'stressed': {
        icon: Activity,
        iconColor: "text-red-700",
        bgColor: "bg-red-50",
        lightBg: "bg-gradient-to-br from-red-100 to-pink-100"
      },
      'overwhelmed': {
        icon: Activity,
        iconColor: "text-purple-700",
        bgColor: "bg-purple-50",
        lightBg: "bg-gradient-to-br from-purple-100 to-indigo-100"
      },
      'frustrated': {
        icon: Activity,
        iconColor: "text-rose-700",
        bgColor: "bg-rose-50",
        lightBg: "bg-gradient-to-br from-rose-100 to-red-100"
      },

      // Sad emotions - blue colors
      'sad': {
        icon: Activity,
        iconColor: "text-blue-700",
        bgColor: "bg-blue-50",
        lightBg: "bg-gradient-to-br from-blue-100 to-indigo-100"
      },

      // Angry emotions - red colors
      'angry': {
        icon: Activity,
        iconColor: "text-red-800",
        bgColor: "bg-red-50",
        lightBg: "bg-gradient-to-br from-red-100 to-rose-100"
      },

      // Tired emotions - purple/indigo colors
      'tired': {
        icon: Activity,
        iconColor: "text-indigo-700",
        bgColor: "bg-indigo-50",
        lightBg: "bg-gradient-to-br from-indigo-100 to-purple-100"
      },
      'sleepy': {
        icon: Activity,
        iconColor: "text-violet-700",
        bgColor: "bg-violet-50",
        lightBg: "bg-gradient-to-br from-violet-100 to-purple-100"
      }
    };

    // Try to find exact match first
    if (emotionConfigs[normalizedEmotion]) {
      return emotionConfigs[normalizedEmotion];
    }

    // Try to find from moods list with emotion mapping
    const moodList = moods(t, locale);
    const foundMood = moodList.find(mood => {
      const normalizedMoodName = mood.name.toLowerCase();
      return normalizedMoodName === normalizedEmotion;
    });

    if (foundMood) {
      // Override with emotion-specific colors if available
      const baseConfig = {
        icon: foundMood.icon || Activity,
        iconColor: foundMood.iconColor || "text-slate-600",
        bgColor: foundMood.bgColor || "bg-slate-50",
        lightBg: foundMood.lightBg || "bg-slate-50"
      };

      // Apply emotion-specific colors if we have them
      const emotionSpecificConfig = emotionConfigs[normalizedEmotion];
      if (emotionSpecificConfig) {
        return {
          ...baseConfig,
          ...emotionSpecificConfig
        };
      }

      return baseConfig;
    }
    
    // Default fallback with neutral colors
    return {
      icon: Activity,
      iconColor: "text-slate-600",
      bgColor: "bg-slate-50",
      lightBg: "bg-gradient-to-br from-slate-100 to-gray-100"
    };
  };

  const getEmotionLabel = (emotion: string) => {
    const emotionLabels: { [key: string]: string } = {
      // English emotions to Ukrainian
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
      'peaceful': locale === "ua" ? "Мирний" : "Peaceful",
      'energetic': locale === "ua" ? "Енергійний" : "Energetic",
      'frustrated': locale === "ua" ? "Розчарований" : "Frustrated",
      'hopeful': locale === "ua" ? "Сповнений надії" : "Hopeful",
      'confused': locale === "ua" ? "Розгублений" : "Confused"
    };

    const normalizedEmotion = emotion.toLowerCase();
    return emotionLabels[normalizedEmotion] || emotion;
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">
            {locale === "ua" ? "Останні записи" : "Recent Entries"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="animate-pulse flex items-center space-x-4 p-4 rounded-2xl bg-gray-100">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
      <CardHeader>
        <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <Activity className="h-6 w-6 text-blue-500" />
          </motion.div>
          {locale === "ua" ? "Останні записи" : "Recent Entries"}
        </CardTitle>
        <CardDescription className="text-slate-600 text-base">
          {locale === "ua" ? "Ваші останні записи настрою" : "Your latest mood entries"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEmotions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 mb-2">
                {locale === "ua" ? "Ще немає записів настрою" : "No mood entries yet"}
              </p>
              <p className="text-xs text-slate-400">
                {locale === "ua" 
                  ? "Почніть відстежувати свій настрій, щоб побачити тенденції" 
                  : "Start tracking your mood to see trends"}
              </p>
            </div>
          ) : (
            recentEmotions.map((emotion, index) => {
              const moodConfig = getMoodConfig(emotion.emotion);
              const translatedEmotion = getEmotionLabel(emotion.emotion);
              
              return (
                <motion.div
                  key={emotion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 hover:bg-white/80 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <motion.div
                    className={`p-3 rounded-2xl ${moodConfig.lightBg || moodConfig.bgColor} shadow-sm`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <moodConfig.icon className={`h-5 w-5 ${moodConfig.iconColor}`} />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {translatedEmotion} • {locale === "ua" ? "Інтенсивність" : "Intensity"}: {emotion.intensity}/10
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{emotion.time}</p>
                    {emotion.description && (
                      <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">
                        "{emotion.description}"
                      </p>
                    )}
                  </div>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Eye className="h-4 w-4 text-slate-400" />
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </div>
        
        {/* Additional info when there are entries */}
        {recentEmotions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              {locale === "ua" 
                ? `Показано ${recentEmotions.length} останніх записів настрою`
                : `Showing ${recentEmotions.length} most recent mood entries`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}