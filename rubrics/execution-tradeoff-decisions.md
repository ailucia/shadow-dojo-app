# Making and defending the call (ship decisions, conflicting metrics)

> **Category:** Analytical / Execution · **Type:** "So what do you do?" Ship or hold, conflicting metrics, two good directions · [All rubrics](README.md)

**In one line:** If two experienced PMs with the same data would agree, just make the call. If
they wouldn't, name the tension, compare **the cost of being wrong** in each direction (and how
reversible it is), then commit with a reversal condition that names a metric, a threshold, and a
time window.

---

## First, sort clear cases from real tension
- **Clear:** primary up, guardrails stable, no second-order risk; or the root cause is a
  measurement artifact with a defined fix. **Call it and move on.** Extra hedging reads as
  uncertainty, not rigor.
- **Real tension:** primary up but a guardrail meaningfully down; the data supports two hypotheses
  that call for different actions; two directions both have real merit and real cost.
- **Test:** would two experienced PMs with the same data reach the same conclusion?

## The framework (3 steps)

**1. Name the tension.** Make the strongest case for *both* sides before picking. Otherwise the
decision sounds easier than it is. Notifications: clicks are up, so discovery works; time-on-site
is down, so the clicks may not create value. Two explanations fit: (a) discovery works but the
experience after the click is weak; (b) notifications drive shallow visits that erode long-term
engagement.

**2. Compare the cost of being wrong.** When both sides have credible upside, comparing upside
again won't settle it. The *downside of being wrong, and how reversible it is,* usually does.
- If I pick A and I'm wrong, what does it cost? Same question for B.
- **Stakes depend on the product.** A bad UI change in classic software can be rolled back. An AI
  model taking wrong actions can damage trust or safety in ways that outlast the rollback.
- This doesn't mean defaulting to the safe option. A bigger, harder-to-reverse downside just
  **demands stronger evidence.**
- Notifications: if pushing is wrong, users learn to dismiss notifications, weakening a channel
  other teams rely on, which is hard to reverse. If pausing is wrong, a feature that was getting
  real clicks is delayed, and you can resume. **Pause.**

**3. Commit, with a specific reversal condition.** State the decision, why, and what evidence
reverses it: **a metric, a threshold, and a time window.** "I'll monitor closely" doesn't count.
Example: *resume expanding if, after segmenting, time-on-site for healthy users returns to the
pre-launch baseline for two consecutive weeks. If the decline is broad, stay paused and
investigate the post-click experience.*

## About staged rollouts
They're a common way to sound cautious without actually deciding. They help **only when they
limit exposure or produce the evidence you need to decide.**
- **Helps:** a UI change to 5% of users, comparing conversion and errors before expanding.
- **Doesn't help:** an agent that can take a harmful action. At 5% it still harms real users and
  may never surface a rare failure.

Before you recommend one, say what risk it contains, what you'll measure, and which result expands
or stops it.

## AI-specific considerations
- **Engagement doesn't guarantee quality.** Users engage with wrong or unsafe output too. Pair
  behavioral metrics with quality, accuracy, and safety evals.
- **Set safety stop conditions *before* launch:** "If the high-severity incident rate exceeds X
  in the first cohort, pause regardless of engagement."
- **What the company promises changes the cost of being wrong:**
  - **Anthropic, safety:** harmful behavior breaks the core promise, so risky capabilities need a
    higher confidence bar.
  - **Apple, privacy:** an engagement win is unacceptable if it compromises privacy.
  - **OpenAI, capability and safety:** speed has value, but an unclear risk of high-severity harm
    can justify slowing down or stopping.

## Traps
- Hedging on clear cases.
- Giving only one side's case.
- Re-arguing upside instead of comparing downside and reversibility.
- "Monitor closely" instead of a reversal condition.
- A staged rollout as a non-decision.
- No safety stop condition for AI.
