"use client";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Zap, Target, Moon, Shield } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { categories, difficultyLevels } from "@/src/shared/config/breathing";

interface BreathingExerciseFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
}

const categoryIcons = {
  calming: Heart,
  energizing: Zap,
  focus: Target,
  sleep: Moon,
  anxiety: Shield
};

export default function BreathingExerciseFilters({
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty
}: BreathingExerciseFiltersProps) {
  const { locale } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-6"
    >
      {/* Category filters */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {locale === "ua" ? "Категорії" : "Categories"}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            {locale === "ua" ? "Всі" : "All"}
          </Button>
          {Object.entries(categories).map(([key, category]) => {
            const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                onClick={() => setSelectedCategory(key)}
                className="rounded-full"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {locale === "ua" ? category.labelUkrainian : category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Difficulty filters */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          {locale === "ua" ? "Рівень складності" : "Difficulty Level"}
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={selectedDifficulty === "all" ? "default" : "outline"}
            onClick={() => setSelectedDifficulty("all")}
            className="rounded-full"
          >
            {locale === "ua" ? "Всі рівні" : "All Levels"}
          </Button>
          {Object.entries(difficultyLevels).map(([key, difficulty]) => (
            <Badge
              key={key}
              variant={selectedDifficulty === key ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(key)}
              className={`
                cursor-pointer px-4 py-2 rounded-full transition-all duration-200
                ${selectedDifficulty === key 
                  ? `${difficulty.bgColor} ${difficulty.color} border-0` 
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {locale === "ua" ? difficulty.labelUkrainian : difficulty.label}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}