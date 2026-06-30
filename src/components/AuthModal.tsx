import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { isSupabaseConfigured } from '../lib/supabase'

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const signIn = useAuthStore((s) => s.signIn)
  const signUp = useAuthStore((s) => s.signUp)
  const signInGuest = useAuthStore((s) => s.signInGuest)
  const error = useAuthStore((s) => s.error)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let ok = false
    if (mode === 'login') {
      ok = await signIn(email, password)
    } else {
      ok = await signUp(email, password, nickname || '主人')
    }
    if (ok) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[var(--paper)] w-full sm:max-w-sm sm:mx-4 sm:rounded-sm border border-[var(--ink-faint)] p-5 safe-bottom max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-px bg-[var(--ink-faint)] mx-auto mb-5 sm:hidden" />

        <h2 className="font-serif text-center text-[var(--ink)] tracking-widest mb-5">
          {mode === 'login' ? '归' : '名'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="名"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-3 py-2.5 border-b border-[var(--ink-faint)] bg-transparent text-sm focus:outline-none font-serif"
            />
          )}
          <input
            type="email"
            placeholder="邮"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 border-b border-[var(--ink-faint)] bg-transparent text-sm focus:outline-none"
          />
          <input
            type="password"
            placeholder="密"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2.5 border-b border-[var(--ink-faint)] bg-transparent text-sm focus:outline-none"
          />

          {error && <p className="text-[var(--seal)] text-xs text-center">{error}</p>}

          <button type="submit" className="w-full py-2.5 btn-primary text-sm font-serif tracking-widest mt-2">
            {mode === 'login' ? '入' : '立'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2 text-xs">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[var(--ink-light)] hover:text-[var(--ink)] font-serif"
          >
            {mode === 'login' ? '无名者' : '已有名'}
          </button>
          <div>
            <button
              onClick={() => { signInGuest(); onClose() }}
              className="text-[var(--ink-faint)] hover:text-[var(--ink-light)] font-serif"
            >
              过客
            </button>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <p className="text-[10px] text-[var(--ink-light)] text-center mt-4">
            本地存
          </p>
        )}
      </div>
    </div>
  )
}
