# /initiate — the first session

Run this when the user is new (`my/sensei-context.md` doesn't exist) or asks to set up again.
It covers everything general. Each mission skill sets up its own specifics the first time it
runs.

Keep it a conversation: **one question at a time**, any question skippable, and short
explanations. If `my/sensei-context.md` already exists, offer to update it instead of starting
over.

## 1 · Welcome and explain the dojo (briefly)

In a few plain lines:
- **Training** is general practice that levels you up: practice questions, mocks, story work.
  Each rep earns XP for one of six skills and fills **ki** (momentum). Titles rise from Novice
  to Master, and the ninja on your campaign strip gains gear as you climb.
- **Missions** are the pursuit of specific companies: finding roles, judging them, tailoring
  your resume, getting referrals.
- **Gates** split your campaign into stretches you pass when you're ready, never by the
  calendar. I'll build them from your strategy in a few minutes.
- **I'm your coach** for AI PM interviews: product design, strategy, metrics and execution,
  vibe coding, behavioral, technical, and take-homes.

## 2 · Setup check, one item at a time

For each: say whether it's on, and if not, how to turn it on. Only the save file is required.

1. **Save file:** is `my/shadow-dojo.json` there? If not, have them click **Link file** in the
   app (Chrome or Edge) and save it into `my/`. In other browsers, use Export into `my/`.
2. **Notion connector:** required for missions. In Claude Code, connectors are under `/mcp` or
   the claude.ai connector settings. Test it with one harmless read.
3. **Google Calendar connector:** so `/kata` plans around their day. On a Mac without it,
   `./scripts/cal.sh` works (it asks for calendar permission once).
4. **Gmail connector:** so `/kata` sees recruiter replies and interview invites. Read-only use;
   nothing is ever sent.
5. **Claude in Chrome:** so `/scout` can read Glassdoor and Blind through their own logged-in
   accounts, and `/referral` can search LinkedIn. Both are read-only.
6. **Tools:** Typst for `/forge` (`brew install typst`); Bun or Node's `npx tsx` for
   `/patrol`; optionally Python `pypdf` for Forge's text check. Check with `which` and give the
   install command if one is missing.

## 3 · Profile interview

Create `my/sensei-context.md` from `templates/sensei-context.md` and fill it as you go.

1. **Target role and level, the kind of company, and why (one line).** Write `dojo.path` and
   `dojo.pathWhy` in the save, plus the Profile section.
2. **Dealbreakers, in their own words:** anything that rules a company out (culture, stage,
   pay, location, workplace type, industry). Goes to the Dealbreakers section.
3. **When the search started.** Write `dojo.campaignStartDate`.
4. **Their resume:** a file path or pasted text. Save a copy as `my/resume/source.<ext>` (or
   `.md` for pasted text). Summarize it in Profile, and note any numbers they confirm under
   Resume facts.
5. **Where things stand:** applications out, interviews scheduled. These become Pipeline rows
   in step 4, and live interviews become Live processes.
6. **Interview types they expect, and their weakest areas.** Goes to Interview focus.
7. **What they avoid, and what derails a day.** Goes to Coaching style.
8. **Hours a day, and how many reps make a full day.** Write `dojo.dailyTarget`.
9. **Coaching style:** offer the presets from SENSEI.md (Patient master, Steady sensei,
   Drill instructor) or their own words.
10. **Permissions:**
    - Calendar access (connector, script, or none).
    - Email reading.
    - **"May I update your Pipeline statuses from email (applied, interviewing, rejected)
      without asking each time?"**

    Record the answers under Permissions.

## 4 · Mission Layer (only if Notion is connected)

Run `prompts/setup-mission-layer.md`, then add each application and interview from question 5
as a Pipeline row (`Type` rep unless they call it a target, the right `Status`, a dated
`Notes` line). If Notion isn't connected yet, record them under Open threads; the first mission
skill adds them.

## 5 · Campaign

Write the campaign into the save, following "Writing gates" in SENSEI.md:
1. Draft the **strategy** in one or two lines from what they told you.
2. Propose the gates (name, focus, phase, 2–3 milestones each), with dates only if they want a
   clock.
3. Agree it with them, adjusting what they push back on.
4. Write `dojo.campaign`, `currentGateId` (the gate that matches where they are) and
   `gateStartedDate`.

## 6 · Skills tour

One or two lines each, and note that each sets itself up the first time it runs:
- **`/kata`** — plan today (reads calendar, inbox, pipeline).
- **`/reflect`** — weekly retro and gate call.
- **`/spar`** — work one answer, as coach or as interviewer.
- **`/scout <company>`** — judge a role; dream companies go on your dream list.
- **`/patrol`** — find postings daily (can run on a schedule in the cloud).
- **`/harvest`** — after you review patrol's picks, tune the filters and board the keepers.
- **`/forge <company>`** — aim your resume at a job.
- **`/referral <company>`** — find someone to ask and draft the note.
- **`/applied <company>`** — log an application.

## 7 · Wrap up

1. Add a `sensei` log entry: "Initiated: <strategy in a few words>."
2. Say what's set up and what isn't.
3. Offer the first `/kata` now.
4. Remind them to click **Sync sensei** in the app.
