"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { BarChart3, Activity, Gauge, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

interface MoodHistoryStatsProps {
  stats: {
    totalEntries: number;
    emotions: Record<string, number>;
    avgIntensity: number;
    topTriggers: [string, number][];
  };
  totalRecords: number;
}

export default function MoodHistoryStats({
  stats,
  totalRecords,
}: MoodHistoryStatsProps) {
  const { locale } = useTranslation();

  const getEmotionLabel = (emotion: string) => {
    const emotionLabels: { [key: string]: string } = {
      happy: locale === "ua" ? "Щасливий" : "Happy",
      joyful: locale === "ua" ? "Радісний" : "Joyful",
      content: locale === "ua" ? "Задоволений" : "Content",
      satisfied: locale === "ua" ? "Задоволений" : "Satisfied",
      neutral: locale === "ua" ? "Нейтральний" : "Neutral",
      anxious: locale === "ua" ? "Тривожний" : "Anxious",
      worried: locale === "ua" ? "Стурбований" : "Worried",
      sad: locale === "ua" ? "Сумний" : "Sad",
      angry: locale === "ua" ? "Сердитий" : "Angry",
      excited: locale === "ua" ? "Збуджений" : "Excited",
      tired: locale === "ua" ? "Втомлений" : "Tired",
      sleepy: locale === "ua" ? "Сонний" : "Sleepy",
      stressed: locale === "ua" ? "Стресовий" : "Stressed",
      calm: locale === "ua" ? "Спокійний" : "Calm",
      overwhelmed: locale === "ua" ? "Перевантажений" : "Overwhelmed",
    };

    return emotionLabels[emotion.toLowerCase()] || emotion;
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return "text-red-600";
    if (intensity >= 6) return "text-orange-600";
    if (intensity >= 4) return "text-yellow-600";
    return "text-green-600";
  };

  const getIntensityBgColor = (intensity: number) => {
    if (intensity >= 8) return "from-red-50 to-red-100";
    if (intensity >= 6) return "from-orange-50 to-orange-100";
    if (intensity >= 4) return "from-yellow-50 to-yellow-100";
    return "from-green-50 to-green-100";
  };

  const mostCommonEmotion =
    Object.entries(stats.emotions).length > 0
      ? Object.entries(stats.emotions).sort(([, a], [, b]) => b - a)[0]
      : null;

  const statsConfig = [
    {
      title: locale === "ua" ? "Всього записів" : "Total Entries",
      value: stats.totalEntries,
      subtitle:
        totalRecords > stats.totalEntries
          ? `${totalRecords} ${
              locale === "ua" ? "всього в базі" : "total in database"
            }`
          : `${locale === "ua" ? "Відфільтровано" : "Filtered results"}`,
      icon: BarChart3,
      iconColor: "text-blue-600",
      bgGradient: "from-blue-50 to-indigo-100",
      borderColor: "border-blue-200",
      percentage:
        totalRecords > 0
          ? Math.round((stats.totalEntries / totalRecords) * 100)
          : 100,
      trend: stats.totalEntries > 0 ? "positive" : "neutral",
    },
    {
      title: locale === "ua" ? "Найчастіше" : "Most Common",
      value: mostCommonEmotion
        ? getEmotionLabel(mostCommonEmotion[0])
        : locale === "ua"
        ? "Немає даних"
        : "No data",
      subtitle: mostCommonEmotion
        ? `${mostCommonEmotion[1]} ${
            locale === "ua" ? "разів записано" : "times recorded"
          }`
        : locale === "ua"
        ? "Почніть відстежувати"
        : "Start tracking",
      icon: Activity,
      iconColor: "text-emerald-600",
      bgGradient: "from-emerald-50 to-green-100",
      borderColor: "border-emerald-200",
      percentage:
        mostCommonEmotion && stats.totalEntries > 0
          ? Math.round((mostCommonEmotion[1] / stats.totalEntries) * 100)
          : 0,
      trend: mostCommonEmotion ? "positive" : "neutral",
    },
    {
      title: locale === "ua" ? "Середня інтенсивність" : "Avg Intensity",
      value: `${stats.avgIntensity}/10`,
      subtitle:
        locale === "ua" ? "Емоційна інтенсивність" : "Emotional intensity",
      icon: Gauge,
      iconColor: getIntensityColor(stats.avgIntensity),
      bgGradient: getIntensityBgColor(stats.avgIntensity),
      borderColor:
        stats.avgIntensity >= 8
          ? "border-red-200"
          : stats.avgIntensity >= 6
          ? "border-orange-200"
          : stats.avgIntensity >= 4
          ? "border-yellow-200"
          : "border-green-200",
      percentage: Math.round(stats.avgIntensity * 10),
      trend:
        stats.avgIntensity >= 6
          ? "negative"
          : stats.avgIntensity >= 4
          ? "neutral"
          : "positive",
    },
    {
      title: locale === "ua" ? "Головний тригер" : "Top Trigger",
      value: stats.topTriggers[0]?.[1] || 0,
      subtitle:
        stats.topTriggers[0]?.[0] ||
        (locale === "ua" ? "Немає тригерів" : "No triggers"),
      icon: Tag,
      iconColor: "text-purple-600",
      bgGradient: "from-purple-50 to-violet-100",
      borderColor: "border-purple-200",
      percentage:
        stats.topTriggers[0] && stats.totalEntries > 0
          ? Math.round((stats.topTriggers[0][1] / stats.totalEntries) * 100)
          : 0,
      trend: stats.topTriggers[0] ? "neutral" : "positive",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statsConfig.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            y: -5,
            transition: { type: "spring", stiffness: 400, damping: 17 },
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`
            bg-white border-2 ${stat.borderColor} shadow-lg hover:shadow-xl 
            transition-all duration-300 relative overflow-hidden group
            hover:border-opacity-60
          `}
          >
            {/* Background gradient overlay */}
            <div
              className={`
              absolute inset-0 bg-gradient-to-br ${stat.bgGradient} 
              opacity-40 group-hover:opacity-60 transition-opacity duration-300
            `}
            />

            {/* Trend indicator */}
            <div className="absolute top-3 right-3 z-10">
              {stat.trend === "positive" && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              )}
              {stat.trend === "negative" && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
              {stat.trend === "neutral" && (
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              )}
            </div>

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700 tracking-wide">
                  {stat.title}
                </CardTitle>
                <motion.div
                  className={`p-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 pt-0">
              <div className="space-y-3">
                {/* Main value */}
                <div className="flex items-baseline gap-2">
                  <motion.div
                    className="text-3xl font-bold text-slate-800"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  {stat.percentage > 0 && (
                    <div className="text-xs font-medium text-slate-500">
                      {stat.percentage}%
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {stat.subtitle}
                </p>

                {/* Progress bar for visual feedback */}
                {stat.percentage > 0 && (
                  <div className="w-full bg-white/60 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        stat.trend === "positive"
                          ? "bg-green-500"
                          : stat.trend === "negative"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      } rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      transition={{
                        delay: 0.4 + index * 0.1,
                        duration: 1,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-white via-transparent to-black/10" />
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
