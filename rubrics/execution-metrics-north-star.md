# Goal setting, north star, and success metrics

> **Category:** Analytical / Execution · **Type:** "Define success / the north star for X." Also how the execution round runs, and the rubric for every execution type. · [All rubrics](README.md)

**In one line:** The single most common PM question right now. Pin the scope, read the product's
lifecycle stage, state what success means for each side, then choose **one specific metric** that
captures customer value, business value, and something the team can move. Name what it misses,
pair it with a guardrail, and defend it when pushed instead of dropping it.

---

## How the execution round runs
- **Shape:** about 20 to 25 minutes on an anchor question ("define success for X"), then 5 to 10
  minutes of a follow-up that puts pressure on the metrics you just chose. It almost always ends
  with one of these:
  - **Root cause:** your north star dropped. → [execution-root-cause.md](execution-root-cause.md)
  - **Conflicting metrics:** one up, one down. →
    [execution-tradeoff-decisions.md](execution-tradeoff-decisions.md)
  - **Ship decision:** north star up, guardrail down. "The LLM fails occasionally. What do you
    launch?" → [execution-tradeoff-decisions.md](execution-tradeoff-decisions.md)
- **What changed:** agentic AI adds metric noise (bots, assistants, and automated workflows inflate
  engagement), and AI products need **quality, trust, and helpfulness** metrics that clicks and
  time-on-page can't capture. OpenAI, Apple, and Perplexity test whether you know the difference.
- **Senior bar:** your hypotheses include AI-specific failure modes; the metric is defended
  against real alternatives and paired with a guardrail; the plan is fully specified (who gets it
  first, the rollout sequence, the *exact* reversal trigger); and your questions show real
  curiosity.

## The framework (4 steps)

**1. Scope.** "My understanding is [product] is [description]. Should I include [parent company,
feature, segment]?" For Airbnb: the core rentals marketplace, or Experiences too?

**2. Product context:** mission (a fair summary is enough), the product's role, and its
**lifecycle stage**. Say the stage out loud, because it narrows the metric type:

| Stage | What matters | Metric focus |
|---|---|---|
| New | Prove people want it | Adoption + early retention |
| Growth | Scale usage | Acquisition + engagement |
| Mature | Keep users, deepen value | Retention + monetization |
| Declining | Manage attrition, decide what's next | Churn + usage decline |

**3. Each group's goals** (two or three sentences each): creators or suppliers if there are any,
consumers, and the company. Single-sided products just need the customer and the company.

**4. Choose the primary metric.** Brainstorm a few, talk through the tradeoffs, and pick one with
three properties:
- **Customer value:** the relevant groups achieve something meaningful.
- **Business value:** it maps to the mission and the model.
- **Team influence:** the team can move it in a reasonable time, and it's scoped tightly enough
  for that impact to show.

**Be specific.** "Engagement" is a category; "nights booked per month per active host" is a
metric. Define how it's calculated.

## North star vs. success metric
A **success metric** measures whether a particular feature or initiative hit its goal, and a
product can have many. The **north star** is the *one* success metric that best shows the overall
product delivering its core value over time.

**The "so what?" test:** if it rose 10%, would that *unambiguously* mean the product is working?
If you need caveats, it's the wrong north star. A DAU spike could be a campaign, a viral moment,
or a competitor's outage. Orders completed per active user rising means users are getting more
value. This test also screens out vanity metrics.

**Top-line categories** (prefer these to AARRR). Turn each into action + population +
time window:
- **Engagement:** users who do X in interval Y; sessions per day; time spent; views.
- **Growth:** DAU/WAU/MAU, defined by a *meaningful action*, not a login.
- **Adoption:** new users who complete X within their first Y days.
- **Retention:** D7; DAU/MAU (stickiness).
- **Monetization:** revenue, subscribers per interval, ARPU.

**Patterns by company type.** Walk in knowing the obvious choice *and* its documented failure
mode, and name the failure mode yourself:

| Type | Common north star | Tradeoff to name | Counter / stronger |
|---|---|---|---|
| Media | Time spent / month | Time ≠ value; addiction loops; passive vs. active; power vs. casual gap | Actions during that time (videos completed); time per cohort; saves / library depth |
| Marketplace | Completed transactions / month | Ignores quality; skewed by power users; supply-constrained markets | Repeat booking rate; supplier utilization; time to match; completion rate; satisfaction per cohort |
| Productivity / SaaS | Weekly active teams with 5+ contributors | Checking in vs. real value; team metric hides individuals | Actions per user; retained teams at D7/D30; time to first meaningful collaboration |
| E-commerce | Purchases / month | Breadth vs. depth; misses supply; no search-to-purchase view | AOV; new purchasers per month; D60 repurchase; cart drop-off; % of searches without a purchase |
| EdTech | Weekly active learners completing a lesson | Completion ≠ comprehension | Assessment score; improvement rate; mid-lesson drop-off |
| Health / wellness | Users hitting 90% of weekly goals | Goal difficulty varies; new vs. retained; improvement vs. maintenance | Goals by difficulty (P25/P50/P75); completion by cohort; outcome score |
| Search | Daily successful searches | "Successful" is hard to define; power-user skew; post-search is invisible | Follow-through actions; searches per user by cohort; sentiment; response time |
| Creator economy | Posts with engagement in the last 7 days | Fuzzy and gameable; ignores non-posters; misses monetization | Revenue-generating posts; returning engagers; median engagement per post |

## Defending your choice (don't fold)
When pushed: **restate the goal or assumption → what the metric captures → what it misses → the
counter-metric for that gap → what new evidence would make you reconsider.** Naming a weakness is
fine, since every north star is a simplification. Example of new evidence: Spotify saves rising
among new users but falling past six months means discovery is improving while long-term value
is weakening. Revisit or segment.

## Rubric: all execution questions (5 dimensions, Strong No Hire → Strong Hire)
One weak score can sink an otherwise strong round.
1. **Investigation skills:** scope before hypothesizing; a full hypothesis space (internal,
   external, AI-specific); every question visibly changes where you go next; re-triage out loud
   when the data doesn't fit. Strong No Hire: fixes before diagnosis, random questions, first
   plausible explanation treated as the answer.
2. **Metric judgment:** principled criteria applied to several candidates; you name where your
   pick misleads, add a guardrail, and treat the north star as a monitored, revisable decision. For
   AI, a click on a suggestion isn't success, and time spent can mean confusion.
3. **Execution:** "phased rollout and monitor quality" is not a plan. A plan says who gets it
   first and why, what %, the timeline and sequence, which guardrails at what *pre-committed*
   thresholds, the exact pause trigger, and what happens next. Concrete enough to act on tomorrow.
4. **Communication & collaboration:** reasoning you can follow at every transition (diagnosis →
   recommendation), assumptions flagged, check-ins before going deep, and the interviewer's input
   used to sharpen the answer.
5. **Curiosity & passion:** the *quality* of your questions ("what's the denominator?" before any
   hypothesis; "has this shown up in a segment before?"). Strong Hire: you uncover something the
   interviewer hadn't framed.

## Traps
- "Engagement" as a north star.
- DAU with no meaningful-action definition.
- Ignoring lifecycle stage.
- One-sided metrics for a two-sided product.
- Folding at the first pushback.
- No guardrail.
- Classic engagement metrics for an AI product.
