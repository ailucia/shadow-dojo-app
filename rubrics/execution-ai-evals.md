# AI evals: "How do you know your AI product is working?"

> **Category:** Analytical / Execution · **Type:** designing an evaluation system for an AI product · [All rubrics](README.md)

**In one line:** Start from the *most costly failure*, because it shapes everything else. Choose
one or two eval approaches that can catch that failure, build them into a three-stage system
(offline → release gate → online monitoring), and name the speed, cost, and signal-quality
tradeoff you're making and why it fits that failure.

---

## The framework (4 steps)

**1. Define success and failure:** what's the cost of a wrong output? It differs by product. A
healthcare summary that misses a diagnosis, an ad-ranking model that leaks revenue, a resume
screener that filters out a qualified candidate (a fairness and legal risk). Write down the task,
who it affects, what success looks like, and **the most costly failure.** That failure decides
which metrics you prioritize. For the screener, that means false negatives and per-group
performance, not overall accuracy.

**2. Choose approaches that can catch that failure:**

| Approach | What it is | Speed / cost / signal |
|---|---|---|
| **Automated metrics** | Compare output to a known correct answer: code runs, correct policy number. Also latency, refusal rate, retrieval precision. | Fast, cheap; strong for verifiable tasks, weak for open-ended ones (exact match treats a paraphrase as wrong) |
| **Benchmarks** | Standardized tests across model versions (e.g., HumanEval for code) | Fast, cheap after setup; good at catching regressions, weak for product-specific behavior |
| **Human evaluation** | Raters score tone, helpfulness, safety edge cases, factual nuance. Check **inter-annotator agreement**: low agreement means fix the guidelines first. | Slow, expensive; strongest signal when raters are calibrated |
| **LLM-as-judge** | One model grades another's output (Snap and Sierra use it) | Fast, medium cost; biased (lenient, rewards confident-but-wrong). **Always calibrate it against a human-labeled set.** |

**3. Design the system across three stages:**
- **Offline (before deploying):** a labeled dataset that reflects real production inputs,
  covering common cases, key segments, and known edge cases. **Quality over volume:** 500
  high-agreement examples beat 50,000 noisy ones. **Set the pass threshold before you run the
  eval,** not after you see the score.
- **Pre-production gates (at release):** a fixed regression suite of known failures. **Keep every
  past failure in it forever.** It's a minimum, not proof the model is good. **Block a release
  that fails, even if the overall score improved.** Example: a support bot once promised a refund
  against policy, so that prompt and the correct answer now live in the suite.
- **Online (after deploying):** monitor real traffic for drift and new failure modes. Use user
  behavior (thumbs, correction rate, abandonment, overrides), automated classifiers on sampled
  outputs, and human review of random and flagged samples. Sample enough to catch a shift before
  it becomes an incident. For a legal summarizer: review 2% of live outputs each week plus
  real-time thumbs-down. A spike in either triggers an investigation.

**4. Name the tradeoffs:** say what you give up, and why that fits the failure from step 1.
Signal quality depends on fit: an automated check is the *strongest* signal for a verifiable task
and the *weakest* for a subjective one.

## Traps
- Naming "accuracy" without defining the costly failure.
- One approach for everything.
- LLM-as-judge without human calibration.
- Setting the threshold after seeing results.
- A regression suite that forgets past failures.
- No online monitoring.
- Average performance hiding a group that's failing. See
  [technical-ai-fluency.md](technical-ai-fluency.md) on bias.
