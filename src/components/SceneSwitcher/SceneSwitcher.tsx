import { backgrounds, type SceneId } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

const SCENES: { id: SceneId; label: string }[] = [
  { id: 'day', label: '房间' },
  { id: 'focus', label: '专注' },
  { id: 'night', label: '夜晚' },
]

export default function SceneSwitcher() {
  const scene = useGameStore((s) => s.scene)
  const setScene = useGameStore((s) => s.setScene)

  return (
    <div className="scene-switcher">
      {SCENES.map((s) => (
        <button
          key={s.id}
          className={`scene-btn ${scene === s.id ? 'active' : ''}`}
          onClick={() => setScene(s.id)}
        >
          <img src={backgrounds[s.id]} alt={s.label} />
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  )
}
