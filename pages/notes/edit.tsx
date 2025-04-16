import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNote, saveNote } from "@/utils/localStorage";
import { ArrowLeft, Save, Download, Bold, Italic, List, ListOrdered, Image, Heading1, Heading2, Heading3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EditPage() {
  const router = useRouter();
  const { subject, topic, subtopic } = router.query;
  const [markdown, setMarkdown] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved content
  useEffect(() => {
    if (subject && topic && subtopic) {
      const savedContent = getNote(String(subject), String(topic), String(subtopic));
      setMarkdown(savedContent || `# ${decodeURIComponent(String(subtopic))}\n\n`);
      setIsSaved(true);
    }
  }, [subject, topic, subtopic]);

  // Focus editor on mount
  useEffect(() => {
    if (textareaRef.current && activeTab === "edit") {
      textareaRef.current.focus();
    }
  }, [activeTab]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdown(newContent);
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    if (subject && topic && subtopic) {
      saveNote({
        subject: String(subject),
        topic: String(topic),
        subtopic: String(subtopic),
        content: markdown
      });
      setIsSaved(true);
    }
  }, [markdown, subject, topic, subtopic]);

  const handleBack = useCallback(() => {
    router.push('/notes');
  }, [router]);

  const handleExport = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subtopic ? decodeURIComponent(String(subtopic)) : "notes"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown, subtopic]);

  const handleFormat = useCallback((format: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = textareaRef.current.value;
      let newText = text;

      switch (format) {
        case 'bold':
          newText = text.substring(0, start) + '**' + text.substring(start, end) + '**' + text.substring(end);
          break;
        case 'italic':
          newText = text.substring(0, start) + '_' + text.substring(start, end) + '_' + text.substring(end);
          break;
        case 'h1':
          newText = text.substring(0, start) + '# ' + text.substring(start, end) + text.substring(end);
          break;
        case 'h2':
          newText = text.substring(0, start) + '## ' + text.substring(start, end) + text.substring(end);
          break;
        case 'h3':
          newText = text.substring(0, start) + '### ' + text.substring(start, end) + text.substring(end);
          break;
        case 'list':
          newText = text.substring(0, start) + '- ' + text.substring(start, end) + text.substring(end);
          break;
        case 'ordered':
          newText = text.substring(0, start) + '1. ' + text.substring(start, end) + text.substring(end);
          break;
      }

      setMarkdown(newText);
      setIsSaved(false);
      
      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + (format === 'bold' ? 2 : format === 'italic' ? 1 : format.startsWith('h') ? 2 : 3);
          textareaRef.current.selectionEnd = end + (format === 'bold' ? 2 : format === 'italic' ? 1 : format.startsWith('h') ? 2 : 3);
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, []);

  if (!subject || !topic || !subtopic) {
    return <div>Missing required parameters</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {subtopic ? decodeURIComponent(String(subtopic)) : "Notes"}
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              isSaved ? "text-gray-500 dark:text-gray-400" : "text-yellow-600 dark:text-yellow-400"
            )}
          >
            {isSaved ? "All changes saved" : "Unsaved changes"}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaved}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900 dark:text-gray-100">Note Editor</CardTitle>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="edit" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">Preview</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {activeTab === "edit" && (
            <div className="flex space-x-1 mt-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('h1')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('h2')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('h3')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('bold')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('italic')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('list')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Bulleted List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFormat('ordered')}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-0">
            {activeTab === "edit" ? (
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={handleInput}
                className="w-full min-h-[60vh] p-4 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                style={{ fontFamily: 'monospace' }}
              />
            ) : (
              <div className="w-full min-h-[60vh] p-4 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md overflow-auto prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 