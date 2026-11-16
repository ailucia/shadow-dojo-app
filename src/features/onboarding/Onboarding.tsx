import { useState } from 'react'
import { useDojo } from '../../store/dojo'
import { connectFile, connectedFileName, fileApiSupported } from '../../db/persistence'

const STEP_ICONS = ['🥷', '📜', '🥋']

const INITIATE_PROMPT =
  "Sensei — I'm new. Read AGENTS.md, then run prompts/initiate.md with me: set up my dojo, interview me, and plan my first day."

// Three screens. The dojo is created when you leave the first one, so the save
// file can be linked on the second; setup only finishes on the third.
export function Onboarding() {
  const dojo = useDojo((s) => s.dojo)
  const createDojo = useDojo((s) => s.createDojo)
  const finishOnboarding = useDojo((s) => s.finishOnboarding)
  // a reload mid-setup resumes at the link step
  const [step, setStep] = useState(dojo ? 1 : 0)
  const [ninjaName, setNinjaName] = useState('')
  const [linkedName, setLinkedName] = useState<string | null>(null)
  const [linkError, setLinkError] = useState('')
  const [copied, setCopied] = useState(false)
  const canLink = fileApiSupported()

  async function leaveNameStep() {
    if (!dojo) await createDojo(ninjaName)
    setStep(1)
  }

  async function onLink() {
    setLinkError('')
    try {
      if (await connectFile()) setLinkedName(await connectedFileName())
    } catch (e) {
      // the user closed the save dialog — not an error worth showing
      if (!(e instanceof DOMException && e.name === 'AbortError')) setLinkError('That file could not be linked. Try again.')
    }
  }

  async function copyInitiate() {
    try {
      await navigator.clipboard.writeText(INITIATE_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center justify-center p-6" style={{ minHeight: '100vh' }}>
      <div className="panel p-8 w-full" style={{ maxWidth: 560 }}>
        <div className="emblem mb-4" aria-hidden="true">
          {STEP_ICONS[step]}
        </div>
        <div className="eyebrow mb-3">Enter the dojo · {step + 1}/3</div>

        {step === 0 && (
          <>
            <h1 className="display text-3xl mb-2">
              What should the dojo <span className="ki-text">call you</span>?
            </h1>
            <p className="mb-4" style={{ color: 'var(--ink-dim)' }}>
              Your name or a nickname. You'll see it every day: "Welcome back, ___."
            </p>
            <input
              autoFocus
              className="field"
              placeholder="e.g. Kage — or just your name"
              value={ninjaName}
              onChange={(e) => setNinjaName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && ninjaName.trim()) void leaveNameStep()
              }}
            />
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="display text-3xl mb-2">
              Link your <span className="ki-text">save file</span>.
            </h1>
            <p className="mb-3" style={{ color: 'var(--ink-dim)' }}>
              The app keeps your progress inside your browser, where your AI sensei can't see it.
              Linking keeps a copy in a file in this project's <code>my/</code> folder, updated every
              time something changes. Your sensei reads that file and writes your daily plan into it,
              and the app picks the changes up when you come back to this tab.
            </p>
            {canLink ? (
              <>
                <p className="text-sm mb-4" style={{ color: 'var(--ink-faint)' }}>
                  In the save dialog, open the <code>my/</code> folder inside the shadow-dojo-app
                  folder and keep the name <code>shadow-dojo.json</code>.
                </p>
                {linkedName ? (
                  <p className="text-sm gold-text">Linked ✓ {linkedName}</p>
                ) : (
                  <button className="btn btn-primary" onClick={() => void onLink()}>
                    🔗 Choose where to save
                  </button>
                )}
                {linkError && (
                  <p className="text-sm mt-2" style={{ color: 'var(--ki-2)' }}>
                    {linkError}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm" style={{ color: 'var(--ink-faint)' }}>
                This browser can't link files (Chrome and Edge can). You can still play: use{' '}
                <strong>Export</strong> in the top bar to save <code>shadow-dojo.json</code> into{' '}
                <code>my/</code> for your sensei, and <strong>Import</strong> to load its changes.
              </p>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="display text-3xl mb-2">
              Wake your <span className="ki-text">sensei</span>.
            </h1>
            <p className="mb-4" style={{ color: 'var(--ink-dim)' }}>
              Your coach is an AI agent working in this folder. It sets up your campaign, plans your
              training, and runs the job-search skills with you.
            </p>
            <ol className="text-sm grid gap-2 mb-4" style={{ color: 'var(--ink-dim)', paddingLeft: '1.2rem', listStyle: 'decimal' }}>
              <li>Open this project's folder in Claude Code, Codex, or Cursor.</li>
              <li>
                Type <code>/initiate</code> in Claude Code, or paste the prompt below in other agents.
                Your sensei will walk you through setup and interview you.
              </li>
              <li>
                When it's done, click <strong>Sync sensei</strong> in the top bar to pull in your
                campaign and your first day's plan.
              </li>
            </ol>
            <button className="btn btn-ghost btn-sm" onClick={() => void copyInitiate()}>
              {copied ? 'Copied ✓' : '📋 Copy the first prompt'}
            </button>
            <p className="text-xs mt-3" style={{ color: 'var(--ink-faint)' }}>
              Until then, the dojo gives you a starter set of reps.
            </p>
          </>
        )}

        <div className="flex items-center gap-2 mt-6">
          {step === 2 && (
            <button className="btn btn-ghost" onClick={() => setStep(1)}>
              Back
            </button>
          )}
          <div className="flex-1" />
          {step === 0 && (
            <button className="btn btn-primary" onClick={() => void leaveNameStep()} disabled={!ninjaName.trim()}>
              Continue
            </button>
          )}
          {step === 1 && (
            <button className={'btn ' + (linkedName || !canLink ? 'btn-primary' : 'btn-ghost')} onClick={() => setStep(2)}>
              {linkedName || !canLink ? 'Continue' : 'Do this later'}
            </button>
          )}
          {step === 2 && (
            <button className="btn btn-primary" onClick={() => void finishOnboarding()}>
              Enter the dojo →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
