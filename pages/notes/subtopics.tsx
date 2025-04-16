"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSubjects } from "@/utils/localStorage"
import { ArrowLeft, FileText, CheckCircle, Clock, Circle } from "lucide-react"

export default function Subtopics() {
  const router = useRouter()
  const { subjectId, subjectName } = router.query
  const [subtopics, setSubtopics] = useState<any[]>([])
  const [subject, setSubject] = useState<any>(null)

  useEffect(() => {
    if (subjectId && typeof subjectId === 'string') {
      const subjects = getSubjects()
      const foundSubject = subjects.find(s => s.id === subjectId)
      if (foundSubject) {
        setSubject(foundSubject)
        setSubtopics(foundSubject.subtopics)
      }
    }
  }, [subjectId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "not-started":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const handleSubtopicClick = (subtopicId: string, subtopicName: string) => {
    router.push(`/notes/edit?subject=${encodeURIComponent(subtopicId)}&topic=${encodeURIComponent(subtopicId)}&subtopic=${encodeURIComponent(subtopicName)}`);
  }

  if (!subject) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{subjectName}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {subject.progress}% Complete
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-100 dark:bg-green-900/30" />
          <CheckCircle className="h-4 w-4 text-green-800 dark:text-green-400" />
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30" />
          <Clock className="h-4 w-4 text-blue-800 dark:text-blue-400" />
          <span className="text-sm">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800" />
          <Circle className="h-4 w-4 text-gray-800 dark:text-gray-400" />
          <span className="text-sm">Not Started</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subtopics.map((subtopic) => (
          <Card 
            key={subtopic.id}
            className={`transition-all hover:shadow-lg ${
              getStatusColor(subtopic.status)
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(subtopic.status)}
                  {subtopic.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSubtopicClick(subtopic.id, subtopic.name)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 