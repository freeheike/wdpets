import { uiButtons } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

export default function ShopButton() {
  const setShowShop = useGameStore((s) => s.setShowShop)

  return (
    <button
      className="game-float-btn"
      onClick={() => setShowShop(true)}
      title="商店"
      aria-label="商店"
    >
      <img src={uiButtons.shop} alt="商店" draggable={false} />
    </button>
  )
}
