import { uiButtons } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

export default function BagButton() {
  const setShowBag = useGameStore((s) => s.setShowBag)

  return (
    <button
      className="game-float-btn"
      onClick={() => setShowBag(true)}
      title="背包"
      aria-label="背包"
    >
      <img src={uiButtons.bag} alt="背包" draggable={false} />
    </button>
  )
}
