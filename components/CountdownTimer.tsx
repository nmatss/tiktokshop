'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

interface CountdownTimerProps {
  targetDate?: Date
  onComplete?: () => void
  className?: string
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({
  targetDate,
  onComplete,
  className = '',
  showLabels = true,
  size = 'md',
}: CountdownTimerProps) {
  // Default: 3 days from now (creates urgency) - memoized to prevent new Date on every render
  const target = useMemo(() => {
    if (targetDate) return targetDate
    const defaultTarget = new Date()
    defaultTarget.setDate(defaultTarget.getDate() + 3)
    defaultTarget.setHours(23, 59, 59, 999)
    return defaultTarget
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Use ref to track if onComplete has been called to prevent multiple calls
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime()
    const distance = target.getTime() - now

    if (distance <= 0) {
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current?.()
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    }
  }, [target])

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      box: 'p-2 min-w-[50px]',
      number: 'text-xl',
      label: 'text-[10px]',
    },
    md: {
      container: 'gap-3',
      box: 'p-3 min-w-[70px]',
      number: 'text-3xl',
      label: 'text-xs',
    },
    lg: {
      container: 'gap-4',
      box: 'p-4 min-w-[90px]',
      number: 'text-4xl md:text-5xl',
      label: 'text-sm',
    },
  }

  const sizes = sizeClasses[size]

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className={`countdown-box ${sizes.box}`}>
      <span className={`countdown-number ${sizes.number}`}>
        {String(value).padStart(2, '0')}
      </span>
      {showLabels && (
        <span className={`countdown-label ${sizes.label}`}>{label}</span>
      )}
    </div>
  )

  return (
    <div className={`flex items-center justify-center ${sizes.container} ${className}`}>
      <TimeBox value={timeLeft.days} label="Dias" />
      <span className="text-2xl font-bold text-gray-500">:</span>
      <TimeBox value={timeLeft.hours} label="Horas" />
      <span className="text-2xl font-bold text-gray-500">:</span>
      <TimeBox value={timeLeft.minutes} label="Min" />
      <span className="text-2xl font-bold text-gray-500">:</span>
      <TimeBox value={timeLeft.seconds} label="Seg" />
    </div>
  )
}
