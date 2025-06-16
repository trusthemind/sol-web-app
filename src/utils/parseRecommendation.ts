export interface ParsedRecommendationData {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    resources: string[];
    coping: string[];
  }
  
  export interface RecommendationApiResponse {
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
        emotion: string;
        intensity: number;
        triggers: string[];
      };
    };
  }
  
  export const parseRecommendationData = (
    apiResponse: unknown
  ): ParsedRecommendationData | null => {
    try {
      const response = apiResponse as RecommendationApiResponse;
      
      if (!response?.success || !response?.data?.recommendations) {
        console.warn("Invalid recommendation API response structure");
        return null;
      }
  
      const recommendations = response.data.recommendations;
  
      return {
        immediate: Array.isArray(recommendations.immediate) 
          ? recommendations.immediate 
          : [],
        shortTerm: Array.isArray(recommendations.shortTerm) 
          ? recommendations.shortTerm 
          : [],
        longTerm: Array.isArray(recommendations.longTerm) 
          ? recommendations.longTerm 
          : [],
        resources: Array.isArray(recommendations.resources) 
          ? recommendations.resources 
          : [],
        coping: Array.isArray(recommendations.coping) 
          ? recommendations.coping 
          : [],
      };
    } catch (error) {
      console.error("Error parsing recommendation data:", error);
      return null;
    }
  };
  
  export const hasValidRecommendations = (
    data: ParsedRecommendationData | null
  ): boolean => {
    if (!data) return false;
    
    const totalRecommendations = 
      data.immediate.length + 
      data.shortTerm.length + 
      data.longTerm.length + 
      data.resources.length + 
      data.coping.length;
      
    return totalRecommendations > 0;
  };
  
  export const getTotalRecommendationCount = (
    data: ParsedRecommendationData | null
  ): number => {
    if (!data) return 0;
    
    return data.immediate.length + 
           data.shortTerm.length + 
           data.longTerm.length + 
           data.resources.length + 
           data.coping.length;
  };