"use client";

import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  locale: string;
  title: string;
  subtitle: string;
}

export function ProfileHeader({ locale, title, subtitle }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div className="flex items-center space-x-4">
        <Link href={`/${locale}/dashboard`}>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
