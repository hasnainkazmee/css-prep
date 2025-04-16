"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getSubjects, type Subject } from "@/utils/localStorage"
import { BookOpen, ChevronRight } from "lucide-react"

export default function Syllabus() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setSubjects(getSubjects())
    setLoading(false)
  }, [])

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/syllabus/${subjectId}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Syllabus</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your subjects and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                {subject.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{subject.subtopics.length} subtopics</div>
                <div className="text-sm">
                  <span className="font-medium">Status: </span>
                  {subject.progress === 100 ? (
                    <span className="text-green-600 dark:text-green-400">Completed</span>
                  ) : subject.progress > 0 ? (
                    <span className="text-blue-600 dark:text-blue-400">In Progress</span>
                  ) : (
                    <span className="text-gray-500">Not Started</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Button variant="ghost" className="w-full justify-between" onClick={() => handleSubjectClick(subject.id)}>
                View Subtopics
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-full">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Add New Subject</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            Create a new subject to organize your study materials
          </p>
          <Button>Add Subject</Button>
        </Card>
      </div>
    </div>
  )
}
