import { useEffect } from 'react'
import { backgrounds } from '../data/petAssets'
import { useGameStore } from '../store/gameStore'
import VirtualPet from '../components/VirtualPet/VirtualPet'
import FocusMode from '../components/FocusMode'

export default function FocusPage() {
  const setScene = useGameStore((s) => s.setScene)

  useEffect(() => {
    setScene('focus')
    return () => setScene('day')
  }, [setScene])

  return (
    <div className="game-screen focus-page">
      <div className="game-bg" style={{ backgroundImage: `url(${backgrounds.focus})` }} />
      <VirtualPet />
      <div className="game-ui focus-ui">
        <div className="game-ui-spacer" />
        <FocusMode />
      </div>
    </div>
  )
}
