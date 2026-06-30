import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/', label: '首页' },
  { path: '/focus', label: '专注' },
  { path: '/profile', label: '我的' },
]

export default function Header() {
  const location = useLocation()

  return (
    <header className="game-header safe-top">
      <Link to="/" className="logo">墨宠</Link>
      <nav className="header-nav">
        {NAV.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
