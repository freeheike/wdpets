import { useState } from 'react'
import { SKINS } from '../types'
import { usePetStore } from '../store/petStore'

export default function SkinShop() {
  const pet = usePetStore((s) => s.pet)
  const buySkin = usePetStore((s) => s.buySkin)
  const equipSkin = usePetStore((s) => s.equipSkin)
  const [message, setMessage] = useState('')

  const handleBuy = (skinId: string) => {
    const skin = SKINS.find((s) => s.id === skinId)!
    if (pet.ownedSkins.includes(skinId)) {
      equipSkin(skinId)
      setMessage(skin.name)
      return
    }
    if (buySkin(skinId)) {
      setMessage(skin.name)
    } else {
      setMessage('不足')
    }
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-lg text-[var(--ink)] tracking-widest">商店</h1>
        <span className="text-sm text-[var(--ink-mid)] tabular-nums">{pet.coins}</span>
      </div>

      {message && (
        <p className="text-xs text-center text-[var(--ink-mid)] font-serif">{message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SKINS.map((skin) => {
          const owned = pet.ownedSkins.includes(skin.id)
          const equipped = pet.skinId === skin.id
          return (
            <div
              key={skin.id}
              className={`ink-card rounded-sm p-3 flex items-center gap-3 ${
                equipped ? 'border-[var(--ink)]' : ''
              }`}
            >
              <div
                className="w-12 h-12 rounded-sm shrink-0 flex items-center justify-center text-xl opacity-80"
                style={{ background: `linear-gradient(135deg, ${skin.colors.body}, ${skin.colors.belly})` }}
              >
                {skin.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm text-[var(--ink)]">{skin.name}</h3>
                  {skin.rarity === 'rare' && (
                    <span className="text-[10px] text-[var(--seal)]">稀</span>
                  )}
                </div>
                <p className="text-xs text-[var(--ink-light)] mt-0.5">
                  {skin.price === 0 ? '—' : skin.price}
                </p>
              </div>
              <button
                onClick={() => handleBuy(skin.id)}
                disabled={!owned && pet.coins < skin.price}
                className={`shrink-0 px-3 py-1.5 text-xs font-serif tracking-wider ${
                  owned
                    ? equipped
                      ? 'text-[var(--ink-light)]'
                      : 'btn-outline'
                    : pet.coins >= skin.price
                      ? 'btn-primary'
                      : 'text-[var(--ink-faint)] cursor-not-allowed'
                }`}
              >
                {owned ? (equipped ? '已装备' : '装备') : '购买'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
