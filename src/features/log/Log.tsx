import { useDojo } from '../../store/dojo'

const ICON: Record<string, string> = {
  event: '⚡',
  reflection: '🖋️',
  sensei: '🥋',
  milestone: '🏮',
}

export function Log() {
  const log = useDojo((s) => s.log)
  return (
    <section className="panel p-6">
      <div className="eyebrow mb-4">📜 Training log · your story</div>
      <div className="grid gap-3">
        {log.length === 0 && <p style={{ color: 'var(--ink-faint)' }}>Nothing logged yet.</p>}
        {log.map((e) => (
          <div key={e.id} className="flex gap-3">
            <div style={{ width: 22, textAlign: 'center' }}>{ICON[e.type] ?? '⚡'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{e.body}</div>
              <div className="text-xs" style={{ color: 'var(--ink-faint)' }}>
                {new Date(e.ts).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
