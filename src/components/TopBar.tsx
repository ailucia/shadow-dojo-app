import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useDojo } from '../store/dojo'
import { Shuriken } from './Shuriken'
import {
  connectFile,
  connectedFileName,
  exportDownload,
  fileApiSupported,
  importFromText,
  isFileConnected,
  syncFromFile,
} from '../db/persistence'

export function TopBar() {
  const reload = useDojo((s) => s.reload)
  const syncIssue = useDojo((s) => s.syncIssue)
  const setSyncIssue = useDojo((s) => s.setSyncIssue)
  const notice = useDojo((s) => s.notice)
  const setNotice = useDojo((s) => s.setNotice)
  const [fileName, setFileName] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void (async () => {
      if (await isFileConnected()) setFileName(await connectedFileName())
    })()
  }, [])

  function flash(t: string) {
    setMsg(t)
    setTimeout(() => setMsg(''), 2600)
  }

  async function onConnect() {
    try {
      if (await connectFile()) {
        setFileName(await connectedFileName())
        flash('Linked — autosaving to your file.')
      }
    } catch {
      /* user canceled the picker */
    }
  }
  async function onSync() {
    try {
      if (await syncFromFile()) {
        await reload()
        setSyncIssue(null)
        flash('Synced with your sensei.')
      }
    } catch (err) {
      setSyncIssue(err instanceof Error ? err.message : 'Your save file could not be loaded.')
    }
  }
  async function onImportPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      await importFromText(await f.text())
      await reload()
      flash('Imported your dojo.')
    } catch (err) {
      flash(err instanceof Error ? `Not imported: ${err.message}` : 'That file could not be imported.')
    }
    e.target.value = ''
  }

  const link = ({ isActive }: { isActive: boolean }) =>
    'btn btn-sm ' + (isActive ? 'btn-primary' : 'btn-ghost')

  return (
    <header className="flex items-center gap-3 flex-wrap mb-6">
      <div className="display text-lg mr-1 flex items-center gap-2">
        <Shuriken size={24} />
        <span>
          SHADOW <span className="ki-text">DOJO</span>
        </span>
      </div>
      <nav className="flex gap-2">
        <NavLink to="/" className={link} end>
          🏯 Dojo
        </NavLink>
        <NavLink to="/log" className={link}>
          📜 Log
        </NavLink>
      </nav>
      <div className="flex-1" />
      {msg && (
        <span className="text-xs" style={{ color: 'var(--calm)' }}>
          {msg}
        </span>
      )}
      {fileApiSupported() &&
        (fileName ? (
          <button className="btn btn-ghost btn-sm" onClick={() => void onSync()} title={`Linked: ${fileName}`}>
            🥋 Sync sensei
          </button>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => void onConnect()}>
            🔗 Link file
          </button>
        ))}
      <button className="btn btn-ghost btn-sm" onClick={() => fileInput.current?.click()}>
        📥 Import
      </button>
      <button className="btn btn-ghost btn-sm" onClick={() => void exportDownload()}>
        📤 Export
      </button>
      <input ref={fileInput} type="file" accept="application/json" hidden onChange={(e) => void onImportPick(e)} />
      {notice && !syncIssue && (
        <div className="w-full panel-raised p-3 text-sm flex items-center justify-between gap-3" role="status" style={{ borderColor: 'var(--calm-dim)', color: 'var(--calm)' }}>
          <span>🥋 {notice}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setNotice(null)}>
            OK
          </button>
        </div>
      )}
      {syncIssue && (
        <div className="w-full panel-raised p-3 text-sm" role="alert" style={{ borderColor: 'var(--ki-2)', color: 'var(--ink)' }}>
          ⚠️ Your save file wasn't loaded, so nothing was replaced: {syncIssue} Ask your sensei to fix the file, then
          click Sync sensei.
        </div>
      )}
    </header>
  )
}
