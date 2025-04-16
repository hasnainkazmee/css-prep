"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getSubject, updateSubject, type Subject, type Subtopic } from "@/utils/localStorage"
import { ArrowLeft, Plus, CheckCircle, Clock, Circle } from "lucide-react"

export default function SubjectDetail() {
  const router = useRouter()
  const { id } = router.query
  const [subject, setSubject] = useState<Subject | null>(null)
  const [newSubtopics, setNewSubtopics] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const subjectData = getSubject(id as string)
      if (subjectData) {
        setSubject(subjectData)
      }
      setLoading(false)
    }
  }, [id])

  const handleStatusChange = (subtopicId: string) => {
    if (!subject) return

    const updatedSubtopics = subject.subtopics.map((subtopic) => {
      if (subtopic.id === subtopicId) {
        let newStatus: "not-started" | "in-progress" | "completed"

        if (subtopic.status === "not-started") {
          newStatus = "in-progress"
        } else if (subtopic.status === "in-progress") {
          newStatus = "completed"
        } else {
          newStatus = "not-started"
        }

        return { ...subtopic, status: newStatus }
      }
      return subtopic
    })

    // Calculate new progress
    const completedCount = updatedSubtopics.filter((s) => s.status === "completed").length
    const newProgress = Math.round((completedCount / updatedSubtopics.length) * 100)

    const updatedSubject = {
      ...subject,
      subtopics: updatedSubtopics,
      progress: newProgress,
    }

    setSubject(updatedSubject)
    updateSubject(updatedSubject)
  }

  const handleAddSubtopics = () => {
    if (!subject || !newSubtopics.trim()) return

    const subtopicNames = newSubtopics
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)

    if (subtopicNames.length === 0) return

    const lastId =
      subject.subtopics.length > 0
        ? Number.parseInt(subject.subtopics[subject.subtopics.length - 1].id.split("-")[1])
        : 0

    const newSubtopicsList: Subtopic[] = subtopicNames.map((name, index) => ({
      id: `${subject.id}-${lastId + index + 1}`,
      name,
      status: "not-started",
    }))

    const updatedSubtopics = [...subject.subtopics, ...newSubtopicsList]

    // Recalculate progress
    const completedCount = updatedSubtopics.filter((s) => s.status === "completed").length
    const newProgress = Math.round((completedCount / updatedSubtopics.length) * 100)

    const updatedSubject = {
      ...subject,
      subtopics: updatedSubtopics,
      progress: newProgress,
    }

    setSubject(updatedSubject)
    updateSubject(updatedSubject)
    setNewSubtopics("")
  }

  const handleViewNotes = (subtopicId: string, subtopicName: string) => {
    router.push(`/notes?subtopicId=${subtopicId}&subtopicName=${encodeURIComponent(subtopicName)}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Subject not found</h2>
        <Button className="mt-4" onClick={() => router.push("/syllabus")}>
          Back to Syllabus
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/syllabus")}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {subject.subtopics.length} subtopics • {subject.progress}% complete
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Add subtopics (comma separated, e.g. CPEC, Inflation)"
            value={newSubtopics}
            onChange={(e) => setNewSubtopics(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddSubtopics}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subtopics
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subject.subtopics.map((subtopic) => (
            <Card key={subtopic.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{subtopic.name}</span>
                  <Badge
                    className={`cursor-pointer ${
                      subtopic.status === "completed"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                        : subtopic.status === "in-progress"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                    onClick={() => handleStatusChange(subtopic.id)}
                  >
                    {subtopic.status === "completed" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </>
                    ) : subtopic.status === "in-progress" ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </>
                    ) : (
                      <>
                        <Circle className="h-3 w-3 mr-1" />
                        Not Started
                      </>
                    )}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewNotes(subtopic.id, subtopic.name)}
                >
                  View Notes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
