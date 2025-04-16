"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Button, ButtonProps } from "@/components/ui/button"

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode
}

export function AnimatedButton({ children, ...props }: AnimatedButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    rest: { scale: 1 },
    hover: shouldReduceMotion ? {} : { scale: 1.05 },
    tap: shouldReduceMotion ? {} : { scale: 0.95 },
  }

  return (
    <motion.div
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  )
} 