import { uiButtons } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

export default function ActionBar() {
  const signIn = useGameStore((s) => s.signIn)
  const setShowBag = useGameStore((s) => s.setShowBag)
  const setShowShop = useGameStore((s) => s.setShowShop)
  const setPetAction = useGameStore((s) => s.setPetAction)
  const signedToday = useGameStore((s) => s.signedToday)

  const handleSignIn = () => {
    if (signIn()) {
      setPetAction('happy')
      setTimeout(() => setPetAction('idle'), 2000)
    }
  }

  return (
    <div className="action-bar">
      <button className="action-btn" onClick={handleSignIn} disabled={signedToday} title="签到">
        <img src={uiButtons.signin} alt="签到" />
      </button>
      <button className="action-btn" onClick={() => setShowShop(true)} title="商店">
        <img src={uiButtons.shop} alt="商店" />
      </button>
      <button className="action-btn" onClick={() => setShowBag(true)} title="背包">
        <img src={uiButtons.bag} alt="背包" />
      </button>
      <button className="action-btn" onClick={() => setShowBag(false)} title="设置">
        <img src={uiButtons.settings} alt="设置" />
      </button>
    </div>
  )
}
