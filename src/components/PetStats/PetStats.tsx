import { uiIcons, statusBars } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

function StatRow({ icon, bar, value, label }: { icon: string; bar: string; value: number; label: string }) {
  return (
    <div className="stat-row">
      <img src={icon} alt="" className="stat-icon" />
      <div className="stat-bar-wrap">
        <img src={bar} alt="" className="stat-bar-bg" />
        <div className="stat-bar-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function PetStats() {
  const stats = useGameStore((s) => s.stats)

  return (
    <div className="pet-stats">
      <div className="stat-badges">
        <div className="badge">
          <img src={uiIcons.level} alt="" />
          <span>{stats.level}</span>
        </div>
        <div className="badge">
          <img src={uiIcons.coin} alt="" />
          <span>{stats.coins}</span>
        </div>
      </div>
      <StatRow icon={uiIcons.heart} bar={statusBars.mood} value={stats.mood} label="心情" />
      <StatRow icon={uiIcons.food} bar={statusBars.hunger} value={stats.hunger} label="饥饿" />
      <StatRow icon={uiIcons.energy} bar={statusBars.energy} value={stats.energy} label="体力" />
      <StatRow icon={uiIcons.star} bar={statusBars.exp} value={Math.min(100, stats.exp % 100)} label="经验" />
    </div>
  )
}
