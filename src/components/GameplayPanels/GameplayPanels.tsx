import { useEffect } from 'react'
import { backgrounds, type SceneId } from '../../data/petAssets'
import type { GameplayPanel } from '../../store/gameStore'
import { useGameStore } from '../../store/gameStore'

const MAP_SCENES: { id: SceneId; label: string }[] = [
  { id: 'day', label: '房间' },
  { id: 'focus', label: '专注' },
  { id: 'night', label: '夜晚' },
]

function CultivateContent() {
  const stats = useGameStore((s) => s.stats)
  const expInLevel = stats.exp % 100

  return (
    <div className="gameplay-panel-body">
      <div className="stat-card">
        <span className="stat-card-label">等级</span>
        <span className="stat-card-value">Lv.{stats.level}</span>
      </div>
      <div className="stat-card">
        <span className="stat-card-label">经验</span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${expInLevel}%` }} />
        </div>
        <span className="stat-card-sub">{stats.exp} / {(Math.floor(stats.exp / 100) + 1) * 100}</span>
      </div>
      <div className="stat-card">
        <span className="stat-card-label">亲密度</span>
        <div className="progress-track progress-track-warm">
          <div className="progress-fill" style={{ width: `${stats.intimacy}%` }} />
        </div>
        <span className="stat-card-sub">{stats.intimacy}%</span>
      </div>
      <div className="stat-card">
        <span className="stat-card-label">成长值</span>
        <div className="progress-track progress-track-growth">
          <div className="progress-fill" style={{ width: `${stats.growthValue}%` }} />
        </div>
        <span className="stat-card-sub">{stats.growthValue}%</span>
      </div>
      <p className="gameplay-panel-hint">持续陪伴与历练，可提升成长与亲密度</p>
    </div>
  )
}

function HatchContent() {
  const hatchProgress = useGameStore((s) => s.hatchProgress)
  const isHatching = useGameStore((s) => s.isHatching)
  const setHatchProgress = useGameStore((s) => s.setHatchProgress)
  const setIsHatching = useGameStore((s) => s.setIsHatching)

  useEffect(() => {
    if (!isHatching || hatchProgress >= 100) return
    const timer = setInterval(() => {
      const next = Math.min(100, useGameStore.getState().hatchProgress + 2)
      setHatchProgress(next)
      if (next >= 100) setIsHatching(false)
    }, 800)
    return () => clearInterval(timer)
  }, [isHatching, hatchProgress, setHatchProgress, setIsHatching])

  const handleHatch = () => {
    if (hatchProgress >= 100) {
      setHatchProgress(0)
      setIsHatching(true)
      return
    }
    if (!isHatching) setIsHatching(true)
  }

  return (
    <div className="gameplay-panel-body gameplay-panel-body-center">
      <div className={`hatch-egg ${isHatching ? 'hatching' : ''}`}>
        <span className="hatch-egg-icon" aria-hidden="true" />
      </div>
      <p className="hatch-status">
        {hatchProgress >= 100 ? '孵化完成，可重新开始' : isHatching ? '孵化中…' : '灵蛋静候破壳'}
      </p>
      <div className="progress-track progress-track-hatch">
        <div className="progress-fill" style={{ width: `${hatchProgress}%` }} />
      </div>
      <span className="stat-card-sub">{hatchProgress}%</span>
      <button type="button" className="gameplay-action-btn" onClick={handleHatch} disabled={isHatching && hatchProgress < 100}>
        {hatchProgress >= 100 ? '重新孵化' : isHatching ? '孵化中' : '开始孵化'}
      </button>
    </div>
  )
}

function TrainingContent() {
  const stats = useGameStore((s) => s.stats)
  const trainingActive = useGameStore((s) => s.trainingActive)
  const startTraining = useGameStore((s) => s.startTraining)
  const setActivePanel = useGameStore((s) => s.setActivePanel)

  const handleStart = () => {
    if (startTraining()) setActivePanel(null)
  }

  return (
    <div className="gameplay-panel-body">
      <div className="training-card">
        <h4>外出历练</h4>
        <p>派遣水墨小龙外出修行，归来后获得经验与成长。</p>
        <ul className="training-meta">
          <li><span>消耗体力</span><strong>10</strong></li>
          <li><span>经验奖励</span><strong>+15</strong></li>
          <li><span>成长奖励</span><strong>+3</strong></li>
          <li><span>当前体力</span><strong>{stats.energy}</strong></li>
        </ul>
        <button
          type="button"
          className="gameplay-action-btn"
          onClick={handleStart}
          disabled={trainingActive || stats.energy < 10}
        >
          {trainingActive ? '历练中…' : stats.energy < 10 ? '体力不足' : '开始历练'}
        </button>
      </div>
    </div>
  )
}

function MapContent() {
  const scene = useGameStore((s) => s.scene)
  const setScene = useGameStore((s) => s.setScene)
  const setActivePanel = useGameStore((s) => s.setActivePanel)

  const selectScene = (id: SceneId) => {
    setScene(id)
    setActivePanel(null)
  }

  return (
    <div className="gameplay-panel-body">
      <div className="map-grid">
        {MAP_SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`map-option ${scene === s.id ? 'active' : ''}`}
            onClick={() => selectScene(s.id)}
          >
            <img src={backgrounds[s.id]} alt={s.label} />
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const TITLES: Record<Exclude<GameplayPanel, null>, string> = {
  cultivate: '培养',
  hatch: '孵蛋',
  training: '历练',
  map: '地图',
}

export default function GameplayPanels() {
  const activePanel = useGameStore((s) => s.activePanel)
  const setActivePanel = useGameStore((s) => s.setActivePanel)

  if (!activePanel) return null

  return (
    <div className="panel-overlay" onClick={() => setActivePanel(null)}>
      <div className="gameplay-panel" onClick={(e) => e.stopPropagation()}>
        <h3>{TITLES[activePanel]}</h3>
        {activePanel === 'cultivate' && <CultivateContent />}
        {activePanel === 'hatch' && <HatchContent />}
        {activePanel === 'training' && <TrainingContent />}
        {activePanel === 'map' && <MapContent />}
        <button type="button" className="panel-close" onClick={() => setActivePanel(null)}>
          关闭
        </button>
      </div>
    </div>
  )
}
