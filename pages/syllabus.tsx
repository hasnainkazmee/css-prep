"use client"

import React, { useState, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSyllabus, saveSyllabus, deleteSubject, deleteTopic, deleteSubtopic, saveNote, getNote, getNotes, getProgress } from "@/utils/localStorage"
import { ArrowLeft, Trash2, CheckCircle2, AlertCircle, Clock, Star } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { Syllabus, Note } from "@/types"
import { useRouter } from "next/router"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedList } from "@/components/ui/animated-list"
import { AnimatedProgress } from "@/components/ui/animated-progress"
import { toast } from "react-hot-toast"

interface Priority {
  [key: string]: 'high' | 'none';
}

interface Timeline {
  [key: string]: string;
}

interface Progress {
  [key: string]: {
    completed: number;
    total: number;
    status: 'onTrack' | 'behind' | 'atRisk';
  };
}

export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState<Syllabus[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState("")
  const [newTopic, setNewTopic] = useState("")
  const [newSubtopic, setNewSubtopic] = useState("")
  const [priorities, setPriorities] = useState<Priority>({})
  const [timelines, setTimelines] = useState<Timeline>({})
  const [progress, setProgress] = useState<Record<string, Progress>>({})
  const [notes, setNotes] = useState<Note[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>("")
  const [noteContent, setNoteContent] = useState<string>("")
  const [itemToDelete, setItemToDelete] = useState<{ type: 'subject' | 'topic' | 'subtopic', name: string } | null>(null)
  const [highPriorityCount, setHighPriorityCount] = useState(0)
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const loadedSyllabus = getSyllabus();
    const savedNotes = getNotes();
    setSyllabus(loadedSyllabus);
    setNotes(savedNotes);
    
    // Initialize priorities and timelines
    const initialPriorities: Priority = {};
    const initialTimelines: Timeline = {};
    const initialProgress: Progress = {};
    
    loadedSyllabus.forEach(subject => {
      initialPriorities[subject.subject] = 'none';
      initialTimelines[subject.subject] = '';
      initialProgress[subject.subject] = getProgress(subject.subject);
    });
    
    setPriorities(initialPriorities);
    setTimelines(initialTimelines);
    setProgress(initialProgress);
  }, []);

  const handleAddSubjects = () => {
    if (newSubject.trim()) {
      const subjects = newSubject.split(",").map(s => s.trim()).filter(s => s)
      const newSyllabus = [...syllabus]
      subjects.forEach(subject => {
        if (!newSyllabus.find(s => s.subject === subject)) {
          newSyllabus.push({
            subject,
            priority: 'none',
            topics: []
          })
          setProgress(prev => ({
            ...prev,
            [subject]: { completed: 0, total: 0, status: 'onTrack' }
          }))
        }
      })
      setSyllabus(newSyllabus)
      setNewSubject("")
    }
  }

  const handleAddTopic = () => {
    if (selectedSubject && newTopic.trim()) {
      const newSyllabus = syllabus.map(s => {
        if (s.subject === selectedSubject) {
          return {
            ...s,
            topics: [...s.topics, { topic: newTopic, subtopics: [] }]
          }
        }
        return s
      })
      setSyllabus(newSyllabus)
      setNewTopic("")
      setProgress(prev => ({
        ...prev,
        [`${selectedSubject}-${newTopic}`]: { completed: 0, total: 0, status: 'onTrack' }
      }))
    }
  }

  const handleAddSubtopic = () => {
    if (selectedSubject && selectedTopic && newSubtopic.trim()) {
      const newSyllabus = syllabus.map(s => {
        if (s.subject === selectedSubject) {
          return {
            ...s,
            topics: s.topics.map(t => {
              if (t.topic === selectedTopic) {
                return {
                  ...t,
                  subtopics: [...t.subtopics, { name: newSubtopic, completed: false }]
                }
              }
              return t
            })
          }
        }
        return s
      })
      setSyllabus(newSyllabus)
      setNewSubtopic("")
      setProgress(prev => ({
        ...prev,
        [`${selectedSubject}-${selectedTopic}`]: {
          ...prev[`${selectedSubject}-${selectedTopic}`],
          total: (prev[`${selectedSubject}-${selectedTopic}`]?.total || 0) + 1
        }
      }))
    }
  }

  const handleAddNote = () => {
    if (selectedSubject && selectedTopic && selectedSubtopic && noteContent.trim()) {
      const newNote: Note = {
        subject: selectedSubject,
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        content: noteContent
      }
      setNotes(prev => [...prev, newNote])
      setNoteContent("")
    }
  }

  const handleDeleteSubject = (subject: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const notesToDelete = notes.filter(noteItem => noteItem.subject === subject).length
    if (notesToDelete > 0) {
      setItemToDelete({ type: 'subject', name: subject })
      setShowDeleteDialog(true)
    } else {
      setSyllabus(prev => prev.filter(s => s.subject !== subject))
    }
  }

  const handleDeleteTopic = (subject: string, topic: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const notesToDelete = notes.filter(noteItem => noteItem.subject === subject && noteItem.topic === topic).length
    if (notesToDelete > 0) {
      setItemToDelete({ type: 'topic', name: topic })
      setShowDeleteDialog(true)
    } else {
      setSyllabus(prev => prev.map(s => {
        if (s.subject === subject) {
          return {
            ...s,
            topics: s.topics.filter(t => t.topic !== topic)
          }
        }
        return s
      }))
    }
  }

  const handleDeleteSubtopic = (subject: string, topic: string, subtopic: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const notesToDelete = notes.filter(noteItem => 
      noteItem.subject === subject && 
      noteItem.topic === topic && 
      noteItem.subtopic === subtopic
    ).length
    if (notesToDelete > 0) {
      setItemToDelete({ type: 'subtopic', name: subtopic })
      setShowDeleteDialog(true)
    } else {
      setSyllabus(prev => prev.map(s => {
        if (s.subject === subject) {
          return {
            ...s,
            topics: s.topics.map(t => {
              if (t.topic === topic) {
                return {
                  ...t,
                  subtopics: t.subtopics.filter(st => st.name !== subtopic)
                }
              }
              return t
            })
          }
        }
        return s
      }))
    }
  }

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    const { type, name } = itemToDelete;

    switch (type) {
      case 'subject':
        deleteSubject(name, () => {
          setSyllabus(getSyllabus());
          setShowDeleteDialog(false);
        });
        break;
      case 'topic':
        if (name) {
          deleteTopic(name, name, () => {
            setSyllabus(getSyllabus());
            setShowDeleteDialog(false);
          });
        }
        break;
      case 'subtopic':
        if (name) {
          deleteSubtopic(name, name, name, () => {
            setSyllabus(getSyllabus());
            setShowDeleteDialog(false);
          });
        }
        break;
    }
  };

  const handlePriorityChange = (subject: string) => {
    const currentPriority = priorities[subject];
    const newPriority = currentPriority === 'high' ? 'none' : 'high';
    
    // Count current high priority subjects
    const highPriorityCount = Object.values(priorities).filter(p => p === 'high').length;
    
    if (newPriority === 'high' && highPriorityCount >= 4) {
      toast.error('You can only have up to 4 high priority subjects');
      return;
    }
    
    setPriorities(prev => ({
      ...prev,
      [subject]: newPriority
    }));
  };

  const handleTimelineChange = (subject: string, days: number) => {
    if (days < 5 || days > 60) return;
    
    const newTimelines = { ...timelines, [subject]: days.toString() };
    setTimelines(newTimelines);
    
    const updatedSyllabus = syllabus.map(s => {
      if (s.subject === subject) {
        const totalSubtopics = s.topics.reduce((sum, t) => sum + t.subtopics.length, 0);
        const dailyTarget = Math.ceil(totalSubtopics / days);
        const plan: { day: number; subtopics: string[] }[] = [];
        let subtopics = s.topics.flatMap(t => t.subtopics.map(st => st.name));
        
        for (let day = 1; subtopics.length > 0; day++) {
          plan.push({ day, subtopics: subtopics.splice(0, dailyTarget) });
        }
        
        return {
          ...s,
          timeline: { days, startDate: new Date().toISOString() },
          plan
        };
      }
      return s;
    });
    
    setSyllabus(updatedSyllabus);
    saveSyllabus(updatedSyllabus);
    setProgress(prev => ({ ...prev, [subject]: getProgress(subject) }));
  };

  const getProgress = (key: string): Progress => {
    return progress[key] || { completed: 0, total: 0, status: 'onTrack' as const }
  }

  const compareProgress = (key1: string, key2: string): number => {
    const prog1 = getProgress(key1)
    const prog2 = getProgress(key2)
    return prog1.completed - prog2.completed
  }

  const handleSubtopicToggle = (subject: string, topic: string, subtopic: string, checked: boolean) => {
    setSyllabus(prev => prev.map(s => {
      if (s.subject === subject) {
        return {
          ...s,
          topics: s.topics.map(t => {
            if (t.topic === topic) {
              return {
                ...t,
                subtopics: t.subtopics.map(st => {
                  if (st.name === subtopic) {
                    return { ...st, completed: checked }
                  }
                  return st
                })
              }
            }
            return t
          })
        }
      }
      return s
    }))

    const progressKey = `${subject}-${topic}`
    const currentProgress = getProgress(progressKey)
    
    setProgress(prev => ({
      ...prev,
      [progressKey]: {
        ...currentProgress,
        completed: currentProgress.completed + (checked ? 1 : -1),
        status: 'onTrack' as const
      }
    }))
  }

  const handleSubtopicClick = (subject: string, topic: string, subtopic: string) => {
    router.push(`/notes/edit?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
  };

  const getStatusBadge = (status: Progress['status']) => {
    switch (status) {
      case 'onTrack':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            On Track
          </span>
        );
      case 'behind':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Behind
          </span>
        );
      case 'atRisk':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            At Risk
          </span>
        );
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, y: 20 },
    visible: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Syllabus</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="New subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-48"
          />
          <Button onClick={handleAddSubjects} className="w-full">
            Add Subject
          </Button>
        </div>
      </motion.div>

      <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {syllabus.map((subject) => (
          <AnimatedCard
            key={subject.subject}
            title={subject.subject}
            className={`relative overflow-hidden ${
              priorities[subject.subject] === 'high' ? 'border-yellow-500' : ''
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${subject.subject}`}
                    checked={priorities[subject.subject] === 'high'}
                    onCheckedChange={(checked) => {
                      if (typeof checked === "boolean") {
                        handlePriorityChange(subject.subject)
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">High Priority</span>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Timeline (days)</label>
                  <Input
                    type="number"
                    value={timelines[subject.subject] || ''}
                    onChange={(e) => {
                      const days = parseInt(e.target.value);
                      if (!isNaN(days) && days >= 5 && days <= 60) {
                        setTimelines(prev => ({ ...prev, [subject.subject]: days.toString() }));
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <AnimatedProgress value={progress[subject.subject]?.completed || 0} total={progress[subject.subject]?.total || 1} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="New topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddTopic}
                    size="sm"
                  >
                    Add Topic
                  </Button>
                </div>

                <AnimatedList className="space-y-2">
                  {subject.topics.map((topic) => (
                    <div key={topic.topic} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {topic.topic}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTopic(subject.subject, topic.topic, e);
                          }}
                        >
                          Delete
                        </Button>
                      </div>

                      <div className="space-y-2 pl-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="New subtopic"
                            value={newSubtopic}
                            onChange={(e) => setNewSubtopic(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleAddSubtopic}
                            size="sm"
                          >
                            Add Subtopic
                          </Button>
                        </div>

                        <AnimatedList className="space-y-1">
                          {topic.subtopics.map((subtopic) => (
                            <div
                              key={subtopic.name}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={subtopic.completed}
                                  onCheckedChange={(checked) =>
                                    handleSubtopicToggle(subject.subject, topic.topic, subtopic.name, checked)
                                  }
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {subtopic.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubtopic(subject.subject, topic.topic, subtopic.name, e);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                        </AnimatedList>
                      </div>
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </AnimatedList>

      {showDeleteDialog && (
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleConfirmDelete}
          title={`Delete ${itemToDelete?.type?.charAt(0).toUpperCase() + itemToDelete?.type?.slice(1)}: ${itemToDelete?.name}`}
          description={
            <div className="space-y-2 pt-2">
              <p>This will permanently delete:</p>
              <ul className="list-disc pl-4 space-y-1">
                {itemToDelete?.type === 'subject' && (
                  <>
                    <li>All topics under this subject</li>
                    <li>All subtopics under this subject</li>
                  </>
                )}
                {itemToDelete?.type === 'topic' && (
                  <>
                    <li>All subtopics under this topic</li>
                  </>
                )}
                {itemToDelete?.type === 'subtopic' && (
                  <>
                    <li>{itemToDelete.name} note(s) associated with this subtopic</li>
                  </>
                )}
              </ul>
              <p className="text-destructive font-medium pt-2">This action cannot be undone.</p>
            </div>
          }
          deleteButtonText="Delete"
        />
      )}
    </div>
  )
}
