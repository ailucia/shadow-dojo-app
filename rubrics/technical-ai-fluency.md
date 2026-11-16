# Technical: AI fluency

> **Category:** Technical & AI · **Type:** AI technical questions: tokens and context, hallucinations, evals, RAG vs. fine-tuning, agents, MCP, temperature, latency/streaming, bias. Also how technical rounds run, and the rubric for every technical type. · [All rubrics](README.md)

**In one line:** "Technical" for PMs now mostly means AI, and it surfaces *inside* product sense,
strategy, and behavioral rounds, often without the job description saying so. Use the concepts
correctly as the conversation gets specific, know how these systems *fail*, commit on the
tradeoffs, tie every technical choice back to a user, and have real decisions from your own work
ready when the interviewer pushes.

---

## How technical rounds run
- Most big-company loops have **no dedicated technical round**. The technical depth shows up
  inside other rounds.
- **The bar is highest at frontier and AI-native companies:**
  - **NVIDIA:** defend every technical claim from your *own* background. Mention RAG in a story and
    the follow-up asks for the metric, the tradeoff, and the system detail.
  - **DeepMind:** clean offline vs. online eval frameworks and a real opinion on RAG vs.
    fine-tuning.
  - **OpenAI:** has sent a research paper as a mini take-home ("critique the fine-tuning
    strategy").
  - **Sierra:** agent architecture, cold: memory, RAG, MCP, quality controls, eval metrics.
- A Google L5 candidate's take: if you don't use AI tools daily, it's hard to fake the fluency,
  because it shows across product sense, execution, *and* technical.
- **Senior bar:** answers grounded in **decisions you actually made** (which embedding model, what
  your evals measured, why fine-tuning over RAG *in that case*), not a comparison table.

## The concepts (the 20% that comes up 80% of the time)

**Model lifecycle**
- **Pre-training:** general knowledge from massive data. Done by foundation labs; the result is
  raw and unaligned.
- **Post-training:** fine-tuning on domain data, instruction tuning, RLHF. Think of it as
  onboarding the new hire.
- **Inference:** live responses. Nothing new is learned; behavior depends on the prompt, the
  context, and the settings.
- Apple expects PMs to know this well, because decisions come down to swapping components for
  latency, hallucination, cost, or privacy.

**Tokens and context windows**
- **Tokens** are roughly word pieces. Everything in (system prompt, history, input) and out costs
  tokens; that's what pricing and limits are based on.
- **Efficiency** = tokens per useful output plus latency per call. **Quality** is a separate
  variable: cheap and fast can still be wrong, which is why you need evals.
- The **context window** is working memory. Past the limit, earlier content is dropped: a support
  bot forgets what the user said, and a 50-page brief may not fit at all.
- **Cost math to own:** 2,000 tokens of history × 100k conversations a day × 10 turns = 2B input
  tokens a day, about $5k a day at $2.50 per million, before generating anything. Trimming to 800
  tokens cuts that by 60%. *A senior PM owns that tradeoff and doesn't hand it to engineering.*

**Hallucinations** are confident, plausible, wrong outputs: pattern-matching without grounding.
- **Training-time:** the knowledge is wrong, stale, or missing. Prompting can't fix it.
- **Inference-time:** confusing or contradictory context. Better prompt design helps.
- **Four mitigations to have ready:**
  - **RAG:** ground answers in retrieved sources, which makes errors traceable.
  - **Citations:** claims tied to sources make failures *auditable* (Perplexity), and users learn
    to check.
  - **Confidence thresholds with a human in the loop:** low-confidence answers go to review or a
    safe fallback ("we recommend seeing a doctor").
  - **Evals:** run a benchmark set with known answers before shipping, and if the hallucination
    rate goes up, don't ship.
- Perplexity's trust question: how you *detect* hallucinations, how you *communicate uncertainty*,
  and how you *catch them after launch.*

**Evals** are the test suite for probabilistic output. Full design is in
[execution-ai-evals.md](execution-ai-evals.md).
- **Human review:** most reliable, slow (e.g., 200 samples per major update on a 1–5 rubric).
- **LLM-as-judge:** fast, but biased. A first-pass filter, not a replacement.
- **Automated metrics:** for verifiable answers.
- **The PM defines "good" before building,** and every model, prompt, or data change runs the
  suite. "We'd measure accuracy" isn't an answer until you've defined accuracy *for these users.*

**RAG (retrieval-augmented generation)** is for knowledge that's proprietary, frequently updated,
or too niche for training data. Embed the knowledge base into a vector DB; embed each query; pull
the semantically closest chunks; pass them as context. (Embeddings work like coordinates:
"mouse" in a tech document sits near "cursor," not "rat.") The decisions:
- **What to embed:** an FAQ split into Q&A pairs beats one long document.
- **Chunking:** too big is noisy, too small loses context, and it differs by content type (a
  contract vs. a support transcript).
- **Embedding model:** general-purpose vs. domain-trained (e.g., clinical).
- **Index freshness:** stale retrieval is a *silent, confident* failure, so set up automatic
  re-embedding.
- **When results are irrelevant, check the embedding model and chunking first,** not the
  generator.

**Prompting vs. RAG vs. fine-tuning**

| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| What it does | Instructs through the input | Fetches data at runtime | Retrains the weights |
| Best for | Behavior, format, tone | Grounding, fewer hallucinations, changing data | Domain fluency, task-specific behavior |
| Cost | ~zero | Medium (vector DB, retrieval latency) | High (compute, data curation, upkeep) |
| Time to ship | Hours | Days to weeks | Weeks to months |
| Maintenance | Low | Medium (keep the index fresh) | High (re-tune as data drifts) |
| Fills knowledge gaps? | No | **Yes** | Only for what you trained on |

**Decision order:** start with prompting → use RAG if it's a *knowledge gap* (current or
proprietary information) → fine-tune only for a specialized task neither can solve, *and* only if
you have the data and budget.

