"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { Smile, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { useAuth } from "@/src/shared/stores/context/AuthContext";
import QuoteOfTheDay from "@/src/components/dashboard/QuoteOfTheDay";
import DashboardStats from "@/src/components/dashboard/DashboardStats";
import MoodTrendsChart from "@/src/components/dashboard/MoodTreadChart";
import RecentEmotions from "@/src/components/dashboard/RecentEmotion";

export default function Dashboard() {
  const { t, locale, isLoading } = useTranslation();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.p
            className="text-slate-600 font-medium text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {t("common.loading")}
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"
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
          className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"
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
        <div className="container mx-auto px-4 py-8 mt-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
          >
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              >
                {t("dashboard.title")}
              </motion.h1>
              <motion.p
                className="text-slate-600 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {locale === "ua"
                  ? `З поверненням${
                      user?.firstName ? `, ${user.firstName}` : ""
                    }! Давайте перевіримо ваш прогрес сьогодні.`
                  : `Welcome back${
                      user?.firstName ? `, ${user.firstName}` : ""
                    }! Let's check your progress today.`}
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/${locale}/mood-tracker`}>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25 px-6 py-3 rounded-xl">
                    <Smile className="h-5 w-5 mr-3" />
                    {t("dashboard.trackMood")}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/${locale}/mood/history`}>
                  <Button
                    variant="ghost"
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-6 py-3 rounded-xl"
                  >
                    <BarChart3 className="h-5 w-5 mr-3" />
                    {t("dashboard.history")}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/${locale}/profile`}>
                  <Button
                    variant="ghost"
                    className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-6 py-3 rounded-xl"
                  >
                    <User className="h-5 w-5 mr-3" />
                    {t("dashboard.profile")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Quote of the Day */}
          <div className="mb-12">
            <QuoteOfTheDay />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Charts Section */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <MoodTrendsChart />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <RecentEmotions />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
