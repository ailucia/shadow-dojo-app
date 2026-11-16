import type { GatePhase, TechniqueKey, TrainingKind } from '../../types'

export type TemplateSlot = 'warmup' | 'core' | 'closeout'

export interface TrainingTemplate {
  id: string
  title: string
  detail: string
  kind: TrainingKind
  techniqueKey: TechniqueKey | null
  xp: number
  focusReward: number
  phases: GatePhase[] // campaign phases this fits; empty = any phase
  slot: TemplateSlot
}

// The library the daily-regimen generator draws from when the sensei hasn't
// planned the day. Every rep is defined by its goal, never a timer. Warmups are
// tiny on purpose — starting is the only hard part; closeouts land the day and
// tee up tomorrow.
//
// XP prices EXPOSURE, not effort or time — what it costs to start, not how
// long it takes. Live/spoken/on-the-spot work and emotionally charged material
// pay the most (18–24); active crafting with mild discomfort pays 10–14;
// comfortable work (passive learning, research, analytical drills) pays 6–8;
// admin (replies, follow-ups, log lines) pays 4–6. A day of easy tasks should
// look cheap on the scoreboard. Focus rewards follow the same direction but
// flatter — showing up always restores some ki.
//
// Question sources: point reps at whatever you actually use — a question bank,
// a peer-mock community, a prep course — so they start concrete.
export const TRAINING_TEMPLATES: TrainingTemplate[] = [
  /* ---- warmups: the first strike. Tiny. Breaks the inertia. ---- */
  // Sleep is training too — this self-check always leads the day (see regimen.ts).
  { id: 'warmup-bedtime', title: 'In bed on time last night', slot: 'warmup',
    detail: 'Did you get to bed on time last night? A rested rep beats a wired one. Log an honest yes or no.',
    kind: 'reflect', techniqueKey: null, xp: 20, focusReward: 13, phases: [] },
  { id: 'warmup-win', title: 'Open the dojo', slot: 'warmup',
    detail: 'Write one line: what would make today a win?',
    kind: 'reflect', techniqueKey: null, xp: 5, focusReward: 7, phases: [] },
  { id: 'drill-pitch', title: 'Practice your elevator pitch', slot: 'warmup',
    detail: 'Say out loud who you are and why you fit the role you’re after. Record it once. Cut the filler.',
    kind: 'drill', techniqueKey: 'storytelling', xp: 14, focusReward: 11, phases: ['prep', 'apply'] },

  /* ---- core reps: the day's real work. The goal defines the rep. ---- */
  { id: 'drill-ps', title: 'Drill product sense', slot: 'core',
    detail: 'Pull one product-design question from your question bank. Sketch the answer with the framework you use — paper is fine.',
    kind: 'drill', techniqueKey: 'productSense', xp: 10, focusReward: 9, phases: ['prep', 'apply'] },
  { id: 'drill-strategy', title: 'Drill product strategy', slot: 'core',
    detail: 'Pick one strategy question (growth, pricing, go-to-market, or “should we build this?”). Commit to a recommendation and the one risk that would change it.',
    kind: 'drill', techniqueKey: 'productSense', xp: 10, focusReward: 9, phases: ['prep', 'apply', 'interview'] },
  { id: 'drill-vibe', title: 'Vibe-code a small prototype', slot: 'core',
    detail: 'Take one product question and build a clickable prototype of your answer with an AI coding tool. Done means you could demo it in two minutes and say what you’d test next.',
    kind: 'drill', techniqueKey: 'productSense', xp: 12, focusReward: 10, phases: ['prep', 'apply', 'interview'] },
  { id: 'drill-ai', title: 'Sharpen AI fluency', slot: 'core',
    detail: 'Read one thing about LLM evals, latency, or RAG — or work one AI question from your question bank. Write 3 sentences you could confidently say in an interview.',
    kind: 'drill', techniqueKey: 'aiFluency', xp: 7, focusReward: 7, phases: ['prep', 'apply', 'interview'] },
  { id: 'drill-metrics', title: 'Metrics rep — pick a North Star', slot: 'core',
    detail: 'Choose any app. Define its North Star metric plus 2 guardrail metrics. Defend the choice in a few lines.',
    kind: 'drill', techniqueKey: 'metrics', xp: 8, focusReward: 8, phases: ['prep', 'apply', 'interview'] },
  /* Behavioral reps ARE the typical questions. The rep names the question and
   * you pick the story live, so it stays concrete without turning into a script.
   * "Out loud" ones (spar) are the charged reps and pay the most. */
  { id: 'bq-tmay', title: '“Tell me about yourself.”', slot: 'core',
    detail: 'The most-asked question on every recruiter call. Deliver your about-me out loud (record it): who you are → the through-line of your career → why you’re here. ~60–90 seconds.',
    kind: 'spar', techniqueKey: 'storytelling', xp: 18, focusReward: 12, phases: ['prep', 'apply'] },
  { id: 'bq-influence', title: '“A time you influenced without authority.”', slot: 'core',
    detail: 'Answer out loud, STAR. Pick your story when you start, not before. Record it.',
    kind: 'spar', techniqueKey: 'behavioral', xp: 20, focusReward: 13, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-conflict', title: '“A disagreement with a stakeholder.”', slot: 'core',
    detail: 'Write the STAR. Pick a real disagreement where something changed because of how you handled it. Tighten until short.',
    kind: 'drill', techniqueKey: 'behavioral', xp: 18, focusReward: 12, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-failure', title: '“A time you failed / something didn’t work out.”', slot: 'core',
    detail: 'Charged one — answer out loud, STAR. Grade your inputs, not the terminal outcome. End on the lesson, not self-blame.',
    kind: 'spar', techniqueKey: 'behavioral', xp: 20, focusReward: 13, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-ambiguity', title: '“A time the problem/goal wasn’t clearly defined.”', slot: 'core',
    detail: 'Answer out loud, STAR. Show how you defined the problem, and what “good” meant, before anyone built anything.',
    kind: 'spar', techniqueKey: 'behavioral', xp: 20, focusReward: 13, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-data', title: '“A time you used data to make/win a decision.”', slot: 'core',
    detail: 'Write the STAR. Show the number you sized up front and how it won the decision.',
    kind: 'drill', techniqueKey: 'behavioral', xp: 18, focusReward: 12, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-unwelcome', title: '“A time you told people what they didn’t want to hear.”', slot: 'core',
    detail: 'Answer out loud, STAR. Say what you found, who didn’t want to hear it, and what changed.',
    kind: 'spar', techniqueKey: 'behavioral', xp: 20, focusReward: 13, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-tradeoff', title: '“A hard product tradeoff you made.”', slot: 'core',
    detail: 'Write the STAR. Name what you gave up on purpose, and why.',
    kind: 'drill', techniqueKey: 'behavioral', xp: 18, focusReward: 12, phases: ['prep', 'apply', 'interview'] },
  { id: 'bq-endtoend', title: '“Something you built end-to-end.”', slot: 'core',
    detail: 'Answer out loud, STAR. Pick something you took from problem to shipped, and say what you personally did.',
    kind: 'spar', techniqueKey: 'behavioral', xp: 20, focusReward: 13, phases: ['prep', 'apply', 'interview'] },
  { id: 'drill-star', title: 'Forge a STAR story for a new question', slot: 'core',
    detail: 'Catch-all for questions not yet on the board: pull one from your question bank that you haven’t drilled, and write the STAR. Tighten until it lands short.',
    kind: 'drill', techniqueKey: 'behavioral', xp: 18, focusReward: 12, phases: ['prep', 'apply', 'interview'] },
  { id: 'spar-mock', title: 'Spar once (a mock)', slot: 'core',
    detail: 'One question from your question bank, answered out loud — recorded solo or with your sensei. A single question counts.',
    kind: 'spar', techniqueKey: null, xp: 20, focusReward: 13, phases: [] },
  { id: 'deep-mock', title: 'Run a full mock with your sensei', slot: 'core',
    detail: 'One complete question with your sensei (/spar), pulled from your question bank. Answer, honest feedback, then retry it once better.',
    kind: 'spar', techniqueKey: null, xp: 24, focusReward: 14, phases: [] },
  { id: 'mock-book', title: 'Book a peer mock', slot: 'core',
    detail: 'Post or reply in your peer-mock community to schedule one mock this week. Booking is admin — the rep comes later.',
    kind: 'outreach', techniqueKey: null, xp: 6, focusReward: 7, phases: ['prep', 'apply', 'interview'] },
  { id: 'mock-peer', title: 'Run a peer mock', slot: 'core',
    detail: 'One live mock with a partner from your peer-mock community. A stranger across the table is the realest rep there is.',
    kind: 'spar', techniqueKey: null, xp: 24, focusReward: 14, phases: [] },
  { id: 'scout-exp', title: 'Read one interview experience', slot: 'core',
    detail: 'One published interview experience from a company on your radar. Note one question they actually asked.',
    kind: 'scout', techniqueKey: 'aiFluency', xp: 7, focusReward: 7, phases: [] },
  { id: 'scout-new', title: 'Scout one new mission', slot: 'core',
    detail: 'Find one role worth pursuing, then bring it to your sensei with /scout — make the rep-or-target call together, and it lands in your pipeline.',
    kind: 'scout', techniqueKey: null, xp: 8, focusReward: 8, phases: ['prep', 'apply', 'interview'] },
  { id: 'scout-intel', title: 'Gather intel on a pipeline role', slot: 'core',
    detail: 'Pick a role from your pipeline. Add 3 notes: the product, why you fit, and one smart question to ask.',
    kind: 'scout', techniqueKey: null, xp: 7, focusReward: 7, phases: ['apply', 'interview', 'close'] },
  { id: 'apply-rep', title: 'Fire off one application', slot: 'core',
    detail: 'Pick a rep from your pipeline and send the application. Done beats perfect — reps are the goal.',
    kind: 'outreach', techniqueKey: null, xp: 8, focusReward: 8, phases: ['apply', 'interview'] },
  { id: 'outreach-1', title: 'Send one piece of outreach', slot: 'core',
    detail: 'One message: a recruiter, a referral, a reconnect. Small is fine — one is the goal.',
    kind: 'outreach', techniqueKey: null, xp: 6, focusReward: 7, phases: ['apply', 'interview', 'close'] },
  { id: 'debrief-round', title: 'Debrief a round with your sensei', slot: 'core',
    detail: 'Take one real round to your sensei: what landed, what wobbled, one thing to retrain.',
    kind: 'reflect', techniqueKey: null, xp: 16, focusReward: 12, phases: ['apply', 'interview', 'close'] },
  { id: 'sharpen-materials', title: 'Sharpen one material', slot: 'core',
    detail: 'Tighten one artifact — a resume bullet, your pitch, a portfolio line. Make it land harder.',
    kind: 'drill', techniqueKey: 'storytelling', xp: 12, focusReward: 10, phases: ['prep', 'apply'] },
  { id: 'follow-up', title: 'Send one follow-up', slot: 'core',
    detail: 'Nudge one warm thread: a thank-you, a check-in, a next-step ask. Pipelines convert on follow-through.',
    kind: 'outreach', techniqueKey: null, xp: 5, focusReward: 6, phases: ['interview', 'close'] },

  /* ---- closeouts: land the day, tee up tomorrow. ---- */
  { id: 'reflect-log', title: 'Add a line to your training log', slot: 'closeout',
    detail: 'One sentence: what you did today, or how the search feels right now. That is the whole task.',
    kind: 'reflect', techniqueKey: null, xp: 5, focusReward: 7, phases: [] },
  { id: 'close-tomorrow', title: "Set tomorrow's first strike", slot: 'closeout',
    detail: "Write down the single rep you'll open with tomorrow. Future-you starts faster.",
    kind: 'reflect', techniqueKey: null, xp: 5, focusReward: 7, phases: [] },
]
