# Latency, cost, and quality tradeoffs

> **Category:** Analytical / Execution · **Type:** inference tradeoffs as product decisions (model rollouts, "it's too slow," "it's too expensive") · [All rubrics](README.md)

**In one line:** You can't optimize latency, cost, and quality all at once. The PM's job is to
decide where *this* product sits on that triangle and defend it with data: know the two latency
numbers, set a quality floor *before* choosing a model, connect cost to unit economics, and pull
the right lever (routing, batching, context, caching).

---

## The triangle
More **quality** usually means a bigger model, which is slower and pricier. Lower **latency**
usually means a smaller model or shorter context, which puts quality at risk. Lower **cost**
means fewer tokens, compression, or a smaller model, which loops back to the other two. Two traps
to avoid: solutions that ignore cost, and cost cuts that quietly destroy quality.

## The four concepts to know

**1. Latency is two numbers:**
- **Time to first token (TTFT):** from send to the first token on screen. The responsiveness
  users feel.
- **Time per output token (TPOT):** how fast the response streams once it starts.

| Use case | Priority | Why |
|---|---|---|
| Conversational chatbot | Fast TTFT | A blank screen feels broken |
| Document summarization | Fast TPOT | A slow start is tolerable; throughput matters |
| Real-time voice | Both, very tight | Any pause breaks the experience |
| Background reports | Neither urgent | Nobody is watching the clock |

**Don't reflexively say "use a smaller model."** First ask *where* the latency comes from: a
bloated system prompt, slow vector retrieval, or cold starts on serverless infrastructure all
raise TTFT, and swapping models fixes none of them. *Strong rollout answer:* "If the new model is
larger, what's the TTFT hit for conversational users, and is streaming enough to cover it?" That
treats the rollout as an infrastructure decision too. *NVIDIA framing that lands:* "A stronger
reasoning model was hurting UX through delay. I watched response metrics, conversion, and drop-off,
ran A/B tests, and found the right point between quality and speed." Show how you monitored and
made the call, not just "use a smaller model."

**2. Quality: define it before you optimize.** Quality is relative to the task. A small model
fine-tuned for a narrow domain can beat a general flagship there, faster and cheaper. **Set the
quality floor before choosing the model.** Know how quality fails predictably:
- **Truncation:** context overflows, and earlier turns or document context drop silently.
- **Hallucination under pressure:** aggressive trimming removes the grounding.

*Senior version:* define the floor, then an eval suite to check whether the smaller model meets
it *for this task*, then ask whether the latency gain is worth the quality loss *for this user in
this moment*. Quality and efficiency aren't separate questions. If you compress context to save
cost, say at what point the compression starts to hurt.

**3. Cost has two layers:**
- **Cost per token:** input and output, growing with model size and volume. A chatbot that sends
  the full history on every call compounds cost fast.
- **Total cost of ownership:** tokens plus retrieval infrastructure, human-review pipelines,
  engineering optimization time, and the fixed compute of self-hosting (which needs volume to pay
  off).
- **Unit economics:** cost per *successful* interaction vs. the revenue or retention value of
  that interaction. If they're far out of balance, *you* raise it. *Rollout line:* "Before full
  rollout, I want the cost-per-conversation difference, and whether current pricing absorbs it or
  we need a tier change."

**4. The optimization levers:**
- **Model routing:** simple requests (rephrasing, FAQs) go to a small fast model; complex
  reasoning goes to the flagship. The PM sets the quality floor for each interaction type. Done
  well, it cuts cost substantially without users noticing.
- **Batching:** group requests into one inference pass. GPU utilization goes up and cost per
  request goes down, but queue latency is added. The product question is *what wait is acceptable
  for this interaction before users notice?*
- **Context management:** summarize earlier turns, drop low-relevance chunks, add a memory layer.
  Safe *if* you've defined quality.
- **Caching:** return stored answers for identical or near-identical queries. Great for
  deterministic content (FAQs), poor for open conversation. Semantic caching handles queries that
  are similar but not identical.

## Traps
- Treating latency as one number.
- "Use a smaller model" before finding where the latency comes from.
- **Handing cost to engineering** ("we'd work with the team to optimize" is not a PM answer; own
  the cost-value equation and the thresholds that trigger optimization work).
- **Skipping the eval question:** any quality-vs.-cost argument needs a way to measure quality.
