"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EnhancedSlider } from "@/components/ui/enchanted-slider";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { getMoodAnimation } from "@/src/utils/getMoodAnimation";
import { EmotionStore } from "@/src/shared/stores/emotion.store";

interface MoodStepOneProps {
  selectedMood: any;
  onNext: () => void;
}

export default function MoodStepOne({ selectedMood, onNext }: MoodStepOneProps) {
  const { t } = useTranslation();
  const { selectedOverallNumber, setSelectedOverallNumber } = EmotionStore();

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Animated Mood Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="flex justify-center mb-8"
      >
        <motion.div
          className="p-8 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl border border-white/30"
          {...getMoodAnimation(selectedMood.animation)}
          whileHover={{ scale: 1.05, rotate: 5 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,255,255,0.3)",
              "0 0 40px rgba(255,255,255,0.5)",
              "0 0 20px rgba(255,255,255,0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <selectedMood.icon className="h-16 w-16 text-white" />
        </motion.div>
      </motion.div>

      {/* Mood Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-semibold mb-3"
      >
        {selectedMood.name}
      </motion.h2>

      {/* Mood Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-lg mb-8 opacity-90 leading-relaxed"
      >
        {selectedMood.description}
      </motion.p>

      {/* Intensity Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm font-medium opacity-90"
          >
            {t("moodTracker.intensityQuestion")}
          </motion.p>
          
          {/* Slider with Labels */}
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-75">
              {t("moodTracker.mild")}
            </span>
            <div className="flex-1 px-2">
              <EnhancedSlider
                value={[selectedOverallNumber]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) =>
                  setSelectedOverallNumber(value[0])
                }
                moodColor={selectedMood.primaryColor}
                glowEffect={true}
                className="w-full"
              />
            </div>
            <span className="text-sm opacity-75">
              {t("moodTracker.strong")}
            </span>
          </div>
          
          {/* Intensity Display */}
          <motion.div
            className="text-center font-semibold text-2xl mt-3"
            animate={{
              scale: [1, 1.1, 1],
              color: [
                selectedMood.primaryColor,
                "#ffffff",
                selectedMood.primaryColor,
              ],
            }}
            transition={{ duration: 0.3 }}
            key={selectedOverallNumber}
          >
            {selectedOverallNumber}/10
          </motion.div>
        </div>

        {/* Continue Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onNext}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full py-3 rounded-xl backdrop-blur-sm transition-all duration-200 shadow-lg"
          >
            <motion.span className="flex items-center">
              {t("moodTracker.continue")}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <ChevronDown className="ml-2 h-4 w-4" />
              </motion.div>
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}