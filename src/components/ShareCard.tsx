import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { usePetStore, getActiveSkin } from '../store/petStore'

export default function ShareCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const pet = usePetStore((s) => s.pet)
  const skin = getActiveSkin(pet)

  const download = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { backgroundColor: '#f6f3ec', scale: 2 })
    const link = document.createElement('a')
    link.download = `mochong-${pet.name}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const shareText = `「${pet.name}」${pet.companionDays}日 · ${pet.level}级`

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      /* noop */
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="font-serif text-sm text-[var(--ink-mid)] tracking-widest">分享</h2>

      <div
        ref={cardRef}
        className="ink-card rounded-sm p-6 text-center"
        style={{ background: '#f6f3ec' }}
      >
        <p className="font-serif text-xs text-[var(--ink-light)] tracking-[0.3em]">墨宠</p>
        <div className="text-4xl my-3 opacity-80">{skin.emoji}</div>
        <h3 className="font-serif text-xl text-[var(--ink)]">{pet.name}</h3>
        <p className="text-sm text-[var(--ink-mid)] mt-1">
          {pet.level} 级 · {skin.name}
        </p>
        <div className="ink-divider my-3" />
        <p className="text-xs text-[var(--ink-light)]">
          {pet.companionDays} 日 · {pet.focusSessions} 静
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={download} className="flex-1 btn-primary py-2 text-xs font-serif tracking-widest">
          存图
        </button>
        <button onClick={copyText} className="flex-1 btn-outline py-2 text-xs font-serif tracking-widest">
          复制
        </button>
      </div>
    </section>
  )
}
