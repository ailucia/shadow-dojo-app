import { db } from './schema'
import type { Snapshot } from '../types'
import { SCHEMA_VERSION } from '../types'
import { migrateDojo, validateSnapshot } from './migrate'

export { migrateDojo, validateSnapshot }

// The whole world, serialized. This is exactly what gets written to
// shadow-dojo.json and what the sensei reads and edits.
export async function buildSnapshot(): Promise<Snapshot> {
  const [dojoRows, techniques, training, log] = await Promise.all([
    db.dojo.toArray(),
    db.techniques.toArray(),
    db.training.toArray(),
    db.log.toArray(),
  ])
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    dojo: dojoRows[0],
    techniques,
    training,
    log,
  }
}

// Replace the live store with a snapshot (from import or a sensei file sync).
// Older saves may still carry a `missions` board; it is ignored.
export async function loadSnapshot(snap: Snapshot): Promise<void> {
  const problem = validateSnapshot(snap)
  if (problem) throw new Error(problem)
  await db.transaction('rw', [db.dojo, db.techniques, db.training, db.log], async () => {
    await Promise.all([db.dojo.clear(), db.techniques.clear(), db.training.clear(), db.log.clear()])
    await db.dojo.put(migrateDojo(snap.dojo))
    if (snap.techniques?.length) await db.techniques.bulkPut(snap.techniques)
    if (snap.training?.length) await db.training.bulkPut(snap.training)
    if (snap.log?.length) await db.log.bulkPut(snap.log)
  })
}