**Agentic AI:** agents take a sequence of actions toward a goal using tools and state (an agent
*books* the trip; a model *suggests* one). The loop: goal → plan → act with tools → observe →
adjust → done or stop. PM concerns:
- **Failures compound.** A mistake in step 2 poisons steps 3 through 10, so evaluate the chain.
- **Human-in-the-loop thresholds by reversibility.** A calendar invite can go automatically; a
  client email, a purchase, or a deletion needs confirmation.
- **Log every step and its reason.** That's your flight recorder, for debugging and for answering
  "why did you send that?"
- **Cost control.** Long chains of tool calls and loops add up, so set limits.
- Sierra asked for the full system of an agentic support bot: tool use, routing, failure states.

**MCP (Model Context Protocol):** an open standard, essentially the contract between a model and
external tools, data, and services. It replaces custom integrations for every pair of systems,
makes tool use more reliable and auditable, and is increasingly a baseline expectation for
enterprise AI.

**Temperature:** low (near 0) means the most likely token every time, so output is consistent
(legal summaries). High means broader sampling: varied, sometimes wrong (tagline brainstorms).
The product decision is whether the feature should be *consistent and accurate* or *varied and
generative.*

**Latency and streaming:** streaming shows tokens as they're generated. Total time is the same,
but it *feels* much faster.
- **Streaming** is the default for conversation.
- **Batch** fits background jobs.
- **Long agentic tasks** need progress indicators.
- **Set latency budgets upfront.** A triage tool that takes 8 seconds isn't real-time.
- DeepMind asks how you'd design the UI and UX around AI latency. More in
  [execution-latency-cost-quality.md](execution-latency-cost-quality.md).

**Bias and fairness:** models inherit human bias (historical hiring data, English-dominant
text). It's predictable, not an edge case. The PM's four jobs:
1. **Identify who gets hurt:** underrepresented groups and the places where error rates run
   highest (non-native accents in speech-to-text; groups historically denied credit).
2. **Detect it with disaggregated evals:** a test set that over-represents edge groups, error
   rates compared by subgroup. A meaningful drop is a **launch blocker, not a backlog item** (90%
   average accuracy can hide 70% for one group).
3. **Prevent reinforcement:** worse results lead to less engagement, which leads to less data and
   a worse model. Filter outputs before they become training signal, use diverse raters, and audit
   pipeline representation on a schedule.
4. **Be transparent** when AI drives consequential decisions (hiring, lending, health,
   moderation) so users can push back.

A strong answer names the at-risk group *for this product*, a concrete way to detect the bias, and
**prevention through feedback-loop design.** Most candidates stop at detection.

## Rubric: all technical questions (5 dimensions, Strong No Hire → Strong Hire)
**Depth under pressure** is what separates candidates now, because studied vocabulary can't
produce it.
1. **Technical accuracy:** the failure is *misapplication* ("use RAG to make it more creative,"
   "fine-tune to fix a prompt problem"), and it gets tested in the follow-ups, not the opener. A
   confidently wrong tool is worse than not knowing the term. Strong Hire: precise including edge
   cases, self-corrects, and the interviewer learns from how you connect concepts.
2. **Failure-mode awareness:** go beyond "it might hallucinate" to *specific* failures: an
   embedding model weak on specialized terms, bias compounding, agent errors cascading. Strong
   Hire: raises them unprompted, ties them to user harm, and proposes a mitigation.
3. **Tradeoff reasoning:** commit. "It depends" without naming *what* it depends on is a hedge.
   Name the winner and the condition that would flip it. Strong No Hire: reaching for the most
   complex fix by default. Strong Hire: the second-order point ("RAG is cheaper to ship, *and* the
   knowledge base changes monthly, so fine-tuning upkeep would be too costly").
4. **Product grounding:** the user is where you start. "We'd add confidence thresholds" is half an
   answer. "…so users aren't confidently served a wrong answer, because trust is what we're
   protecting" is the whole one.
5. **Depth under pressure:** when pushed, give a *specific* answer, not the principle again at
   higher volume. Example of depth: "We moved from a general embedding model to a clinical one
   because recall on medication names was 60% and needed to be above 85%."

## Traps
- Vocabulary without correct application.
- Generic failure modes.
- Listing options with no recommendation.
- Fine-tuning by reflex.
- Technical answers with no user in them.
- Retreating into abstraction when asked "which model? what did the eval measure?"
