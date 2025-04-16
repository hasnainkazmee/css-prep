"use client"

import React from "react"
import { motion, useReducedMotion } from "framer-motion"

interface AnimatedListProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
  const shouldReduceMotion = useReducedMotion()

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
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {child}
        </motion.li>
      ))}
    </motion.ul>
  )
} 