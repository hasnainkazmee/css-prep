"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getExamPapers, getQuestions, updateQuestions, awardPoints, type Question } from "@/utils/localStorage"
import { FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function ExamRoom() {
  const [examPapers, setExamPapers] = useState<any[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeTab, setActiveTab] = useState("past-papers")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form state for adding new questions
  const [newQuestion, setNewQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    setExamPapers(getExamPapers())
    setQuestions(getQuestions())
    setLoading(false)
  }, [])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || options.some((opt) => !opt.trim()) || correctAnswer === null) {
      setSubmitError("Please fill in all fields and select a correct answer")
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      const newQuestionObj: Question = {
        id: Date.now().toString(),
        question: newQuestion,
        options: [...options],
        correctAnswer,
      }

      const updatedQuestions = [...questions, newQuestionObj]
      setQuestions(updatedQuestions)
      updateQuestions(updatedQuestions)

      // Reset form
      setNewQuestion("")
      setOptions(["", "", "", ""])
      setCorrectAnswer(null)
      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError("Failed to add question. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const startQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
  }

  const handleAnswerSelection = (answerIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    const currentQuestion = questions[currentQuestionIndex]
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prevScore) => prevScore + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setQuizCompleted(true)
      // Award points for completing the quiz
      awardPoints(10)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exam Room</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Practice with past papers and test your knowledge</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="past-papers">Past Papers</TabsTrigger>
          <TabsTrigger value="practice-mcqs">Practice MCQs</TabsTrigger>
        </TabsList>

        <TabsContent value="past-papers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examPapers.map((paper) => (
              <Card key={paper.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    {paper.year} Past Paper
                  </CardTitle>
                  <CardDescription>{paper.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and practice with the official CSS exam paper from {paper.year}.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Paper
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice-mcqs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
                <CardDescription>Create your own multiple-choice questions for practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter your question here"
                    disabled={submitting}
                  />
                </div>

                {options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                    <Input
                      id={`option-${index}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Enter option ${index + 1}`}
                      disabled={submitting}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <RadioGroup
                    value={correctAnswer?.toString()}
                    onValueChange={(value) => setCorrectAnswer(Number.parseInt(value))}
                  >
                    {options.map((_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                        <Label htmlFor={`answer-${index}`}>Option {index + 1}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {submitError && (
                  <div className="text-red-500 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{submitError}</span>
                  </div>
                )}
                {submitSuccess && (
                  <div className="text-green-500 text-sm flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Question added successfully!</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddQuestion}
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting ? "Adding..." : "Add Question"}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice Quiz</CardTitle>
                <CardDescription>Test your knowledge with {questions.length} questions</CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No questions available. Add some questions to start practicing.
                    </p>
                  </div>
                ) : quizCompleted ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-600 dark:text-green-400" />
                    <h3 className="text-xl font-bold">Quiz Completed!</h3>
                    <p className="text-lg">
                      Your score: {score} / {questions.length}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You've earned 10 points for completing this quiz.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <span>Score: {score}</span>
                    </div>

                    <div className="font-medium text-lg">{questions[currentQuestionIndex].question}</div>

                    <RadioGroup
                      value={selectedAnswer?.toString()}
                      onValueChange={(value) => handleAnswerSelection(Number.parseInt(value))}
                      className="space-y-2"
                    >
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 p-2 rounded-md ${
                            isAnswered && index === questions[currentQuestionIndex].correctAnswer
                              ? "bg-green-100 dark:bg-green-900/30"
                              : isAnswered &&
                                  index === selectedAnswer &&
                                  index !== questions[currentQuestionIndex].correctAnswer
                                ? "bg-red-100 dark:bg-red-900/30"
                                : ""
                          }`}
                        >
                          <RadioGroupItem value={index.toString()} id={`quiz-option-${index}`} disabled={isAnswered} />
                          <Label htmlFor={`quiz-option-${index}`} className="flex-1">
                            {option}
                          </Label>
                          {isAnswered && index === questions[currentQuestionIndex].correctAnswer && (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                          {isAnswered &&
                            index === selectedAnswer &&
                            index !== questions[currentQuestionIndex].correctAnswer && (
                              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {quizCompleted ? (
                  <Button onClick={startQuiz} className="w-full">
                    Restart Quiz
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} disabled={!isAnswered} className="w-full">
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
