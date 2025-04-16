"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye } from "lucide-react"

interface PastPaper {
  id: string
  year: string
  subject: string
  paperType: string
  language: string
  downloadUrl: string
  viewUrl: string
}

export default function PastPapers() {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockPastPapers: PastPaper[] = [
      {
        id: "1",
        year: "2024",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "2",
        year: "2024",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "3",
        year: "2023",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "4",
        year: "2023",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "5",
        year: "2022",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "6",
        year: "2022",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "7",
        year: "2021",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "8",
        year: "2021",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "9",
        year: "2020",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "10",
        year: "2020",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "11",
        year: "2019",
        subject: "Pakistan Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
      {
        id: "12",
        year: "2019",
        subject: "Current Affairs",
        paperType: "Compulsory",
        language: "English",
        downloadUrl: "#",
        viewUrl: "#",
      },
    ]

    setPastPapers(mockPastPapers)
    setLoading(false)
  }, [])

  const filteredPapers = pastPapers.filter((paper) => {
    const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesYear = yearFilter === "all" || paper.year === yearFilter
    const matchesSubject = subjectFilter === "all" || paper.subject === subjectFilter

    return matchesSearch && matchesYear && matchesSubject
  })

  const years = ["all", ...Array.from(new Set(pastPapers.map((paper) => paper.year)))].sort((a, b) =>
    b.localeCompare(a),
  )
  const subjects = ["all", ...Array.from(new Set(pastPapers.map((paper) => paper.subject)))].sort()

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Past Papers</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and download past CSS/PMS examination papers</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />

        <div className="flex flex-wrap gap-4">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject === "all" ? "All Subjects" : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPapers.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">No past papers found</h2>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {paper.subject}
                    <Badge variant="outline" className="ml-2">
                      {paper.year}
                    </Badge>
                  </CardTitle>
                </div>
                <CardDescription className="mt-1">
                  {paper.paperType} Paper • {paper.language}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>CSS Examination {paper.year}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="default" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
