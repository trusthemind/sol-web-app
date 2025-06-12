"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedSlider } from "@/components/ui/enchanted-slider";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  Save,
  Smile,
  Frown,
  Meh,
  Heart,
  Zap,
  Sun,
  Moon,
  Briefcase,
  Users,
  Activity,
  DollarSign,
  Smartphone,
  Newspaper,
  Cloud,
  Bed,
  Dumbbell,
  Utensils,
  Home,
  Sparkles,
  Target,
  CheckCircle,
  Waves,
  Wind,
  Flame,
  Snowflake,
  Star,
  CloudRain,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function MoodTracker() {
  const { t, locale, isLoading } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [step, setStep] = useState(1);
  const [isBreathing, setIsBreathing] = useState(false);
  const [stepTransition, setStepTransition] = useState(false);
  const breathCircleRef = useRef<HTMLDivElement>(null);
  const breathingControls = useAnimation();

  const moods = [
    {
      id: 1,
      name: t("moodTracker.moods.joyful.name"),
      icon: Sun,
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500",
      lightBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
      description: "Feeling energetic, happy, and full of life",
      suggestedActivities: [
        "Take a walk in nature",
        "Call a friend or loved one",
        "Listen to upbeat music",
        "Dance or move your body",
      ],
      breathingPattern: "normal",
      affirmation: "I embrace the joy in my life and share it with others.",
      particles: "sunshine",
      animation: "bounce",
      primaryColor: "#F59E0B",
      secondaryColor: "#FDE68A",
      effectIcon: Star,
    },
    {
      id: 2,
      name: t("moodTracker.moods.content.name"),
      icon: Heart,
      color: "from-green-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-green-400 via-emerald-400 to-blue-500",
      lightBg: "bg-green-50",
      iconColor: "text-green-500",
      description: "Peaceful, satisfied, and at ease with yourself",
      suggestedActivities: [
        "Practice meditation",
        "Read a good book",
        "Write in a gratitude journal",
        "Enjoy a warm cup of tea",
      ],
      breathingPattern: "calm",
      affirmation: "I am at peace with myself and my surroundings.",
      particles: "gentle",
      animation: "float",
      primaryColor: "#10B981",
      secondaryColor: "#A7F3D0",
      effectIcon: Waves,
    },
    {
      id: 3,
      name: t("moodTracker.moods.neutral.name"),
      icon: Meh,
      color: "from-gray-400 to-gray-600",
      bgColor: "bg-gradient-to-br from-gray-400 via-slate-400 to-gray-600",
      lightBg: "bg-gray-50",
      iconColor: "text-gray-500",
      description: "Feeling balanced, neither particularly good nor bad",
      suggestedActivities: [
        "Practice mindfulness",
        "Do light stretching",
        "Journal your thoughts",
        "Take a mindful walk",
      ],
      breathingPattern: "normal",
      affirmation:
        "I accept my current state and remain open to what comes next.",
      particles: "minimal",
      animation: "steady",
      primaryColor: "#6B7280",
      secondaryColor: "#D1D5DB",
      effectIcon: Wind,
    },
    {
      id: 4,
      name: t("moodTracker.moods.anxious.name"),
      icon: Zap,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-400 via-red-400 to-red-500",
      lightBg: "bg-orange-50",
      iconColor: "text-orange-500",
      description: "Feeling worried, stressed, or overwhelmed",
      suggestedActivities: [
        "Practice deep breathing",
        "Try progressive muscle relaxation",
        "Use grounding techniques",
        "Listen to calming music",
      ],
      breathingPattern: "calming",
      affirmation:
        "This feeling is temporary. I am safe and I can handle this moment.",
      particles: "electric",
      animation: "pulse",
      primaryColor: "#F97316",
      secondaryColor: "#FDBA74",
      effectIcon: Zap,
    },
    {
      id: 5,
      name: t("moodTracker.moods.sad.name"),
      icon: Frown,
      color: "from-blue-400 to-purple-600",
      bgColor: "bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-500",
      description: "Feeling down, melancholy, or emotionally low",
      suggestedActivities: [
        "Practice self-care",
        "Gentle movement or yoga",
        "Talk to someone you trust",
        "Watch something comforting",
      ],
      breathingPattern: "deep",
      affirmation:
        "It's okay to feel sad. My emotions are valid and will pass with time.",
      particles: "rain",
      animation: "drift",
      primaryColor: "#3B82F6",
      secondaryColor: "#93C5FD",
      effectIcon: CloudRain,
    },
    {
      id: 6,
      name: t("moodTracker.moods.angry.name"),
      icon: Zap,
      color: "from-red-500 to-pink-600",
      bgColor: "bg-gradient-to-br from-red-500 via-rose-500 to-pink-600",
      lightBg: "bg-red-50",
      iconColor: "text-red-500",
      description: "Feeling frustrated, irritated, or mad",
      suggestedActivities: [
        "Physical exercise",
        "Write out your feelings",
        "Count to ten slowly",
        "Take a cold shower",
      ],
      breathingPattern: "releasing",
      affirmation:
        "I acknowledge my anger and choose how to respond to it constructively.",
      particles: "fire",
      animation: "shake",
      primaryColor: "#EF4444",
      secondaryColor: "#FCA5A5",
      effectIcon: Flame,
    },
    {
      id: 7,
      name: t("moodTracker.moods.excited.name"),
      icon: Smile,
      color: "from-yellow-300 to-pink-500",
      bgColor: "bg-gradient-to-br from-yellow-300 via-pink-400 to-pink-500",
      lightBg: "bg-pink-50",
      iconColor: "text-pink-500",
      description: "Feeling enthusiastic, eager, and full of anticipation",
      suggestedActivities: [
        "Channel energy into creativity",
        "Share your excitement with others",
        "Plan your next steps",
        "Start a new project",
      ],
      breathingPattern: "energizing",
      affirmation: "I embrace this positive energy and direct it purposefully.",
      particles: "sparkle",
      animation: "vibrate",
      primaryColor: "#EC4899",
      secondaryColor: "#F9A8D4",
      effectIcon: Sparkles,
    },
    {
      id: 8,
      name: t("moodTracker.moods.tired.name"),
      icon: Moon,
      color: "from-indigo-400 to-blue-700",
      bgColor: "bg-gradient-to-br from-indigo-400 via-blue-500 to-blue-700",
      lightBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      description: "Feeling fatigued, exhausted, or low on energy",
      suggestedActivities: [
        "Take a short nap",
        "Gentle stretching",
        "Prioritize rest and recovery",
        "Practice relaxation techniques",
      ],
      breathingPattern: "restful",
      affirmation: "I honor my body's need for rest and recovery.",
      particles: "dreamy",
      animation: "slow",
      primaryColor: "#6366F1",
      secondaryColor: "#C7D2FE",
      effectIcon: Snowflake,
    },
  ];

  const emotionTriggers = [
    {
      label: t("moodTracker.triggers.work"),
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      category: "external",
    },
    {
      label: t("moodTracker.triggers.relationships"),
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50",
      category: "social",
    },
    {
      label: t("moodTracker.triggers.health"),
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-50",
      category: "physical",
    },
    {
      label: t("moodTracker.triggers.finances"),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      category: "external",
    },
    {
      label: t("moodTracker.triggers.socialMedia"),
      icon: Smartphone,
      color: "text-purple-600",
      bg: "bg-purple-50",
      category: "digital",
    },
    {
      label: t("moodTracker.triggers.news"),
      icon: Newspaper,
      color: "text-orange-600",
      bg: "bg-orange-50",
      category: "digital",
    },
    {
      label: t("moodTracker.triggers.weather"),
      icon: Cloud,
      color: "text-sky-600",
      bg: "bg-sky-50",
      category: "environmental",
    },
    {
      label: t("moodTracker.triggers.sleep"),
      icon: Bed,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      category: "physical",
    },
    {
      label: t("moodTracker.triggers.exercise"),
      icon: Dumbbell,
      color: "text-red-600",
      bg: "bg-red-50",
      category: "physical",
    },
    {
      label: t("moodTracker.triggers.food"),
      icon: Utensils,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      category: "physical",
    },
    {
      label: t("moodTracker.triggers.family"),
      icon: Home,
      color: "text-teal-600",
      bg: "bg-teal-50",
      category: "social",
    },
    {
      label: t("moodTracker.triggers.friends"),
      icon: Users,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      category: "social",
    },
  ];

  // Mock history data
  const moodHistory = [
    {
      date: `${t("moodTracker.history.today")}, 9:30 AM`,
      mood: t("moodTracker.moods.content.name"),
      intensity: 7,
      icon: Heart,
      color: "text-green-500",
    },
    {
      date: `${t("moodTracker.history.yesterday")}, 2:15 PM`,
      mood: t("moodTracker.moods.anxious.name"),
      intensity: 6,
      icon: Zap,
      color: "text-orange-500",
    },
    {
      date: `${t("moodTracker.history.yesterday")}, 8:45 AM`,
      mood: t("moodTracker.moods.joyful.name"),
      intensity: 8,
      icon: Sun,
      color: "text-yellow-500",
    },
    {
      date: `2 ${t("moodTracker.history.daysAgo")}`,
      mood: t("moodTracker.moods.sad.name"),
      intensity: 4,
      icon: Frown,
      color: "text-blue-500",
    },
  ];

  const handleMoodSelect = (mood: any) => {
    setSelectedMood(mood);
    setIsAnimating(true);
    setStep(1);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedMood(null);
      setIntensity(5);
      setNote("");
      setSelectedTriggers([]);
      setStep(1);
      setIsBreathing(false);
      setStepTransition(false);
    }, 300);
  };

  const handleSave = () => {
    // Save mood logic here
    setTimeout(() => {
      window.location.href = `/${locale}/dashboard`;
    }, 1000);
  };

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter((t) => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const nextStep = () => {
    setStepTransition(true);
    setTimeout(() => {
      setStep(step + 1);
      setStepTransition(false);
    }, 200);
  };

  const prevStep = () => {
    setStepTransition(true);
    setTimeout(() => {
      setStep(step - 1);
      setStepTransition(false);
    }, 200);
  };

  // Enhanced breathing animation
  useEffect(() => {
    if (isBreathing && selectedMood) {
      const pattern = selectedMood.breathingPattern;

      const breathingSequence = async () => {
        // Inhale
        await breathingControls.start({
          scale: 1.8,
          opacity: [0.6, 1],
          transition: {
            duration: pattern === "calming" ? 4 : pattern === "deep" ? 5 : 3,
            ease: "easeInOut",
          },
        });

        // Hold if needed
        if (pattern === "calming" || pattern === "deep") {
          await breathingControls.start({
            scale: 1.8,
            transition: { duration: pattern === "deep" ? 2 : 1 },
          });
        }

        // Exhale
        await breathingControls.start({
          scale: 1,
          opacity: [1, 0.6],
          transition: {
            duration: pattern === "releasing" ? 5 : pattern === "deep" ? 6 : 4,
            ease: "easeInOut",
          },
        });

        // Hold if needed
        if (pattern === "releasing") {
          await breathingControls.start({
            scale: 1,
            transition: { duration: 1 },
          });
        }
      };

      const interval = setInterval(
        () => {
          breathingSequence();
        },
        pattern === "deep" ? 14000 : pattern === "calming" ? 10000 : 8000
      );

      breathingSequence();

      return () => clearInterval(interval);
    }
  }, [isBreathing, selectedMood, breathingControls]);

  // Dynamic background animation component
  const DynamicBackground = ({ mood }: { mood: any }) => {
    const getParticleAnimation = (type: string) => {
      switch (type) {
        case "sunshine":
          return {
            animate: {
              y: [-20, -40, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            },
            transition: {
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        case "gentle":
          return {
            animate: {
              y: [-10, -30, -10],
              opacity: [0.3, 0.8, 0.3],
            },
            transition: {
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        case "electric":
          return {
            animate: {
              x: [-5, 5, -5],
              y: [-5, 5, -5],
              scale: [0.8, 1.2, 0.8],
            },
            transition: {
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        case "rain":
          return {
            animate: {
              y: [0, window.innerHeight + 50],
              x: [-20, 20],
            },
            transition: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          };
        case "fire":
          return {
            animate: {
              y: [-30, -60, -30],
              x: [-15, 15, -15],
              scale: [0.8, 1.3, 0.8],
              rotate: [-10, 10, -10],
            },
            transition: {
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        case "sparkle":
          return {
            animate: {
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            },
            transition: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        case "dreamy":
          return {
            animate: {
              y: [-50, -100, -50],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            },
            transition: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          };
        default:
          return {
            animate: { y: [-20, -40, -20] },
            transition: { duration: 4, repeat: Number.POSITIVE_INFINITY },
          };
      }
    };

    const particleCount =
      mood.particles === "minimal"
        ? 8
        : mood.particles === "electric"
        ? 25
        : 15;
    const animation = getParticleAnimation(mood.particles);

    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 ${mood.bgColor} opacity-90`}
          animate={{
            opacity: [0.85, 0.95, 0.85],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Dynamic Particles */}
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            {...animation}
            transition={{
              ...animation.transition,
              delay: i * 0.1,
            }}
          >
            <mood.effectIcon
              className="text-white/30"
              size={Math.random() * 20 + 10}
            />
          </motion.div>
        ))}

        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Mood-specific animation variants
  const getMoodAnimation = (animationType: string) => {
    switch (animationType) {
      case "bounce":
        return {
          animate: { y: [0, -10, 0] },
          transition: { duration: 0.6, repeat: Number.POSITIVE_INFINITY },
        };
      case "float":
        return {
          animate: { y: [0, -5, 0], x: [0, 2, 0] },
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        };
      case "pulse":
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
        };
      case "shake":
        return {
          animate: { x: [0, -2, 2, 0] },
          transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
        };
      case "vibrate":
        return {
          animate: { x: [0, -1, 1, 0], y: [0, -1, 1, 0] },
          transition: { duration: 0.1, repeat: Number.POSITIVE_INFINITY },
        };
      case "drift":
        return {
          animate: { x: [0, -3, 3, 0], y: [0, -2, 2, 0] },
          transition: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        };
      case "slow":
        return {
          animate: { scale: [1, 1.02, 1] },
          transition: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        };
      default:
        return {
          animate: { scale: [1, 1.02, 1] },
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white border-b border-gray-100"
      >
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {t("moodTracker.title")}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t("moodTracker.subtitle")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
            >
              <Clock className="h-4 w-4" />
              {showHistory
                ? t("moodTracker.hideHistory")
                : t("moodTracker.showHistory")}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Mood History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mb-8 overflow-hidden"
            >
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="p-6">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-semibold mb-4 flex items-center text-gray-900"
                  >
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    {t("moodTracker.recentEntries")}
                  </motion.h3>
                  <div className="space-y-3">
                    {moodHistory.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`p-2 rounded-full bg-white ${entry.color}`}
                          >
                            <entry.icon className="h-5 w-5" />
                          </motion.div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {entry.mood}
                            </p>
                            <p className="text-sm text-gray-500">
                              {entry.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-700">
                            {t("moodTracker.intensity")}: {entry.intensity}/10
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            {t("moodTracker.view")}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Mood Grid */}
        <AnimatePresence>
          {!selectedMood && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {moods.map((mood, index) => {
                  const moodAnimation = getMoodAnimation(mood.animation);
                  return (
                    <motion.div
                      key={mood.id}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className="cursor-pointer transition-all duration-300 hover:shadow-xl border-0 bg-white h-full group overflow-hidden relative"
                        onClick={() => handleMoodSelect(mood)}
                      >
                        <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full relative z-10">
                          <motion.div
                            className={`p-4 rounded-2xl ${mood.lightBg} mb-4 transition-all duration-300`}
                            {...moodAnimation}
                            whileHover={{ scale: 1.15, rotate: 5 }}
                          >
                            <mood.icon
                              className={`h-8 w-8 ${mood.iconColor}`}
                            />
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2 text-gray-900">
                            {mood.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {mood.description}
                          </p>
                        </CardContent>
                        {/* Enhanced hover effect overlay */}
                        <motion.div
                          className={`absolute inset-0 ${mood.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        />
                        <motion.div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Full Screen Mood Display */}
      <AnimatePresence>
        {selectedMood && (
          <>
            {/* Dynamic Animated Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-20"
            >
              <DynamicBackground mood={selectedMood} />
              <div className="absolute inset-0 backdrop-blur-sm bg-black/10" />
            </motion.div>

            {/* Enhanced Animated Mood Block */}
            <motion.div
              initial={{
                y: "100vh",
                scale: 0.3,
                opacity: 0,
                rotateX: 45,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
                rotateX: 0,
              }}
              exit={{
                y: "100vh",
                scale: 0.3,
                opacity: 0,
                rotateX: 45,
              }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                duration: 1,
              }}
              className="fixed inset-0 z-30 flex items-center justify-center"
            >
              <div className="text-center text-white p-6 w-full max-w-lg mx-auto relative">
                {/* Enhanced Step indicator */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mb-8"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className={`relative mx-2`}
                      whileHover={{ scale: 1.2 }}
                    >
                      <motion.div
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          step === i
                            ? "bg-white scale-125 shadow-lg"
                            : step > i
                            ? "bg-white/80 scale-110"
                            : "bg-white/40"
                        }`}
                        animate={{
                          scale: step === i ? [1, 1.2, 1] : 1,
                          boxShadow:
                            step === i
                              ? [
                                  "0 0 0 rgba(255,255,255,0.4)",
                                  "0 0 20px rgba(255,255,255,0.8)",
                                  "0 0 0 rgba(255,255,255,0.4)",
                                ]
                              : "0 0 0 rgba(255,255,255,0.4)",
                        }}
                        transition={{
                          duration: 2,
                          repeat: step === i ? Number.POSITIVE_INFINITY : 0,
                        }}
                      />
                      {step > i && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CheckCircle className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Step Content */}
                <AnimatePresence mode="wait">
                  {/* Step 1: Enhanced Mood Selection */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="space-y-8"
                    >
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

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl font-semibold mb-3"
                      >
                        {selectedMood.name}
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-lg mb-8 opacity-90 leading-relaxed"
                      >
                        {selectedMood.description}
                      </motion.p>

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
                          <div className="flex items-center gap-4">
                            <span className="text-sm opacity-75">
                              {t("moodTracker.mild")}
                            </span>
                            <div className="flex-1 px-2">
                              <EnhancedSlider
                                value={[intensity]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={(value) =>
                                  setIntensity(value[0])
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
                            key={intensity}
                          >
                            {intensity}/10
                          </motion.div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={nextStep}
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
                  )}

                  {/* Step 2: Enhanced Grid-based Triggers */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-semibold mb-6"
                      >
                        {t("moodTracker.triggersQuestion")}
                      </motion.h2>

                      {/* Enhanced Grid Layout */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8"
                      >
                        {emotionTriggers.map((trigger, index) => (
                          <motion.div
                            key={trigger.label}
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              className={cn(
                                "bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 p-4 h-auto flex flex-col items-center gap-3 relative overflow-hidden w-full",
                                selectedTriggers.includes(trigger.label) &&
                                  "bg-white/40 border-white/60 shadow-lg ring-2 ring-white/50"
                              )}
                              onClick={() => toggleTrigger(trigger.label)}
                            >
                              <motion.div
                                className="relative"
                                animate={
                                  selectedTriggers.includes(trigger.label)
                                    ? {
                                        rotate: [0, 10, -10, 0],
                                        scale: [1, 1.1, 1],
                                      }
                                    : {}
                                }
                                transition={{ duration: 0.5 }}
                              >
                                <trigger.icon className="h-6 w-6" />
                                {selectedTriggers.includes(trigger.label) && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  </motion.div>
                                )}
                              </motion.div>
                              <span className="text-xs text-center leading-tight font-medium">
                                {trigger.label}
                              </span>

                              {/* Selection overlay with ripple effect */}
                              {selectedTriggers.includes(trigger.label) && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute inset-0 bg-white/10 rounded-lg"
                                />
                              )}

                              {/* Hover glow effect */}
                              <motion.div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                      >
                        <label className="text-sm font-medium opacity-90">
                          {t("moodTracker.addNote")}
                        </label>
                        <Textarea
                          placeholder={t("moodTracker.notePlaceholder")}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          className="bg-white/20 border border-white/30 placeholder:text-white/60 text-white resize-none backdrop-blur-sm rounded-xl transition-all duration-200 focus:bg-white/30 focus:border-white/50"
                          rows={4}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={prevStep}
                            size="lg"
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full py-3 rounded-xl backdrop-blur-sm"
                          >
                            <ChevronUp className="mr-2 h-4 w-4" />
                            {t("moodTracker.back")}
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={nextStep}
                            size="lg"
                            className="bg-white/30 hover:bg-white/40 text-white border border-white/40 w-full py-3 rounded-xl backdrop-blur-sm shadow-lg"
                          >
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
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* Step 3: Enhanced Recommendations and Breathing */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 0.8 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        >
                          <Sparkles className="h-6 w-6" />
                        </motion.div>
                        {t("moodTracker.recommendations")}
                      </motion.h2>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                      >
                        <p className="text-lg font-medium mb-2 opacity-90 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          {t("moodTracker.affirmation")}
                        </p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="italic text-white/90 leading-relaxed"
                        >
                          "{selectedMood.affirmation}"
                        </motion.p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <p className="text-lg font-medium mb-3 opacity-90">
                          {t("moodTracker.tryActivities")}
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedMood.suggestedActivities.map(
                            (activity: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                              >
                                <motion.div
                                  className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0"
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    delay: i * 0.2,
                                  }}
                                />
                                <span className="text-sm leading-relaxed">
                                  {activity}
                                </span>
                              </motion.div>
                            )
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex gap-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={prevStep}
                            size="lg"
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 w-full py-3 rounded-xl backdrop-blur-sm"
                          >
                            <ChevronUp className="mr-2 h-4 w-4" />
                            {t("moodTracker.back")}
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1"
                        >
                          <Button
                            onClick={handleSave}
                            size="lg"
                            className="bg-white/40 hover:bg-white/50 text-white border border-white/40 w-full py-3 rounded-xl backdrop-blur-sm shadow-lg"
                          >
                            <motion.span className="flex items-center">
                              <Save className="mr-2 h-4 w-4" />
                              {t("moodTracker.saveEntry")}
                            </motion.span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/20 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
