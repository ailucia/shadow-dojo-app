import { useEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDojo } from './store/dojo'
import { Onboarding } from './features/onboarding/Onboarding'
import { Dojo } from './features/dojo/Dojo'
import { Log } from './features/log/Log'
import { TopBar } from './components/TopBar'
import { RewardLayer } from './components/RewardLayer'
import { RankUpOverlay } from './components/RankUpOverlay'
import { KiBloomOverlay } from './components/KiBloomOverlay'
import { isFileConnected, setExternalChangeHandler, syncFromFile } from './db/persistence'

export default function App() {
  const ready = useDojo((s) => s.ready)
  const dojo = useDojo((s) => s.dojo)
  const init = useDojo((s) => s.init)
  const reload = useDojo((s) => s.reload)
  const setSyncIssue = useDojo((s) => s.setSyncIssue)
  const setNotice = useDojo((s) => s.setNotice)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    void init()
  }, [init])

  // Pull sensei edits from the linked file when the window regains focus, and
  // whenever an autosave finds the file changed first (so it never overwrites them).
  useEffect(() => {
    async function pullFromFile(): Promise<boolean> {
      if (!(await isFileConnected())) return false
      try {
        const pulled = await syncFromFile()
        if (pulled) await reload()
        setSyncIssue(null)
        return pulled
      } catch (e) {
        setSyncIssue(e instanceof Error ? e.message : 'Your save file could not be loaded.')
        return false
      }
    }
    const onFocus = () => void pullFromFile()
    window.addEventListener('focus', onFocus)
    setExternalChangeHandler(() => {
      void (async () => {
        if (await pullFromFile()) {
          setNotice("Pulled in your sensei's latest changes. Anything you did in the last few seconds may need redoing.")
        }
      })()
    })
    return () => {
      window.removeEventListener('focus', onFocus)
      setExternalChangeHandler(null)
    }
  }, [reload, setSyncIssue, setNotice])

  if (!ready) {
    return (
      <div
        className="flex items-center justify-center gap-2"
        style={{ minHeight: '100vh', color: 'var(--ink-faint)' }}
      >
        <span aria-hidden="true">🥷</span> Entering the dojo…
      </div>
    )
  }

  if (!dojo || !dojo.onboarded) return <Onboarding />

  return (
    <BrowserRouter>
      <div className="p-5 md:p-8" style={{ maxWidth: 1040, margin: '0 auto' }}>
        <TopBar />
        <Routes>
          <Route path="/" element={<Dojo />} />
          <Route path="/log" element={<Log />} />
        </Routes>
      </div>
      <RewardLayer />
      <RankUpOverlay />
      <KiBloomOverlay />
    </BrowserRouter>
  )
}
