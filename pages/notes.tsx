"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNotes, saveNote } from "@/utils/localStorage"
import { ArrowLeft, Save, Download, Bold, Italic, List, Link } from "lucide-react"

export default function Notes() {
  const router = useRouter()
  const { subtopicId, subtopicName } = router.query
  const [content, setContent] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  const [isSaved, setIsSaved] = useState(true)

  useEffect(() => {
    if (subtopicId) {
      const savedContent = getNotes(subtopicId as string)
      setContent(savedContent)
    }
  }, [subtopicId])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setIsSaved(false)
  }

  const handleSave = () => {
    if (subtopicId) {
      saveNote(subtopicId as string, content)
      setIsSaved(true)
    }
  }

  const handleExport = () => {
    // Create a blob with the content
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = `${subtopicName || "notes"}.md`
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = ""

    switch (format) {
      case "bold":
        newText = `**${selectedText}**`
        break
      case "italic":
        newText = `*${selectedText}*`
        break
      case "list":
        newText = `\n- ${selectedText}`
        break
      case "link":
        newText = `[${selectedText}](url)`
        break
      default:
        newText = selectedText
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)
    setIsSaved(false)

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + newText.length, start + newText.length)
    }, 0)
  }

  // Simple markdown to HTML converter
  const renderMarkdown = (text: string) => {
    if (!text) return ""

    // Convert headers
    let html = text.replace(/^# (.*?)$/gm, "<h1>$1</h1>")
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>")
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>")

    // Convert bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Convert lists
    html = html.replace(/^- (.*?)$/gm, "<li>$1</li>")
    html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>")

    // Convert links
    html = html.replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // Convert line breaks
    html = html.replace(/\n/g, "<br />")

    return html
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {subtopicName ? decodeURIComponent(subtopicName as string) : "Notes"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{isSaved ? "All changes saved" : "Unsaved changes"}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave} disabled={isSaved}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Note Editor</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {activeTab === "edit" && (
            <div className="flex space-x-1 mt-2">
              <Button variant="outline" size="icon" onClick={() => insertFormatting("bold")}>
                <Bold className="h-4 w-4" />
                <span className="sr-only">Bold</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertFormatting("italic")}>
                <Italic className="h-4 w-4" />
                <span className="sr-only">Italic</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertFormatting("list")}>
                <List className="h-4 w-4" />
                <span className="sr-only">List</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => insertFormatting("link")}>
                <Link className="h-4 w-4" />
                <span className="sr-only">Link</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-0">
            {activeTab === "edit" ? (
              <textarea
                id="markdown-editor"
                className="w-full h-[60vh] p-4 border rounded-md font-mono text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content}
                onChange={handleContentChange}
                placeholder="# Start typing your notes here...

Use Markdown syntax for formatting:
- # Header 1
- ## Header 2
- **Bold text**
- *Italic text*
- - List item
- [Link text](url)"
              ></textarea>
            ) : (
              <div
                className="w-full h-[60vh] p-4 border rounded-md overflow-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              ></div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
