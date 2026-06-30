import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import FocusPage from './pages/FocusPage'
import ProfilePage from './pages/ProfilePage'
import { useGameStore } from './store/gameStore'

function AppContent() {
  const init = useGameStore((s) => s.init)
  const tick = useGameStore((s) => s.tick)

  useEffect(() => {
    init()
    const interval = setInterval(tick, 120000)
    return () => clearInterval(interval)
  }, [init, tick])

  return (
    <div className="app-root">
      <Header />
      <main className="main-content page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<HomePage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guide" element={<ProfilePage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppContent />
    </BrowserRouter>
  )
}
