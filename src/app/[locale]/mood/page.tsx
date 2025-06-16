"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ArrowLeft,
  X,
  Clock,
  Calendar,
  Frown,
  Heart,
  Zap,
  Sun,
  CheckCircle,
  Flame,
  Trophy,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { moods } from "@/src/shared/constants/emotion";
import { getParticleAnimation } from "@/src/utils/getParticalAnimation";
import { getMoodAnimation } from "@/src/utils/getMoodAnimation";
import {
  EmotionStore,
  EmotionTypeValue,
} from "@/src/shared/stores/emotion.store";
import MoodStepThree from "@/src/components/mood/MoodStepThree";
import MoodStepTwo from "@/src/components/mood/MoodStepTwo";
import MoodStepOne from "@/src/components/mood/MoodStepOne";
import { ParsedRecommendationData } from "@/src/utils/parseRecommendation";
import {
  emotionApi,
  EmotionData,
  streakApi,
} from "@/src/shared/api/emotion.api";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import Image from "next/image";

interface RecentEmotion {
  _id: string;
  emotion: string;
  emotionUkrainian: string;
  intensity: number;
  createdAt: string;
  description?: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalMoodTracked: number;
  isActive: boolean;
  lastActivityDate?: string;
}

export default function MoodTrackerRefactored() {
  const { t, locale, isLoading } = useTranslation();
  const {
    step,
    setStep,
    selectedValue,
    setSelectedValue,
    selectedOverallNumber,
    selectedTriggers,
    adictionalNote,
    clearAll,
  } = EmotionStore();

  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [recentEmotions, setRecentEmotions] = useState<EmotionData[]>([]);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const { user } = useAuth();
  const [recommendationData, setRecommendationData] =
    useState<ParsedRecommendationData | null>(null);

  useEffect(() => {
    if (selectedMood && selectedMood.name) setSelectedValue(selectedMood.name);
  }, [selectedMood]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setIsLoadingData(true);
      try {
        const [emotionsRes, streakRes] = await Promise.all([
          emotionApi.getAllEmotions({
            userId: user.id,
            limit: 5,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
          streakApi.getUserStreak(user.id),
        ]);

        setRecentEmotions(emotionsRes.data.data || []);
        setStreakData(streakRes.data.data as StreakData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const getEmotionIcon = (emotion: string) => {
    const iconMap: Record<string, any> = {
      joyful: Sun,
      satisfied: Heart,
      neutral: Calendar,
      anxious: Zap,
      sad: Frown,
      angry: Flame,
      excited: Trophy,
      tired: Clock,
    };
    return iconMap[emotion] || Calendar;
  };

  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      joyful: "text-yellow-500",
      satisfied: "text-green-500",
      neutral: "text-gray-500",
      anxious: "text-orange-500",
      sad: "text-blue-500",
      angry: "text-red-500",
      excited: "text-purple-500",
      tired: "text-indigo-500",
    };
    return colorMap[emotion] || "text-gray-500";
  };

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);

    const moodValueMap: Record<string, EmotionTypeValue> = {
      happy: EmotionTypeValue.HAPPY,
      content: EmotionTypeValue.SATISFIED,
      neutral: EmotionTypeValue.NEUTRAL,
      anxious: EmotionTypeValue.ANXIOUS,
      sad: EmotionTypeValue.SAD,
      angry: EmotionTypeValue.ANGRY,
      excited: EmotionTypeValue.EXCITED,
      tired: EmotionTypeValue.TIRED,
    };

    if (moodValueMap[mood.id]) {
      setSelectedValue(moodValueMap[mood.id]);
    }
    setStep(1);
  };

  const handleClose = () => {
    setTimeout(() => {
      setSelectedMood(null);
      clearAll();
    }, 300);
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      const emotionData = {
        userId: user.id,
        emotion: selectedValue,
        intensity: selectedOverallNumber,
        triggers: selectedTriggers,
        description: adictionalNote,
      };

      await emotionApi.createEmotion(emotionData);

      // Оновлюємо дані після збереження
      const [emotionsRes, streakRes] = await Promise.all([
        emotionApi.getAllEmotions({
          userId: user.id,
          limit: 5,
          sortBy: "createdAt",
          sortOrder: "desc",
        }),
        streakApi.getUserStreak(user.id),
      ]);

      setRecentEmotions(emotionsRes.data.data || []);
      setStreakData(streakRes.data.data as StreakData);

      setTimeout(() => {
        window.location.href = `/${locale}/dashboard`;
      }, 1000);
    } catch (error) {
      console.error("Error saving emotion:", error);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const DynamicBackground = ({ mood }: { mood: any }) => {
    //
    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${mood.bgColor} opacity-90`}
          animate={{ opacity: [0.85, 0.95, 0.85] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {t("moodTracker.title")}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t("moodTracker.subtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Streak Display */}
              {streakData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-full border border-orange-200"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">
                    {streakData.currentStreak} {t("moodTracker.streak.days")}
                  </span>
                  <div className="text-xs text-orange-600">
                    🔥 {streakData.totalMoodTracked}{" "}
                    {t("moodTracker.streak.total")}
                  </div>
                </motion.div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center border-2 gap-2 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
              >
                <Clock className="h-4 w-4" />
                {showHistory
                  ? t("moodTracker.hideHistory")
                  : t("moodTracker.showHistory")}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 mt-4">
        {/* Mood History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mb-8 overflow-hidden"
            >
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-semibold mb-4 flex items-center text-gray-900"
                  >
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    {t("moodTracker.recentEntries")}
                  </motion.h3>

                  {isLoadingData ? (
                    <div className="flex justify-center py-8">
                      <motion.div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </div>
                  ) : recentEmotions.length > 0 ? (
                    <div className="space-y-3">
                      {recentEmotions.map((emotion, i) => {
                        const EmotionIcon = getEmotionIcon(emotion.emotion);
                        const emotionColor = getEmotionColor(emotion.emotion);

                        return (
                          <motion.div
                            key={emotion._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={`p-2 rounded-full bg-white ${emotionColor}`}
                              >
                                <EmotionIcon className="h-5 w-5" />
                              </motion.div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {emotion.emotionUkrainian || emotion.emotion}
                                </p>
                                {emotion.description && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {emotion.description.slice(0, 50)}...
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-sm font-medium text-gray-700">
                                {t("moodTracker.intensity")}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                {t("moodTracker.view")}
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{t("moodTracker.noEntries")}</p>
                      <p className="text-sm mt-2">
                        {t("moodTracker.startTracking")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Mood Grid */}
        <AnimatePresence>
          {!selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {moods(t, locale).map((mood, index) => {
                  const moodAnimation = getMoodAnimation(mood.animation);
                  return (
                    <motion.div
                      key={mood.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className="cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-white h-full group overflow-hidden relative"
                        onClick={() => handleMoodSelect(mood)}
                      >
                        <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full relative z-10">
                          <motion.div
                            className={`p-4 rounded-2xl ${mood.lightBg} mb-4 transition-all duration-300`}
                            {...moodAnimation}
                            whileHover={{ scale: 1.15, rotate: 5 }}
                          >
                            <Image
                              src={mood.icon}
                              alt={mood.affirmation}
                              width={64}
                              height={64}
                              className={`h-13 w-13 ${mood.iconColor}`}
                            />
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">
                            {mood.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {mood.description}
                          </p>
                        </CardContent>

                        <motion.div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Full Screen Mood Display */}
      <AnimatePresence>
        {selectedMood && (
          <>
            {/* Dynamic Animated Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-20"
            >
              <DynamicBackground mood={selectedMood} />
              <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
            </motion.div>

            {/* Enhanced Animated Mood Block */}
            <motion.div
              initial={{
                y: "100vh",
                scale: 0.3,
                opacity: 0,
                rotateX: 45,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
                rotateX: 0,
              }}
              exit={{
                y: "100vh",
                scale: 0.3,
                opacity: 0,
                rotateX: 45,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1,
              }}
              className="fixed inset-0 z-30 flex items-center justify-center"
            >
              <div className="text-center text-white p-6 w-full max-w-lg mx-auto relative">
                {/* Enhanced Step indicator */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mb-8"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className={`relative mx-2`}
                      whileHover={{ scale: 1.2 }}
                    >
                      <motion.div
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          step === i
                            ? "bg-white scale-125 shadow-lg"
                            : step > i
                            ? "bg-white/80 scale-110"
                            : "bg-white/40"
                        }`}
                        animate={{
                          scale: step === i ? [1, 1.2, 1] : 1,
                          boxShadow:
                            step === i
                              ? [
                                  "0 0 0 rgba(255,255,255,0.4)",
                                  "0 0 20px rgba(255,255,255,0.8)",
                                  "0 0 0 rgba(255,255,255,0.4)",
                                ]
                              : "0 0 0 rgba(255,255,255,0.4)",
                        }}
                        transition={{
                          duration: 2,
                          repeat: step === i ? Number.POSITIVE_INFINITY : 0,
                        }}
                      />
                      {step > i && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CheckCircle className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Step Components */}
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <MoodStepOne
                      selectedMood={selectedMood}
                      onNext={nextStep}
                    />
                  )}

                  {step === 2 && (
                    <MoodStepTwo
                      onNext={nextStep}
                      onPrev={prevStep}
                      setRecommendationData={setRecommendationData}
                    />
                  )}

                  {step === 3 && (
                    <MoodStepThree
                      selectedMood={selectedMood}
                      onPrev={prevStep}
                      onSave={handleSave}
                      recommendationData={recommendationData}
                    />
                  )}
                </AnimatePresence>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
