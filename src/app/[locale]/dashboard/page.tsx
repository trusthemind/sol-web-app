"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Sun,
  Calendar,
  Heart,
  TrendingUp,
  Users,
  User,
  Smile,
  Target,
  Clock,
  Brain,
  Sparkles,
  Zap,
  Moon,
  Coffee,
  BookOpen,
  Award,
  ChevronRight,
  Plus,
  Filter,
  BarChart3,
  Eye,
  Flame,
  Waves,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useTranslation } from "@/src/shared/hooks/useTranslation";
import { useAuth } from "@/src/shared/stores/context/AuthContext";

const moodData = [
  { day: "Mon", mood: 7, energy: 6, stress: 4 },
  { day: "Tue", mood: 8, energy: 7, stress: 3 },
  { day: "Wed", mood: 6, energy: 5, stress: 6 },
  { day: "Thu", mood: 9, energy: 8, stress: 2 },
  { day: "Fri", mood: 7, energy: 7, stress: 4 },
  { day: "Sat", mood: 8, energy: 9, stress: 2 },
  { day: "Sun", mood: 9, energy: 8, stress: 1 },
];

const achievements = [
  {
    id: 1,
    title: "Meditation Master",
    description: "Complete 7 meditation sessions",
    progress: 85,
    icon: Brain,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: 2,
    title: "Mood Tracker",
    description: "Log mood for 30 days straight",
    progress: 67,
    icon: Heart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 3,
    title: "Wellness Warrior",
    description: "Complete all daily goals",
    progress: 92,
    icon: Award,
    color: "from-amber-500 to-orange-500",
  },
];

