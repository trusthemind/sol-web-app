import clsx from "clsx";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "../shared/hooks/useTranslation";

const floatingIconVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const AuthHeader: React.FC<{ itemVariants: any }> = ({
  itemVariants,
}) => {
  const { t } = useTranslation();

  useEffect(() => {}, [t]);

  return (
    <motion.div variants={itemVariants} className="text-center mb-12">
      <motion.div
        className="flex items-center justify-center mb-6"
        variants={floatingIconVariants}
        animate="animate"
      >
        <div className="relative">
          <Brain className={clsx("h-16 w-16 text-blue-400 mr-3")} />
          <motion.div
            className={clsx(
              "absolute -top-1 -right-1 w-4 h-4 rounded-full",
              "bg-gradient-to-r from-blue-500 to-indigo-500"
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </div>
        <h1
          className={clsx(
            "text-6xl font-bold bg-clip-text text-transparent",
            "bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500"
          )}
        >
          Sol
        </h1>
        <Sparkles className="h-8 w-8 text-blue-400 ml-3" />
      </motion.div>
      <motion.p
        className={clsx(
          "text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
        )}
        variants={itemVariants}
      >
        {t("auth.subtitle")}
      </motion.p>
    </motion.div>
  );
};
