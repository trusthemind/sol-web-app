import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";

export const RecommendationCard = ({
    title,
    items,
    icon: Icon,
    color,
    delay,
  }: {
    title: string;
    items: string[];
    icon: any;
    color: string;
    delay: number;
  }) => {
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const toggleItem = (index: number) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      setExpandedItems(newExpanded);
    };
  
    if (items.length === 0) return null;
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className={cn(
          "p-5 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:shadow-lg",
          color
        )}
      >
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.1 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
            className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <motion.span
            className="text-sm text-white/70 bg-white/20 px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
          >
            {items.length}
          </motion.span>
        </motion.div>
  
        <div className="space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 + index * 0.1 }}
              className="group"
            >
              <motion.div
                onClick={() => toggleItem(index)}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 cursor-pointer border border-white/10 hover:border-white/30"
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="mt-1 w-2 h-2 rounded-full bg-white/70 flex-shrink-0"
                  animate={{
                    scale: expandedItems.has(index) ? [1, 1.3, 1] : 1,
                    backgroundColor: expandedItems.has(index)
                      ? "#22c55e"
                      : "rgba(255,255,255,0.7)",
                  }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-white/90 group-hover:text-white transition-colors">
                    {item}
                  </p>
                  {expandedItems.has(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 flex items-center gap-2 text-xs text-green-300"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Додано до плану дій
                    </motion.div>
                  )}
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 text-white/50 group-hover:text-white/80 transition-all duration-200",
                    expandedItems.has(index) && "rotate-90 text-green-400"
                  )}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };