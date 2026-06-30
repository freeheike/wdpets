import { useGameStore } from '../../store/gameStore'
import { SKINS } from '../../types'

export default function ShopPanel() {
  const show = useGameStore((s) => s.showShop)
  const setShowShop = useGameStore((s) => s.setShowShop)
  const stats = useGameStore((s) => s.stats)

  if (!show) return null

  return (
    <div className="panel-overlay" onClick={() => setShowShop(false)}>
      <div className="inventory-panel shop-panel" onClick={(e) => e.stopPropagation()}>
        <h3>商店 <span className="coins">{stats.coins}</span></h3>
        <div className="item-grid">
          {SKINS.filter((s) => s.price > 0).map((skin) => (
            <div key={skin.id} className="shop-item">
              <div
                className="shop-preview"
                style={{ background: `linear-gradient(135deg, ${skin.colors.body}, ${skin.colors.belly})` }}
              >
                {skin.emoji}
              </div>
              <span>{skin.name}</span>
              <span className="price">{skin.price}</span>
            </div>
          ))}
        </div>
        <p className="shop-hint">皮肤系统即将上线</p>
        <button className="panel-close" onClick={() => setShowShop(false)}>关闭</button>
      </div>
    </div>
  )
}
