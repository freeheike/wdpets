import { share } from '../data/petAssets'
import { useGameStore } from '../store/gameStore'

export default function ProfilePage() {
  const stats = useGameStore((s) => s.stats)

  const copyShare = () => {
    const text = `小猫陪伴 ${stats.companionDays} 天 · Lv.${stats.level}`
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="profile-page">
      <div className="share-card-wrap">
        <img src={share.template} alt="分享卡片" className="share-template" />
        <img src={share.avatar} alt="" className="share-avatar" />
        <div className="share-info">
          <p>Lv.{stats.level}</p>
          <p>{stats.companionDays} 天</p>
        </div>
      </div>
      <button className="btn-primary" onClick={copyShare}>复制分享</button>
    </div>
  )
}
