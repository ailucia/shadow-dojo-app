import Dexie from 'dexie'
import type { Table } from 'dexie'
import type { DojoState, Technique, Training, LogEntry } from '../types'

export interface MetaRow {
  key: string
  value: unknown
}

// IndexedDB is the live store. The exported JSON snapshot (snapshot.ts) is
// the durable, sensei-readable mirror.
export class DojoDB extends Dexie {
  dojo!: Table<DojoState, string>
  techniques!: Table<Technique, string>
  training!: Table<Training, string>
  log!: Table<LogEntry, string>
  meta!: Table<MetaRow, string>

  constructor() {
    super('shadow-dojo-training')
    this.version(1).stores({
      dojo: 'id',
      techniques: 'key',
      training: 'id, date, status',
      log: 'id, ts',
      meta: 'key',
    })
  }
}

export const db = new DojoDB()
