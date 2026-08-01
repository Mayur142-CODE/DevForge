'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Mail className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent you a verification link. Please check your inbox and
          click the link to verify your account.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
        Didn&apos;t receive the email? Check your spam folder or try signing up again.
      </div>

      <Link 
        href="/login" 
        className={buttonVariants({ variant: "outline", className: "w-full" })}
      >
        Back to login
      </Link>
    </motion.div>
  )
}
