import { useState, useEffect, useRef, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'

const FOCUS_MINUTES = 25

export default function FocusMode() {
  const stats = useGameStore((s) => s.stats)
  const setPetAction = useGameStore((s) => s.setPetAction)
  const triggerEffect = useGameStore((s) => s.triggerEffect)

  const [secondsLeft, setSecondsLeft] = useState(FOCUS_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  const start = () => {
    setRunning(true)
    setPetAction('sit')
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimer()
          setRunning(false)
          setPetAction('happy')
          triggerEffect('star')
          setTimeout(() => setPetAction('idle'), 2000)
          return FOCUS_MINUTES * 60
        }
        return s - 1
      })
    }, 1000)
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  return (
    <div className="focus-mode">
      <p className="focus-timer">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </p>
      {!running ? (
        <button className="btn-primary" onClick={start}>开始专注</button>
      ) : (
        <button className="btn-outline" onClick={() => { clearTimer(); setRunning(false); setPetAction('idle') }}>
          暂停
        </button>
      )}
      <p className="focus-stats">{stats.focusSessions} 次专注</p>
    </div>
  )
}
