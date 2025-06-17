import { useState, useEffect, useMemo } from "react";
import { emotionApi, EmotionsListResponse } from "@/src/shared/api/emotion.api";
import { useAuth } from "@/src/shared/stores/context/AuthContext";

export interface EmotionFilters {
  userId?: string;
  emotion?: string | string[];
  intensity?: number;
  minIntensity?: number;
  maxIntensity?: number;
  stressLievel?: number;
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

interface UseMoodHistoryDataProps {
  selectedEmotion: string;
  selectedIntensity: string;
  selectedTimeRange: string;
  sortBy: string;
  sortOrder: string;
  searchTerm: string;
}

export function useMoodHistoryData({
  selectedEmotion,
  selectedIntensity,
  selectedTimeRange,
  sortBy,
  sortOrder,
  searchTerm,
}: UseMoodHistoryDataProps) {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<EmotionsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildFilters = useMemo((): EmotionFilters => {
    const filters: EmotionFilters = {
      userId: user?.id,
      limit: 50,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
    };

    if (selectedEmotion !== "all") filters.emotion = selectedEmotion;
    if (selectedIntensity !== "all") {
      const intensity = parseInt(selectedIntensity);
      if (!isNaN(intensity)) filters.intensity = intensity;
    }

    if (selectedTimeRange !== "all")
      filters.timeRange = selectedTimeRange as any;

    return filters;
  }, [
    user?.id,
    selectedEmotion,
    selectedIntensity,
    selectedTimeRange,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user?.id) return;

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
  }, [buildFilters, user?.id]);

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
            )) ||
          (entry.description &&
            entry.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [moodData?.data, searchTerm]);

  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        totalEntries: 0,
        emotions: {},
        intensities: {},
        avgIntensity: 0,
        topTriggers: [],
      };
    }

    const emotions = filteredData.reduce((acc, entry) => {
      const emotion = entry.emotion || "unknown";
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const intensities = filteredData.reduce((acc, entry) => {
      const intensity = entry.intensity || 0;
      acc[intensity] = (acc[intensity] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const validIntensities = filteredData
      .map((entry) => entry.intensity)
      .filter(
        (intensity) =>
          intensity !== null && intensity !== undefined && !isNaN(intensity)
      );

    const avgIntensity =
      validIntensities.length > 0
        ? validIntensities.reduce((sum, intensity) => sum + intensity, 0) /
          validIntensities.length
        : 0;

    const topTriggers = filteredData
      .flatMap((entry) => entry.triggers || [])
      .filter((trigger) => trigger && trigger.trim().length > 0)
      .reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalEntries: filteredData.length,
      emotions,
      intensities,
      avgIntensity: Number.isNaN(avgIntensity)
        ? 0
        : Math.round(avgIntensity * 10) / 10,
      topTriggers: Object.entries(topTriggers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    };
  }, [filteredData]);

  return {
    moodData,
    setMoodData,
    loading,
    error,
    filteredData,
    stats,
    buildFilters,
  };
}
