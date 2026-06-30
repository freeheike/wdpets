import { uiButtons } from '../../data/petAssets'
import { useGameStore } from '../../store/gameStore'

export default function SignInButton() {
  const signIn = useGameStore((s) => s.signIn)
  const setPetAction = useGameStore((s) => s.setPetAction)
  const signedToday = useGameStore((s) => s.signedToday)

  const handleSignIn = () => {
    if (signIn()) {
      setPetAction('happy')
      setTimeout(() => setPetAction('idle'), 2000)
    }
  }

  return (
    <button
      className="game-float-btn"
      onClick={handleSignIn}
      disabled={signedToday}
      title="签到"
      aria-label="签到"
    >
      <img src={uiButtons.signin} alt="签到" draggable={false} />
    </button>
  )
}
