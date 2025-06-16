import { AxiosRequestConfig } from "axios";
import { api, ParseResponse } from ".";

export interface EmotionData {
  _id?: string;
  userId: string;
  emotion: string;
  emotionUkrainian?: string;
  intensity: number;
  description?: string;
  triggers?: string[];
  tags?: string[];
  stressLevel?: number;
  activities?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalMoodTracked: number;
  lastActivityDate?: Date;
  streakStartDate?: Date;
  isActive: boolean;
}

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

export interface EmotionResponse {
  success: boolean;
  message?: string;
  data: {
    emotion: EmotionData;
    streak?: StreakData;
  };
}

export interface EmotionsListResponse {
  success: boolean;
  data: EmotionData[];
  total: number;
  filters: EmotionFilters;
  streak?: StreakData;
}

export interface EmotionStatsResponse {
  success: boolean;
  data: {
    totalEntries: number;
    averageIntensity: number;
    averageStressLevel: number;
    mostCommonEmotion: string;
    mostCommonIntensity: number;
    emotionDistribution: Record<string, number>;
    intensityDistribution: Record<number, number>;
    trendsOverTime: any[];
    streak?: StreakData;
  };
}

export interface EmotionPatternsResponse {
  success: boolean;
  data: {
    dailyPatterns: any[];
    weeklyPatterns: any[];
    triggers: Record<string, number>;
    tags: Record<string, number>;
    correlations: any[];
  };
  period: string;
}

export interface EmotionAnalysisResponse {
  success: boolean;
  data: {
    analysis: {
      insights: string[];
      trends: string[];
      concerns: string[];
      positives: string[];
      emotionalBalance: string;
      riskFactors: string[];
    };
    summary: {
      totalEntries: number;
      averageIntensity: number;
      mostCommonIntensity: number;
      mostCommonEmotion: string;
      timeRange: string;
    };
  };
}

export interface EmotionRecommendationsResponse {
  success: boolean;
  data: {
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      professionalHelp: boolean;
      resources: string[];
      coping: string[];
    };
    basedOn: {
      entriesAnalyzed: number;
      timeRange: string;
      averageIntensity: number;
      mostCommonIntensity: number;
      dominantEmotion: string;
    };
  };
}

export interface EmotionOverallSummaryResponse {
  success: boolean;
  data: {
    summary: {
      emotionalWellbeing: string;
      keyInsights: string[];
      actionPlan: string[];
      progress: string;
      nextSteps: string[];
    };
    analysis: {
      insights: string[];
      trends: string[];
      concerns: string[];
      positives: string[];
      emotionalBalance: string;
      riskFactors: string[];
    };
    recommendations: {
      immediate: string[];
      shortTerm: string[];
      longTerm: string[];
      professionalHelp: boolean;
      resources: string[];
      coping: string[];
    };
    stats: any;
    streak?: StreakData;
    metadata: {
      timeRange: string;
      entriesAnalyzed: number;
      generatedAt: Date;
      averageIntensity: number;
      mostCommonIntensity: number;
      mostCommonEmotion: string;
    };
  };
}

export interface EmotionsByTimeRangeResponse {
  success: boolean;
  data: EmotionData[];
  timeRange: string;
  count: number;
}

export interface EmotionSearchResponse {
  success: boolean;
  data: EmotionData[];
  total: number;
  filters: EmotionFilters;
}

export interface StreakResponse {
  success: boolean;
  data: StreakData;
}

export interface StreakStatsResponse {
  success: boolean;
  data: StreakData & {
    streakDuration: number;
    daysSinceLastActivity: number | null;
    averageEntriesPerDay: string;
  };
}

export interface TopStreaksResponse {
  success: boolean;
  data: (StreakData & { userId: { firstName?: string; lastName?: string } })[];
  limit: number;
  count: number;
}

