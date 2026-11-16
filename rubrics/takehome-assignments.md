# Take-home assignments (and the debrief)

> **Category:** Take-Home · **Type:** feature-design and roadmap take-homes, the live debrief, and unsolicited prototypes · [All rubrics](README.md)

**In one line:** AI made a polished deck the minimum, so a take-home is now judged on whether it
takes a **real position that's specific to this company**, holds up as a rigorous plan, matches
the role's level, and **survives the live debrief**, which is where most of the signal is now.
Think before you prompt, research, pressure-test the idea, *then* build, and interrogate every
claim before the panel does.

---

## What they're scoring
- **A real position**, not a tidy survey of options.
- Built for **this company**, not one where the name could be swapped.
- **A rigorous experiment** with business-connected metrics and named tradeoffs.
- **Scope matching the level:** a well-scoped feature for junior roles; cross-team,
  sequencing-aware thinking for senior roles.
- **Defending every claim** in the debrief.

**Senior bar:** a non-obvious read on current priorities, explicit tradeoffs, cross-org
dependencies and stakeholders, and a debrief as strong as the written work. **For a
proof-of-concept deliverable:** answer "what would you change to take this to production?" in a
few bullets *before* they ask.

## The workflow (7 steps)
1. **Think before you prompt.** Read the brief, close the laptop, go for a walk, and record your
   raw reaction: the real problem, what you'd build, why, what's obvious vs. interesting. Paste
   that transcript in as the *first* message. Asking the AI "what should I build?" first gets you
   answers built from its priors, thorough and structured with no point of view, and panels can
   feel it.
2. **Research the company.** The metric it's *actually* optimizing (judged from recent decisions),
   its biggest current growth challenge, what it built, killed, or changed in the last 12 to 18
   months, what the role signals (who you'd work with, what you're hired to fix, what 90-day
   success looks like), and how the team thinks (experimentation, speed, quality, the tradeoffs it
   favors). End with your *single most important observation.*
3. **Develop the idea.** Combine your instincts with the research into a **named feature or bet
   with a hypothesis** (what it does, for whom, why it moves the key metric), plus the business
   outcome it serves and an ambitious or contrarian version. Then decide whether that version is
   worth the risk.
4. **Pressure-test it** over several rounds, as a skeptical senior PM would: the weakest
   assumption; *why hasn't the company built this already?* (what do you see that insiders
   don't?); who internally would push back (eng, growth, safety, legal, leadership); the *quiet
   failure* (it ships, nobody adopts it, it's quietly deprioritized in six months); and a simpler
   version that captures most of the upside.
5. **Outline.**
   - *Feature:* business outcome → primary KPI → behavior-grounded user problem → the opportunity
     or unlock → core feature → engagement mechanics → notification strategy (triggers, copy,
     cadence, channel) → experiment design (hypothesis, test/control, rollout, what to watch in the
     first two weeks) → metrics (KPI, adoption/engagement, guardrails) → success at 30/60/90 days.
     A sketch for a language-learning app's retention: user growth → current-user retention → motivation
     decay and solo isolation → social competition → matchups, leaderboards, groups, notifications
     → a regional A/B test.
   - *Roadmap:* company analysis → prioritization rationale → quick win (under a week) → medium bet
     (about 4 weeks) → strategic bet (18 to 24 weeks) → dependencies and sequencing → metrics per
     bet → what you'd *stop* to make room.
6. **Build from *your* filled-in outline.** Keep your exact language, have the AI flag every
   assumption it made, keep the tone direct, and use a deck or spec format. **Read the whole draft
   aloud and rewrite any section that sounds like AI in your own voice.**
7. **Interrogate it before they do.** Go section by section: the hardest follow-up, thin
   evidence, anything generic, anything that fails one level deeper. Then list the five most
   likely debrief questions, what a strong answer to each looks like, and whether the doc sets
   you up for it.

## The debrief
Expect: *why this metric? What if the experiment failed? Who internally would disagree, and how
would you handle them? What did you deliberately leave out, and why? What would you change if you
had to ship tomorrow?* Candidates who stumble usually let AI build sections they didn't fully own.

## Going further: the unsolicited prototype
Product folks call it **"the new dogfooding."** Even if you never send it, you learn the product
and make real tradeoffs.
- **One thing:** a working prototype you'd actually ship, not a strategy doc or a deck. A
  three-screen clickable flow that solves one problem beats a ten-slide strategy deck. Match the
  company's style (scrappy, design-obsessed, or metric-front). Perplexity runs **app-critique
  rounds** (here's the app, talk), where time already spent in the product is a big advantage.
- **Five steps:**
  1. **Target the signal, not the output:** what does the company care about most, and what do you
     want them to think of you? A monetization role means showing incentives and retention. An AI
     company means showing model behavior, not just UI.
  2. **Scope it to 1 to 3 hours.** One problem; say what you left out. Tight scope is itself a
     judgment signal.
  3. **Build with AI,** but edit so it doesn't look generated. At AI companies, show the
     latency, retrieval, and context tradeoffs.
  4. **Write a one-paragraph framing note:** the problem and why, what you built, what you left
     out and the tradeoffs, and **what you'd validate or change with more information** (that last
     part is what separates good from great).
  5. **Mention it naturally** when it's relevant, and offer to share.
- Best when it responds to *something they said* in an earlier round. If you can't describe it in
  one sentence, cut it down.

## Rubric (5 dimensions, Strong No Hire → Strong Hire)
**Debrief readiness is the hardest to fake.** Anthropic, Stripe, and Notion have shifted weight
toward it.
1. **Point of view:** commit to one direction with an explicit hypothesis and defend it. *Settling
   on the safe middle isn't a stance; it's skipping one.* Strong Hire: a
   non-obvious read on this company's priorities, naming what it knowingly deprioritizes.
2. **Company specificity:** a property of *every* decision, not a section you add. A product name
   dropped in as decoration doesn't count. Strong Hire: every major decision traces back to
   something specific about this company right now.
3. **Rigor:** a falsifiable hypothesis, test/control, staged rollout, a primary metric with a
   success threshold, and **guardrails that would stop you** (the most-skipped element). The KPI
   ties to a business outcome, and tradeoffs are named. Strong Hire: anticipates the *quiet
   failure* and the signals that would catch it.
4. **Level signal:** senior means multi-team: who else is affected, cross-org dependencies, longer
   sequencing, internal pushback named, and how early choices open up or close off later ones.
   Polish on the feature without naming what it makes harder elsewhere means the altitude is
   missing.
5. **Debrief readiness:** Strong No Hire restates the doc instead of explaining *why*. No Hire
   breaks one level deeper. Strong Hire anticipates the hardest questions, raises tradeoffs before
   being asked, and has a crisp answer to "what would you change if you shipped tomorrow?"

## Traps
- Asking AI what to build first.
- Surveying options.
- Company name used as decoration.
- No guardrails.
- No success threshold.
- Overbuilding past the time box without a narrative.
- Sections you can't defend live.
