// Type definitions for our data
export interface User {
  name: string
  points: number
  joinedDate: string
}

export interface Subject {
  id: string
  name: string
  progress: number
  subtopics: Subtopic[]
}

export interface Subtopic {
  id: string
  name: string
  status: "not-started" | "in-progress" | "completed"
  notes?: string
}

export interface Task {
  id: string
  title: string
  dueDate: string
  completed: boolean
}

export interface ExamPaper {
  id: string
  year: string
  title: string
  url: string
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  userAnswer?: number
}

export interface ProgressPoint {
  date: string
  progress: number
}

// Initialize default data if not exists
export const initializeData = () => {
  // Mock user
  if (!localStorage.getItem("user")) {
    const user: User = {
      name: "Ali",
      points: 120,
      joinedDate: "2025-01-15",
    }
    localStorage.setItem("user", JSON.stringify(user))
  }

  // Mock subjects
  if (!localStorage.getItem("subjects")) {
    const subjects: Subject[] = [
      {
        id: "1",
        name: "Pakistan Affairs",
        progress: 65,
        subtopics: [
          { id: "1-1", name: "History", status: "completed" },
          { id: "1-2", name: "Geography", status: "in-progress" },
          { id: "1-3", name: "Politics", status: "not-started" },
        ],
      },
      {
        id: "2",
        name: "Current Affairs",
        progress: 25,
        subtopics: [
          { id: "2-1", name: "International Relations", status: "in-progress" },
          { id: "2-2", name: "Economy", status: "not-started" },
        ],
      },
    ]
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }

  // Mock tasks
  if (!localStorage.getItem("tasks")) {
    const tasks: Task[] = [
      {
        id: "1",
        title: "Read Pakistan Affairs Chapter 3",
        dueDate: "2025-04-17",
        completed: false,
      },
      {
        id: "2",
        title: "Complete 20 MCQs on Current Affairs",
        dueDate: "2025-04-18",
        completed: false,
      },
    ]
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }

  // Mock exam papers
  if (!localStorage.getItem("examPapers")) {
    const examPapers: ExamPaper[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      year: String(2015 + i),
      title: `CSS ${2015 + i} Past Paper`,
      url: "#",
    }))
    localStorage.setItem("examPapers", JSON.stringify(examPapers))
  }

  // Mock questions
  if (!localStorage.getItem("questions")) {
    const questions: Question[] = [
      {
        id: "1",
        question: "What is the capital of Pakistan?",
        options: ["Karachi", "Lahore", "Islamabad", "Peshawar"],
        correctAnswer: 2,
      },
      {
        id: "2",
        question: "When was Pakistan founded?",
        options: ["1945", "1946", "1947", "1948"],
        correctAnswer: 2,
      },
    ]
    localStorage.setItem("questions", JSON.stringify(questions))
  }

  // Mock progress data
  if (!localStorage.getItem("progressData")) {
    const today = new Date()
    const progressData: ProgressPoint[] = Array.from({ length: 5 }, (_, i) => {
      const date = new Date()
      date.setDate(today.getDate() - (4 - i) * 7)
      return {
        date: date.toISOString().split("T")[0],
        progress: 10 + i * 9,
      }
    })
    localStorage.setItem("progressData", JSON.stringify(progressData))
  }
}

// Helper functions to get and set data
export const getUser = (): User => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const updateUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user))
}

export const getSubjects = (): Subject[] => {
  const subjects = localStorage.getItem("subjects")
  return subjects ? JSON.parse(subjects) : []
}

export const updateSubjects = (subjects: Subject[]) => {
  localStorage.setItem("subjects", JSON.stringify(subjects))
}

export const getSubject = (id: string): Subject | undefined => {
  const subjects = getSubjects()
  return subjects.find((subject) => subject.id === id)
}

export const updateSubject = (updatedSubject: Subject) => {
  const subjects = getSubjects()
  const index = subjects.findIndex((subject) => subject.id === updatedSubject.id)
  if (index !== -1) {
    subjects[index] = updatedSubject
    updateSubjects(subjects)
  }
}

export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem("tasks")
  return tasks ? JSON.parse(tasks) : []
}

export const updateTasks = (tasks: Task[]) => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

export const getExamPapers = (): ExamPaper[] => {
  const examPapers = localStorage.getItem("examPapers")
  return examPapers ? JSON.parse(examPapers) : []
}

export const getQuestions = (): Question[] => {
  const questions = localStorage.getItem("questions")
  return questions ? JSON.parse(questions) : []
}

export const updateQuestions = (questions: Question[]) => {
  localStorage.setItem("questions", JSON.stringify(questions))
}

export const getProgressData = (): ProgressPoint[] => {
  const progressData = localStorage.getItem("progressData")
  return progressData ? JSON.parse(progressData) : []
}

export const updateProgressData = (progressData: ProgressPoint[]) => {
  localStorage.setItem("progressData", JSON.stringify(progressData))
}

export const getNotes = (subtopicId: string): string => {
  const notes = localStorage.getItem(`notes-${subtopicId}`)
  return notes || ""
}

export const saveNote = (subtopicId: string, content: string) => {
  localStorage.setItem(`notes-${subtopicId}`, content)

  // Award points for saving a note
  const user = getUser()
  if (user) {
    user.points += 5
    updateUser(user)
  }
}

export const awardPoints = (points: number) => {
  const user = getUser()
  if (user) {
    user.points += points
    updateUser(user)
  }
}
