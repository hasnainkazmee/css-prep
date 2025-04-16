"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSyllabus, getNote, getNotes } from "@/utils/localStorage"
import { ArrowLeft, BookOpen } from "lucide-react"
import type { Syllabus, Note } from "@/types"
import { Progress } from "@/components/ui/progress"

export default function Notes() {
  const router = useRouter()
  const [syllabus, setSyllabus] = useState<Syllabus[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setSyllabus(getSyllabus())
    const notesData = getNotes()
    setNotes(Array.isArray(notesData) ? notesData : Object.values(notesData))
    setIsLoading(false)
  }, [])

  const getSubtopicStatus = (subject: string, topic: string, subtopic: string) => {
    const note = notes.find(n => 
      n.subject === subject && n.topic === topic && n.subtopic === subtopic
    )
    return note ? (note.content ? "completed" : "in-progress") : "not-started"
  }

  const getTopicProgress = (subject: string, topic: string) => {
    const topicSubtopics = syllabus
      .find(s => s.subject === subject)
      ?.topics.find(t => t.topic === topic)
      ?.subtopics || []
    
    const completedCount = topicSubtopics.filter(subtopic => 
      getSubtopicStatus(subject, topic, subtopic.name) === "completed"
    ).length
    
    return {
      completed: completedCount,
      total: topicSubtopics.length,
      percentage: topicSubtopics.length ? Math.round((completedCount / topicSubtopics.length) * 100) : 0
    }
  }

  const getSubjectProgress = (subject: string) => {
    const subjectTopics = syllabus.find(s => s.subject === subject)?.topics || []
    const allSubtopics = subjectTopics.flatMap(t => t.subtopics)
    const completedCount = allSubtopics.filter(subtopic => 
      subjectTopics.some(topic => getSubtopicStatus(subject, topic.topic, subtopic.name) === "completed")
    ).length
    
    return {
      completed: completedCount,
      total: allSubtopics.length,
      percentage: allSubtopics.length ? Math.round((completedCount / allSubtopics.length) * 100) : 0
    }
  }

  const handleSubtopicClick = (subject: string, topic: string, subtopic: string) => {
    router.push(`/notes/edit?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (selectedSubject && selectedTopic) {
    const subject = syllabus.find(s => s.subject === selectedSubject)
    const topic = subject?.topics.find(t => t.topic === selectedTopic)
    
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedTopic(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{selectedTopic}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topic?.subtopics.map((subtopic) => {
            const status = getSubtopicStatus(selectedSubject, selectedTopic, subtopic.name)
            return (
              <Card key={subtopic.name} className="cursor-pointer" onClick={() => handleSubtopicClick(selectedSubject, selectedTopic, subtopic.name)}>
                <CardHeader>
                  <CardTitle>{subtopic.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      status === "completed" ? "bg-green-100 text-green-800" :
                      status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {status === "completed" ? "Completed" :
                       status === "in-progress" ? "In Progress" :
                       "Not Started"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (selectedSubject) {
    const subject = syllabus.find(s => s.subject === selectedSubject)
    
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedSubject(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{selectedSubject}</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subject?.topics.map((topic) => {
            const progress = getTopicProgress(selectedSubject, topic.topic)
            return (
              <Card key={topic.topic} className="cursor-pointer" onClick={() => setSelectedTopic(topic.topic)}>
                <CardHeader>
                  <CardTitle>{topic.topic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.completed} of {progress.total} completed</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {topic.subtopics.length} subtopics
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {syllabus.map((subject) => {
          const progress = getSubjectProgress(subject.subject)
          return (
            <Card key={subject.subject} className="cursor-pointer" onClick={() => setSelectedSubject(subject.subject)}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>{subject.subject}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.completed} of {progress.total} completed</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    {subject.topics.length} topics
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 