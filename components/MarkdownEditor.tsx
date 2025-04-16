"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isBlinking, setIsBlinking] = useState(true)

  // Blink cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Sync scroll positions
  const handleScroll = () => {
    if (textareaRef.current && previewRef.current) {
      previewRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // Calculate cursor position in rendered markdown
  const updateCursorPosition = () => {
    if (!textareaRef.current || !cursorRef.current || !previewRef.current) return

    const textarea = textareaRef.current
    const cursor = cursorRef.current
    const preview = previewRef.current

    // Get cursor position in textarea
    const pos = textarea.selectionStart
    setCursorPosition(pos)

    // Get text up to cursor position
    const textBeforeCursor = value.substring(0, pos)

    // Create a temporary element to measure rendered text
    const temp = document.createElement('div')
    temp.className = 'prose prose-sm max-w-none'
    temp.innerHTML = textBeforeCursor
    preview.appendChild(temp)

    // Get the last text node's position
    const lastTextNode = temp.lastChild
    if (lastTextNode) {
      const range = document.createRange()
      range.selectNodeContents(lastTextNode)
      range.collapse(false)
      const rect = range.getBoundingClientRect()
      const previewRect = preview.getBoundingClientRect()
      
      cursor.style.left = `${rect.right - previewRect.left}px`
      cursor.style.top = `${rect.top - previewRect.top}px`
    }

    // Clean up
    preview.removeChild(temp)
  }

  // Handle cursor movement
  const handleCursorChange = () => {
    updateCursorPosition()
  }

  // Handle formatting
  const applyFormatting = (format: string) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    let formattedText = ""

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "link":
        formattedText = `[${selectedText}](url)`
        break
      case "code":
        formattedText = `\`${selectedText}\``
        break
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end)
    onChange(newValue)

    // Set cursor position after formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(start + formattedText.length, start + formattedText.length)
        updateCursorPosition()
      }
    }, 0)
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => applyFormatting("bold")}
        >
          <strong>B</strong>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => applyFormatting("italic")}
        >
          <em>I</em>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => applyFormatting("link")}
        >
          <span className="text-sm">🔗</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => applyFormatting("code")}
        >
          <code className="text-sm">`</code>
        </Button>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onSelect={handleCursorChange}
          onKeyUp={handleCursorChange}
          onMouseUp={handleCursorChange}
          className="w-full h-[60vh] p-4 font-mono text-sm bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-ring relative z-10"
          style={{ 
            color: "transparent",
            caretColor: "transparent",
            resize: "none",
            WebkitTextFillColor: "transparent"
          }}
        />
        <div
          ref={previewRef}
          className="absolute inset-0 w-full h-[60vh] p-4 overflow-auto bg-background border rounded-md prose prose-sm max-w-none dark:prose-invert pointer-events-none select-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-4xl font-bold" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-3xl font-bold" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-bold" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-xl font-bold" {...props} />,
              h5: ({ node, ...props }) => <h5 className="text-lg font-bold" {...props} />,
              h6: ({ node, ...props }) => <h6 className="text-base font-bold" {...props} />,
              p: ({ node, ...props }) => <p className="my-2" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
              em: ({ node, ...props }) => <em className="italic" {...props} />,
              code: ({ node, className, children, ...props }) => (
                <code
                  className={`${
                    (props as any).inline ? "bg-muted px-1 py-0.5 rounded" : "block bg-muted p-2 rounded"
                  } font-mono text-sm ${className || ''}`}
                >
                  {children}
                </code>
              ),
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
              li: ({ node, ...props }) => <li className="my-1" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-blue-600 hover:underline dark:text-blue-400" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
              ),
            }}
          >
            {value}
          </ReactMarkdown>
          <div
            ref={cursorRef}
            className={`absolute w-0.5 h-6 bg-black dark:bg-white transition-opacity duration-200 ${
              isBlinking ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              pointerEvents: 'none',
              zIndex: 20,
              position: 'absolute',
              transform: 'translateY(-50%)'
            }}
          />
        </div>
      </div>
    </div>
  )
} 