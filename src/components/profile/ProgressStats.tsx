"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

interface ProgressStatsProps {
  title: string;
  stats: {
    label: string;
    value: string | number;
  }[];
}

export function ProgressStats({ title, stats }: ProgressStatsProps) {
  return (
    <Card className="mt-6 bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="font-semibold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
