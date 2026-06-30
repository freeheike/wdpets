import { useState } from 'react'
import { usePetStore } from '../store/petStore'

export default function EmbedCode() {
  const pet = usePetStore((s) => s.pet)
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const code = `<script src="${origin}/widget.js" data-pet-name="${pet.name}" data-skin="${pet.skinId}" data-level="${pet.level}"></script>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  return (
    <section className="space-y-3">
      <h2 className="font-serif text-sm text-[var(--ink-mid)] tracking-widest">嵌入</h2>

      <div className="relative">
        <pre className="ink-card rounded-sm p-3 text-[10px] text-[var(--ink-mid)] overflow-x-auto leading-relaxed font-mono">
          {code}
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-xs text-[var(--ink-light)] hover:text-[var(--ink)] font-serif"
        >
          {copied ? '已' : '复制'}
        </button>
      </div>
    </section>
  )
}
