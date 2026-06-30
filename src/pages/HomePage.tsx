import VirtualPet from '../components/VirtualPet/VirtualPet'
import SignInButton from '../components/SignInButton/SignInButton'
import BagButton from '../components/BagButton/BagButton'
import ShopButton from '../components/ShopButton/ShopButton'
import GameplayBar from '../components/GameplayBar/GameplayBar'
import GameplayPanels from '../components/GameplayPanels/GameplayPanels'
import InventoryPanel from '../components/InventoryPanel/InventoryPanel'
import ShopPanel from '../components/ShopPanel/ShopPanel'
import { backgrounds } from '../data/petAssets'
import { useGameStore } from '../store/gameStore'

export default function HomePage() {
  const scene = useGameStore((s) => s.scene)

  return (
    <div className="game-screen">
      <div
        className="game-bg"
        style={{ backgroundImage: `url(${backgrounds[scene]})` }}
      />
      <VirtualPet />
      <div className="top-left-bar">
        <SignInButton />
        <BagButton />
        <ShopButton />
      </div>
      <GameplayBar />
      <InventoryPanel />
      <ShopPanel />
      <GameplayPanels />
    </div>
  )
}
