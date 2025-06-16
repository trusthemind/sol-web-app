"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  Search,
  Filter,
  CalendarIcon,
  TrendingUp,
  BarChart3,
  Clock,
  Tag,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"
import isBetween from "dayjs/plugin/isBetween"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

// Mock data based on your API structure
const mockMoodHistory = {
  success: true,
  data: [
    {
      _id: "684fcd577a7b25afb13ad0ef",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "happy",
      intensity: "HIGH",
      triggers: ["Соціальні мережі", "Якість сну"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-16T07:52:55.665Z",
      createdAt: "2025-06-16T07:52:55.760Z",
      updatedAt: "2025-06-16T07:52:55.760Z",
      __v: 0,
      intensityDescription: "High - Strong emotional response",
    },
    {
      _id: "684f3441f48386e215480ad4",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "angry",
      intensity: "HIGH",
      triggers: ["Стосунки", "Фінанси", "Робота/Навчання"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-15T20:59:45.123Z",
      createdAt: "2025-06-15T20:59:45.176Z",
      updatedAt: "2025-06-15T20:59:45.176Z",
      __v: 0,
      intensityDescription: "High - Strong emotional response",
    },
    {
      _id: "684f33f2f48386e215480ad2",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "happy",
      intensity: "HIGH",
      triggers: ["Погода", "Фізичні вправи", "Якість сну", "Новини"],
      activities: [],
      tags: ["high-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-15T20:58:26.464Z",
      createdAt: "2025-06-15T20:58:26.541Z",
      updatedAt: "2025-06-15T20:58:26.541Z",
      __v: 0,
      intensityDescription: "High - Strong emotional response",
    },
    {
      _id: "684eb6c429e181b30ef75d15",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "happy",
      intensity: "MODERATE",
      triggers: ["Соціальні мережі"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-15T12:04:20.689Z",
      createdAt: "2025-06-15T12:04:20.777Z",
      updatedAt: "2025-06-15T12:04:20.777Z",
      __v: 0,
      intensityDescription: "Moderate - Noticeable but manageable",
    },
    {
      _id: "684ead5547df2e2c934ca1a7",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "happy",
      intensity: "HIGH",
      triggers: ["Стосунки"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-15T11:24:05.048Z",
      createdAt: "2025-06-15T11:24:05.082Z",
      updatedAt: "2025-06-15T11:24:05.082Z",
      __v: 0,
      intensityDescription: "High - Strong emotional response",
    },
    {
      _id: "684df90c2cd3102b36690fb9",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "excited",
      intensity: "MODERATE",
      triggers: ["Стосунки"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-14T22:34:52.011Z",
      createdAt: "2025-06-14T22:34:52.048Z",
      updatedAt: "2025-06-14T22:34:52.048Z",
      __v: 0,
      intensityDescription: "Moderate - Noticeable but manageable",
    },
    {
      _id: "684df8512cd3102b36690fac",
      userId: {
        _id: "684db4e25067a32732e5c655",
        email: "userdev@gmail.com",
        firstName: "Fedir",
        lastName: "Melnyk",
      },
      emotion: "happy",
      intensity: "HIGH",
      triggers: ["Соціальні мережі"],
      activities: [],
      tags: ["medium-intensity"],
      isPrivate: false,
      recordedAt: "2025-06-14T22:31:45.690Z",
      createdAt: "2025-06-14T22:31:45.837Z",
      updatedAt: "2025-06-14T22:31:45.837Z",
      __v: 0,
      intensityDescription: "High - Strong emotional response",
    },
  ],
  total: 7,
  filters: {
    limit: 10,
    skip: 0,
    sortBy: "recordedAt",
    sortOrder: "desc",
  },
}

// Emotion configuration
const emotionConfig = {
  happy: {
    emoji: "😊",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  excited: {
    emoji: "🤩",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  angry: {
    emoji: "😠",
    color: "from-red-500 to-pink-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-700 dark:text-red-300",
  },
  sad: {
    emoji: "😢",
    color: "from-blue-400 to-purple-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  anxious: {
    emoji: "😰",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  neutral: {
    emoji: "😐",
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-900/20",
    textColor: "text-gray-700 dark:text-gray-300",
  },
}

const intensityConfig = {
  HIGH: { label: "High", color: "bg-red-500", icon: "🔥" },
  MODERATE: { label: "Moderate", color: "bg-yellow-500", icon: "⚡" },
  LOW: { label: "Low", color: "bg-green-500", icon: "🌱" },
}

// Helper function to format relative time with more context
const formatRelativeTime = (dateString: string) => {
  const date = dayjs(dateString)
  const now = dayjs()

  if (date.isToday()) {
    return `Today at ${date.format("h:mm A")}`
  } else if (date.isYesterday()) {
    return `Yesterday at ${date.format("h:mm A")}`
  } else if (now.diff(date, "day") <= 7) {
    return `${date.format("dddd")} at ${date.format("h:mm A")}`
  } else {
    return date.format("MMM DD, YYYY [at] h:mm A")
  }
}

export default function MoodHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("all")
  const [selectedIntensity, setSelectedIntensity] = useState("all")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [showPrivate, setShowPrivate] = useState(true)

  // Filter and search logic
  const filteredData = useMemo(() => {
    let filtered = mockMoodHistory.data

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.emotion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.triggers.some((trigger) => trigger.toLowerCase().includes(searchTerm.toLowerCase())) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Emotion filter
    if (selectedEmotion !== "all") {
      filtered = filtered.filter((entry) => entry.emotion === selectedEmotion)
    }

    // Intensity filter
    if (selectedIntensity !== "all") {
      filtered = filtered.filter((entry) => entry.intensity === selectedIntensity)
    }

    // Date range filter using dayjs
    if (dateRange.from && dateRange.to) {
      const fromDate = dayjs(dateRange.from).startOf("day")
      const toDate = dayjs(dateRange.to).endOf("day")

      filtered = filtered.filter((entry) => {
        const entryDate = dayjs(entry.recordedAt)
        return entryDate.isBetween(fromDate, toDate, null, "[]")
      })
    }

    // Privacy filter
    if (!showPrivate) {
      filtered = filtered.filter((entry) => !entry.isPrivate)
    }

    return filtered
  }, [searchTerm, selectedEmotion, selectedIntensity, dateRange, showPrivate])

  // Statistics
  const stats = useMemo(() => {
    const emotions = filteredData.reduce(
      (acc, entry) => {
        acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const intensities = filteredData.reduce(
      (acc, entry) => {
        acc[entry.intensity] = (acc[entry.intensity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topTriggers = filteredData
      .flatMap((entry) => entry.triggers)
      .reduce(
        (acc, trigger) => {
          acc[trigger] = (acc[trigger] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    return {
      totalEntries: filteredData.length,
      emotions,
      intensities,
      topTriggers: Object.entries(topTriggers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
    }
  }, [filteredData])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/mood-tracker">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Mood History</h1>
              <p className="text-muted-foreground">Track your emotional journey over time</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries}</div>
              <p className="text-xs text-muted-foreground">{mockMoodHistory.total} total records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Common</CardTitle>
              <div className="text-lg">
                {Object.entries(stats.emotions).length > 0 &&
                  emotionConfig[
                    Object.entries(stats.emotions).sort(([, a], [, b]) => b - a)[0][0] as keyof typeof emotionConfig
                  ]?.emoji}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {Object.entries(stats.emotions).length > 0 &&
                  Object.entries(stats.emotions).sort(([, a], [, b]) => b - a)[0][0]}
              </div>
              <p className="text-xs text-muted-foreground">
                {Object.entries(stats.emotions).length > 0 &&
                  Object.entries(stats.emotions).sort(([, a], [, b]) => b - a)[0][1]}{" "}
                times recorded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Intensity</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.entries(stats.intensities).length > 0 &&
                  Object.entries(stats.intensities).sort(([, a], [, b]) => b - a)[0][0]}
              </div>
              <p className="text-xs text-muted-foreground">Most frequent level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Trigger</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.topTriggers[0]?.[1] || 0}</div>
              <p className="text-xs text-muted-foreground">{stats.topTriggers[0]?.[0] || "No triggers"}</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search emotions, triggers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Emotion Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emotion</label>
                  <Select value={selectedEmotion} onValueChange={setSelectedEmotion}>
                    <SelectTrigger>
                      <SelectValue placeholder="All emotions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All emotions</SelectItem>
                      {Object.keys(emotionConfig).map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          <div className="flex items-center space-x-2">
                            <span>{emotionConfig[emotion as keyof typeof emotionConfig].emoji}</span>
                            <span className="capitalize">{emotion}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Intensity Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intensity</label>
                  <Select value={selectedIntensity} onValueChange={setSelectedIntensity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All intensities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All intensities</SelectItem>
                      {Object.entries(intensityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <span>{config.icon}</span>
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {dayjs(dateRange.from).format("MMM DD, YYYY")} -{" "}
                              {dayjs(dateRange.to).format("MMM DD, YYYY")}
                            </>
                          ) : (
                            dayjs(dateRange.from).format("MMM DD, YYYY")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        // selected={dateRange}
                        // onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Private</label>
                  <Button variant="ghost" size="sm" onClick={() => setShowPrivate(!showPrivate)}>
                    {showPrivate ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Quick Filters */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Filters</label>
                  <div className="space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        setDateRange({
                          from: dayjs().subtract(7, "day").toDate(),
                          to: dayjs().toDate(),
                        })
                      }
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        setDateRange({
                          from: dayjs().subtract(30, "day").toDate(),
                          to: dayjs().toDate(),
                        })
                      }
                    >
                      Last 30 days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() =>
                        setDateRange({
                          from: dayjs().subtract(3, "month").toDate(),
                          to: dayjs().toDate(),
                        })
                      }
                    >
                      Last 3 months
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setDateRange({})}
                    >
                      Clear dates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {filteredData.length} {filteredData.length === 1 ? "Entry" : "Entries"} Found
                </h2>
                <Select defaultValue="recordedAt">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recordedAt">Most Recent</SelectItem>
                    <SelectItem value="emotion">Emotion</SelectItem>
                    <SelectItem value="intensity">Intensity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mood Entries */}
              <div className="space-y-4">
                {filteredData.map((entry, index) => {
                  const emotion = emotionConfig[entry.emotion as keyof typeof emotionConfig]
                  const intensity = intensityConfig[entry.intensity as keyof typeof intensityConfig]

                  return (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {/* Emotion Icon */}
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${emotion?.bgColor}`}
                            >
                              {emotion?.emoji}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold capitalize">{entry.emotion}</h3>
                                  <Badge variant="secondary" className={`${intensity?.color} text-white`}>
                                    {intensity?.icon} {intensity?.label}
                                  </Badge>
                                  {entry.isPrivate && (
                                    <Badge variant="outline">
                                      <EyeOff className="h-3 w-3 mr-1" />
                                      Private
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    {dayjs(entry.recordedAt).format("MMM DD, YYYY")}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {dayjs(entry.recordedAt).format("h:mm A")}
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground">{entry.intensityDescription}</p>

                              {/* Triggers */}
                              {entry.triggers.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Triggers:</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {entry.triggers.map((trigger, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {trigger}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Tags */}
                              {entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {entry.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      #{tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {/* User Info */}
                              <div className="flex items-center space-x-2 pt-2 border-t">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {entry.userId.firstName[0]}
                                    {entry.userId.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {entry.userId.firstName} {entry.userId.lastName}
                                </span>
                                <Clock className="h-3 w-3 text-muted-foreground ml-auto" />
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeTime(entry.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* No Results */}
              {filteredData.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No entries found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedEmotion("all")
                      setSelectedIntensity("all")
                      setDateRange({})
                    }}
                  >
                    Clear all filters
                  </Button>
                </motion.div>
              )}

              {/* Load More */}
              {filteredData.length > 0 && filteredData.length < mockMoodHistory.total && (
                <div className="text-center pt-6">
                  <Button variant="outline">Load More Entries</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
