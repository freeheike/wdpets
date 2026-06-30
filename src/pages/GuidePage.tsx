import { Link } from 'react-router-dom'
import { SKINS } from '../types'

export default function GuidePage() {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h1 className="font-serif text-lg text-[var(--ink)] tracking-widest text-center">图鉴</h1>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {SKINS.map((skin) => (
          <div key={skin.id} className="ink-card rounded-sm p-3 text-center">
            <div
              className="w-10 h-10 mx-auto rounded-sm flex items-center justify-center text-lg opacity-80"
              style={{ background: `linear-gradient(135deg, ${skin.colors.body}, ${skin.colors.belly})` }}
            >
              {skin.emoji}
            </div>
            <p className="font-serif text-xs text-[var(--ink)] mt-2">{skin.name}</p>
          </div>
        ))}
      </div>

      <Link to="/" className="block text-center text-xs text-[var(--ink-light)] hover:text-[var(--ink)] py-2 font-serif">
        ← 回首页
      </Link>
    </div>
  )
}
