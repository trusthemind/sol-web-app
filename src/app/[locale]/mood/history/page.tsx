"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  ArrowLeft,
  Search,
  Filter,
  CalendarIcon,
  TrendingUp,
  BarChart3,
  Clock,
  Tag,
  Zap,
  Eye,
  EyeOff,
  Flame,
  ZapIcon,
  Leaf,
  Search as SearchIcon,
  Activity,
  Gauge,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dayjs from "@/src/shared/config/dayjs";
import EmotionTransformer, { EmotionType } from "@/src/shared/config/emotion";
import { emotionApi, EmotionsListResponse } from "@/src/shared/api/emotion.api";
import { useAuth } from "@/src/shared/stores/context/AuthContext";

// Updated EmotionFilters interface
export interface EmotionFilters {
  userId?: string;
  emotion?: string | string[];
  intensity?: number;
  minIntensity?: number;
  maxIntensity?: number;
  stressLevel?: number;
  minStressLevel?: number;
  maxStressLevel?: number;
  timeRange?: "today" | "week" | "month" | "quarter" | "year";
  startDate?: Date | string;
  endDate?: Date | string;
  tags?: string[];
  triggers?: string[];
  limit?: number;
  skip?: number;
  sortBy?: "createdAt" | "intensity" | "stressLevel" | "emotion";
  sortOrder?: "asc" | "desc";
}

const intensityConfig = {
  1: {
    label: "Very Low",
    color: "bg-green-200",
    icon: Leaf,
    desc: "Barely noticeable",
  },
  2: {
    label: "Low",
    color: "bg-green-300",
    icon: Leaf,
    desc: "Mild emotional response",
  },
  3: {
    label: "Low-Medium",
    color: "bg-green-400",
    icon: Leaf,
    desc: "Slight but noticeable",
  },
  4: {
    label: "Medium-Low",
    color: "bg-yellow-300",
    icon: Activity,
    desc: "Noticeable feeling",
  },
  5: {
    label: "Medium",
    color: "bg-yellow-400",
    icon: Activity,
    desc: "Moderate emotional response",
  },
  6: {
    label: "Medium-High",
    color: "bg-yellow-500",
    icon: ZapIcon,
    desc: "Strong but manageable",
  },
  7: {
    label: "High",
    color: "bg-orange-400",
    icon: ZapIcon,
    desc: "Intense emotional response",
  },
  8: {
    label: "Very High",
    color: "bg-orange-500",
    icon: Flame,
    desc: "Very intense feeling",
  },
  9: {
    label: "Extreme",
    color: "bg-red-500",
    icon: Flame,
    desc: "Overwhelming emotion",
  },
  10: {
    label: "Maximum",
    color: "bg-red-600",
    icon: AlertTriangle,
    desc: "Peak emotional intensity",
  },
};

