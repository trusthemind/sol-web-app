import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "@/src/shared/hooks/useTranslation";

interface ProfileStatsProps {
  moodEntries: number;
  sessionsCompleted: number;
  currentStreak: number;
  averageMood: number;
}

export const ProfileStats = ({
  moodEntries,
  sessionsCompleted,
  currentStreak,
  averageMood,
}: ProfileStatsProps) => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("profile.moodEntries"),
      value: moodEntries.toString(),
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: t("profile.sessionsCompleted"),
      value: sessionsCompleted.toString(),
      color: "from-indigo-500 to-purple-500",
    },
    {
      label: t("profile.currentStreak"),
      value: `${currentStreak} days`,
      color: "from-amber-500 to-orange-500",
    },
    {
      label: t("profile.averageMood"),
      value: `${averageMood}/10`,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl shadow-blue-500/5">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          {t("profile.yourProgress")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100"
          >
            <span className="text-sm text-slate-600 font-medium">
              {stat.label}
            </span>
            <span
              className={`font-bold text-lg bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.value}
            </span>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
