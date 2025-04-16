"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, BookOpen, Calendar, ArrowUpRight } from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  url: string
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockArticles: Article[] = [
      {
        id: "1",
        title: "Understanding Pakistan's Foreign Policy Challenges",
        description: "An in-depth analysis of the current geopolitical situation and its implications for Pakistan.",
        category: "international-relations",
        date: "2025-04-10",
        readTime: "8 min read",
        url: "#",
      },
      {
        id: "2",
        title: "Economic Reforms: Past, Present and Future",
        description: "A comprehensive overview of Pakistan's economic journey and future prospects.",
        category: "economy",
        date: "2025-04-05",
        readTime: "12 min read",
        url: "#",
      },
      {
        id: "3",
        title: "Constitutional Amendments: A Historical Perspective",
        description: "Tracing the evolution of Pakistan's constitution through major amendments.",
        category: "law",
        date: "2025-03-28",
        readTime: "10 min read",
        url: "#",
      },
      {
        id: "4",
        title: "Climate Change and Pakistan: Policy Responses",
        description: "Examining Pakistan's vulnerability to climate change and policy measures to address it.",
        category: "environment",
        date: "2025-03-20",
        readTime: "7 min read",
        url: "#",
      },
      {
        id: "5",
        title: "Education System Reforms: Challenges and Opportunities",
        description: "Critical analysis of Pakistan's education system and potential reform pathways.",
        category: "education",
        date: "2025-03-15",
        readTime: "9 min read",
        url: "#",
      },
      {
        id: "6",
        title: "Governance and Public Administration in Pakistan",
        description: "Exploring the structures, challenges, and reform needs in Pakistan's governance systems.",
        category: "governance",
        date: "2025-03-10",
        readTime: "11 min read",
        url: "#",
      },
    ]

    setArticles(mockArticles)
    setLoading(false)
  }, [])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return article.category === activeTab && matchesSearch
  })

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "international-relations", label: "International Relations" },
    { id: "economy", label: "Economy" },
    { id: "law", label: "Law & Constitution" },
    { id: "environment", label: "Environment" },
    { id: "education", label: "Education" },
    { id: "governance", label: "Governance" },
  ]

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Curated articles and resources to help with your CSS/PMS preparation
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:max-w-xs"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto overflow-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">No articles found</h2>
          <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription className="mt-1">{article.description}</CardDescription>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                    {categories.find((c) => c.id === article.category)?.label.split(" ")[0]}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{article.readTime}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full justify-between">
                  Read Article
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
