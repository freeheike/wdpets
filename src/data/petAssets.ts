const BASE = `${import.meta.env.BASE_URL}assets/web_virtual_pet_assets`

function asset(path: string) {
  return `${BASE}/${path}`
}

const qilinFrame = (n: number) => asset(`pets/qilin/state/${n}.webp`)

/** 水墨小龙 10 帧动画 */
export const qilinFrames = {
  /** 帧1：标准站立待机 */
  stand: qilinFrame(1),
  /** 行走循环 帧2-6 */
  walk: [2, 3, 4, 5, 6].map(qilinFrame),
  /** 休憩循环 帧7-10 */
  rest: [7, 8, 9, 10].map(qilinFrame),
  all: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qilinFrame),
} as const

/** 行走首圈：1→2→3→4→5→6 */
export const WALK_CYCLE_START = [1, 2, 3, 4, 5, 6] as const
/** 行走循环：2→3→4→5→6（接在上圈之后无限循环） */
export const WALK_CYCLE_LOOP = [2, 3, 4, 5, 6] as const
/** @deprecated 使用 WALK_CYCLE_LOOP */
export const WALK_SEQUENCE = WALK_CYCLE_LOOP

/** 休憩片段：7→8→9→10 循环 */
export const REST_SEQUENCE = [7, 8, 9, 10] as const

/** 起身过渡：10→7→1→2 */
export const WAKE_SEQUENCE = [10, 7, 1, 2] as const

/** 犯困过渡：6→7→8 */
export const TO_REST_SEQUENCE = [6, 7, 8] as const

/** 进入休息：1→7→8→9→10 */
export const ENTER_REST_SEQUENCE = [1, 7, 8, 9, 10] as const

export type QilinFrameIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type PetAnimMode = 'walk' | 'idle' | 'rest' | 'wake' | 'to_rest' | 'enter_rest' | 'happy'

export const FRAME_INTERVAL_MS = 350
export const PET_WIDTH = 150
export const IDLE_TO_REST_MS = 3000

// --- 兼容旧素材路径（UI/道具/背景等仍使用原素材包）---

export const catActions = {
  idle: [qilinFrame(1)],
  walk: qilinFrames.walk,
  sleep: [qilinFrame(9), qilinFrame(10)],
  happy: [qilinFrame(1), qilinFrame(7)],
  headpat: [qilinFrame(1), qilinFrame(8)],
  sit: [qilinFrame(9)],
  cute: [qilinFrame(7), qilinFrame(8)],
} as const

export type CatAction = keyof typeof catActions

export const catStates = {
  fullHappy: qilinFrame(1),
  hungry: qilinFrame(7),
  sleepy: qilinFrame(8),
  sick: qilinFrame(9),
  dirty: qilinFrame(7),
  levelUp: qilinFrame(1),
  reward: qilinFrame(1),
}

export const foodItems = {
  fish: { src: asset('items/food/food_fish.webp'), name: '鱼干' },
  bone: { src: asset('items/food/food_bone.webp'), name: '骨头' },
  carrot: { src: asset('items/food/food_carrot.webp'), name: '胡萝卜' },
  cookie: { src: asset('items/food/food_cookie.webp'), name: '饼干' },
  milk: { src: asset('items/food/food_milk.webp'), name: '牛奶' },
  cake: { src: asset('items/food/food_cake.webp'), name: '蛋糕' },
}

export const toyItems = {
  ball: { src: asset('items/toys/toy_ball.webp'), name: '小球' },
  yarn: { src: asset('items/toys/toy_yarn.webp'), name: '毛线' },
  frisbee: { src: asset('items/toys/toy_frisbee.webp'), name: '飞盘' },
  bell: { src: asset('items/toys/toy_bell.webp'), name: '铃铛' },
  bubble: { src: asset('items/toys/toy_bubble.webp'), name: '泡泡' },
  pillow: { src: asset('items/toys/toy_pillow.webp'), name: '枕头' },
}

export const cleaningItems = {
  soap: asset('items/cleaning/clean_soap.webp'),
  towel: asset('items/cleaning/clean_towel.webp'),
  brush: asset('items/cleaning/clean_brush.webp'),
  water: asset('items/cleaning/clean_water_drops.webp'),
}

export const uiIcons = {
  heart: asset('ui/icons/icon_heart.webp'),
  food: asset('ui/icons/icon_food.webp'),
  energy: asset('ui/icons/icon_energy.webp'),
  star: asset('ui/icons/icon_star.webp'),
  coin: asset('ui/icons/icon_coin.webp'),
  diamond: asset('ui/icons/icon_diamond.webp'),
  level: asset('ui/icons/icon_level_badge.webp'),
}

export const uiButtons = {
  signin: asset('ui/buttons/1.webp'),
  shop: asset('ui/buttons/3.webp'),
  bag: asset('ui/buttons/2.webp'),
  cultivate: asset('ui/buttons/4.webp'),
  hatch: asset('ui/buttons/5.webp'),
  training: asset('ui/buttons/6.webp'),
  map: asset('ui/buttons/7.webp'),
  settings: asset('ui/buttons/button_settings.webp'),
}

export const statusBars = {
  mood: asset('ui/status_bars/status_bar_mood.webp'),
  hunger: asset('ui/status_bars/status_bar_hunger.webp'),
  energy: asset('ui/status_bars/status_bar_energy.webp'),
  exp: asset('ui/status_bars/status_bar_exp.webp'),
}

export const backgrounds = {
  day: asset('backgrounds/bg_day.webp'),
  focus: asset('backgrounds/bg_focus.webp'),
  night: asset('backgrounds/bg_night.webp'),
} as const

/** 宠物活动区：自底向上 3/7 处为上限，1/8 处为下限 */
export const PET_ZONE_TOP_FROM_BOTTOM = 3 / 7
export const PET_ZONE_BOTTOM_FROM_BOTTOM = 1 / 8

export type SceneId = keyof typeof backgrounds

export const effects = {
  heart: asset('effects/effect_heart_pop.webp'),
  star: asset('effects/effect_star_flash.webp'),
  coin: asset('effects/effect_coin_fly.webp'),
  smoke: asset('effects/effect_smoke.webp'),
  zzz: asset('effects/effect_zzz.webp'),
  exclamation: asset('effects/effect_exclamation.webp'),
  speech: asset('effects/effect_speech_bubble.webp'),
}

export const share = {
  template: asset('share/share_card_template.webp'),
  avatar: qilinFrame(1),
  qr: asset('share/qr_code_placeholder.webp'),
}

export function getQilinFrameSrc(index: number): string {
  return qilinFrame(index)
}
