import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/', label: '首页' },
  { path: '/focus', label: '专注' },
  { path: '/profile', label: '我的' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="bottom-nav safe-bottom">
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
  )
}
