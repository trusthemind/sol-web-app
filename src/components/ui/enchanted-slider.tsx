"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface EnhancedSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  moodColor?: string;
  glowEffect?: boolean;
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ className, moodColor = "white", glowEffect = true, ...props }, ref) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const progress = useMotionValue(0);
  const scale = useTransform(progress, [0, 100], [1, 1.1]);
  const glow = useTransform(progress, [0, 100], [0, 20]);

  React.useEffect(() => {
    if (props.value) {
      progress.set((props.value[0] / (props.max || 10)) * 100);
    }
  }, [props.value, props.max, progress]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      {...props}
    >
      {/* Enhanced Track */}
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full"
          style={{
            width: `${((props.value?.[0] || 0) / (props.max || 10)) * 100}%`,
            boxShadow: glowEffect
              ? `0 0 ${glow.get()}px rgba(255,255,255,0.6)`
              : undefined,
          }}
          animate={{
            boxShadow:
              isDragging && glowEffect
                ? `0 0 25px rgba(255,255,255,0.8), 0 0 50px rgba(255,255,255,0.4)`
                : `0 0 10px rgba(255,255,255,0.3)`,
          }}
          transition={{ duration: 0.2 }}
        />

        {glowEffect && (
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/80 rounded-full"
                style={{
                  left: `${
                    ((props.value?.[0] || 0) / (props.max || 10)) * 100
                  }%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                animate={{
                  x: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        )}
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb asChild>
        <motion.div
          className="block h-6 w-6 rounded-full border-2 border-white bg-white/90 shadow-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing backdrop-blur-sm"
          style={{ scale }}
          animate={{
            scale: isDragging ? 1.3 : 1,
            boxShadow: isDragging
              ? "0 0 20px rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.3)"
              : "0 2px 10px rgba(0,0,0,0.2)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Thumb Glow Effect */}
          {glowEffect && (
            <motion.div
              className="absolute inset-0 rounded-full bg-white/40"
              animate={{
                scale: isDragging ? [1, 1.5, 1] : 1,
                opacity: isDragging ? [0.4, 0.8, 0.4] : 0.4,
              }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
          )}
        </motion.div>
      </SliderPrimitive.Thumb>

      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium text-white border border-white/30"
        style={{
          left: `${((props.value?.[0] || 0) / (props.max || 10)) * 100}%`,
        }}
        animate={{
          opacity: isDragging ? 1 : 0,
          y: isDragging ? 0 : 10,
          scale: isDragging ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        {props.value?.[0] || 0}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/20" />
      </motion.div>
    </SliderPrimitive.Root>
  );
});

EnhancedSlider.displayName = "EnhancedSlider";

export { EnhancedSlider };
