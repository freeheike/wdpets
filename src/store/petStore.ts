import { create } from 'zustand'
import {
  DEFAULT_PET,
  SKINS,
  calcLevel,
  expForLevel,
  getToday,
  type PetData,
  type PetAction,
} from '../types'
import { loadPetData, savePetData } from '../lib/storage'

interface PetState {
  pet: PetData
  currentAction: PetAction
  speech: string | null
  init: () => void
  tick: () => void
  setAction: (action: PetAction) => void
  setSpeech: (text: string | null) => void
  feed: () => boolean
  play: () => boolean
  clean: () => boolean
  checkIn: () => { success: boolean; coins: number; streak: boolean }
  buySkin: (skinId: string) => boolean
  equipSkin: (skinId: string) => void
  rename: (name: string) => void
  addFocusReward: (minutes: number) => void
  addExp: (amount: number) => void
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v))
}

function persist(pet: PetData) {
  savePetData(pet)
}

export const usePetStore = create<PetState>((set, get) => ({
  pet: { ...DEFAULT_PET },
  currentAction: 'idle',
  speech: null,

  init: () => {
    const saved = loadPetData<PetData | null>(null)
    if (saved) {
      const level = calcLevel(saved.exp)
      set({ pet: { ...saved, level } })
      get().tick()
    } else {
      persist(DEFAULT_PET)
    }
  },

  tick: () => {
    const { pet } = get()
    const now = new Date()
    const last = new Date(pet.lastDecay)
    const hoursPassed = (now.getTime() - last.getTime()) / (1000 * 60 * 60)

    if (hoursPassed < 0.5) return

    const decay = Math.floor(hoursPassed)
    const updated: PetData = {
      ...pet,
      hunger: clamp(pet.hunger - decay * 2),
      mood: clamp(pet.mood - decay),
      cleanliness: clamp(pet.cleanliness - decay),
      lastDecay: now.toISOString(),
    }
    persist(updated)
    set({ pet: updated })
  },

  setAction: (action) => set({ currentAction: action }),

  setSpeech: (text) => set({ speech: text }),

  feed: () => {
    const { pet } = get()
    if (pet.hunger >= 95) {
      get().setSpeech('我已经吃饱啦～')
      return false
    }
    const updated = {
      ...pet,
      hunger: clamp(pet.hunger + 25),
      mood: clamp(pet.mood + 5),
      exp: pet.exp + 10,
    }
    updated.level = calcLevel(updated.exp)
    persist(updated)
    set({ pet: updated, currentAction: 'eat' })
    setTimeout(() => set({ currentAction: 'idle' }), 2000)
    return true
  },

  play: () => {
    const { pet } = get()
    const updated = {
      ...pet,
      mood: clamp(pet.mood + 20),
      hunger: clamp(pet.hunger - 5),
      exp: pet.exp + 15,
    }
    updated.level = calcLevel(updated.exp)
    persist(updated)
    set({ pet: updated, currentAction: 'happy' })
    setTimeout(() => set({ currentAction: 'idle' }), 2000)
    return true
  },

  clean: () => {
    const { pet } = get()
    const updated = {
      ...pet,
      cleanliness: clamp(pet.cleanliness + 30),
      mood: clamp(pet.mood + 10),
      exp: pet.exp + 10,
    }
    updated.level = calcLevel(updated.exp)
    persist(updated)
    set({ pet: updated, currentAction: 'wave' })
    setTimeout(() => set({ currentAction: 'idle' }), 2000)
    return true
  },

  checkIn: () => {
    const { pet } = get()
    const today = getToday()
    if (pet.lastCheckIn === today) {
      return { success: false, coins: 0, streak: false }
    }
    const isStreak = pet.lastCheckIn === getYesterday()
    const baseCoins = 10
    const bonus = isStreak ? 5 : 0
    const total = baseCoins + bonus + pet.level
    const updated: PetData = {
      ...pet,
      coins: pet.coins + total,
      lastCheckIn: today,
      companionDays: pet.companionDays + (pet.lastCheckIn ? 1 : 0),
      mood: clamp(pet.mood + 10),
      exp: pet.exp + 20,
    }
    updated.level = calcLevel(updated.exp)
    persist(updated)
    set({ pet: updated })
    return { success: true, coins: total, streak: isStreak }
  },

  buySkin: (skinId) => {
    const skin = SKINS.find((s) => s.id === skinId)
    if (!skin) return false
    const { pet } = get()
    if (pet.ownedSkins.includes(skinId)) return false
    if (pet.coins < skin.price) return false
    const updated = {
      ...pet,
      coins: pet.coins - skin.price,
      ownedSkins: [...pet.ownedSkins, skinId],
      skinId,
    }
    persist(updated)
    set({ pet: updated })
    return true
  },

  equipSkin: (skinId) => {
    const { pet } = get()
    if (!pet.ownedSkins.includes(skinId)) return
    const updated = { ...pet, skinId }
    persist(updated)
    set({ pet: updated })
  },

  rename: (name) => {
    const { pet } = get()
    const updated = { ...pet, name: name.trim() || pet.name }
    persist(updated)
    set({ pet: updated })
  },

  addFocusReward: (minutes) => {
    const { pet } = get()
    const expGain = minutes * 2
    const coinGain = Math.floor(minutes / 5)
    const updated: PetData = {
      ...pet,
      exp: pet.exp + expGain,
      coins: pet.coins + coinGain,
      mood: clamp(pet.mood + 15),
      totalFocusMinutes: pet.totalFocusMinutes + minutes,
      focusSessions: pet.focusSessions + 1,
    }
    updated.level = calcLevel(updated.exp)
    if (updated.level >= 3 && !updated.unlockedActions.includes('dance')) {
      updated.unlockedActions = [...updated.unlockedActions, 'dance']
    }
    if (updated.level >= 5 && !updated.unlockedActions.includes('follow')) {
      updated.unlockedActions = [...updated.unlockedActions, 'follow']
    }
    persist(updated)
    set({ pet: updated, currentAction: 'dance' })
    setTimeout(() => set({ currentAction: 'idle' }), 3000)
  },

  addExp: (amount) => {
    const { pet } = get()
    const updated = { ...pet, exp: pet.exp + amount }
    updated.level = calcLevel(updated.exp)
    persist(updated)
    set({ pet: updated })
  },
}))

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function getExpProgress(pet: PetData): { current: number; max: number; percent: number } {
  let remaining = pet.exp
  let level = 1
  while (level < pet.level) {
    remaining -= expForLevel(level)
    level++
  }
  const max = expForLevel(pet.level)
  return { current: remaining, max, percent: Math.round((remaining / max) * 100) }
}

export function getActiveSkin(pet: PetData) {
  return SKINS.find((s) => s.id === pet.skinId) ?? SKINS[0]
}
