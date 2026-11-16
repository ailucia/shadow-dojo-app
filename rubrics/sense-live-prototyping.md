# Live prototyping / vibe coding

> **Category:** Product Sense · **Type:** live AI prototyping ("Design X for Y" with AI tools; "Use AI to solve X") · [All rubrics](README.md)

**In one line:** Run normal product sense thinking, then turn it into a working prototype of the
*one critical interaction*. Narrate every tradeoff as you build, iterate with the interviewer,
and close on how it would work in production (instrumentation, evals, guardrails, rollout).

---

## What they're looking for
Problem framing under ambiguity · real user insight · something concrete, visual, and
interactive · awareness of tradeoffs and constraints. They are not scoring polish.

## The framework (7 steps)
1. **Clarify:** what problem, for whom, under what constraints.
2. **Motivation:** use AI for quick context ("why is Gen Z entering crypto?") to ground a
   hypothesis.
3. **Segment:** AI-assisted is fine. Pick one primary segment.
4. **Pain plus hypothesis:** e.g., "Gen Z wants transparency and simplicity; current apps feel
   opaque and risky, so the UX must explain risk clearly and build trust."
5. **Build the core flow live:** the *single most important interaction*. Narrate the
   tradeoffs. Don't build the whole app.
6. **Co-create:** treat feedback as collaboration and change the flow, copy, or logic on the
   spot ("let's simplify this step").
7. **Production thinking**, a strong seniority signal:
   - **Instrumentation:** funnel metrics, errors, model performance, feedback signals.
   - **AI fundamentals:** when you'd use RAG vs. a plain LLM; hallucination and safety
     boundaries; memory and context management; logs, traces, and evals for monitoring.
   - **Validation:** correctness, quality, satisfaction.
   - **Guardrails and compliance:** limits, disclosures, approvals, privacy, especially in
     fintech, health, or anything for kids.
   - **Rollout:** alpha → beta → phased, with a rollback plan.

**"Use AI to solve X" template:** data inputs and sources → AI approach (retrieval, generation,
classification, or hybrid) → boundaries (what the AI does vs. what needs a human or a guardrail)
→ prototype the chat or task flow → validate assumptions with the interviewer → evaluation and
observability (what quality means, how you catch hallucinations, what the fallback is).

## Tactics that stand out
- **Replicate familiar UI patterns** from a screenshot or link, so the interviewer focuses on
  decisions instead of layout.
- **Connect a real LLM API key** so the demo actually reasons instead of showing static text.
- Generate flows from user stories, pull live data, write UX copy on the fly.
- **Introduce metrics early** ("on day one we'd track…") and **state constraints** ("we won't
  build X in v1; too complex for now").
- **Showing the MVP** (from the main framework): paste your interview notes into the tool as
  context, list the screens and their purpose, the core flow, what must be included, what to
  leave out, and the design direction. A well-structured prompt makes a better prototype.

## Traps
- **Overbuilding:** a backend or a full app.
- **Framework over product:** reciting CIRCLES instead of showing something.
- **No narrative:** a prototype with no story is noise, and a story with no prototype sounds
  like everyone else's.
- **No metrics,** so nobody can judge the design decisions.
- **Perfectionism.** Agility and live iteration are what's scored.
