"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Filter, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

interface MoodHistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedEmotion: string;
  setSelectedEmotion: (emotion: string) => void;
  selectedIntensity: string;
  setSelectedIntensity: (intensity: string) => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (range: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onClearFilters: () => void;
}

const availableEmotions = [
  "happy", "joyful", "content", "satisfied", "neutral", 
  "anxious", "worried", "sad", "angry", "excited", 
  "tired", "sleepy", "stressed", "calm", "overwhelmed"
];

const intensityConfig = {
  1: { label: "Very Low" },
  2: { label: "Low" },
  3: { label: "Low-Medium" },
  4: { label: "Medium-Low" },
  5: { label: "Medium" },
  6: { label: "Medium-High" },
  7: { label: "High" },
  8: { label: "Very High" },
  9: { label: "Extreme" },
  10: { label: "Maximum" },
};

export default function MoodHistoryFilters({
  searchTerm,
  setSearchTerm,
  selectedEmotion,
  setSelectedEmotion,
  selectedIntensity,
  setSelectedIntensity,
  selectedTimeRange,
  setSelectedTimeRange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onClearFilters
}: MoodHistoryFiltersProps) {
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

  return (
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
            {locale === "ua" ? "Фільтри" : "Filters"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Пошук" : "Search"}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={locale === "ua" ? "Пошук емоцій, тригерів..." : "Search emotions, triggers..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Emotion Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Емоція" : "Emotion"}
            </label>
            <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={locale === "ua" ? "Всі емоції" : "All emotions"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-700">
                  {locale === "ua" ? "Всі емоції" : "All emotions"}
                </SelectItem>
                {availableEmotions.map((emotion) => (
                  <SelectItem key={emotion} value={emotion} className="text-gray-700">
                    <span className="capitalize">{getEmotionLabel(emotion)}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Intensity Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Інтенсивність" : "Intensity"}
            </label>
            <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={locale === "ua" ? "Всі інтенсивності" : "All intensities"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-700">
                  {locale === "ua" ? "Всі інтенсивності" : "All intensities"}
                </SelectItem>
                {Object.entries(intensityConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="text-gray-700">
                    <span>
                      {key} - {locale === "ua" ? 
                        (config.label === "Very Low" ? "Дуже низька" :
                         config.label === "Low" ? "Низька" :
                         config.label === "Medium" ? "Середня" :
                         config.label === "High" ? "Висока" :
                         config.label === "Very High" ? "Дуже висока" :
                         config.label === "Extreme" ? "Екстремальна" :
                         config.label === "Maximum" ? "Максимальна" : config.label) :
                        config.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Часовий діапазон" : "Time Range"}
            </label>
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder={locale === "ua" ? "Весь час" : "All time"} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-gray-700">
                  {locale === "ua" ? "Весь час" : "All time"}
                </SelectItem>
                <SelectItem value="today" className="text-gray-700">
                  {locale === "ua" ? "Сьогодні" : "Today"}
                </SelectItem>
                <SelectItem value="week" className="text-gray-700">
                  {locale === "ua" ? "Цей тиждень" : "This week"}
                </SelectItem>
                <SelectItem value="month" className="text-gray-700">
                  {locale === "ua" ? "Цей місяць" : "This month"}
                </SelectItem>
                <SelectItem value="quarter" className="text-gray-700">
                  {locale === "ua" ? "Цей квартал" : "This quarter"}
                </SelectItem>
                <SelectItem value="year" className="text-gray-700">
                  {locale === "ua" ? "Цей рік" : "This year"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Сортувати за" : "Sort By"}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="createdAt" className="text-gray-700">
                  {locale === "ua" ? "Дата створення" : "Date Created"}
                </SelectItem>
                <SelectItem value="intensity" className="text-gray-700">
                  {locale === "ua" ? "Інтенсивність" : "Intensity"}
                </SelectItem>
                <SelectItem value="emotion" className="text-gray-700">
                  {locale === "ua" ? "Емоція" : "Emotion"}
                </SelectItem>
                <SelectItem value="stressLevel" className="text-gray-700">
                  {locale === "ua" ? "Рівень стресу" : "Stress Level"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {locale === "ua" ? "Порядок сортування" : "Sort Order"}
            </label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="desc" className="text-gray-700">
                  {locale === "ua" ? "За спаданням" : "Descending"}
                </SelectItem>
                <SelectItem value="asc" className="text-gray-700">
                  {locale === "ua" ? "За зростанням" : "Ascending"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={onClearFilters}
          >
            {locale === "ua" ? "Очистити всі фільтри" : "Clear All Filters"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}