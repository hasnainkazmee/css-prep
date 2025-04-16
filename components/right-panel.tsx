"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Timer } from "lucide-react"

interface RightPanelProps {
  isOpen: boolean
}

export default function RightPanel({ isOpen }: RightPanelProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(25)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  if (!isOpen) return null

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 overflow-y-auto transition-all border-l border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-3">Today's Tasks</h3>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="task-1" />
              <div className="grid gap-1.5">
                <label
                  htmlFor="task-1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Read Pakistan Affairs Chapter 3
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete by today</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="task-2" />
              <div className="grid gap-1.5">
                <label
                  htmlFor="task-2"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Complete 20 MCQs on Current Affairs
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Complete by tomorrow</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Daily Goal</span>
                <span className="text-sm font-medium">70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Weekly Goal</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Study Timer</h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <div className="text-center mb-4">
              <div className="text-3xl font-mono">
                {String(timerMinutes).padStart(2, "0")}:{String(timerSeconds).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pomodoro Timer</div>
            </div>
            <Button onClick={toggleTimer} className="w-full" variant={isTimerRunning ? "destructive" : "default"}>
              <Timer className="h-4 w-4 mr-2" />
              {isTimerRunning ? "Pause" : "Start 25 minutes"}
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-lg mb-3">Quick Notes</h3>
          <textarea
            className="w-full h-32 p-2 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your quick notes here..."
          ></textarea>
        </div>
      </div>
    </aside>
  )
}
