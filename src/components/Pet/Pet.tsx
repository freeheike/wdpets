import { useEffect, useRef, useState, useCallback } from 'react'
import { usePetStore, getActiveSkin } from '../../store/petStore'
import { PET_PHRASES } from '../../types'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import './Pet.css'

interface PetProps {
  floating?: boolean
  followMouse?: boolean
  size?: number
}

export default function Pet({ floating = true, followMouse = false, size = 120 }: PetProps) {
  const pet = usePetStore((s) => s.pet)
  const currentAction = usePetStore((s) => s.currentAction)
  const speech = usePetStore((s) => s.speech)
  const setAction = usePetStore((s) => s.setAction)
  const setSpeech = usePetStore((s) => s.setSpeech)
  const play = usePetStore((s) => s.play)
  const { isMobile } = useBreakpoint()

  const skin = getActiveSkin(pet)
  const containerRef = useRef<HTMLDivElement>(null)
  const arenaRef = useRef<HTMLElement | null>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const movedRef = useRef(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const phraseTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const centerPet = useCallback(() => {
    const parent = containerRef.current?.parentElement
    if (!parent) return
    arenaRef.current = parent
    const rect = parent.getBoundingClientRect()
    setPos({
      x: Math.max(0, (rect.width - size) / 2),
      y: Math.max(0, (rect.height - size) / 2 - 10),
    })
  }, [size])

  useEffect(() => {
    centerPet()
    const parent = containerRef.current?.parentElement
    if (!parent) return
    const observer = new ResizeObserver(centerPet)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [centerPet])

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    if (currentAction === 'sleep') setAction('idle')
    idleTimer.current = setTimeout(() => {
      if (!dragging) setAction('sleep')
    }, 15000)
  }, [currentAction, dragging, setAction])

  useEffect(() => {
    resetIdleTimer()
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [resetIdleTimer])

  useEffect(() => {
    phraseTimer.current = setInterval(() => {
      if (Math.random() > 0.7 && currentAction !== 'sleep') {
        const phrase = PET_PHRASES[Math.floor(Math.random() * PET_PHRASES.length)]
        setSpeech(phrase)
        setTimeout(() => setSpeech(null), 3000)
      }
    }, 12000)
    return () => {
      if (phraseTimer.current) clearInterval(phraseTimer.current)
    }
  }, [currentAction, setSpeech])

  useEffect(() => {
    if (!followMouse || isMobile) return
    const handleMove = (e: MouseEvent) => {
      if (dragging) return
      const rect = arenaRef.current?.getBoundingClientRect()
      if (!rect) return
      const targetX = e.clientX - rect.left - size / 2
      const targetY = e.clientY - rect.top - size / 2
      setPos((p) => {
        if (!p) return p
        return {
          x: p.x + (targetX - p.x) * 0.08,
          y: p.y + (targetY - p.y) * 0.08,
        }
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [followMouse, dragging, size, isMobile])

  const onPointerDown = (e: React.PointerEvent) => {
    if (!floating) return
    setDragging(true)
    movedRef.current = false
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    resetIdleTimer()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !floating) return
    movedRef.current = true
    const parent = containerRef.current?.parentElement
    if (!parent) return
    const rect = parent.getBoundingClientRect()
    setPos({
      x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.current.x, rect.width - size)),
      y: Math.max(0, Math.min(e.clientY - rect.top - dragOffset.current.y, rect.height - size)),
    })
  }

  const onPointerUp = () => {
    setDragging(false)
    resetIdleTimer()
  }

  const onClick = () => {
    if (movedRef.current) return
    play()
    setAction('happy')
    setSpeech('好开心！摸摸头～')
    setTimeout(() => {
      setAction('idle')
      setSpeech(null)
    }, 2000)
    resetIdleTimer()
  }

  const actionClass = `pet-action-${currentAction}`

  const style: React.CSSProperties = floating
    ? {
        position: 'absolute',
        left: pos?.x ?? '50%',
        top: pos?.y ?? '50%',
        width: size,
        height: size,
        cursor: dragging ? 'grabbing' : 'grab',
        zIndex: 50,
        transition: dragging ? 'none' : 'left 0.3s ease, top 0.3s ease',
        transform: pos ? undefined : 'translate(-50%, -50%)',
        opacity: pos ? 1 : 0,
      }
    : { width: size, height: size, position: 'relative', margin: '0 auto' }

  return (
    <div
      ref={containerRef}
      className={`pet-container ${actionClass} ${dragging ? 'dragging' : ''}`}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
      role="img"
      aria-label={`宠物 ${pet.name}`}
    >
      {speech && (
        <div className={`pet-speech ${isMobile ? 'pet-speech-mobile' : ''}`}>
          {speech}
        </div>
      )}
      <div
        className="pet-body"
        style={{
          '--body': skin.colors.body,
          '--belly': skin.colors.belly,
          '--ear': skin.colors.ear,
          '--cheek': skin.colors.cheek,
          '--accent': skin.colors.accent,
        } as React.CSSProperties}
      >
        <div className="pet-ear pet-ear-left" />
        <div className="pet-ear pet-ear-right" />
        <div className="pet-face">
          <div className="pet-eye pet-eye-left">
            <div className="pet-pupil" />
          </div>
          <div className="pet-eye pet-eye-right">
            <div className="pet-pupil" />
          </div>
          <div className="pet-cheek pet-cheek-left" />
          <div className="pet-cheek pet-cheek-right" />
          <div className="pet-nose" />
          <div className="pet-mouth" />
        </div>
        <div className="pet-belly" />
        <div className="pet-tail" />
        <div className="pet-paws">
          <div className="pet-paw pet-paw-left" />
          <div className="pet-paw pet-paw-right" />
        </div>
      </div>
      {currentAction === 'sleep' && <div className="pet-zzz">z z z</div>}
    </div>
  )
}