export const emotionApi = {
  async createEmotion(
    emotionData: Omit<EmotionData, "_id" | "createdAt" | "updatedAt">,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionResponse }> {
    const res = await api.post("/emotions", emotionData, opt);
    return ParseResponse(res);
  },

  async getAllEmotions(
    filters?: EmotionFilters,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionsListResponse }> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(","));
          } else if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const res = await api.get(`/emotions?${params.toString()}`, opt);
    return ParseResponse(res);
  },

  async getEmotionById(
    id: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionResponse }> {
    const res = await api.get(`/emotions/${id}`, opt);
    return ParseResponse(res);
  },

  async updateEmotion(
    id: string,
    updateData: Partial<EmotionData>,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionResponse }> {
    const res = await api.put(`/emotions/${id}`, updateData, opt);
    return ParseResponse(res);
  },

  async deleteEmotion(
    id: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: { success: boolean; message: string } }> {
    const res = await api.delete(`/emotions/${id}`, opt);
    return ParseResponse(res);
  },

  async getEmotionsByTimeRange(
    userId: string,
    timeRange: "today" | "week" | "month" | "quarter" | "year", 
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionsByTimeRangeResponse }> {
    const res = await api.get(
      `/emotions/user/${userId}/timerange/${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async getEmotionStats(
    userId: string,
    filters?: Pick<EmotionFilters, "timeRange" | "startDate" | "endDate">,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionStatsResponse }> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const res = await api.get(
      `/emotions/user/${userId}/stats?${params.toString()}`,
      opt
    );
    return ParseResponse(res);
  },

  async getEmotionPatterns(
    userId: string,
    days: number = 30,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionPatternsResponse }> {
    const res = await api.get(
      `/emotions/user/${userId}/patterns?days=${days}`,
      opt
    );
    return ParseResponse(res);
  },

  async getEmotionAnalysis(
    userId: string,
    timeRange: string = "month",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionAnalysisResponse }> {
    const res = await api.get(
      `/emotions/user/${userId}/analysis?timeRange=${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async getRecommendations(
    userId: string,
    timeRange: string = "week",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionRecommendationsResponse }> {
    const res = await api.get(
      `/emotions/user/${userId}/recommendations?timeRange=${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async getInstantRecommendation(
    data: {
      emotion: string;
      intensity: number;
      triggers?: string[];
      notes?: string;
      tags?: string[];
    },
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionRecommendationsResponse }> {
    const res = await api.post(`/emotions/recommendations/instant`, data, opt);
    return ParseResponse(res);
  },

  async getOverallSummary(
    userId: string,
    timeRange: string = "month",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionOverallSummaryResponse }> {
    const res = await api.get(
      `/emotions/user/${userId}/summary?timeRange=${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async searchEmotions(
    searchFilters: {
      userId: string;
      emotions?: string[];
      intensity?: number;
      tags?: string[];
      triggers?: string[];
      startDate?: Date | string;
      endDate?: Date | string;
      limit?: number;
    },
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionSearchResponse }> {
    const params = new URLSearchParams();

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else if (value instanceof Date) {
          params.append(key, value.toISOString());
        } else {
          params.append(key, String(value));
        }
      }
    });

    const res = await api.get(`/emotions/search?${params.toString()}`, opt);
    return ParseResponse(res);
  },
};

export const streakApi = {
  async getUserStreak(
    userId: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: StreakResponse }> {
    const res = await api.get(`/streaks/user/${userId}`, opt);
    return ParseResponse(res);
  },

  async getStreakStats(
    userId: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: StreakStatsResponse }> {
    const res = await api.get(`/streaks/user/${userId}/stats`, opt);
    return ParseResponse(res);
  },

  async getTopStreaks(
    limit: number = 10,
    opt?: AxiosRequestConfig
  ): Promise<{ data: TopStreaksResponse }> {
    const res = await api.get(`/streaks/top?limit=${limit}`, opt);
    return ParseResponse(res);
  },

  async resetUserStreak(
    userId: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: StreakResponse }> {
    const res = await api.post(`/streaks/user/${userId}/reset`, {}, opt);
    return ParseResponse(res);
  },

  async deleteUserStreak(
    userId: string,
    opt?: AxiosRequestConfig
  ): Promise<{ data: { success: boolean; message: string } }> {
    const res = await api.delete(`/streaks/user/${userId}`, opt);
    return ParseResponse(res);
  },
};

export const emotionApiHelpers = {
  async getRecentEmotions(
    userId: string,
    limit: number = 10,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getTodayEmotions(userId: string, opt?: AxiosRequestConfig) {
    return emotionApi.getEmotionsByTimeRange(userId, "today", opt);
  },

  async getWeekEmotions(userId: string, opt?: AxiosRequestConfig) {
    return emotionApi.getEmotionsByTimeRange(userId, "week", opt);
  },

  async getEmotionsByType(
    userId: string,
    emotionType: string,
    limit: number = 50,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        emotion: emotionType,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getEmotionsByIntensity(
    userId: string,
    intensity: number,
    limit: number = 50,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        intensity,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getEmotionsByIntensityRange(
    userId: string,
    minIntensity: number,
    maxIntensity: number,
    limit: number = 50,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        minIntensity,
        maxIntensity,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getEmotionsByDateRange(
    userId: string,
    startDate: Date | string,
    endDate: Date | string,
    limit: number = 100,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        startDate,
        endDate,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getUserEmotionDashboard(
    userId: string,
    timeRange: string = "month",
    opt?: AxiosRequestConfig
  ) {
    const [summary, stats, patterns, recent, streak] = await Promise.all([
      emotionApi.getOverallSummary(userId, timeRange, opt),
      emotionApi.getEmotionStats(userId, { timeRange: timeRange as any }, opt),
      emotionApi.getEmotionPatterns(userId, 30, opt),
      emotionApiHelpers.getRecentEmotions(userId, 5, opt),
      streakApi.getUserStreak(userId, opt),
    ]);

    return {
      summary: summary.data,
      stats: stats.data,
      patterns: patterns.data,
      recent: recent.data,
      streak: streak.data,
    };
  },

  async getUserStreakDashboard(userId: string, opt?: AxiosRequestConfig) {
    const [streak, stats, topStreaks] = await Promise.all([
      streakApi.getUserStreak(userId, opt),
      streakApi.getStreakStats(userId, opt),
      streakApi.getTopStreaks(10, opt),
    ]);

    return {
      userStreak: streak.data,
      stats: stats.data,
      topStreaks: topStreaks.data,
    };
  },
};
