# /reflect — the weekly retro and gate call

Run this once a week, when the user asks, or whenever the plan and reality have drifted. Gates
pass on readiness, never on the calendar. Follow their coaching style from
`my/sensei-context.md`: it sets how hard the pressure in §3 lands.

## 1 · Read the evidence (inputs only)

- **The save:**
  - The current gate (`currentGateId`) and when it started (`gateStartedDate`).
  - The week's log.
  - Training landed vs planned.
  - `milestonesDone`: the user's own checkmarks. Treat them as primary evidence, but confirm
    honestly rather than rubber-stamping.
- **The Pipeline:** applications sent, rounds held, anything at `interviewing` that changes
  timing. Move rows at `applied` that have been silent 30+ days to `ghosted`, with a dated Notes
  line.
- **Callbacks and offers are weather.** They never gate a pass by themselves, but a serious
  loop arriving early can pull the campaign forward.

## 2 · The retro — three questions, asked together

1. **What worked this week?** Name specifics: the rep that landed, the habit that held.
2. **What didn't?** Reps skipped, rounds that wobbled, what kept getting pushed.
3. **What changes next week?** One to three concrete changes, such as a smaller daily target,
   a different first strike, more spoken reps, or a new referral push. Write them into next
   week's plan via `/kata`, and note them under Open threads.

Lead with the user's own read on each question, then add what the evidence shows.

## 3 · Why is a milestone unmet? Diagnose before deciding

- **Strategic gap:** the work happened but showed they're not ready (mocks run but flat,
  stories forged but thin). Staying is the design working; re-aim sharply.
- **Effort gap:** the inputs didn't happen. The week was available and went unused. Name it as
  a debt, not a plan. Count the stays: a second review on the same gap with no new inputs is an
  effort gap, whatever the explanation.

When it's effort, press, scaled to their coaching style:
- **Patient master:** name it once, gently, and cut next week's target to the smallest version.
- **Steady sensei:** name the specific debt and its cost, and set a small, non-optional target
  you'll check. On a second miss, ask what's actually in the way, and have them name the
  blocker.
- **Drill instructor:** name it plainly the first time. On a repeat, refuse the comfortable
  framing and set today's single unmissable rep.

**Third time on the same gap:** stop the curriculum and talk about the avoidance itself (fear,
burnout, wrong target). Always pair pressure with one concrete next action they control.

## 4 · The gate call — pass, stay, or re-plan

- **Pass** (milestones substantially met):
  - Set `currentGateId` to the next gate and `gateStartedDate` to today.
  - Add a `milestone` log entry.
- **Stay** (not ready yet): keep the gate, re-aim training at the specific gap, and log it as
  deliberate. This only holds when the gap is strategic (§3).
- **Re-plan** (the search taught you something):
  - Add, merge, reorder or rewrite gates (SENSEI.md, "Writing gates").
  - A serious loop arriving early can jump straight to an interview-phase gate.
  - Update `dojo.campaign` and keep `currentGateId` and `milestonesDone` consistent.

"Substantially met" is the bar, not perfect. When honestly unsure, stay once with a sharper aim
rather than passing soft.

## 5 · Write it

Update the save, then remind them to click **Sync sensei**. If the gate changed, the app
re-aims the day's auto reps at the new gate's phase.
