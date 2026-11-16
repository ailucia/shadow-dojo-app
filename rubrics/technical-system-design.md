# Technical: system design for PMs

> **Category:** Technical & AI · **Type:** "Design a system that…" and the reverse version ("walk me through a system you designed") · [All rubrics](README.md)

**In one line:** At heart it's **a scoping exercise in technical clothes.** The bar is product
judgment applied to technical constraints, not engineering depth. Clarify, turn a user journey
into requirements, decide which qualities matter most, draw only the components those
requirements need, then raise where the design bends before you're asked.

---

## What they're scoring
- Turning user needs into system requirements.
- Picking the components that matter, and saying why each is there.
- Reasoning about tradeoffs *before being asked*.
- Being credible enough on technical constraints to be a real partner to engineering (PMs now
  scope against infrastructure, push back on estimates, and make build-vs-buy calls).

## The framework (5 steps)
1. **Clarify and scope.** This is where most interviews are lost. Who are the users and what are
   they trying to do? What are the scale, latency, and data-sensitivity constraints? What's in
   scope and what's explicitly out? Play your understanding back even if the prompt seems clear.
   *Interviewers deliberately hold information back,* and the key detail often only comes out if
   you ask.
2. **Requirements from user needs.** Walk the user journey step by step and turn each step into a
   requirement. A component that doesn't trace back to a requirement probably doesn't belong.
   Skipping this step leads to over-engineering or missing something obvious.
3. **System qualities.** Speed, accuracy, reliability, privacy and security. These decide your
   tradeoffs: a medical-records system and a social feed have similar data requirements but are
   architecturally different products.
4. **Basic architecture.** Every component the requirements need, what each one does, and how
   data flows between them. Stay at product-architecture altitude: no pseudocode, no schemas.
5. **Tradeoffs and improvements, unprompted.** What in the design conflicts with the qualities
   you chose? What are the failure modes? What changes if scale doubles or latency gets tighter?
   "Here's what I'd worry about" sounds like thinking. Describing only what you built sounds like
   presenting.

## Reverse system design
Pick **one system you know cold** and be ready to whiteboard the architecture, the data flow, the
key tradeoffs, and one concrete technical decision you'd make differently now (e.g., how you
handled conflicts). If your background is light on technical ownership, rebuild your most
technical project at this level of detail during prep.

## Traps
- **Playing engineer:** speculating about infrastructure you're unsure of costs credibility.
- **Being intimidated by "design ChatGPT."** You have 45 minutes and you're the tech lead
  planning an MVP. It doesn't need to be fancy, just done.
- **Adding features instead of cutting scope.** More senior candidates cut more and treat parts
  as black boxes ("let's leave that as a black box for now").
- **Naming brands you can't defend.** Say "Redis" and the follow-up is "why not Memcached?" Just
  say "a cache."
- **Skimping on questions** when the prompt looks clear.
