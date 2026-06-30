import { create } from 'zustand'
import type { CatAction, SceneId } from '../data/petAssets'

export interface PetStats {
  mood: number
  hunger: number
  energy: number
  exp: number
  level: number
  coins: number
  cleanliness: number
  companionDays: number
  focusSessions: number
  lastCheckIn: string | null
  intimacy: number
  growthValue: number
}

export type GameplayPanel = 'cultivate' | 'hatch' | 'training' | 'map' | null

export interface GameState {
  stats: PetStats
  scene: SceneId
  petAction: CatAction
  showBag: boolean
  showShop: boolean
  activePanel: GameplayPanel
  hatchProgress: number
  isHatching: boolean
  trainingActive: boolean
  effect: 'heart' | 'coin' | 'zzz' | 'star' | null
  signedToday: boolean
}

const STORAGE_KEY = 'webpet_mvp_v2'

const defaultStats: PetStats = {
  mood: 85,
  hunger: 60,
  energy: 70,
  exp: 120,
  level: 10,
  coins: 36,
  cleanliness: 80,
  companionDays: 1,
  focusSessions: 0,
  lastCheckIn: null,
  intimacy: 62,
  growthValue: 38,
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v))
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function loadState(): Partial<GameState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function save(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    stats: state.stats,
    scene: state.scene,
    lastCheckIn: state.stats.lastCheckIn,
    hatchProgress: state.hatchProgress,
    isHatching: state.isHatching,
  }))
}

interface GameStore extends GameState {
  init: () => void
  setPetAction: (action: CatAction) => void
  setScene: (scene: SceneId) => void
  setShowBag: (v: boolean) => void
  setShowShop: (v: boolean) => void
  setActivePanel: (panel: GameplayPanel) => void
  setHatchProgress: (v: number) => void
  setIsHatching: (v: boolean) => void
  startTraining: () => boolean
  completeTraining: () => void
  triggerEffect: (e: GameState['effect']) => void
  signIn: () => boolean
  feed: () => void
  playToy: () => void
  clean: () => void
  tick: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  stats: { ...defaultStats },
  scene: 'day',
  petAction: 'idle',
  showBag: false,
  showShop: false,
  activePanel: null,
  hatchProgress: 35,
  isHatching: false,
  trainingActive: false,
  effect: null,
  signedToday: false,

  init: () => {
    const saved = loadState()
    const stats = { ...defaultStats, ...saved.stats }
    const today = getToday()
    set({
      stats,
      scene: saved.scene ?? 'day',
      signedToday: stats.lastCheckIn === today,
      hatchProgress: typeof saved.hatchProgress === 'number' ? saved.hatchProgress : 35,
      isHatching: saved.isHatching ?? false,
    })
  },

  setPetAction: (action) => set({ petAction: action }),

  setScene: (scene) => {
    set({ scene })
    save({ ...get(), scene })
  },

  setShowBag: (v) => set({ showBag: v, showShop: false, activePanel: null }),

  setShowShop: (v) => set({ showShop: v, showBag: false, activePanel: null }),

  setActivePanel: (panel) => set({ activePanel: panel, showBag: false, showShop: false }),

  setHatchProgress: (v) => {
    const progress = clamp(v, 0, 100)
    set({ hatchProgress: progress })
    save({ ...get(), hatchProgress: progress })
  },

  setIsHatching: (v) => {
    set({ isHatching: v })
    save({ ...get(), isHatching: v })
  },

  startTraining: () => {
    const { stats, trainingActive } = get()
    if (trainingActive || stats.energy < 10) return false
    const updated = { ...stats, energy: clamp(stats.energy - 10) }
    set({ stats: updated, trainingActive: true, activePanel: null })
    save({ ...get(), stats: updated })
    return true
  },

  completeTraining: () => {
    const { stats } = get()
    const updated = {
      ...stats,
      exp: stats.exp + 15,
      growthValue: clamp(stats.growthValue + 3, 0, 100),
    }
    set({ stats: updated, trainingActive: false })
    get().triggerEffect('star')
    save({ ...get(), stats: updated })
  },

  triggerEffect: (effect) => {
    set({ effect })
    setTimeout(() => set({ effect: null }), 1200)
  },

  signIn: () => {
    const { stats } = get()
    const today = getToday()
    if (stats.lastCheckIn === today) return false
    const updated = {
      ...stats,
      coins: stats.coins + 10,
      exp: stats.exp + 5,
      lastCheckIn: today,
      companionDays: stats.companionDays + (stats.lastCheckIn ? 1 : 0),
    }
    set({ stats: updated, signedToday: true })
    get().triggerEffect('coin')
    save({ ...get(), stats: updated })
    return true
  },

  feed: () => {
    const { stats } = get()
    const updated = {
      ...stats,
      hunger: clamp(stats.hunger + 15),
      mood: clamp(stats.mood + 5),
      exp: stats.exp + 3,
    }
    set({ stats: updated, petAction: 'happy' })
    get().triggerEffect('heart')
    save({ ...get(), stats: updated })
    setTimeout(() => set({ petAction: 'idle' }), 2000)
  },

  playToy: () => {
    const { stats } = get()
    const updated = {
      ...stats,
      mood: clamp(stats.mood + 15),
      energy: clamp(stats.energy - 5),
      exp: stats.exp + 5,
    }
    set({ stats: updated, petAction: 'cute' })
    get().triggerEffect('heart')
    save({ ...get(), stats: updated })
    setTimeout(() => set({ petAction: 'idle' }), 2000)
  },

  clean: () => {
    const { stats } = get()
    const updated = {
      ...stats,
      cleanliness: clamp(stats.cleanliness + 20),
      mood: clamp(stats.mood + 8),
    }
    set({ stats: updated, petAction: 'happy' })
    save({ ...get(), stats: updated })
    setTimeout(() => set({ petAction: 'idle' }), 2000)
  },

  tick: () => {
    const { stats } = get()
    const updated = {
      ...stats,
      hunger: clamp(stats.hunger - 1),
      mood: clamp(stats.mood - 1),
      energy: clamp(stats.energy - 1),
    }
    set({ stats: updated })
    save({ ...get(), stats: updated })
  },
}))
