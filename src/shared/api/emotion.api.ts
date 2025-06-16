
import { AxiosRequestConfig } from "axios";
import { api, ParseResponse } from ".";

export interface EmotionData {
  _id?: string;
  userId: string;
  emotion: string;
  intensity: number | string;
  triggers?: string[];
  tags?: string[];
  notes?: string;
  recordedAt?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmotionFilters {
  userId?: string;
  emotion?: string | string[];
  intensity?: number | string;
  timeRange?: "day" | "week" | "month" | "year";
  startDate?: Date | string;
  endDate?: Date | string;
  tags?: string[];
  triggers?: string[];
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface EmotionResponse {
  success: boolean;
  message?: string;
  data: EmotionData;
}

export interface EmotionsListResponse {
  success: boolean;
  data: EmotionData[];
  total: number;
  filters: EmotionFilters;
}

export interface EmotionStatsResponse {
  success: boolean;
  data: {
    totalEntries: number;
    mostCommonEmotion: string;
    mostCommonIntensity: number;
    averageIntensity: number;
    emotionBreakdown: Record<string, number>;
    intensityDistribution: Record<string, number>;
    timePatterns?: any;
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
    analysis: string;
    summary: {
      totalEntries: number;
      mostCommonIntensity: number;
      mostCommonEmotion: string;
      timeRange: string;
    };
  };
}

export interface EmotionRecommendationsResponse {
  success: boolean;
  data: {
    recommendations: string;
    basedOn: {
      entriesAnalyzed: number;
      timeRange: string;
      mostCommonIntensity: number;
      dominantEmotion: string;
    };
  };
}

export interface EmotionOverallSummaryResponse {
  success: boolean;
  data: {
    summary: string;
    analysis: string;
    recommendations: string;
    stats: any;
    metadata: {
      timeRange: string;
      entriesAnalyzed: number;
      generatedAt: Date;
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
    timeRange: "day" | "week" | "month" | "year",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionsByTimeRangeResponse }> {
    const res = await api.get(
      `/emotions/${userId}/timerange/${timeRange}`,
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
      `/emotions/${userId}/stats?${params.toString()}`,
      opt
    );
    return ParseResponse(res);
  },

  async getEmotionPatterns(
    userId: string,
    days: number = 30,
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionPatternsResponse }> {
    const res = await api.get(`/emotions/${userId}/patterns?days=${days}`, opt);
    return ParseResponse(res);
  },

  async getEmotionAnalysis(
    userId: string,
    timeRange: string = "month",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionAnalysisResponse }> {
    const res = await api.get(
      `/emotions/${userId}/analysis?timeRange=${timeRange}`,
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
      `/emotions/${userId}/recommendations?timeRange=${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async getInstantRecommedation(
    data: {
      emotion: string;
      intensity: number;
      triggers: string[];
      notes: string;
      tags: string[];
    },
    opt?: AxiosRequestConfig
  ) {
    const res = await api.post(`/emotions/recommendations`, data, opt);
    return res;
  },

  async getOverallSummary(
    userId: string,
    timeRange: string = "month",
    opt?: AxiosRequestConfig
  ): Promise<{ data: EmotionOverallSummaryResponse }> {
    const res = await api.get(
      `/emotions/${userId}/summary?timeRange=${timeRange}`,
      opt
    );
    return ParseResponse(res);
  },

  async searchEmotions(
    searchFilters: {
      userId: string;
      emotions?: string[];
      intensity?: number | string;
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
        sortBy: "recordedAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getTodayEmotions(userId: string, opt?: AxiosRequestConfig) {
    return emotionApi.getEmotionsByTimeRange(userId, "day", opt);
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
        sortBy: "recordedAt",
        sortOrder: "desc",
      },
      opt
    );
  },

  async getEmotionsByIntensity(
    userId: string,
    intensity: number | string,
    limit: number = 50,
    opt?: AxiosRequestConfig
  ) {
    return emotionApi.getAllEmotions(
      {
        userId,
        intensity,
        limit,
        sortBy: "recordedAt",
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
        sortBy: "recordedAt",
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
    const [summary, stats, patterns, recent] = await Promise.all([
      emotionApi.getOverallSummary(userId, timeRange, opt),
      emotionApi.getEmotionStats(userId, { timeRange: timeRange as any }, opt),
      emotionApi.getEmotionPatterns(userId, 30, opt),
      emotionApiHelpers.getRecentEmotions(userId, 5, opt),
    ]);

    return {
      summary: summary.data,
      stats: stats.data,
      patterns: patterns.data,
      recent: recent.data,
    };
  },
};
