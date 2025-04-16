"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getUser, getTasks, getSubjects } from "@/utils/localStorage"
import { BookOpen, CheckCircle, Award, Clock } from "lucide-react"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [daysRemaining, setDaysRemaining] = useState(320)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Calculate days until March 1, 2026
    const targetDate = new Date("2026-03-01")
    const currentDate = new Date()
    const timeDiff = targetDate.getTime() - currentDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysRemaining(daysDiff)

    // Load data from localStorage
    setUser(getUser())
    setTasks(getTasks())
    setSubjects(getSubjects())
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  // Calculate overall progress
  const overallProgress =
    subjects.length > 0 ? Math.round(subjects.reduce((sum, subject) => sum + subject.progress, 0) / subjects.length) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Let's continue your preparation journey</p>
        </div>
        <div className="mt-4 md:mt-0 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-4 py-2 rounded-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          <span>{daysRemaining} days to CSS 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syllabus Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{subjects.length} subjects in your syllabus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.filter((task) => task.completed).length}/{tasks.length}
            </div>
            <Progress
              value={tasks.length > 0 ? (tasks.filter((task) => task.completed).length / tasks.length) * 100 : 0}
              className="h-2 mt-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {tasks.filter((task) => !task.completed).length} tasks remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.points}</div>
            <div className="flex items-center mt-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                Level {Math.floor(user?.points / 100) + 1}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {100 - (user?.points % 100)} points to next level
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.slice(0, 3).map((subject) => (
                <div key={subject.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{subject.subtopics.length} subtopics</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium mr-2">{subject.progress}%</div>
                    <div className="w-20">
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" onClick={() => (window.location.href = "/syllabus")}>
                View All Subjects
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    readOnly
                  />
                  <div>
                    <div className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>
                      {task.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
