import { db } from './schema'
import { buildSnapshot, loadSnapshot } from './snapshot'
import type { Snapshot } from '../types'

// Durable mirror + sensei interface via the File System Access API
// (Chromium). Everything degrades gracefully to manual export/import.

const FILE_KEY = 'fileHandle'
const FILE_NAME = 'shadow-dojo.json'

type PermState = 'granted' | 'denied' | 'prompt'
interface FileHandle {
  name: string
  queryPermission(opts: { mode: 'read' | 'readwrite' }): Promise<PermState>
  requestPermission(opts: { mode: 'read' | 'readwrite' }): Promise<PermState>
  createWritable(): Promise<{ write: (data: string) => Promise<void>; close: () => Promise<void> }>
  getFile(): Promise<File>
}

export function fileApiSupported(): boolean {
  return typeof (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker === 'function'
}

async function getHandle(): Promise<FileHandle | null> {
  const row = await db.meta.get(FILE_KEY)
  return (row?.value as FileHandle) ?? null
}

export async function isFileConnected(): Promise<boolean> {
  const h = await getHandle()
  if (!h) return false
  return (await h.queryPermission({ mode: 'readwrite' })) === 'granted'
}

export async function connectedFileName(): Promise<string | null> {
  const h = await getHandle()
  return h?.name ?? null
}

/** Pick/create the shared dojo file. Must run from a user gesture. */
export async function connectFile(): Promise<boolean> {
  if (!fileApiSupported()) return false
  const picker = (window as unknown as {
    showSaveFilePicker: (opts: unknown) => Promise<FileHandle>
  }).showSaveFilePicker
  const handle = await picker({
    suggestedName: FILE_NAME,
    types: [{ description: 'Shadow Dojo save', accept: { 'application/json': ['.json'] } }],
  })
  lastKnownModified = 0 // a newly chosen file starts from the app's state
  await db.meta.put({ key: FILE_KEY, value: handle })
  await saveToFile()
  return true
}

/** Re-grant permission to a previously connected handle (user gesture). */
export async function reconnectPermission(): Promise<boolean> {
  const h = await getHandle()
  if (!h) return false
  return (await h.requestPermission({ mode: 'readwrite' })) === 'granted'
}

// The file's lastModified as of our last read or write. If the file changed
// after that, the sensei edited it, and an autosave must not overwrite those
// edits: the app pulls them in instead.
let lastKnownModified = 0
let onExternalChange: (() => void) | null = null

/** Called when an autosave finds the file was changed outside the app. */
export function setExternalChangeHandler(fn: (() => void) | null): void {
  onExternalChange = fn
}

export async function saveToFile(): Promise<boolean> {
  const h = await getHandle()
  if (!h) return false
  if ((await h.queryPermission({ mode: 'readwrite' })) !== 'granted') return false
  if (lastKnownModified && (await h.getFile()).lastModified > lastKnownModified) {
    onExternalChange?.()
    return false
  }
  const snap = await buildSnapshot()
  const writable = await h.createWritable()
  await writable.write(JSON.stringify(snap, null, 2))
  await writable.close()
  lastKnownModified = (await h.getFile()).lastModified
  return true
}

/** Pull changes the sensei made to the file back into the app. Throws with a
 *  plain message if the file can't be read as a save; nothing is replaced then. */
export async function syncFromFile(): Promise<boolean> {
  const h = await getHandle()
  if (!h) return false
  if ((await h.queryPermission({ mode: 'readwrite' })) !== 'granted') {
    if ((await h.requestPermission({ mode: 'readwrite' })) !== 'granted') return false
  }
  const file = await h.getFile()
  const text = await file.text()
  if (!text.trim()) return false
  let snap: Snapshot
  try {
    snap = JSON.parse(text) as Snapshot
  } catch {
    throw new Error('Your save file is not valid JSON, so it was not loaded.')
  }
  await loadSnapshot(snap)
  lastKnownModified = file.lastModified
  return true
}

export async function disconnectFile(): Promise<void> {
  await db.meta.delete(FILE_KEY)
}

/* ---- universal export / import (every browser) ---- */
export async function exportDownload(): Promise<void> {
  const snap = await buildSnapshot()
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = FILE_NAME
  a.click()
  URL.revokeObjectURL(url)
}

export async function importFromText(text: string): Promise<void> {
  const snap = JSON.parse(text) as Snapshot
  await loadSnapshot(snap)
}

/* ---- debounced autosave to the connected file ---- */
let saveTimer: ReturnType<typeof setTimeout> | null = null
export function scheduleAutosave(): void {
  if (!fileApiSupported()) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    void saveToFile()
  }, 1200)
}
