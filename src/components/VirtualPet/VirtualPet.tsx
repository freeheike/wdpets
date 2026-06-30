import { useEffect, useRef, useState, useCallback } from 'react'
import {
  WALK_CYCLE_START,
  WALK_CYCLE_LOOP,
  REST_SEQUENCE,
  WAKE_SEQUENCE,
  FRAME_INTERVAL_MS,
  PET_WIDTH,
  PET_ZONE_TOP_FROM_BOTTOM,
  PET_ZONE_BOTTOM_FROM_BOTTOM,
  effects,
  getQilinFrameSrc,
  type PetAnimMode,
} from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

const PET_HEIGHT = Math.round(PET_WIDTH * 1.05)
/** 帧 2-6 每帧对应的跨步位移（像素） */
const STEP_PIXELS = 16
const ARRIVE_DIST = 12
const PAUSE_MS = 600
const REST_CHANCE = 0.1
const REST_DURATION_MS = 6000

interface Point {
  x: number
  y: number
}

interface MoveBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickTarget(b: MoveBounds): Point {
  return {
    x: randomBetween(b.minX, Math.max(b.minX, b.maxX)),
    y: randomBetween(b.minY, Math.max(b.minY, b.maxY)),
  }
}

function clampPos(p: Point, b: MoveBounds): Point {
  return {
    x: Math.max(b.minX, Math.min(p.x, b.maxX)),
    y: Math.max(b.minY, Math.min(p.y, b.maxY)),
  }
}

function isStepFrame(frame: number) {
  return frame >= 2 && frame <= 6
}

