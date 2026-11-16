# A/B testing and rollout questions

> **Category:** Analytical / Execution · **Type:** A/B testing, experiment design, rollout · [All rubrics](README.md)

**In one line:** These questions are never about experiment mechanics alone. They test whether
the experiment leads to a *decision*. State a hypothesis with a reason, design a sound test, pick
primary, tracking, and guardrail metrics, say how each outcome changes the launch call, and name a
blind spot before the interviewer does.

---

## The framework (5 steps)

**1. Hypothesis = prediction + rationale**, grounded in a specific behavior or friction.
- Weak: "This change will increase satisfaction."
- Strong: "…because users abandon when responses feel overwhelming, and this addresses that
  directly."

**2. Design the experiment:**
- **Treatment vs. control:** specific enough that an engineer could build it without asking you
  anything.
- **Population:** the users most likely to be affected, with exclusions, the %, and why.

| Product type | Guidance |
|---|---|
| Global consumer app | 1–5% of eligible users is usually enough |
| Regional / smaller app | May need 20–50%+, so run a power calculation |
| Dating apps | Test regionally first, since engagement varies sharply by geography |
| B2B / enterprise | Randomize by account to avoid contamination within a team |

- **Duration and size:** 2 to 3 weeks is a common start (full weekly cycles, past the novelty
  effect). Size it to detect the smallest lift that matters, often 3 to 5% at 95% confidence:
  "current traffic, baseline rate, minimum detectable effect."

**3. Choose three tiers of metrics:**

| Tier | What it is | Guards against |
|---|---|---|
| **Primary** | The one number that says whether it worked; maps to the hypothesis | Answering a different question than you asked |
| **Tracking** | Leading indicators that it's moving *for the right reason* | Winning for the wrong reason |
| **Guardrail** | Signals something broke even though the primary is up | Local wins that cause problems downstream |

**Ratings make a weak primary:** low participation, negative skew, and they measure perception
rather than outcomes. A **behavioral** metric (did they continue or complete the task?) is almost
always stronger.

**AI features need a second layer**, because engagement data can't tell a user engaging with a
*correct* answer from one engaging with a *wrong* one:
- **Output quality:** hallucination rate, task completion, factual accuracy. Usually needs
  **offline eval** (sampled human review) running alongside the test.
- **Trust:** override rate (users editing or dismissing the output), escalation to a manual path,
  returning to the same query.
- **Latency and cost:** p50/p95 response time, cost per query. AI often trades speed for quality,
  so measure that explicitly.

An A/B test shows behavior, not whether outputs are accurate or safe. **Pair it with offline
eval.**

**4. Define the decision:**

| Primary | Guardrails | Action |
|---|---|---|
| Up | Stable | **Ship.** Name the rollout slice and why you start there. |
| Up | Down | **Don't hedge.** Name the tension, decide which signal matters more *here*, and commit with a specific reversal condition. |
| No effect | — | Separate "wrong hypothesis" from "bad experiment." Did users even *see* or use it? Low engagement can be a discoverability problem, not a value problem. |

Tie the call to the company's broader goal.

**5. Name a blind spot unprompted:**
- **Quality vs. quantity:** more comments ≠ better conversations.
- **Trust and satisfaction:** looks neutral in the data while confidence erodes.
- **Cannibalization:** the bigger button gets clicks, but what did users stop clicking?
- **Novelty:** an early spike that fades.
- **Changes you can't A/B test:** infrastructure or brand decisions too broad for a controlled test.

## Traps
- A hypothesis with no "because."
- A vague treatment.
- Testing everyone.
- Stopping before a full weekly cycle.
- A rating as the primary metric.
- No guardrail.
- Hedging on the up/down case.
- Calling a no-effect test a failed idea without checking exposure.
- Classic engagement metrics only, for an AI feature.
