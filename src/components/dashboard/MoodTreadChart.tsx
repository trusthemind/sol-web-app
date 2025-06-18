"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { emotionApi } from "@/src/shared/api/emotion.api";

interface MoodTrendData {
  day: string;
  date: string;
  mood: number;
  intensity: number;
  hasData: boolean;
}

export default function MoodTrendsChart() {
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const [moodData, setMoodData] = useState<MoodTrendData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("intensity");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodTrends = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        const response = await emotionApi.getAllEmotions({
          userId: user.id,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        const emotions = response.data.data;

        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          last7Days.push(date);
        }

        // Group emotions by date
        const emotionsByDate: { [key: string]: number[] } = {};

        emotions.forEach((emotion) => {
          const emotionDate = new Date(emotion.createdAt!);
          const dateKey = emotionDate.toDateString();

          if (!emotionsByDate[dateKey]) {
            emotionsByDate[dateKey] = [];
          }

          emotionsByDate[dateKey].push(emotion.intensity || 0);
        });

        // Create chart data for last 7 days
        const chartData = last7Days.map((date) => {
          const dateKey = date.toDateString();
          const dayEmotions = emotionsByDate[dateKey] || [];

          const dayNames = {
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            ua: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          };

          const dayName =
            locale === "ua"
              ? dayNames.ua[date.getDay()]
              : dayNames.en[date.getDay()];

          const hasData = dayEmotions.length > 0;
          const avgIntensity = hasData
            ? dayEmotions.reduce((sum, intensity) => sum + intensity, 0) /
              dayEmotions.length
            : null;

          return {
            day: dayName,
            date: date.toLocaleDateString(locale === "ua" ? "uk-UA" : "en-US", {
              month: "short",
              day: "numeric",
            }),
            mood: avgIntensity ? Number(avgIntensity.toFixed(1)) : null,
            intensity: avgIntensity ? Number(avgIntensity.toFixed(1)) : null,
            hasData,
          };
        });

        setMoodData(chartData as MoodTrendData[]);
      } catch (error) {
        console.error("Failed to fetch mood trends:", error);

        const fallbackData = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);

          const dayNames = {
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            ua: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          };

          const dayName =
            locale === "ua"
              ? dayNames.ua[date.getDay()]
              : dayNames.en[date.getDay()];

          fallbackData.push({
            day: dayName,
            date: date.toLocaleDateString(locale === "ua" ? "uk-UA" : "en-US", {
              month: "short",
              day: "numeric",
            }),
            mood: null,
            intensity: null,
            hasData: false,
          });
        }

        setMoodData(fallbackData as any as MoodTrendData[]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodTrends();
  }, [user?.id, locale]);

  const getMetricLabel = (metric: string) => {
    const labels = {
      mood: locale === "ua" ? "Настрій" : "Mood",
      intensity: locale === "ua" ? "Інтенсивність" : "Intensity",
    };
    return labels[metric as keyof typeof labels] || metric;
  };

  const getGradientColors = (metric: string) => {
    switch (metric) {
      case "mood":
        return {
          stroke: "#10B981",
          gradientId: "moodGradient",
          stopColor1: "#10B981",
          stopColor2: "#10B981",
        };
      case "intensity":
        return {
          stroke: "#3B82F6",
          gradientId: "intensityGradient",
          stopColor1: "#3B82F6",
          stopColor2: "#3B82F6",
        };
      default:
        return {
          stroke: "#3B82F6",
          gradientId: "defaultGradient",
          stopColor1: "#3B82F6",
          stopColor2: "#3B82F6",
        };
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">
            {locale === "ua" ? "Тренди настрою" : "Mood Trends"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-80 bg-gray-200 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  const colors = getGradientColors(selectedMetric);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </motion.div>
              {locale === "ua" ? "Тренди настрою" : "Mood Trends"}
            </CardTitle>
            <CardDescription className="text-slate-600 text-base mt-2">
              {locale === "ua"
                ? "Ваші емоційні патерни за останні 7 днів"
                : "Your emotional patterns for the last 7 days"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {["intensity", "mood"].map((metric) => (
              <motion.button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedMetric === metric
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {getMetricLabel(metric)}
              </motion.button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={moodData}>
            <defs>
              <linearGradient
                id={colors.gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={colors.stopColor1}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.stopColor2}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="day"
              stroke="#64748B"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 10]}
              stroke="#64748B"
              fontSize={12}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderColor: "#E2E8F0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#1E293B", fontWeight: "600" }}
              formatter={(value, name, props) => {
                if (value === null) {
                  return [
                    locale === "ua" ? "Немає даних" : "No data",
                    getMetricLabel(selectedMetric),
                  ];
                }
                return [value, getMetricLabel(selectedMetric)];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const data = payload[0].payload;
                  return `${label} (${data.date})`;
                }
                return label;
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={colors.stroke}
              strokeWidth={3}
              fill={`url(#${colors.gradientId})`}
              dot={(props) => {
                const { payload } = props;
                if (payload && payload.hasData) {
                  return (
                    <circle
                      key={props.cx}
                      cx={props.cx}
                      cy={props.cy}
                      r={5}
                      fill={colors.stroke}
                      strokeWidth={2}
                      stroke="white"
                    />
                  );
                }
                return (
                  <circle
                    key={props.cx}
                    cx={props.cx}
                    cy={props.cy}
                    r={3}
                    fill="#E2E8F0"
                    strokeWidth={1}
                    stroke="#94A3B8"
                  />
                );
              }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Data availability indicator */}
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                colors.stroke === "#3B82F6"
                  ? "from-blue-500 to-blue-600"
                  : "from-emerald-500 to-emerald-600"
              }`}
            ></div>
            <span>{locale === "ua" ? "Є дані" : "Has data"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <span>{locale === "ua" ? "Немає даних" : "No data"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
