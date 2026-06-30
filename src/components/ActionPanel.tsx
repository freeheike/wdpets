import { usePetStore } from '../store/petStore'

export default function ActionPanel() {
  const feed = usePetStore((s) => s.feed)
  const play = usePetStore((s) => s.play)
  const clean = usePetStore((s) => s.clean)
  const checkIn = usePetStore((s) => s.checkIn)
  const setSpeech = usePetStore((s) => s.setSpeech)
  const setAction = usePetStore((s) => s.setAction)

  const handleCheckIn = () => {
    const result = checkIn()
    if (result.success) {
      setSpeech(`+${result.coins}`)
      setAction('happy')
      setTimeout(() => setAction('idle'), 2000)
    } else {
      setSpeech('明日再来')
    }
  }

  const actions = [
    { label: '食', onClick: () => { feed(); setSpeech('…'); setTimeout(() => setSpeech(null), 1500) } },
    { label: '玩', onClick: () => { play(); setSpeech('～'); setTimeout(() => setSpeech(null), 1500) } },
    { label: '沐', onClick: () => { clean(); setSpeech('。'); setTimeout(() => setSpeech(null), 1500) } },
    { label: '签', onClick: handleCheckIn },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          className="btn-outline py-3 font-serif text-sm tracking-widest active:bg-[var(--wash)]"
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}
