import type { GameplayPanel } from '../../store/gameStore'
import { useGameStore } from '../../store/gameStore'
import { uiButtons } from '../../data/petAssets'

const ITEMS: { id: GameplayPanel; label: string; icon?: string }[] = [
  { id: 'cultivate', label: '培养', icon: uiButtons.cultivate },
  { id: 'hatch', label: '孵蛋', icon: uiButtons.hatch },
  { id: 'training', label: '历练', icon: uiButtons.training },
  { id: 'map', label: '地图', icon: uiButtons.map },
]

export default function GameplayBar() {
  const activePanel = useGameStore((s) => s.activePanel)
  const setActivePanel = useGameStore((s) => s.setActivePanel)

  const toggle = (id: GameplayPanel) => {
    setActivePanel(activePanel === id ? null : id)
  }

  return (
    <nav className="gameplay-bar" aria-label="玩法栏">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`gameplay-bar-btn ${activePanel === item.id ? 'active' : ''}`}
          onClick={() => toggle(item.id!)}
        >
          <span className="gameplay-bar-icon" aria-hidden="true">
            {item.icon ? (
              <img src={item.icon} alt="" className="gameplay-bar-icon-img" draggable={false} />
            ) : null}
          </span>
          <span className="gameplay-bar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
