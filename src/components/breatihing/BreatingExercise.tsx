"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Clock, Users, Star, Play, Pause, RotateCcw, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { BreathingExercise, difficultyLevels } from "@/src/shared/config/breathing";

interface BreathingExerciseCardProps {
  exercise: BreathingExercise;
  onStart: (exercise: BreathingExercise) => void;
}

export default function BreathingExerciseCard({ exercise, onStart }: BreathingExerciseCardProps) {
  const { locale } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const difficultyConfig = difficultyLevels[exercise.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className={`
        relative overflow-hidden border-2 border-gray-200 
        hover:border-opacity-60 transition-all duration-300
        bg-white shadow-lg hover:shadow-xl
      `}>
        {/* Background gradient */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${exercise.bgGradient} 
          opacity-30 group-hover:opacity-50 transition-opacity duration-300
        `} />

        {/* Category indicator */}
        <div className="absolute top-3 right-3 z-10">
          <Heart className="h-5 w-5 text-blue-500" />
        </div>

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {locale === "ua" ? exercise.nameUkrainian : exercise.name}
              </CardTitle>
              <p className="text-sm text-slate-600 leading-relaxed">
                {locale === "ua" ? exercise.descriptionUkrainian : exercise.description}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge 
              variant="secondary" 
              className={`${difficultyConfig.bgColor} ${difficultyConfig.color} border-0`}
            >
              {locale === "ua" ? difficultyConfig.labelUkrainian : difficultyConfig.label}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              {exercise.duration} min
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          {/* Breathing pattern */}
          <div className="mb-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {locale === "ua" ? "Патерн дихання:" : "Breathing Pattern:"}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-semibold">{exercise.inhaleTime}s</span>
              <span className="text-gray-400">•</span>
              <span className="text-purple-600 font-semibold">{exercise.holdTime}s</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 font-semibold">{exercise.exhaleTime}s</span>
              {exercise.holdAfterExhale && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-orange-600 font-semibold">{exercise.holdAfterExhale}s</span>
                </>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {locale === "ua" ? "Переваги:" : "Benefits:"}
            </div>
            <div className="flex flex-wrap gap-1">
              {(locale === "ua" ? exercise.benefitsUkrainian : exercise.benefits).slice(0, 3).map((benefit, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-gray-200 text-gray-600 bg-white/60"
                >
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => onStart(exercise)}
              className={`
                w-full bg-gradient-to-r ${exercise.color} 
                hover:opacity-90 text-white shadow-lg
                border-0 rounded-xl py-3 font-semibold
                transition-all duration-300
              `}
            >
              <Play className="h-4 w-4 mr-2" />
              {locale === "ua" ? "Почати вправу" : "Start Exercise"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}