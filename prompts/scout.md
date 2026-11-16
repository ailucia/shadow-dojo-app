# /scout — judge a role together (and grow the dream list)

Use this when the user brings a company or role, or wants to re-judge one. The call is a
judgment, so make it **together**: 3–6 sharp questions, then a recommendation. Don't
rubber-stamp and don't interrogate.

`/scout <company>` with no role means they want to add the company to their dream list: skip to
§6.

**First use:** if `my/notion.md` doesn't exist, run `prompts/setup-mission-layer.md` first.

## 1 · Read the board

Query **Pipeline** (what's in flight, reps vs targets) and **Targets** (the dream list) using
the links in `my/notion.md`. Read the **Search settings** on the hub page (target roles,
dealbreakers). Sequencing matters: practice-first applications before long shots, and not too
many active targets early in the campaign.

## 2 · Get the facts, live

- **The posting:** what the role owns, years asked, comp, location and **workplace type**
  (on-site, hybrid with N days, or remote; check the careers page or posting header, since the
  JD often omits it). Say "unconfirmed" for anything you can't find.
- **The company:** stage, funding, size, profitability or runway, and layoffs or leadership
  changes in the last 6 months. Use live search, never memory. Confirm any layoff claim in a
  primary source (filings, layoffs.fyi) before it goes in a rationale; a search summary or a
  single forum post isn't enough.
- **Culture, through the user's own logged-in Chrome** (Claude in Chrome), read-only:
  - Glassdoor and Blind reviews from the **last 6 months**, filtered to the product or PM org
    where the site allows, rather than the company average.
  - Always cite how many reviews and the positive-to-negative balance. 1–4 reviews is an
    anecdote; trust a negative only if it repeats.
  - Flag a leadership change or reorg as resetting culture.
  - If Chrome or the sites aren't available, say culture is unread rather than guessing.

## 3 · Dealbreakers (hard screens)

Check the user's dealbreakers from Search settings before anything else. A role that fails one
doesn't go on the board as a target. The only exception: the user can deliberately keep it as a
**practice-only rep**, with a written exit rule in Notes.

## 4 · Three lenses

- **Fit:** what the role demands versus their skills (product sense, AI fluency, metrics,
  storytelling, behavioral, execution). Where are they strong, where are they gappy, and is the
  level right? Does the company let PMs build and prototype, or is it a meeting-running seat?
- **Desire:** would they take the offer tomorrow? Would they chew on this problem unprompted?
  Name the pull, or its absence.
- **Odds:** the hiring bar, competition, referral vs cold, timing. Judge on evidence, in this
  order:
  1. Inbound interest (a recruiter reaching out means their filters are already cleared).
  2. Must-haves read literally.
  3. Referral availability.
  4. The user's own conversion rates as they build up.

  Two habits help:
  - **Let the years asked route the ask.** A role asking more years than they have goes
    through a person (referral, recruiter), not a cold application.
  - **A reposted role is still live,** and a person behind the application matters more,
    since the first pool missed the bar.

  Self-critical adjectives aren't evidence. Low odds argue for sequencing and referrals, never
  for dropping a real target.

**Optional moat check** (ask first; worth it for a private or growth-stage company): name the
compounding loop, if any. The candidates are switching costs, network effects, scale economies
or data effects, judged by what the company invests in (biggest teams, roadmap, hiring mix),
not what it says. No visible loop leans the stability read toward Mixed or Risky. Adapted from
Dan Hockenmaier, "How to tell if a startup has a moat" (Lenny's Newsletter).

## 5 · Agree the call — rep or target

- **Rep:** real stakes, practice-first. A fit without desire, a meeting-running seat, or a
  domain they want out of. Strategy: apply promptly, prep proportionately, and treat every
  round as training data.
- **Target:** a role they'd genuinely want, with clear fit and desire, that clears the
  stability read. Strategy: tailored stories, proper research, a referral hunt, scheduled prep.
- **Tie-breakers:**
  - **Desire without fit** is a long-shot target: sequence it late.
  - **Stability:** set `Stability / Culture` (Strong, Mixed, Risky). A Risky company stays a
    rep however good the fit. If the user's dealbreakers prize stability, early-stage
    companies default to rep unless they're a dead-center fit that clears the stability read.
  - **Early in the campaign,** bias toward reps.
  - Calls aren't permanent; re-run this when the intel changes.

## 6 · Write it

**A Pipeline row** (or update the existing one, matching Company + Role):
- `Company`, `Role`, `Type`, and `Status: to-apply`.
- `JD`, `JD summary`, `Company Brief`, `Comp`, `Location`, `Date JD opened`.
- `Stability / Culture` with its rationale and source.
- `Notes`: the agreed reasoning in one short paragraph.

**Then the dream-list question, asked explicitly:** *"Is <company> a dream-list company,
somewhere you'd genuinely want to work, not just a good role?"* Only on a clear yes:
- Add the company to **Targets** (dedupe by Company):
  - `Actionable` (`open now` if there's a live role, else `watching`).
  - `Careers` URL.
  - `Cooldown`, from reputable sources (`none` if uncapped).
  - `Referral`, if known.
  - A one-line why in `Notes`.
- If the role is a target, set its `Target company` relation.

Nothing goes in the save. Tell the user which database the row is in.
