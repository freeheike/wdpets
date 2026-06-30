import { foodItems, toyItems, cleaningItems } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

export default function InventoryPanel() {
  const show = useGameStore((s) => s.showBag)
  const setShowBag = useGameStore((s) => s.setShowBag)
  const feed = useGameStore((s) => s.feed)
  const playToy = useGameStore((s) => s.playToy)
  const clean = useGameStore((s) => s.clean)

  if (!show) return null

  return (
    <div className="panel-overlay" onClick={() => setShowBag(false)}>
      <div className="inventory-panel" onClick={(e) => e.stopPropagation()}>
        <h3>背包</h3>

        <p className="panel-section">食物</p>
        <div className="item-grid">
          {Object.entries(foodItems).map(([key, item]) => (
            <button key={key} className="item-btn" onClick={() => { feed(); setShowBag(false) }}>
              <img src={item.src} alt={item.name} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <p className="panel-section">玩具</p>
        <div className="item-grid">
          {Object.entries(toyItems).map(([key, item]) => (
            <button key={key} className="item-btn" onClick={() => { playToy(); setShowBag(false) }}>
              <img src={item.src} alt={item.name} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <p className="panel-section">清洁</p>
        <div className="item-grid item-grid-sm">
          {Object.entries(cleaningItems).map(([key, src]) => (
            <button key={key} className="item-btn" onClick={() => { clean(); setShowBag(false) }}>
              <img src={src} alt={key} />
            </button>
          ))}
        </div>

        <button className="panel-close" onClick={() => setShowBag(false)}>关闭</button>
      </div>
    </div>
  )
}
