"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import dayjs from "@/src/shared/config/dayjs";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import MoodHistoryHeader from "@/src/components/mood-history/MoodHIstoryHeader";
import MoodHistoryFilters from "@/src/components/mood-history/MoodHistoryFilters";
import MoodHistoryStats from "@/src/components/mood-history/MoodHistoryStats";
import MoodHistoryList from "@/src/components/mood-history/MoodHistoryList";
import { useMoodHistoryData } from "@/src/shared/hooks/UseHistoryData";

const intensityConfig = {
  1: { label: "Very Low", desc: "Barely noticeable" },
  2: { label: "Low", desc: "Mild emotional response" },
  3: { label: "Low-Medium", desc: "Slight but noticeable" },
  4: { label: "Medium-Low", desc: "Noticeable feeling" },
  5: { label: "Medium", desc: "Moderate emotional response" },
  6: { label: "Medium-High", desc: "Strong but manageable" },
  7: { label: "High", desc: "Intense emotional response" },
  8: { label: "Very High", desc: "Very intense feeling" },
  9: { label: "Extreme", desc: "Overwhelming emotion" },
  10: { label: "Maximum", desc: "Peak emotional intensity" },
};

export default function MoodHistory() {
  const { locale } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState<string>("all");
  const [selectedIntensity, setSelectedIntensity] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const {
    moodData,
    setMoodData,
    loading,
    error,
    filteredData,
    stats,
    buildFilters,
  } = useMoodHistoryData({
    selectedEmotion,
    selectedIntensity,
    selectedTimeRange,
    sortBy,
    sortOrder,
    searchTerm,
  });

  const getIntensityDescription = (intensity: number) => {
    const config = intensityConfig[intensity as keyof typeof intensityConfig];
    return config ? `${config.label} - ${config.desc}` : "Unknown intensity";
  };

  const formatRelativeTime = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    if (date.isSame(now, "day"))
      return `${locale === "ua" ? "Сьогодні о" : "Today at"} ${date.format(
        "HH:mm"
      )}`;
    else if (date.isSame(now.subtract(1, "day"), "day"))
      return `${locale === "ua" ? "Вчора о" : "Yesterday at"} ${date.format(
        "HH:mm"
      )}`;
    else if (now.diff(date, "day") <= 7)
      return `${date.format(
        locale === "ua" ? "dddd [о]" : "dddd [at]"
      )} ${date.format("HH:mm")}`;
    else if (date.isSame(now, "year"))
      return date.format(
        locale === "ua" ? "DD MMM [о] HH:mm" : "MMM DD [at] HH:mm"
      );
    else
      return date.format(
        locale === "ua" ? "DD MMM YYYY [о] HH:mm" : "MMM DD, YYYY [at] HH:mm"
      );
  };

  const formatDisplayDate = (dateString: string) => {
    return dayjs(dateString).format(
      locale === "ua" ? "DD MMM YYYY" : "MMM DD, YYYY"
    );
  };

  const formatDisplayTime = (dateString: string) => {
    return dayjs(dateString).format("HH:mm");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedEmotion("all");
    setSelectedIntensity("all");
    setSelectedTimeRange("all");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-gray-600">
            {locale === "ua" ? "Завантаження..." : "Loading..."}
          </p>
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
            {locale === "ua" ? "Спробувати знову" : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <MoodHistoryHeader />

        <MoodHistoryStats stats={stats} totalRecords={moodData?.total || 0} />

        <div className="grid lg:grid-cols-4 gap-8">
          <MoodHistoryFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedEmotion={selectedEmotion}
            setSelectedEmotion={setSelectedEmotion}
            selectedIntensity={selectedIntensity}
            setSelectedIntensity={setSelectedIntensity}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onClearFilters={handleClearFilters}
          />

          <MoodHistoryList
            filteredData={filteredData}
            moodData={moodData}
            setMoodData={setMoodData}
            buildFilters={buildFilters}
            formatDisplayDate={formatDisplayDate}
            formatDisplayTime={formatDisplayTime}
            formatRelativeTime={formatRelativeTime}
            getIntensityDescription={getIntensityDescription}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
}
