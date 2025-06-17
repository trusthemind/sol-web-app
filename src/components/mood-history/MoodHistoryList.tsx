"use client";

import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { EmotionData, emotionApi } from "@/src/shared/api/emotion.api";
import MoodHistoryEntry from "./MoodHistoryEntry";

interface MoodHistoryListProps {
  filteredData: EmotionData[];
  moodData: any;
  setMoodData: any;
  buildFilters: any;
  formatDisplayDate: (date: string) => string;
  formatDisplayTime: (date: string) => string;
  formatRelativeTime: (date: string) => string;
  getIntensityDescription: (intensity: number) => string;
  onClearFilters: () => void;
}

export default function MoodHistoryList({
  filteredData,
  moodData,
  setMoodData,
  buildFilters,
  formatDisplayDate,
  formatDisplayTime,
  formatRelativeTime,
  getIntensityDescription,
  onClearFilters
}: MoodHistoryListProps) {
  const { locale } = useTranslation();

  const handleLoadMore = async () => {
    try {
      const newFilters = {
        ...buildFilters,
        skip: moodData.data.length,
      };

      const response = await emotionApi.getAllEmotions(newFilters);

      setMoodData((prev: any) =>
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
  };

  return (
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
            {locale === "ua" ? 
              (filteredData.length === 1 ? "запис знайдено" : "записів знайдено") :
              (filteredData.length === 1 ? "Entry" : "Entries")} Found
          </h2>
        </div>

        {/* Mood Entries */}
        <div className="space-y-4">
          {filteredData.map((entry, index) => (
            <MoodHistoryEntry
              key={entry._id}
              entry={entry}
              index={index}
              formatDisplayDate={formatDisplayDate}
              formatDisplayTime={formatDisplayTime}
              formatRelativeTime={formatRelativeTime}
              getIntensityDescription={getIntensityDescription}
            />
          ))}
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
              {locale === "ua" ? "Записи не знайдені" : "No entries found"}
            </h3>
            <p className="text-gray-600 mb-4">
              {locale === "ua" ? 
                "Спробуйте налаштувати фільтри або умови пошуку" : 
                "Try adjusting your filters or search terms"}
            </p>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={onClearFilters}
            >
              {locale === "ua" ? "Очистити всі фільтри" : "Clear all filters"}
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
                onClick={handleLoadMore}
              >
                {locale === "ua" ? "Завантажити більше записів" : "Load More Entries"}
              </Button>
            </div>
          )}
      </div>
    </motion.div>
  );
}
