import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const useTimeAgo = (timestamp: number, intervalMs: number = 10000) => {
  const [timeAgo, setTimeAgo] = useState(
    formatDistanceToNow(new Date(timestamp), { addSuffix: true }),
  )

  useEffect(() => {
    const update = () =>
      setTimeAgo(formatDistanceToNow(new Date(timestamp), { addSuffix: true }))

    const interval = setInterval(update, intervalMs)
    update()

    return () => clearInterval(interval)
  }, [timestamp, intervalMs])

  return timeAgo
}
