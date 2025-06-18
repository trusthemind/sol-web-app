"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Flame, Calendar, Activity } from "lucide-react";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { emotionApi, streakApi, EmotionData } from "@/src/shared/api/emotion.api";

interface StatsData {
  currentMood: string;
  weeklyAverage: number;
  monthlyAverage: number;
  streak: number;
  totalEntries: number;
  mostFrequentEmotion: string;
  averageStressLevel: number;
  emotionTrend: "improving" | "declining" | "stable";
  recentActivity: string;
}

export default function DashboardStats() {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyzeEmotions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch all user emotions and streak data
        const [allEmotionsResponse, userStreakResponse] = await Promise.all([
          emotionApi.getAllEmotions({
            userId: user.id,
            sortBy: "createdAt",
            sortOrder: "desc"
          }),
          streakApi.getUserStreak(user.id)
        ]);

        const emotions = allEmotionsResponse.data.data;
        const streakData = userStreakResponse.data.data;

        // Perform local analysis
        const analysisResult = analyzeEmotions(emotions);

        setStats({
          ...analysisResult,
          streak: streakData.currentStreak,
          totalEntries: emotions.length
        });

      } catch (error) {
        console.error('Failed to fetch emotions for analysis:', error);
        // Set fallback data
        setStats({
          currentMood: "neutral",
          weeklyAverage: 0,
          monthlyAverage: 0,
          streak: 0,
          totalEntries: 0,
          mostFrequentEmotion: "neutral",
          averageStressLevel: 5,
          emotionTrend: "stable",
          recentActivity: "No recent activity"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyzeEmotions();
  }, [user?.id]);

  const analyzeEmotions = (emotions: EmotionData[]): Omit<StatsData, 'streak' | 'totalEntries'> => {
    if (emotions.length === 0) {
      return {
        currentMood: "neutral",
        weeklyAverage: 0,
        monthlyAverage: 0,
        mostFrequentEmotion: "neutral",
        averageStressLevel: 5,
        emotionTrend: "stable",
        recentActivity: "No recent activity"
      };
    }

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Filter emotions by time periods
    const weeklyEmotions = emotions.filter(e => new Date(e.createdAt!) >= oneWeekAgo);
    const monthlyEmotions = emotions.filter(e => new Date(e.createdAt!) >= oneMonthAgo);
    const previousWeekEmotions = emotions.filter(e => {
      const emotionDate = new Date(e.createdAt!);
      return emotionDate >= twoWeeksAgo && emotionDate < oneWeekAgo;
    });

    // Calculate averages with proper NaN handling
    const weeklyAverage = weeklyEmotions.length > 0 
      ? weeklyEmotions.reduce((sum, e) => sum + (e.intensity || 0), 0) / weeklyEmotions.length 
      : 0;

    const monthlyAverage = monthlyEmotions.length > 0 
      ? monthlyEmotions.reduce((sum, e) => sum + (e.intensity || 0), 0) / monthlyEmotions.length 
      : 0;

    const previousWeekAverage = previousWeekEmotions.length > 0 
      ? previousWeekEmotions.reduce((sum, e) => sum + (e.intensity || 0), 0) / previousWeekEmotions.length 
      : weeklyAverage;

    // Calculate average stress level
    const emotionsWithStress = emotions.filter(e => e.stressLevel !== undefined);
    const averageStressLevel = emotionsWithStress.length > 0 
      ? emotionsWithStress.reduce((sum, e) => sum + (e.stressLevel || 5), 0) / emotionsWithStress.length 
      : 5;

    // Find most frequent emotion
    const emotionCounts: { [key: string]: number } = {};
    emotions.forEach(e => {
      emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
    });
    
    const mostFrequentEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral";

    // Determine emotion trend
    let emotionTrend: "improving" | "declining" | "stable" = "stable";
    const trendDifference = weeklyAverage - previousWeekAverage;
    if (Math.abs(trendDifference) > 0.5) {
      emotionTrend = trendDifference > 0 ? "improving" : "declining";
    }

    // Get current mood (most recent emotion)
    const currentMood = emotions[0]?.emotion || "neutral";

    // Recent activity description
    const recentActivity = emotions.length > 0 
      ? formatTimeAgo(new Date(emotions[0].createdAt!))
      : "No recent activity";

    return {
      currentMood,
      weeklyAverage: Number.isNaN(weeklyAverage) ? 0 : Math.round(weeklyAverage * 10) / 10,
      monthlyAverage: Number.isNaN(monthlyAverage) ? 0 : Math.round(monthlyAverage * 10) / 10,
      mostFrequentEmotion,
      averageStressLevel: Number.isNaN(averageStressLevel) ? 5 : Math.round(averageStressLevel * 10) / 10,
      emotionTrend,
      recentActivity
    };
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return locale === "ua" ? "Щойно" : "Just now";
    } else if (diffInHours < 24) {
      return locale === "ua" ? `${diffInHours} год тому` : `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return locale === "ua" ? "1 день тому" : "1 day ago";
    } else {
      return locale === "ua" ? `${diffInDays} днів тому` : `${diffInDays} days ago`;
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.25, 0, 1] }
    }
  };

  const getMoodLabel = (mood: string) => {
    const moodLabels = {
      joyful: locale === "ua" ? "Радісний" : "Joyful",
      content: locale === "ua" ? "Задоволений" : "Content",
      satisfied: locale === "ua" ? "Задоволений" : "Satisfied",
      neutral: locale === "ua" ? "Нейтральний" : "Neutral",
      anxious: locale === "ua" ? "Тривожний" : "Anxious",
      sad: locale === "ua" ? "Сумний" : "Sad",
      angry: locale === "ua" ? "Сердитий" : "Angry",
      excited: locale === "ua" ? "Збуджений" : "Excited",
      tired: locale === "ua" ? "Втомлений" : "Tired",
      happy: locale === "ua" ? "Щасливий" : "Happy",
      stressed: locale === "ua" ? "Стресовий" : "Stressed",
      calm: locale === "ua" ? "Спокійний" : "Calm",
      worried: locale === "ua" ? "Стурбований" : "Worried"
    };
    return moodLabels[mood as keyof typeof moodLabels] || (locale === "ua" ? mood : mood);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getTrendLabel = (trend: string) => {
    const labels = {
      improving: locale === "ua" ? "Покращується" : "Improving",
      declining: locale === "ua" ? "Погіршується" : "Declining",
      stable: locale === "ua" ? "Стабільно" : "Stable"
    };
    return labels[trend as keyof typeof labels] || trend;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: locale === "ua" ? "Поточний настрій" : "Current Mood",
      value: stats ? getMoodLabel(stats.currentMood) : "-",
      change: stats?.recentActivity || (locale === "ua" ? "Немає активності" : "No activity"),
      icon: Heart,
      color: "from-rose-600 to-pink-600",
      bgColor: "from-rose-100 to-pink-100",
    },
    {
      title: locale === "ua" ? "Тижневий середній" : "Weekly Average",
      value: stats && !Number.isNaN(stats.weeklyAverage) ? `${stats.weeklyAverage}/10` : "0.0/10",
      change: stats ? `${getTrendIcon(stats.emotionTrend)} ${getTrendLabel(stats.emotionTrend)}` : "-",
      icon: TrendingUp,
      color: "from-blue-600 to-indigo-600",
      bgColor: "from-blue-100 to-indigo-100",
    },
    {
      title: locale === "ua" ? "Серія днів" : "Streak",
      value: `${stats?.streak || 0} ${locale === "ua" ? "днів" : "days"}`,
      change: stats?.streak && stats.streak > 0 ? 
        (locale === "ua" ? "Так тримати!" : "Keep it up!") : 
        (locale === "ua" ? "Почніть відстежувати!" : "Start tracking!"),
      icon: Flame,
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-100 to-red-100",
    },
    {
      title: locale === "ua" ? "Частий настрій" : "Most Frequent",
      value: stats ? getMoodLabel(stats.mostFrequentEmotion) : "-",
      change: stats ? 
        `${locale === "ua" ? "Всього" : "Total"}: ${stats.totalEntries} ${locale === "ua" ? "записів" : "entries"}` : 
        "0 entries",
      icon: Activity,
      color: "from-purple-600 to-violet-600",
      bgColor: "from-purple-100 to-violet-100",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      transition={{ staggerChildren: 0.1 }}
    >
      {statsConfig.map((stat, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${stat.bgColor} shadow-sm`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon
                    className={`h-6 w-6 text-transparent bg-gradient-to-r ${stat.color} bg-clip-text font-bold`}
                    style={{
                      filter: 'brightness(1.2) saturate(1.5)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  />
                </motion.div>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}