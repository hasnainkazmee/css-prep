"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedProgressProps {
  value: number
  total?: number
  className?: string
}

export function AnimatedProgress({ value, total = 100, className }: AnimatedProgressProps) {
  const shouldReduceMotion = useReducedMotion()
  const percentage = Math.min(100, Math.max(0, (value / total) * 100))

  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700", className)}>
      <motion.div
        className="bg-blue-600 h-2.5 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.5,
          ease: "easeOut",
        }}
      />
    </div>
  )
} 