"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

export default function MoodHistoryHeader() {
  const { locale } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center space-x-4">
        <Link href={`/${locale}/mood-tracker`}>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4 text-gray-700" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === "ua" ? "Історія настрою" : "Mood History"}
          </h1>
          <p className="text-gray-600">
            {locale === "ua" ? "Відстежуйте свій емоційний шлях у часі" : "Track your emotional journey over time"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

