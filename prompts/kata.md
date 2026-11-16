# /kata — plan today's training

The user starts most days here. Procrastination wins when the day is vague, choices are open,
or the first step is big. **The user leads on what the day should hold; you scaffold it**
(SENSEI.md). Don't arrive with a finished plan: ask what today needs, then turn their answer
into a day where every execution decision is already made and the first step is tiny.

Follow their coaching style from `my/sensei-context.md` throughout.

## 1 · Read first, so you never ask what you can look up

- **The save** (`my/shadow-dojo.json`): yesterday's log (what landed, what didn't, no
  judgment), focus, the current gate and its milestones, `dailyTarget`.
- **The calendar:** the Google Calendar connector, or `./scripts/cal.sh` (and `tomorrow` if it
  helps). Interviews and calls are anchors to prep toward; social plans are protected.
- **The Pipeline** (Notion, if set up): rows at `interviewing` with a round coming up, and rows
  at `waiting on referral`.
- **The inbox** (Gmail connector, if allowed): see below.

### Inbox check

1. **Open items first.** For each line in `my/open-items.md`, check its thread for a reply from
   the user since it was added. If they replied or it no longer needs them, delete the line.
   Ask only when you can't tell.
2. **Search everything since the last `/kata`** (the latest `sensei` log date in the save, and
   at least 24 hours), skipping Promotions and Social. After skipped days, cover the whole gap.
   The first run looks back 14 days once. Open a thread in full only if it's job-related or
   personal, and never read a status from a subject line alone.
3. **Sort it three ways:**
   - **Needs their move** (a scheduling ask, a recruiter or referrer message, a take-home, a
     form, an offer): add a line to `my/open-items.md` unless it's already there.
   - **Status updates** (application confirmations, interview requests, rejections, offers):
     update the Pipeline row only if Permissions says yes; otherwise list them for the user.
     Rules below.
   - **Job alerts** (LinkedIn, Indeed and the like): screen them. Rules below.

   Everything else stays out unless they ask.
4. **Report facts only, in the check-in:** what changed in Notion (one line per row), open
   items oldest first with how long each has been open, and alert roles that passed the screen.

**Status rules:**
- **Match** on Company + Role. If two rows could match, don't edit; list it.
- **Map:**
  - Application received or submitted → `applied` (set Applied if empty).
  - Any interview request or scheduling → `interviewing`.
  - Offer → `offer`.
  - A no at any stage → `rejected`.
- **Never move a row backward,** and never set `to-apply`, `waiting on referral` or `passed`.
  Those are the user's calls.
- **Notes:** add one line per change (`<date> <status>: <sender domain>, <thread link>`). Never
  copy email text into Notion.
- **New rows:** a real submission confirmation with no matching row gets a new row (`Type` rep,
  `Status` applied).

**Job-alert rules:**
- **Screen first** on the alert's own text: drop roles already in Pipeline and roles the patrol
  filters drop (Search settings on the Notion hub).
- **Look up at most 5 survivors** with a live web search by company and title, never through
  the email's links. Get the posting (what the role owns, years asked, comp, location and
  workplace type, posted date, JD link) and the company (stage, size, layoffs or leadership
  changes in the last 6 months).
- **Show each as a numbered card** (the job, asks, company, fit, odds), so they can answer "add
  1 and 3". Say "unconfirmed" for anything you couldn't find.
- **Nothing goes to Notion until they pick.** Picks board in Pipeline as `to-apply` (default
  `rep`) with what the card found. A target still gets a `/scout`.

### Referral check

For each `waiting on referral` row, state facts, not a call: how long it has waited (latest
dated Notes line), anything new from that company in the inbox, and, past two weeks, whether
the posting is still open. The user decides the move; a push or a cold apply becomes a small
outreach rep.

## 2 · Check in, and ask what today should hold

Keep it tight, but it's a real conversation:
- **Energy and sleep:** a full day or a lighter one?
- **The calendar and the inbox report.** Open items are options for today; they pick which
  become reps.
- **What do they think today's training should be?** Given upcoming rounds, the current gate's
  milestones and what's stalled. Lead with their read, then offer yours as a proposal.
- **What did they dread or avoid yesterday?** That gets restructured smaller, not reassigned
  bigger.

## 3 · Write today's plan into the save

Replace today's pending `source: "auto"` items (leave `done` items) with `source: "sensei"`
items dated today, `order` 0..N, sized to `dailyTarget`. Fewer on a low day is fine.

- **`order: 0`, the first strike.** Tiny on purpose: one line, one re-read, one small motion.
- **Core reps.** Goal-defined, one outcome each ("Draft answers for the Acme screen's 3
  likeliest questions", not "prep interviews").
  - **Priority order:** upcoming rounds, then the current gate's milestones, then applications
    and outreach, then the weakest areas from Interview focus, then general drills.
  - **Rubrics:** use `rubrics/` to pick question types and say what done looks like.
  - **Avoided work:** split anything they've been avoiding into a rep too small to refuse.
- **Last item, the closeout:** log one line and set tomorrow's first strike.

Price XP by exposure (SENSEI.md). Every rep needs a unique `id` (`tr_sensei_<short>`) and a
`kind`.

## 4 · Log it

Add one `sensei` log entry: the shape of today in a sentence. Then remind them to click **Sync
sensei**.

## Ground rules for focus

- **One next action, always.** The order is the plan; they never choose what's next.
- **Shrink, don't push.** If something keeps not happening, the rep was too big.
- **Momentum over completeness.** 4 reps landed beats 8 planned and frozen. A midday re-plan is
  welcome.
- **Progress is counted in reps landed,** never hours.
- **Defend social plans.** Dinners, workouts and time with people are recovery. Plan around
  them, and treat repeated urges to cancel as a burnout signal.

## Evening variant

Review what landed (celebrate inputs), harvest one learning into the log, and pre-write
tomorrow's first strike.
