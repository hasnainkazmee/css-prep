"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, PenTool } from "lucide-react"

interface Task {
  title: string
  type: 'reading' | 'quiz'
  dueDate: string
  completed: boolean
}

export default function TaskPanel() {
  const tasks: Task[] = [
    {
      title: "Read Pakistan Affairs Chapter 3",
      type: "reading",
      dueDate: "today",
      completed: false
    },
    {
      title: "Complete 20 MCQs on Current Affairs",
      type: "quiz",
      dueDate: "tomorrow",
      completed: false
    }
  ]

  return (
    <div className="w-[400px] bg-white dark:bg-gray-900 shadow-sm p-4 h-screen sticky top-0 overflow-y-auto">
      <Card className="bg-gray-50 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Checkbox
                  checked={task.completed}
                  className="text-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Complete by {task.dueDate}
                    </span>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {task.type === 'reading' ? (
                        <>
                          <PenTool className="h-4 w-4 mr-2" />
                          Read
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Take Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 