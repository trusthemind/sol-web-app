"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Wind } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { BreathingExercise, breathingExercises } from "@/src/shared/config/breathing";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import BreathingExerciseCard from "@/src/components/breatihing/BreatingExercise";
import BreathingExerciseFilters from "@/src/components/breatihing/BreathingFilters";
import BreathingTimer from "@/src/components/breatihing/BreathingTimer";

export default function BreathingExercises() {
  const { locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [activeExercise, setActiveExercise] = useState<BreathingExercise | null>(null);

  const filteredExercises = breathingExercises.filter(exercise => {
    const categoryMatch = selectedCategory === "all" || exercise.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleStartExercise = (exercise: BreathingExercise) => {
    setActiveExercise(exercise);
  };

  const handleCloseTimer = () => {
    setActiveExercise(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="ghost" size="icon" className="hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 text-gray-700" />
                </Button>
              </Link>
              <div>
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2 flex items-center gap-3"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Wind className="h-10 w-10 text-cyan-600" />
                  </motion.div>
                  {locale === "ua" ? "Дихальні вправи" : "Breathing Exercises"}
                </motion.h1>
                <motion.p
                  className="text-slate-600 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {locale === "ua" 
                    ? "Керовані дихальні техніки для розслаблення та концентрації"
                    : "Guided breathing techniques for relaxation and focus"}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <BreathingExerciseFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
          />

          {/* Exercise Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredExercises.map((exercise, index) => (
              <motion.div key={exercise.id} variants={itemVariants}>
                <BreathingExerciseCard
                  exercise={exercise}
                  onStart={handleStartExercise}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* No results */}
          {filteredExercises.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="mb-4">
                <Heart className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {locale === "ua" ? "Вправи не знайдені" : "No exercises found"}
              </h3>
              <p className="text-gray-600 mb-4">
                {locale === "ua" 
                  ? "Спробуйте змінити фільтри для пошуку інших вправ"
                  : "Try adjusting your filters to find other exercises"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {locale === "ua" ? "Скинути фільтри" : "Reset filters"}
              </Button>
            </motion.div>
          )}

          {/* Exercise count */}
          {filteredExercises.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 text-sm text-slate-500"
            >
              {locale === "ua" 
                ? `Знайдено ${filteredExercises.length} вправ із ${breathingExercises.length}`
                : `Showing ${filteredExercises.length} of ${breathingExercises.length} exercises`}
            </motion.div>
          )}
        </div>
      </div>

      {/* Breathing Timer Modal */}
      {activeExercise && (
        <BreathingTimer
          exercise={activeExercise}
          onClose={handleCloseTimer}
        />
      )}
    </div>
  );
}