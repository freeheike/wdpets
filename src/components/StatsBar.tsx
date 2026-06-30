import { usePetStore, getExpProgress } from '../store/petStore'

function StatBar({ label, value }: { label: string; value: number }) {
  const low = value < 30
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[var(--ink-mid)] w-8 shrink-0 font-serif">{label}</span>
      <div className="flex-1 ink-bar">
        <div
          className={`ink-bar-fill ${low ? 'low' : ''}`}
          style={{ width: `${value}%`, opacity: low ? 1 : 0.3 + (value / 100) * 0.7 }}
        />
      </div>
      <span className={`text-xs w-6 text-right tabular-nums ${low ? 'text-[var(--seal)]' : 'text-[var(--ink-light)]'}`}>
        {value}
      </span>
    </div>
  )
}

export default function StatsBar() {
  const pet = usePetStore((s) => s.pet)
  const exp = getExpProgress(pet)

  return (
    <div className="ink-card rounded-sm p-4 space-y-3">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-base text-[var(--ink)]">{pet.name}</h2>
          <p className="text-xs text-[var(--ink-light)] mt-0.5">
            {pet.level} 级 · {pet.companionDays} 日
          </p>
        </div>
        <span className="text-sm text-[var(--ink-mid)] tabular-nums">{pet.coins}</span>
      </div>

      <div className="ink-divider" />

      <div className="space-y-2">
        <StatBar label="饥" value={pet.hunger} />
        <StatBar label="心" value={pet.mood} />
        <StatBar label="洁" value={pet.cleanliness} />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[var(--ink-mid)] w-8 shrink-0 font-serif">境</span>
        <div className="flex-1 ink-bar">
          <div className="ink-bar-fill" style={{ width: `${exp.percent}%` }} />
        </div>
        <span className="text-xs text-[var(--ink-light)] w-10 text-right tabular-nums">
          {exp.current}/{exp.max}
        </span>
      </div>
    </div>
  )
}
