import { Syllabus, Progress, Note } from "@/types"

// Type definitions for our data
export interface User {
  id: string
  name: string
  points: number
  joinedDate: string
  savedNotesCount: number
  completedNotesCount: number
  quizzesCount: number
  ticks: Record<string, boolean>
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

export interface ProgressData {
  date: string
  points: number
}

export interface Achievement {
  id: string
  title: string
  description: string
}

const SYLLABUS_KEY = "syllabus"
const NOTES_KEY = "notes"
const PROGRESS_KEY = "progress"

// Initialize default data if not exists
export const initializeData = () => {
  // Mock user
  if (!localStorage.getItem("user")) {
    const user: User = {
      id: "1",
      name: "Ali",
      points: 120,
      joinedDate: "2025-01-15",
      savedNotesCount: 5,
      completedNotesCount: 0,
      quizzesCount: 3,
      ticks: {
        "first_note": false,
        "note_master": false,
        "completionist": false,
        "quiz_enthusiast": false,
        "point_collector": false
      }
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
    const progressData: ProgressData[] = Array.from({ length: 5 }, (_, i) => {
      const date = new Date()
      date.setDate(today.getDate() - (4 - i) * 7)
      return {
        date: date.toISOString().split("T")[0],
        points: 10 + i * 9,
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

export const getProgressData = (): ProgressData[] => {
  // Get existing progress data
  const progressData = localStorage.getItem("progressData")
  if (progressData) {
    const data = JSON.parse(progressData) as ProgressData[]
    const today = new Date().toISOString().split('T')[0]
    
    // Update today's progress if it exists, otherwise add new entry
    const todayIndex = data.findIndex(d => d.date === today)
    const currentPoints = getUser()?.points || 0
    
    if (todayIndex !== -1) {
      data[todayIndex].points = currentPoints
    } else {
      data.push({ date: today, points: currentPoints })
    }
    
    // Keep only last 30 days
    const recentData = data.slice(-30)
    localStorage.setItem("progressData", JSON.stringify(recentData))
    return recentData
  }

  // Initialize with today's progress
  const today = new Date().toISOString().split('T')[0]
  const currentPoints = getUser()?.points || 0
  const initialData = [{ date: today, points: currentPoints }]
  localStorage.setItem("progressData", JSON.stringify(initialData))
  return initialData
}

export const updateProgressData = (progressData: ProgressData[]) => {
  localStorage.setItem("progressData", JSON.stringify(progressData))
}

// Note-related functions
export const saveSyllabus = (syllabus: Syllabus[]) => {
  try {
    localStorage.setItem(SYLLABUS_KEY, JSON.stringify(syllabus))
  } catch (error) {
    console.error('Error saving syllabus:', error)
  }
}

export const getSyllabus = (): Syllabus[] => {
  try {
    const stored = localStorage.getItem(SYLLABUS_KEY)
    if (!stored) {
      // Default syllabus structure
      return [
        {
          subject: 'ENGLISH ESSAY',
          priority: 'none',
          topics: []
        },
        {
          subject: 'ENGLISH (PRECIS & COMPOSITION)',
          priority: 'none',
          topics: []
        },
        {
          subject: 'GENERAL SCIENCE & ABILITY',
          priority: 'none',
          topics: []
        },
        {
          subject: 'CURRENT AFFAIRS',
          priority: 'none',
          topics: []
        },
        {
          subject: 'PAKISTAN AFFAIRS',
          priority: 'none',
          topics: []
        },
        {
          subject: 'ISLAMIC STUDIES',
          priority: 'none',
          topics: []
        }
      ]
    }
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error getting syllabus:', error)
    return []
  }
}

export const saveNote = (note: Note) => {
  try {
    const notes = getNotes()
    notes[`${note.subject}/${note.topic}/${note.subtopic}`] = note
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
    
    // Update subtopic completion status
    const syllabus = getSyllabus()
    const updatedSyllabus = syllabus.map(subject => {
      if (subject.subject === note.subject) {
        return {
          ...subject,
          topics: subject.topics.map(topic => {
            if (topic.topic === note.topic) {
              return {
                ...topic,
                subtopics: topic.subtopics.map(subtopic => {
                  if (subtopic.name === note.subtopic) {
                    return {
                      ...subtopic,
                      completed: true,
                      date: new Date().toISOString()
                    }
                  }
                  return subtopic
                })
              }
            }
            return topic
          })
        }
      }
      return subject
    })
    
    saveSyllabus(updatedSyllabus)
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

export const getNotes = (): Record<string, Note> => {
  try {
    const stored = localStorage.getItem(NOTES_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Error getting notes:', error)
    return {}
  }
}

export const getNote = (subject: string, topic: string, subtopic: string): string | null => {
  try {
    const notes = getNotes()
    const note = notes[`${subject}/${topic}/${subtopic}`]
    return note ? note.content : null
  } catch (error) {
    console.error('Error getting note:', error)
    return null
  }
}

export const getProgress = (subject: string): Progress => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    if (!stored) {
      return {
        completed: 0,
        total: 0,
        status: 'onTrack'
      }
    }
    const progress = JSON.parse(stored)
    return progress[subject] || {
      completed: 0,
      total: 0,
      status: 'onTrack'
    }
  } catch (error) {
    console.error('Error getting progress:', error)
    return {
      completed: 0,
      total: 0,
      status: 'onTrack'
    }
  }
}

export const saveProgress = (subject: string, progress: Progress) => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY)
    const allProgress = stored ? JSON.parse(stored) : {}
    allProgress[subject] = progress
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error('Error saving progress:', error)
  }
}

export const awardPoints = (points: number) => {
  const user = getUser()
  if (user) {
    user.points += points
    updateUser(user)
  }
}

export const updateProgress = (action: "saveNote" | "completeNote" | "quiz") => {
  const user = getUser()
  if (!user) return

  // Initialize ticks if not present
  if (!user.ticks) {
    user.ticks = {
      "first_note": false,
      "note_master": false,
      "completionist": false,
      "quiz_enthusiast": false,
      "point_collector": false
    }
  }

  switch (action) {
    case "saveNote":
      user.points += 2.5
      user.savedNotesCount += 1
      break
    case "completeNote":
      user.points += 5
      user.completedNotesCount += 1
      break
    case "quiz":
      user.points += 10
      user.quizzesCount += 1
      break
  }

  // Update achievements
  if (user.points >= 100) {
    user.ticks["point_collector"] = true
  }
  if (user.completedNotesCount >= 5) {
    user.ticks["completionist"] = true
  }
  if (user.quizzesCount >= 5) {
    user.ticks["quiz_enthusiast"] = true
  }
  if (user.savedNotesCount >= 10) {
    user.ticks["note_master"] = true
  }
  if (user.savedNotesCount >= 1) {
    user.ticks["first_note"] = true
  }

  updateUser(user)
  getProgressData() // This will update the progress data with the new points
}

export const getAchievements = (): Achievement[] => {
  return [
    {
      id: "first_note",
      title: "First Note",
      description: "Create your first note"
    },
    {
      id: "note_master",
      title: "Note Master",
      description: "Create 10 notes"
    },
    {
      id: "completionist",
      title: "Completionist",
      description: "Complete 5 notes"
    },
    {
      id: "quiz_enthusiast",
      title: "Quiz Enthusiast",
      description: "Take 5 quizzes"
    },
    {
      id: "point_collector",
      title: "Point Collector",
      description: "Earn 100 points"
    }
  ]
}

export const deleteSubject = (subject: string, callback: () => void) => {
  const syllabus = getSyllabus().filter(s => s.subject !== subject)
  saveSyllabus(syllabus)
  callback()
}

export const deleteTopic = (subject: string, topic: string, callback: () => void) => {
  const syllabus = getSyllabus().map(s =>
    s.subject === subject
      ? { ...s, topics: s.topics.filter(t => t.topic !== topic) }
      : s
  )
  saveSyllabus(syllabus)
  callback()
}

export const deleteSubtopic = (subject: string, topic: string, subtopic: string, callback: () => void) => {
  const syllabus = getSyllabus().map(s =>
    s.subject === subject
      ? {
          ...s,
          topics: s.topics.map(t =>
            t.topic === topic
              ? { ...t, subtopics: t.subtopics.filter(st => st.name !== subtopic) }
              : t
          ),
        }
      : s
  )
  saveSyllabus(syllabus)
  callback()
}

export function saveTheme(theme: 'light' | 'dark') {
  localStorage.setItem('theme', theme);
}

export function getTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme') as 'light' | 'dark';
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
