'use client'

import { motion } from 'framer-motion'

interface FireAnimationProps {
  size?: number
  className?: string
}

export function FireAnimation({ size = 24, className }: FireAnimationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M12 2C12 2 7 7 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 7 12 2 12 2Z"
          fill="url(#fireGradient)"
          animate={{
            d: [
              'M12 2C12 2 7 7 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 7 12 2 12 2Z',
              'M12 2C12 2 6 8 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8 12 2 12 2Z',
              'M12 2C12 2 7 7 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 7 12 2 12 2Z',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
          d="M12 9C12 9 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 9 12 9Z"
          fill="url(#fireInner)"
          animate={{
            d: [
              'M12 9C12 9 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 9 12 9Z',
              'M12 8C12 8 9.5 11 9.5 13C9.5 14.38 10.62 15.5 12 15.5C13.38 15.5 14.5 14.38 14.5 13C14.5 11 12 8 12 8Z',
              'M12 9C12 9 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 9 12 9Z',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <defs>
          <linearGradient id="fireGradient" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F97316" />
            <stop offset="1" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="fireInner" x1="12" y1="9" x2="12" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FCD34D" />
            <stop offset="1" stopColor="#F97316" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}
