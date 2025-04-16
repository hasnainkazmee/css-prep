"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnimatedCardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function AnimatedCard({ title, children, className = "" }: AnimatedCardProps) {
  const shouldReduceMotion = useReducedMotion()
  
  const variants = {
    hidden: shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 },
    visible: shouldReduceMotion ? {} : { opacity: 1, scale: 1 },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      <Card className="bg-gray-50 dark:bg-gray-700">
        {title && (
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
} 