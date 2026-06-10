import { useEffect, useState } from 'react'

// Angka yang berhitung naik — rasa "game sungguhan" pada layar skor.
export function CountUp({ value, duration = 750, className }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let startT = null
    let raf
    const step = (t) => {
      if (!startT) startT = t
      const p = Math.min(1, (t - startT) / duration)
      // ease in-out lembut
      setV(Math.round(value * (0.5 - 0.5 * Math.cos(Math.PI * p))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={className}>{v}</span>
}

// Hujan partikel perayaan ringan (CSS murni, otomatis berhenti).
export function Celebrate() {
  return (
    <div className="celebrate" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className={'cf cf' + (i % 7)}
          style={{ left: 4 + i * 6.8 + '%', animationDelay: i * 0.07 + 's' }}
        />
      ))}
    </div>
  )
}