export default function VirtualPet() {
  const petAction = useGameStore((s) => s.petAction)
  const setPetAction = useGameStore((s) => s.setPetAction)
  const stats = useGameStore((s) => s.stats)
  const effect = useGameStore((s) => s.effect)
  const triggerEffect = useGameStore((s) => s.triggerEffect)
  const trainingActive = useGameStore((s) => s.trainingActive)
  const completeTraining = useGameStore((s) => s.completeTraining)

  const [frameIndex, setFrameIndex] = useState(1)
  const [animMode, setAnimMode] = useState<PetAnimMode>('walk')
  const [pos, setPos] = useState<Point>({ x: 60, y: 80 })
  const [facingLeft, setFacingLeft] = useState(false)

  const arenaRef = useRef<HTMLDivElement>(null)
  const posRef = useRef<Point>({ x: 60, y: 80 })
  const targetRef = useRef<Point>({ x: 200, y: 120 })
  const animModeRef = useRef<PetAnimMode>('walk')
  /** 首圈走 1→2→3→4→5→6，之后循环 2→3→4→5→6 */
  const walkPhaseRef = useRef<'start' | 'loop'>('start')
  const seqPosRef = useRef(0)
  const busyRef = useRef(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const trainingRef = useRef(false)

  trainingRef.current = trainingActive

  animModeRef.current = animMode
  const currentSrc = getQilinFrameSrc(frameIndex)

  const getBounds = useCallback((): MoveBounds => {
    const el = arenaRef.current
    const calc = (h: number, w: number): MoveBounds => {
      const minY = h * (1 - PET_ZONE_TOP_FROM_BOTTOM)
      const maxY = h * (1 - PET_ZONE_BOTTOM_FROM_BOTTOM) - PET_HEIGHT
      return {
        minX: 0,
        maxX: Math.max(0, w - PET_WIDTH),
        minY: Math.max(0, minY),
        maxY: Math.max(minY, maxY),
      }
    }
    if (!el) return calc(400, 300)
    return calc(el.clientHeight, el.clientWidth)
  }, [])

  const clearTimers = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    if (restTimerRef.current) clearTimeout(restTimerRef.current)
    pauseTimerRef.current = null
    restTimerRef.current = null
  }

  const stepTowardTarget = useCallback((): boolean => {
    const target = targetRef.current
    const cur = posRef.current
    const dx = target.x - cur.x
    const dy = target.y - cur.y
    const dist = Math.hypot(dx, dy)

    if (dist < ARRIVE_DIST) return false

    const move = Math.min(STEP_PIXELS, dist)
    setFacingLeft(dx < 0)

    const b = getBounds()
    const next = clampPos(
      { x: cur.x + (dx / dist) * move, y: cur.y + (dy / dist) * move },
      b,
    )
    posRef.current = next
    setPos(next)
    return true
  }, [getBounds])

  const beginRest = useCallback(() => {
    busyRef.current = true
    animModeRef.current = 'rest'
    setAnimMode('rest')
    seqPosRef.current = 0
    setFrameIndex(REST_SEQUENCE[0])
    triggerEffect('zzz')
    restTimerRef.current = setTimeout(() => {
      animModeRef.current = 'wake'
      setAnimMode('wake')
      seqPosRef.current = 0
      setFrameIndex(WAKE_SEQUENCE[0])
    }, REST_DURATION_MS)
  }, [triggerEffect])

  const startWander = useCallback(() => {
    busyRef.current = false
    clearTimers()
    animModeRef.current = 'walk'
    setAnimMode('walk')
    walkPhaseRef.current = 'start'
    seqPosRef.current = 0
    setFrameIndex(1)
    const b = getBounds()
    targetRef.current = pickTarget(b)
  }, [getBounds])

  const onArrived = useCallback(() => {
    if (trainingRef.current) {
      completeTraining()
      startWander()
      return
    }
    if (busyRef.current) return
    busyRef.current = true
    animModeRef.current = 'idle'
    setAnimMode('idle')
    setFrameIndex(1)

    const shouldRest = stats.energy < 30 || Math.random() < REST_CHANCE

    pauseTimerRef.current = setTimeout(() => {
      if (shouldRest) {
        beginRest()
        return
      }
      targetRef.current = pickTarget(getBounds())
      startWander()
    }, PAUSE_MS + Math.random() * 800)
  }, [stats.energy, beginRest, getBounds, startWander, completeTraining])

  const advanceWalkFrame = useCallback(() => {
    const phase = walkPhaseRef.current
    const seq = phase === 'start' ? WALK_CYCLE_START : WALK_CYCLE_LOOP
    let nextPos = seqPosRef.current + 1

    if (nextPos >= seq.length) {
      if (phase === 'start') {
        walkPhaseRef.current = 'loop'
        nextPos = 0
      } else {
        nextPos = 0
      }
    }

    seqPosRef.current = nextPos
    const currentPhase = walkPhaseRef.current
    const currentSeq = currentPhase === 'start' ? WALK_CYCLE_START : WALK_CYCLE_LOOP
    const frame = currentSeq[nextPos]

    setFrameIndex(frame)

    // 帧 2-6：跨步位移；帧 1：原地站立缓冲
    if (isStepFrame(frame)) {
      const moved = stepTowardTarget()
      if (!moved) onArrived()
    }
  }, [stepTowardTarget, onArrived])

  // 帧序列 + 跨步：1→2→3→4→5→6→2→3→4→5→6…
  useEffect(() => {
    if (animMode === 'idle' || animMode === 'happy') {
      setFrameIndex(1)
      return
    }

    if (animMode === 'rest' || animMode === 'wake') {
      const seq = animMode === 'rest' ? REST_SEQUENCE : WAKE_SEQUENCE
      const id = setInterval(() => {
        let next = seqPosRef.current + 1
        if (next >= seq.length) {
          if (animModeRef.current === 'wake') {
            startWander()
            return
          }
          next = 0
        }
        seqPosRef.current = next
        setFrameIndex(seq[next])
      }, FRAME_INTERVAL_MS)
      return () => clearInterval(id)
    }

    if (animMode !== 'walk') return

    const id = setInterval(advanceWalkFrame, FRAME_INTERVAL_MS)
    return () => clearInterval(id)
  }, [animMode, advanceWalkFrame, startWander])

  useEffect(() => {
    const b = getBounds()
    const init = pickTarget(b)
    posRef.current = init
    setPos(init)
    targetRef.current = pickTarget(b)
    startWander()

    const onResize = () => {
      const nb = getBounds()
      posRef.current = clampPos(posRef.current, nb)
      setPos(posRef.current)
      targetRef.current = pickTarget(nb)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimers()
    }
  }, [getBounds, startWander])

  useEffect(() => {
    if (stats.energy < 20 && animMode === 'walk' && !busyRef.current) {
      onArrived()
    }
  }, [stats.energy, animMode, onArrived])

  useEffect(() => {
    if (!trainingActive) return
    clearTimers()
    busyRef.current = true
    animModeRef.current = 'walk'
    setAnimMode('walk')
    walkPhaseRef.current = 'loop'
    seqPosRef.current = 0
    setFrameIndex(2)
    setFacingLeft(false)
    const b = getBounds()
    targetRef.current = { x: b.maxX, y: posRef.current.y }
  }, [trainingActive, getBounds])

  useEffect(() => {
    if (petAction !== 'happy') return
    clearTimers()
    busyRef.current = true
    setFrameIndex(1)
    setAnimMode('happy')
    triggerEffect('heart')
    const t = setTimeout(() => {
      setPetAction('idle')
      startWander()
    }, 1500)
    return () => clearTimeout(t)
  }, [petAction, triggerEffect, setPetAction, startWander])

  const handleClick = useCallback(() => {
    clearTimers()
    triggerEffect('heart')

    if (animModeRef.current === 'rest') {
      busyRef.current = true
      animModeRef.current = 'wake'
      setAnimMode('wake')
      seqPosRef.current = 0
      setFrameIndex(WAKE_SEQUENCE[0])
      return
    }

    busyRef.current = true
    setFrameIndex(1)
    setAnimMode('happy')
    setPetAction('happy')
  }, [triggerEffect, setPetAction])

  const effectSrc = effect ? effects[effect] : null
  const showZzz = animMode === 'rest' && frameIndex >= 10

  return (
    <div ref={arenaRef} className="pet-map-layer">
      <div className="pet-walk-zone" aria-hidden="true" />
      <div
        className={`virtual-pet qilin-pet${trainingActive ? ' training-run' : ''}`}
        style={{ left: pos.x, top: pos.y, width: PET_WIDTH }}
        onClick={handleClick}
        role="button"
        aria-label="点击互动"
      >
        {effectSrc && <img src={effectSrc} alt="" className="pet-effect" draggable={false} />}
        {showZzz && !effect && <img src={effects.zzz} alt="" className="pet-effect-zzz" draggable={false} />}
        <img
          src={currentSrc}
          alt="水墨小龙"
          className="pet-sprite qilin-sprite"
          style={{ transform: facingLeft ? 'scaleX(-1)' : 'none' }}
          draggable={false}
        />
      </div>
    </div>
  )
}
