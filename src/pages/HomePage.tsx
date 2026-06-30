import VirtualPet from '../components/VirtualPet/VirtualPet'
import ActionBar from '../components/ActionBar/ActionBar'
import InventoryPanel from '../components/InventoryPanel/InventoryPanel'
import ShopPanel from '../components/ShopPanel/ShopPanel'
import SceneSwitcher from '../components/SceneSwitcher/SceneSwitcher'
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
      <div className="game-ui">
        <div className="game-ui-spacer" />
        <SceneSwitcher />
        <ActionBar />
      </div>
      <InventoryPanel />
      <ShopPanel />
    </div>
  )
}
