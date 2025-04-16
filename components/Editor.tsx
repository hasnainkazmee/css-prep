"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNote, saveNote } from "@/utils/localStorage";
import { ArrowLeft, Save, Download, Bold, Italic, List, ListOrdered, Image, Heading1, Heading2, Heading3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/utils/localStorage";

export default function NoteEditor() {
  const router = useRouter();
  const { subject, topic, subtopic } = router.query;
  const [content, setContent] = useState<string>(`<h1>${subtopic ? decodeURIComponent(subtopic as string) : "Untitled"}</h1>`);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSaved, setIsSaved] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Virtual DOM state
  const virtualDOM = useRef<{
    nodes: Node[];
    selection: {
      anchorNode: Node | null;
      anchorOffset: number;
      focusNode: Node | null;
      focusOffset: number;
    } | null;
  }>({
    nodes: [],
    selection: null
  });

  // Load saved content
  useEffect(() => {
    if (subject && topic && subtopic) {
      const savedContent = getNote(subject as string, topic as string, subtopic as string);
      setContent(savedContent || `<h1>${subtopic ? decodeURIComponent(subtopic as string) : "Untitled"}</h1>`);
      setIsSaved(true);
    }
  }, [subject, topic, subtopic]);

  // Focus editor and set initial cursor
  useEffect(() => {
    if (editorRef.current && activeTab === "edit") {
      editorRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [activeTab]);

  // Sanitize HTML to allow only permitted tags
  const sanitizeContent = useCallback((html: string): string => {
    const allowedTags = ["h1", "h2", "h3", "p", "ul", "ol", "li", "strong", "em", "img"];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = doc.body.getElementsByTagName("*");

    for (let i = elements.length - 1; i >= 0; i--) {
      const tag = elements[i].tagName.toLowerCase();
      if (!allowedTags.includes(tag)) {
        const parent = elements[i].parentNode;
        if (parent) {
          while (elements[i].firstChild) {
            const child = elements[i].firstChild;
            if (child) {
              parent.insertBefore(child, elements[i]);
            }
          }
          parent.removeChild(elements[i]);
        }
      }
    }

    return doc.body.innerHTML.replace(/<(div|br)[^>]*>/gi, "");
  }, []);

  // Parse HTML into virtual DOM
  const parseToVirtualDOM = useCallback((html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes);
  }, []);

  // Update virtual DOM from real DOM
  const updateVirtualDOM = useCallback(() => {
    if (editorRef.current) {
      virtualDOM.current.nodes = Array.from(editorRef.current.childNodes);
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        virtualDOM.current.selection = {
          anchorNode: range.startContainer,
          anchorOffset: range.startOffset,
          focusNode: range.endContainer,
          focusOffset: range.endOffset
        };
      }
    }
  }, []);

  // Restore selection in virtual DOM
  const restoreVirtualSelection = useCallback(() => {
    if (editorRef.current && virtualDOM.current.selection) {
      const selection = window.getSelection();
      const range = document.createRange();
      
      try {
        range.setStart(virtualDOM.current.selection.anchorNode!, virtualDOM.current.selection.anchorOffset);
        range.setEnd(virtualDOM.current.selection.focusNode!, virtualDOM.current.selection.focusOffset);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        // If selection restoration fails, place cursor at end
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, []);

  // Handle input with virtual DOM
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      updateVirtualDOM();
      
      const newContent = editorRef.current.innerHTML;
      const sanitizedContent = sanitizeContent(newContent);
      
      if (sanitizedContent !== content) {
        setContent(sanitizedContent);
        setIsSaved(false);
      }
    }
  }, [content, sanitizeContent, updateVirtualDOM]);

  // Restore virtual DOM after content updates
  useEffect(() => {
    if (editorRef.current) {
      requestAnimationFrame(() => {
        restoreVirtualSelection();
      });
    }
  }, [content, restoreVirtualSelection]);

  // Initialize virtual DOM
  useEffect(() => {
    if (editorRef.current) {
      virtualDOM.current.nodes = parseToVirtualDOM(content);
    }
  }, [content, parseToVirtualDOM]);

  // Handle keyboard shortcuts and H1 protection
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            document.execCommand("bold", false);
            handleInput();
            break;
          case "i":
            e.preventDefault();
            document.execCommand("italic", false);
            handleInput();
            break;
          case "1":
            e.preventDefault();
            document.execCommand("formatBlock", false, "h1");
            handleInput();
            break;
          case "2":
            e.preventDefault();
            document.execCommand("formatBlock", false, "h2");
            handleInput();
            break;
          case "3":
            e.preventDefault();
            document.execCommand("formatBlock", false, "h3");
            handleInput();
            break;
          case "7":
            if (e.shiftKey) {
              e.preventDefault();
              document.execCommand("insertOrderedList", false);
              handleInput();
            }
            break;
          case "8":
            if (e.shiftKey) {
              e.preventDefault();
              document.execCommand("insertUnorderedList", false);
              handleInput();
            }
            break;
        }
      } else if (e.key === "Backspace" && editorRef.current) {
        const h1 = editorRef.current.querySelector("h1");
        if (
          h1 &&
          editorRef.current.childNodes.length === 1 &&
          window.getSelection()?.anchorNode?.parentElement?.tagName === "H1"
        ) {
          e.preventDefault();
        }
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.execCommand('insertLineBreak');
        handleInput();
      }
    },
    [handleInput]
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          document.execCommand("insertHTML", false, `<img src="${reader.result}" class="max-w-full h-auto rounded mb-2">`);
          handleInput();
        };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid or too large image. Max 2MB.");
      }
    },
    [handleInput]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/") && file.size < 2 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = () => {
          document.execCommand("insertHTML", false, `<img src="${reader.result}" class="max-w-full h-auto rounded mb-2">`);
          handleInput();
        };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid or too large image. Max 2MB.");
      }
    },
    [handleInput]
  );

  const handleSave = useCallback(() => {
    if (subject && topic && subtopic) {
      saveNote(
        subject as string,
        topic as string,
        subtopic as string,
        sanitizeContent(content)
      );
      setIsSaved(true);
    }
  }, [content, subject, topic, subtopic, sanitizeContent]);

  const handleExport = useCallback(() => {
    const blob = new Blob([sanitizeContent(content)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subtopic ? decodeURIComponent(subtopic as string) : "notes"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, subtopic]);

  const renderPreview = (html: string) => {
    // For preview, ensure safe rendering
    const previewContent = sanitizeContent(html);
    return previewContent;
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/notes")}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {subtopic ? decodeURIComponent(subtopic as string) : "Notes"}
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
                onClick={() => document.execCommand("formatBlock", false, "h1")}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 1 (Ctrl+1)"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("formatBlock", false, "h2")}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 2 (Ctrl+2)"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("formatBlock", false, "h3")}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Heading 3 (Ctrl+3)"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("bold", false)}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("italic", false)}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("insertUnorderedList", false)}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Bulleted List (Ctrl+Shift+8)"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => document.execCommand("insertOrderedList", false)}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Numbered List (Ctrl+Shift+7)"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Insert Image"
              >
                <Image className="h-4 w-4" />
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-0">
            {activeTab === "edit" ? (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onClick={handleInput}
                onKeyDown={handleKeyDown}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full min-h-[60vh] p-4 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                style={{ caretColor: "currentColor" }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div
                className="w-full min-h-[60vh] p-4 text-base text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-md overflow-auto"
                dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}