export default function MoodHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("all");
  const [selectedIntensity, setSelectedIntensity] = useState<string>("all");
  const [intensityRange, setIntensityRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "intensity" | "stressLevel" | "emotion"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { user } = useAuth();

  const userId = user?.id;

  const [moodData, setMoodData] = useState<EmotionsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const availableEmotions = useMemo(
    () => EmotionTransformer.getAllEmotions(),
    []
  );

  const getIntensityDescription = (intensity: number) => {
    const config = intensityConfig[intensity as keyof typeof intensityConfig];
    return config ? `${config.label} - ${config.desc}` : "Unknown intensity";
  };

  const formatRelativeTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    if (date.isSame(now, "day")) return `Today at ${date.format("HH:mm")}`;
    else if (date.isSame(now.subtract(1, "day"), "day"))
      return `Yesterday at ${date.format("HH:mm")}`;
    else if (now.diff(date, "day") <= 7)
      return `${date.format("dddd")} at ${date.format("HH:mm")}`;
    else if (date.isSame(now, "year")) return date.format("MMM DD [at] HH:mm");
    else return date.format("MMM DD, YYYY [at] HH:mm");
  };

  const formatDisplayDate = (dateString: string) => {
    return dayjs(dateString).format("MMM DD, YYYY");
  };

  const formatDisplayTime = (dateString: string) => {
    return dayjs(dateString).format("HH:mm");
  };

  const buildFilters = useMemo((): EmotionFilters => {
    const filters: EmotionFilters = {
      userId,
      limit: 50,
      sortBy,
      sortOrder,
    };

    if (selectedEmotion !== "all") filters.emotion = selectedEmotion;
    else if (intensityRange.min) filters.minIntensity = intensityRange.min;
    else if (intensityRange.max) filters.maxIntensity = intensityRange.max;

    if (selectedTimeRange !== "all")
      filters.timeRange = selectedTimeRange as
        | "today"
        | "week"
        | "month"
        | "quarter"
        | "year";

    return filters;
  }, [
    userId,
    selectedEmotion,
    selectedIntensity,
    intensityRange,
    selectedTimeRange,
    sortBy,
    sortOrder,
    searchTerm,
  ]);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await emotionApi.getAllEmotions(buildFilters);
        setMoodData(response.data);
      } catch (err) {
        console.error("Error fetching mood history:", err);
        setError("Failed to load mood history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [buildFilters]);

  const filteredData = useMemo(() => {
    if (!moodData?.data) return [];

    let filtered = moodData.data;

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.emotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (entry.triggers &&
            entry.triggers.some((trigger) =>
              trigger.toLowerCase().includes(searchTerm.toLowerCase())
            )) ||
          (entry.tags &&
            entry.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    return filtered;
  }, [moodData?.data, searchTerm]);

  const stats = useMemo(() => {
    const emotions = filteredData.reduce((acc, entry) => {
      const normalizedEmotion = EmotionTransformer.normalizeEmotion(
        entry.emotion
      );
      acc[normalizedEmotion] = (acc[normalizedEmotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const intensities = filteredData.reduce((acc, entry) => {
      acc[entry.intensity] = (acc[entry.intensity] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const avgIntensity =
      filteredData.length > 0
        ? filteredData.reduce((sum, entry) => sum + entry.intensity, 0) /
          filteredData.length
        : 0;

    const topTriggers = filteredData
      .flatMap((entry) => entry.triggers || [])
      .reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalEntries: filteredData.length,
      emotions,
      intensities,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      topTriggers: Object.entries(topTriggers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    };
  }, [filteredData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/mood-tracker">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 text-gray-700" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mood History</h1>
              <p className="text-gray-600">
                Track your emotional journey over time
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Entries
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalEntries}
              </div>
              <p className="text-xs text-gray-500">
                {moodData?.total || 0} total records
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Most Common
              </CardTitle>
              <div className="text-lg">
                {Object.entries(stats.emotions).length > 0 &&
                  (() => {
                    const mostCommonEmotion = Object.entries(
                      stats.emotions
                    ).sort(([, a], [, b]) => b - a)[0][0] as EmotionType;
                    const emotionIcon =
                      EmotionTransformer.getEmotionIcon(mostCommonEmotion);
                    return emotionIcon ? (
                      <Image
                        src={emotionIcon}
                        alt={mostCommonEmotion}
                        width={16}
                        height={16}
                        className="text-gray-600"
                      />
                    ) : null;
                  })()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 capitalize">
                {Object.entries(stats.emotions).length > 0 &&
                  Object.entries(stats.emotions).sort(
                    ([, a], [, b]) => b - a
                  )[0][0]}
              </div>
              <p className="text-xs text-gray-500">
                {Object.entries(stats.emotions).length > 0 &&
                  Object.entries(stats.emotions).sort(
                    ([, a], [, b]) => b - a
                  )[0][1]}{" "}
                times recorded
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Avg Intensity
              </CardTitle>
              <Gauge className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.avgIntensity}/10
              </div>
              <p className="text-xs text-gray-500">
                Average emotional intensity
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Top Trigger
              </CardTitle>
              <Tag className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.topTriggers[0]?.[1] || 0}
              </div>
              <p className="text-xs text-gray-500">
                {stats.topTriggers[0]?.[0] || "No triggers"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4 bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Filter className="h-5 w-5 mr-2 text-gray-600" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search emotions, triggers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Emotion Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Emotion
                  </label>
                  <Select
                    value={selectedEmotion}
                    onValueChange={setSelectedEmotion}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All emotions" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all" className="text-gray-700">
                        All emotions
                      </SelectItem>
                      {availableEmotions.map((emotion) => {
                        return (
                          <SelectItem
                            key={emotion.value}
                            value={emotion.value}
                            className="text-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <Image
                                src={emotion.icon}
                                alt={emotion.label}
                                width={16}
                                height={16}
                              />
                              <span className="capitalize">
                                {emotion.label}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Intensity Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Intensity
                  </label>
                  <Select
                    value={selectedIntensity}
                    onValueChange={setSelectedIntensity}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All intensities" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all" className="text-gray-700">
                        All intensities
                      </SelectItem>
                      {Object.entries(intensityConfig).map(([key, config]) => {
                        const IconComponent = config.icon;
                        return (
                          <SelectItem
                            key={key}
                            value={key}
                            className="text-gray-700"
                          >
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-4 w-4 text-gray-600" />
                              <span>
                                {key} - {config.label}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Time Range
                  </label>
                  <Select
                    value={selectedTimeRange}
                    onValueChange={setSelectedTimeRange}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All time" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all" className="text-gray-700">
                        All time
                      </SelectItem>
                      <SelectItem value="today" className="text-gray-700">
                        Today
                      </SelectItem>
                      <SelectItem value="week" className="text-gray-700">
                        This week
                      </SelectItem>
                      <SelectItem value="month" className="text-gray-700">
                        This month
                      </SelectItem>
                      <SelectItem value="quarter" className="text-gray-700">
                        This quarter
                      </SelectItem>
                      <SelectItem value="year" className="text-gray-700">
                        This year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Options */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value as typeof sortBy)}
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="createdAt" className="text-gray-700">
                        Date Created
                      </SelectItem>
                      <SelectItem value="intensity" className="text-gray-700">
                        Intensity
                      </SelectItem>
                      <SelectItem value="emotion" className="text-gray-700">
                        Emotion
                      </SelectItem>
                      <SelectItem value="stressLevel" className="text-gray-700">
                        Stress Level
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort Order
                  </label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) =>
                      setSortOrder(value as typeof sortOrder)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="desc" className="text-gray-700">
                        Descending
                      </SelectItem>
                      <SelectItem value="asc" className="text-gray-700">
                        Ascending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedEmotion("all");
                    setSelectedIntensity("all");
                    setSelectedTimeRange("all");

                    setIntensityRange({});
                    setSortBy("createdAt");
                    setSortOrder("desc");
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredData.length}{" "}
                  {filteredData.length === 1 ? "Entry" : "Entries"} Found
                </h2>
              </div>

              {/* Mood Entries */}
              <div className="space-y-4">
                {filteredData.map((entry, index) => {
                  const emotionConfig = EmotionTransformer.getEmotionConfig(
                    entry.emotion
                  );
                  const intensity =
                    intensityConfig[
                      entry.intensity as keyof typeof intensityConfig
                    ];

                  const emotionIcon = emotionConfig.icon;
                  const IntensityIcon = intensity?.icon;

                  return (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-md transition-shadow bg-white border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {/* Emotion Icon */}
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center ${emotionConfig.bgColor}`}
                            >
                              <Image
                                src={emotionIcon}
                                alt={EmotionTransformer.normalizeEmotion(
                                  entry.emotion
                                )}
                                width={32}
                                height={32}
                                className={emotionConfig.textColor}
                              />
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold capitalize text-gray-900">
                                    {EmotionTransformer.normalizeEmotion(
                                      entry.emotion
                                    )}
                                  </h3>
                                  <Badge
                                    variant="secondary"
                                    className={`${intensity?.color} text-white flex items-center space-x-1`}
                                  >
                                    {IntensityIcon && (
                                      <IntensityIcon className="h-3 w-3" />
                                    )}
                                    <span>{entry.intensity}/10</span>
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatDisplayDate(
                                      entry.createdAt?.toString() || ""
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {formatDisplayTime(
                                      entry.createdAt?.toString() || ""
                                    )}
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600">
                                {entry.description ||
                                  getIntensityDescription(entry.intensity)}
                              </p>

                              {/* Stress Level (if available) */}
                              {entry.stressLevel && (
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-gray-700">
                                    Stress Level: {entry.stressLevel}/10
                                  </span>
                                </div>
                              )}

                              {/* Triggers */}
                              {entry.triggers && entry.triggers.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Tag className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Triggers:
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {entry.triggers.map((trigger, idx) => (
                                      <Badge
                                        key={idx}
                                        variant="outline"
                                        className="text-xs border-gray-300 text-gray-600"
                                      >
                                        {trigger}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tags */}
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {entry.tags.map((tag, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="secondary"
                                      className="text-xs bg-gray-100 text-gray-700"
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* Entry Info */}
                              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {formatRelativeTime(
                                    entry.createdAt?.toString() || ""
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* No Results */}
              {filteredData.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">
                    <SearchIcon className="w-16 h-16 text-gray-300 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    No entries found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedEmotion("all");
                      setSelectedIntensity("all");
                      setSelectedTimeRange("all");
                      setIntensityRange({});
                      setSortBy("createdAt");
                      setSortOrder("desc");
                    }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}

              {/* Load More */}
              {filteredData.length > 0 &&
                moodData &&
                filteredData.length < moodData.total && (
                  <div className="text-center pt-6">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={async () => {
                        try {
                          const newFilters = {
                            ...buildFilters,
                            skip: moodData.data.length,
                          };

                          const response = await emotionApi.getAllEmotions(
                            newFilters
                          );

                          setMoodData((prev) =>
                            prev
                              ? {
                                  ...response.data,
                                  data: [...prev.data, ...response.data.data],
                                }
                              : response.data
                          );
                        } catch (err) {
                          console.error("Error loading more entries:", err);
                        }
                      }}
                    >
                      Load More Entries
                    </Button>
                  </div>
                )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
