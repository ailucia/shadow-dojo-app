# Root cause analysis (including conflicting metrics)

> **Category:** Analytical / Execution · **Type:** "Metric X dropped. Investigate." and "X is up but Y is down" · [All rubrics](README.md)

**In one line:** Usually a 10 to 15 minute follow-up. You're scored on *systematic*
investigation, not on finding the exact cause. Define the metric exactly, lay out the eight-bucket
map, use four triage questions to rule out whole branches, dig into the likeliest bucket (and
back out when the evidence doesn't fit), then decide whether it even needs action and who owns
the fix.

---

## The framework (5 steps)

**1. Define the problem before forming any hypothesis.**
- **Volume, rate, or quality?** Fewer people completing checkout and the same people completing
  at a lower rate are different investigations.
- **Boundaries and denominator:** what's in the metric and what isn't? Example: if an agentic
  feature started auto-creating carts, the denominator rises and the rate "drops" with no change
  in behavior. Skip this check and you can spend the whole interview chasing something that isn't
  real.
- **Conflicting metrics:** open by naming the tension. What relationship did we assume between
  the two metrics, and what does it mean that it broke? (Starts up and completions down means
  lower-intent traffic *or* new friction.) Meta loves this version: an engagement metric up while
  retention is flat or down.

**2. Lay out the full hypothesis map before asking for data:**
- **Internal:**
  - **Product/UX change:** a release, redesign, or experiment changed behavior.
  - **Cohort effect:** users from a new channel or campaign behave differently.
  - **Quality/model regression:** output got worse, including prompt drift and model version
    changes.
  - **Infrastructure/latency:** slower or less reliable, so users quit before getting value.
  - **Measurement artifact:** the metric changed, not the experience (a new usage type averaged
    in, or the definition shifted).
- **External:**
  - **Competitive/market:** a competitor launch, a change at a platform you depend on, or a shift
    across the category.
  - **Seasonality:** calendar or usage cycles.
  - **Macro/out of your control:** policy, regulation, the economy, force majeure.

**3. Triage with four questions.** Each answer rules out several buckets:

| Question | If… | Prioritize |
|---|---|---|
| Any external event at the same time? | Yes | That external bucket (seasonality is fastest to check against history) |
| | No | Internal buckets |
| Sudden or gradual? | Sudden | Product/UX, infrastructure, measurement |
| | Gradual | Cohort, quality/model (maybe seasonality) |
| Broad or concentrated? | Broad | Product/UX, quality, measurement |
| | Concentrated | Infrastructure, cohort (market shift if it's one region or user type) |
| Did we ship or change anything when it started? | Yes | Product/UX, model update, measurement |
| | No | Cohort, quality, external |

Then say it out loud: *"Most likely X, possibly Y. I'll start with X because ___, and run a quick
check on [external bucket] in parallel since it's fast to rule out."*

**4. Investigate inside the bucket.** A yes and a no are *both* informative:
- **Product/UX** (sudden, broad, internal change): 100% rollout (no control, so focus on what
  changed) or a flag (compare the arms)? Concentrated at one funnel step? Immediate or lagged (a
  disrupted habit)? **Power users vs. new users equally affected?** That's the highest-signal
  question: universal friction means roll back; a broken workflow means a targeted fix.
- **Cohort** (gradual, or concentrated in recent users): Did acquisition spike? Did the channel
  mix change? Do new users from *established* channels differ from past cohorts (then onboarding
  changed)? When does the new cohort's retention fall? D1 points at activation and first
  impressions; D7+ points at habit and ongoing value.
- **Quality/model** (gradual, broad, no obvious change): Is satisfaction down alongside engagement
  (if not, look at latency or UX)? Was there a model, prompt, or third-party API change? Are users
  abandoning early, or finishing but rating lower? Is it broad, or specific query types?
- **Infrastructure/latency** (sudden, concentrated by region, device, or time): Did p95/p99 rise
  (the tail hurts even when the average looks fine)? One region or data center? One device or OS
  version? Error-rate spikes? If none, look for silent degradation in a dependency.
- **Measurement artifact** (aggregate down, core segment fine): Did a definition, logging event,
  or attribution window change? Did a new surface, API tier, or agent start creating automated
  sessions? Separate them out. Does the drop disappear when filtered to the original target users?
  Did data volume rise without real users (bots)? *Example:* "lots of usage, but PRs aren't
  reaching production" (asked at Cursor) is a textbook measurement artifact: the headline looks
  healthy while the real signal is buried.
- **Competitive:** a competitor launch, so is the drop concentrated in users most likely to
  switch? A dependency change or outage? A category-wide shift? **Are competitors seeing the same
  thing** (app-store rankings, earnings calls, analyst notes)?
- **Seasonality:** the same dip in prior cycles? Within the normal range (document it, monitor it,
  move on)? A holiday or calendar shift that matches the regions affected?
- **Macro:** policy, regulation, or a platform block? An economic shift? A disaster or outage
  (isolate it, watch for recovery)? Even here, mitigation is still the PM's job: protect retention,
  speed up the contingency roadmap, adjust pricing. Senior candidates pivot naturally into
  strategy.

> **Green flag:** if two or three answers in a row don't fit, say so: "This isn't consistent with
> a product change; I'll re-triage toward infra or cohort." Don't double down.

**5. Resolution path:**
- **Does it need action at all?** A measurement artifact needs a metrics fix, not a product fix. A
  known seasonal pattern gets documented, monitored, and left alone. Saying this shows you don't
  jump to fixes by reflex.
- **If yes, name the tradeoff and the owner.** In your own product: was this an expected side
  effect, and is the upside still worth it? In another team's area: name the escalation path ("I'd
  flag it to the PM who owns that surface"). That's cross-functional awareness, not avoidance.

## Interviewer moves to expect
- **The pivot:** new information mid-investigation ("it's concentrated in Southeast Asia").
  That's not a curveball, it's more data. Go back to triage with the new constraint. Panicking
  means you were performing, not reasoning.
- **The rabbit hole:** they keep saying "yes" to test how deep your domain knowledge goes. Many
  candidates don't notice the exercise has been extended.
- **It isn't over when you name a bucket.** It's over when they signal it is.

## Traps
- Forming hypotheses before defining the metric.
- Anchoring on the first plausible cause.
- Asking for data without a map.
- Doubling down on a bucket that doesn't fit.
- Jumping to a fix for an artifact.
- Forgetting the owner and the escalation path.
- Stopping at the root cause.
