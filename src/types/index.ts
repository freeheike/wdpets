export type PetMood = 'happy' | 'normal' | 'sad' | 'sleepy'
export type PetAction = 'idle' | 'bounce' | 'sleep' | 'happy' | 'eat' | 'wave' | 'dance' | 'follow'

export interface Skin {
  id: string
  name: string
  price: number
  emoji: string
  colors: {
    body: string
    belly: string
    ear: string
    cheek: string
    accent: string
  }
  description: string
  rarity: 'common' | 'rare'
}

export interface PetData {
  name: string
  hunger: number
  mood: number
  cleanliness: number
  exp: number
  level: number
  coins: number
  skinId: string
  ownedSkins: string[]
  companionDays: number
  totalFocusMinutes: number
  focusSessions: number
  lastCheckIn: string | null
  lastDecay: string
  adoptedAt: string
  unlockedActions: string[]
}

export interface UserProfile {
  id: string
  email: string
  nickname: string
  isGuest: boolean
}

export const DEFAULT_PET: PetData = {
  name: '小团子',
  hunger: 80,
  mood: 80,
  cleanliness: 80,
  exp: 0,
  level: 1,
  coins: 50,
  skinId: 'default',
  ownedSkins: ['default'],
  companionDays: 1,
  totalFocusMinutes: 0,
  focusSessions: 0,
  lastCheckIn: null,
  lastDecay: new Date().toISOString(),
  adoptedAt: new Date().toISOString(),
  unlockedActions: ['idle', 'bounce', 'happy'],
}

export const SKINS: Skin[] = [
  {
    id: 'default',
    name: '橘团子',
    price: 0,
    emoji: '🐱',
    colors: { body: '#FFB347', belly: '#FFE4B5', ear: '#FF8C42', cheek: '#FF9999', accent: '#FF6B35' },
    description: '温暖治愈的橘色小猫，每只宠物的起点',
    rarity: 'common',
  },
  {
    id: 'golden',
    name: '金闪闪',
    price: 30,
    emoji: '✨',
    colors: { body: '#FFD700', belly: '#FFF8DC', ear: '#DAA520', cheek: '#FFE066', accent: '#B8860B' },
    description: '闪闪发光的金色皮肤，象征好运',
    rarity: 'common',
  },
  {
    id: 'strawberry',
    name: '草莓喵',
    price: 50,
    emoji: '🍓',
    colors: { body: '#FF6B9D', belly: '#FFE0EC', ear: '#E84393', cheek: '#FF85A2', accent: '#C44569' },
    description: '粉嫩可爱的草莓色系，少女心满满',
    rarity: 'common',
  },
  {
    id: 'cyber',
    name: '赛博猫',
    price: 80,
    emoji: '🤖',
    colors: { body: '#6C5CE7', belly: '#A29BFE', ear: '#4834D4', cheek: '#74B9FF', accent: '#00CEC9' },
    description: '未来感十足的赛博朋克风格',
    rarity: 'rare',
  },
  {
    id: 'night',
    name: '暗夜精灵',
    price: 100,
    emoji: '🌙',
    colors: { body: '#2D3436', belly: '#636E72', ear: '#1E272E', cheek: '#6C5CE7', accent: '#A29BFE' },
    description: '神秘的暗夜色系，陪伴你深夜学习',
    rarity: 'rare',
  },
]

export const PET_PHRASES = [
  '主人今天也要加油哦～',
  '摸摸头，好开心！',
  '我陪你一起努力！',
  '记得喝水休息呀～',
  '你今天也很棒！',
  '伸个懒腰～',
  '想和你一起玩！',
  'zzz...好困...',
  '肚子有点饿了...',
  '最喜欢主人了！',
  '学会新技能啦！',
  '今天天气真好～',
]

export function expForLevel(level: number): number {
  return level * 100
}

export function calcLevel(exp: number): number {
  let level = 1
  let needed = expForLevel(level)
  while (exp >= needed) {
    exp -= needed
    level++
    needed = expForLevel(level)
  }
  return level
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}