export default function Dashboard() {
  const { t, locale, isLoading } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("mood");
  const { user } = useAuth();

  // Localized day abbreviations
  const localizedDayData = moodData.map((item) => ({
    ...item,
    day:
      locale === "ua"
        ? {
            Mon: "Пн",
            Tue: "Вт",
            Wed: "Ср",
            Thu: "Чт",
            Fri: "Пт",
            Sat: "Сб",
            Sun: "Нд",
          }[item.day] || item.day
        : item.day,
  }));

  const weeklyGoals = [
    {
      name: t("dashboard.goals.meditation"),
      completed: 5,
      total: 7,
      color: "from-blue-500 to-indigo-500",
      icon: Brain,
    },
    {
      name: t("dashboard.goals.exercise"),
      completed: 4,
      total: 5,
      color: "from-emerald-500 to-green-500",
      icon: Activity,
    },
    {
      name: t("dashboard.goals.journaling"),
      completed: 6,
      total: 7,
      color: "from-purple-500 to-violet-500",
      icon: BookOpen,
    },
    {
      name: t("dashboard.goals.sleep"),
      completed: 4,
      total: 7,
      color: "from-indigo-500 to-blue-500",
      icon: Moon,
    },
  ];

  const recentActivities = [
    {
      activity: t("dashboard.activities.meditation"),
      time: `2 ${t("dashboard.activities.hoursAgo")}`,
      type: "meditation",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      activity: t("dashboard.activities.mood"),
      time: `4 ${t("dashboard.activities.hoursAgo")}`,
      type: "mood",
      icon: Heart,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      activity: t("dashboard.activities.breathing"),
      time: `1 ${t("dashboard.activities.dayAgo")}`,
      type: "breathing",
      icon: Waves,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      activity: t("dashboard.activities.journal"),
      time: `2 ${t("dashboard.activities.daysAgo")}`,
      type: "journal",
      icon: BookOpen,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  // Localized metric labels
  const getMetricLabel = (metric: string) => {
    const labels = {
      mood: locale === "ua" ? "Настрій" : "Mood",
      energy: locale === "ua" ? "Енергія" : "Energy",
      stress: locale === "ua" ? "Стрес" : "Stress",
    };
    return labels[metric as keyof typeof labels] || metric;
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0, 1],
      },
    },
  };

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
              <motion.div
                className="flex items-center mt-3 gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-500">
                  {locale === "ua"
                    ? "У вас 12-денна серія!"
                    : "You're on a 12-day streak!"}
                </span>
              </motion.div>
            </div>
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              {
                title: t("dashboard.currentMood"),
                value: t("dashboard.great"),
                change: locale === "ua" ? "+2 від вчора" : "+2 from yesterday",
                icon: Heart,
                color: "from-emerald-500 to-green-500",
                bgColor: "from-emerald-50 to-green-50",
              },
              {
                title: t("dashboard.weeklyAverage"),
                value: "7.6/10",
                change:
                  locale === "ua"
                    ? "+0.8 від минулого тижня"
                    : "+0.8 from last week",
                icon: TrendingUp,
                color: "from-blue-500 to-indigo-500",
                bgColor: "from-blue-50 to-indigo-50",
              },
              {
                title: t("dashboard.streak"),
                value: `12 ${t("dashboard.days")}`,
                change: t("dashboard.keepItUp"),
                icon: Flame,
                color: "from-amber-500 to-orange-500",
                bgColor: "from-amber-50 to-orange-50",
              },
              {
                title: t("dashboard.nextSession"),
                value: t("dashboard.tomorrow"),
                change:
                  locale === "ua" ? "Др. Сміт о 14:00" : "Dr. Smith at 2:00 PM",
                icon: Calendar,
                color: "from-purple-500 to-violet-500",
                bgColor: "from-purple-50 to-violet-50",
              },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${stat.bgColor} shadow-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <stat.icon
                          className={`h-6 w-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        />
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-medium mb-2">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-slate-800 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Enhanced Mood Trends */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 20,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <BarChart3 className="h-6 w-6 text-blue-500" />
                          </motion.div>
                          {t("dashboard.moodEnergyTrends")}
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-base mt-2">
                          {t("dashboard.emotionalPatterns")}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {["mood", "energy", "stress"].map((metric) => (
                          <motion.button
                            key={metric}
                            onClick={() => setSelectedMetric(metric)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                              selectedMetric === metric
                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {getMetricLabel(metric)}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={localizedDayData}>
                        <defs>
                          <linearGradient
                            id="moodGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3B82F6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="energyGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10B981"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10B981"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="stressGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#F59E0B"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#F59E0B"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="day" stroke="#64748B" fontSize={12} />
                        <YAxis
                          domain={[0, 10]}
                          stroke="#64748B"
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            borderColor: "#E2E8F0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                          }}
                          labelStyle={{ color: "#1E293B", fontWeight: "600" }}
                          formatter={(value, name) => [
                            value,
                            getMetricLabel(name as string),
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="mood"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          fill="url(#moodGradient)"
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                          name="mood"
                        />
                        <Area
                          type="monotone"
                          dataKey="energy"
                          stroke="#10B981"
                          strokeWidth={3}
                          fill="url(#energyGradient)"
                          dot={{ fill: "#10B981", strokeWidth: 2, r: 5 }}
                          name="energy"
                        />
                        <Area
                          type="monotone"
                          dataKey="stress"
                          stroke="#F59E0B"
                          strokeWidth={3}
                          fill="url(#stressGradient)"
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 5 }}
                          name="stress"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Recent Activities */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-800 flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Activity className="h-6 w-6 text-blue-500" />
                      </motion.div>
                      {t("dashboard.recentActivities")}
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base">
                      {t("dashboard.latestActivities")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 10 }}
                          className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 hover:bg-white/80 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                          <motion.div
                            className={`p-3 rounded-2xl ${item.bgColor} ${item.color} shadow-sm`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {item.activity}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {item.time}
                            </p>
                          </div>
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Eye className="h-4 w-4 text-slate-400" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-8">
              {/* Enhanced Weekly Goals */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl text-slate-800">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <Target className="h-6 w-6 mr-3 text-blue-500" />
                      </motion.div>
                      {t("dashboard.weeklyGoals")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {weeklyGoals.map((goal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="space-y-3 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100 hover:shadow-md transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl bg-gradient-to-r ${goal.color} shadow-sm`}
                            >
                              <goal.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                              {goal.name}
                            </span>
                          </div>
                          <span className="text-sm text-slate-500 font-medium">
                            {goal.completed}/{goal.total}
                          </span>
                        </div>
                        <div className="relative">
                          <Progress
                            value={(goal.completed / goal.total) * 100}
                            className="h-3 bg-slate-200 rounded-full overflow-hidden"
                          />
                          <motion.div
                            className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${goal.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(goal.completed / goal.total) * 100}%`,
                            }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Achievements */}
              <motion.div variants={itemVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Award className="h-6 w-6 text-amber-500" />
                      </motion.div>
                      {locale === "ua" ? "Досягнення" : "Achievements"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-2xl bg-gradient-to-r from-white/60 to-blue-50/60 border border-slate-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-r ${achievement.color} shadow-sm`}
                          >
                            <achievement.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {locale === "ua"
                                ? {
                                    "Meditation Master": "Майстер медитації",
                                    "Mood Tracker": "Трекер настрою",
                                    "Wellness Warrior": "Воїн здоров'я",
                                  }[achievement.title] || achievement.title
                                : achievement.title}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {locale === "ua"
                                ? {
                                    "Complete 7 meditation sessions":
                                      "Завершіть 7 сесій медитації",
                                    "Log mood for 30 days straight":
                                      "Відстежуйте настрій протягом 30 днів поспіль",
                                    "Complete all daily goals":
                                      "Виконайте всі щоденні цілі",
                                  }[achievement.description] ||
                                  achievement.description
                                : achievement.description}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-2 bg-gradient-to-r ${achievement.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${achievement.progress}%` }}
                              transition={{ duration: 1.5, delay: index * 0.2 }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 mt-1 block text-right">
                            {achievement.progress}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
