"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { BreathingExercise } from "@/src/shared/config/breathing";

interface BreathingTimerProps {
  exercise: BreathingExercise;
  onClose: () => void;
}

type BreathingPhase = "inhale" | "hold" | "exhale" | "holdAfterExhale";

export default function BreathingTimer({ exercise, onClose }: BreathingTimerProps) {
  const { locale } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [timeLeft, setTimeLeft] = useState(exercise.inhaleTime);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = {
    inhale: {
      duration: exercise.inhaleTime,
      next: "hold" as BreathingPhase,
      label: locale === "ua" ? "Вдих" : "Inhale",
      color: "from-blue-400 to-cyan-500",
      instruction: locale === "ua" ? "Повільно вдихайте" : "Breathe in slowly"
    },
    hold: {
      duration: exercise.holdTime,
      next: "exhale" as BreathingPhase,
      label: locale === "ua" ? "Затримка" : "Hold",
      color: "from-purple-400 to-indigo-500", 
      instruction: locale === "ua" ? "Затримайте дихання" : "Hold your breath"
    },
    exhale: {
      duration: exercise.exhaleTime,
      next: exercise.holdAfterExhale ? "holdAfterExhale" : "inhale" as BreathingPhase,
      label: locale === "ua" ? "Видих" : "Exhale",
      color: "from-green-400 to-emerald-500",
      instruction: locale === "ua" ? "Повільно видихайте" : "Breathe out slowly"
    },
    holdAfterExhale: {
      duration: exercise.holdAfterExhale || 0,
      next: "inhale" as BreathingPhase,
      label: locale === "ua" ? "Пауза" : "Pause",
      color: "from-orange-400 to-yellow-500",
      instruction: locale === "ua" ? "Затримайтеся на порожніх легенях" : "Hold on empty lungs"
    }
  };

  // Handle clicking outside modal
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  useEffect(() => {
    if (isActive && timeLeft > 0 && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const currentPhaseConfig = phases[currentPhase];
            const nextPhase = currentPhaseConfig.next;
            
            // Check if we completed a full cycle (reached inhale again)
            if (nextPhase === "inhale") {
              const newCycle = currentCycle + 1;
              setCurrentCycle(newCycle);
              
              // Check if we've completed all cycles
              if (newCycle > exercise.cycles) {
                setIsCompleted(true);
                setIsActive(false);
                return 0;
              }
            }
            
            setCurrentPhase(nextPhase);
            return phases[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentPhase, currentCycle, exercise.cycles, isCompleted]);

  useEffect(() => {
    const totalTime = phases[currentPhase].duration;
    setProgress(((totalTime - timeLeft) / totalTime) * 100);
  }, [timeLeft, currentPhase]);

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(exercise.inhaleTime);
    setCurrentCycle(1);
    setProgress(0);
    setIsCompleted(false);
  };

  const currentPhaseConfig = phases[currentPhase];
  const circleSize = 300;
  const strokeWidth = 8;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          {/* Background gradient */}
          <div className={`
            absolute inset-0 bg-gradient-to-br ${currentPhaseConfig.color} 
            opacity-20 transition-all duration-1000
          `} />

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="relative z-10 p-8 text-center">
            {/* Exercise title */}
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {locale === "ua" ? exercise.nameUkrainian : exercise.name}
            </h2>

            {/* Cycle counter */}
            <div className="text-sm text-slate-600 mb-8">
              {locale === "ua" ? "Цикл" : "Cycle"} {currentCycle} / {exercise.cycles}
            </div>

            {/* Breathing circle */}
            <div className="relative flex items-center justify-center mb-8">
              <svg
                width={circleSize}
                height={circleSize}
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <motion.circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  className={`text-blue-500`}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: circumference - (progress / 100) * circumference,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={currentPhase}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    {timeLeft}
                  </div>
                  <div className="text-lg font-semibold text-slate-600">
                    {currentPhaseConfig.label}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Instruction */}
            <motion.div
              key={currentPhaseConfig.instruction}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-700 mb-8 text-lg font-medium"
            >
              {currentPhaseConfig.instruction}
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                className="rounded-full w-12 h-12 border-2"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => setIsActive(!isActive)}
                size="lg"
                disabled={isCompleted}
                className={`
                  rounded-full w-16 h-16 bg-gradient-to-r ${currentPhaseConfig.color}
                  hover:opacity-90 text-white shadow-lg border-0
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isActive ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>

            {/* Exercise complete message */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
                >
                  <div className="text-green-800 font-semibold mb-1">
                    🎉 {locale === "ua" ? "Вітаємо!" : "Congratulations!"}
                  </div>
                  <div className="text-green-700 text-sm">
                    {locale === "ua" 
                      ? "Ви успішно завершили дихальну вправу!" 
                      : "You've successfully completed the breathing exercise!"}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}