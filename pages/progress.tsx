"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUser, getProgressData } from "@/utils/localStorage"
import { Award, BookOpen, CheckCircle, Clock, Target } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function Progress() {
  const [user, setUser] = useState<any>(null)
  const [progressData, setProgressData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(getUser())
    setProgressData(getProgressData())
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  // Calculate achievements
  const achievements = [
    {
      id: "1",
      title: "Earned 100 Points",
      description: "You've earned over 100 points",
      icon: Award,
      completed: user?.points >= 100,
      progress: Math.min(100, user?.points) / 100,
    },
    {
      id: "2",
      title: "Study Streak",
      description: "7 days consecutive study",
      icon: Clock,
      completed: true,
      progress: 1,
    },
    {
      id: "3",
      title: "Subject Master",
      description: "Complete a subject 100%",
      icon: BookOpen,
      completed: false,
      progress: 0.65,
    },
    {
      id: "4",
      title: "Quiz Champion",
      description: "Score 100% on 5 quizzes",
      icon: Target,
      completed: false,
      progress: 0.4,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track your study progress and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.points}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Level {Math.floor(user?.points / 100) + 1}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last studied: Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes Created</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Across 2 subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average score: 75%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Syllabus Progress</CardTitle>
            <CardDescription>Your progress over the last few weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  progress: {
                    label: "Progress",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getDate()}/${date.getMonth() + 1}`
                      }}
                    />
                    <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="var(--color-progress)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your study milestones and badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3">
                  <div
                    className={`rounded-full p-2 ${
                      achievement.completed
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{achievement.title}</div>
                      {achievement.completed && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div
                        className={`h-1.5 rounded-full ${
                          achievement.completed ? "bg-green-600 dark:bg-green-500" : "bg-blue-600 dark:bg-blue-500"
                        }`}
                        style={{ width: `${achievement.progress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
