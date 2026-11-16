# Product sense: design a new product, improve an existing one, novel technology

> **Category:** Product Sense · **Type:** design / improve / novel-tech framing. Also the rubric for every product sense type. · [All rubrics](README.md)

**In one line:** Building is cheap now, so judgment is the bottleneck: *what* to ship and *why*.
Clarify, explain why this company should build it (ending with a north star), pick one specific
user, find the pain that comes up when you walk through their day, generate three genuinely
different solutions, and scope the smallest MVP that tests what has to be true.

---

## What they're scoring
- Ideas tied to the company's **mission, business model, and competitive position**, not just
  what users might want.
- A **specific user** with pain that comes from their real day, not a template.
- Ideas that are **meaningfully different**, grounded in the root problem, with at least one you're
  visibly excited about.
- Concrete output: you narrate your design decisions and handle implementation follow-ups calmly.
- A conversation, not a performance.

**Senior bar:** the segment is specific to what *this* company or technology enables. Strategy
connects to mission and competitive position *before* you're asked. The winning idea is argued
against the north star, not "it's the most impactful." The clearest senior markers: strategic
framing nobody asked for, a product arc beyond the MVP, teaching the interviewer something, and
**naming what you're not building and exactly why.** The most consistent differentiator across
companies is a genuine point of view on the strategy, the user, and which idea is worth building.

## The framework (6 steps)

### 1. Clarify (scope and constraints)
- **Loaded or ambiguous terms first,** especially with novel tech. For "understand animals":
  precise thoughts or broad emotional states? How accurate? Does the animal wear hardware? The
  answer reshapes the product. Broad states from a wearable means a tool for *how the animal
  feels*, not a translator.
- **Then state the context as assumptions** and invite correction: company, market, resources,
  timeline. "OpenAI, US, fully staffed, three to six months. Sound right?"
- If the prompt is already clear ("design a garage door opener"), say so and move on. Don't ask
  questions for the sake of it.
- **If the interviewer keeps answering "up to you," take the hint.** Switch from asking to
  proposing assumptions.

### 2. Strategy (1–2 minutes, ending with a north star)
Why this makes sense in the market *and for this company*. Pick what matters most: company
mission and strategy, market trends, why the company is well positioned, and the product's own
mission. **End with a north star metric.** At OpenAI, strong candidates tie the answer to the
AGI mission without being asked.

### 3. User types (segment, then pick one)
- **Generate at least three** using one or two lenses:
  - **Use case:** what job are they hiring the product for?
  - **Usage stage:** new, power, or lapsed. Best for established products.
  - **Demographics:** age, life stage, role. Only when it actually changes the need.
  - **Consumption behavior:** how and when they engage (movie watchers vs. episodic viewers).
- **Make each one concrete:** a memorable name plus a one-sentence situation ("the Worried Dog
  Owner").
- **Sharpen the list:**
  - *Too broad:* could it appear in an unrelated exercise?
  - *Too narrow:* is the pain already baked in? "Dog owners with separation anxiety" has picked the
    problem for you.
  - *Too similar:* do two overlap heavily?
- **Pick one** on **breadth** (how many share the need), **depth** (how painful or urgent), and
  **mission fit** (the company's goals and the technology's strengths). Also consider willingness
  to pay and which group gives the best signal on whether the core works. **Red flag:** picking
  the biggest group by default. A smaller group with an acute need or better fit is often the
  better start.

### 4. Pain points (find them, sort them, pick one)
- **Paint the user's world.** Restate who they are and what's unique, then walk through a day.
  Watch for moments of uncertainty, frustration, or lost control. Let the problems *emerge*;
  don't arrive with a list. Capture more than you need.
- **Sort into buckets:** time · money · motivation · trust & safety. A spread across three or more
  buckets is a strong mix. If they cluster, go find friction elsewhere. Two in the same bucket may
  be the same problem in different words. Different buckets point to different root causes, which
  produce genuinely different solutions.
- **Pick one** on breadth, depth (frequency and pain), **product strength** (is *this company*
  well positioned?), and **risk** (can the product reliably deliver?). Say why the winner comes
  first, why the others wait, and why this company. **Judgment means picking a painful problem the
  company can credibly solve.** OpenAI checks whether it's something AI *can and should* solve.

### 5. Solutions (three genuinely different ideas)
- **State the problem statement first and keep it in view.** A pain point is what someone
  *feels*; a problem statement is *why it happens*. "New employees keep getting blocked" is a
  pain. "Answers are scattered across tools and people, so there's no reliable source" is a
  problem statement. Every idea must solve that same statement. Vague ideas usually mean a vague
  problem statement.
- **Two traps:** (a) several *features of one experience* passed off as separate ideas (a
  dashboard, a notification, and an app are one solution; so are an app, a Slack bot, and a push
  notification); (b) ideas that each solve a *different* problem, so they can't be compared.
- **Solution lenses**, meaning different mechanisms for the same problem:
  - **Software:** detect, automate, organize, recommend. AI lives here.
  - **Physical:** a device or a real-world interaction.
  - **Service:** a person or an operational process.
  - **Network:** other users, experts, or providers.
  - **Environment:** change the surrounding context so the problem happens less.
- **Moonshot:** the long-term version if a key constraint disappeared (the technology improves
  dramatically, or you gain enough data, trust, or distribution). Spend one to two minutes:
  state it, name the constraint, say why it matters, then come back.
- **Prioritize after stating assumptions** (team, time, technology, distribution). Then compare on
  **problem fit**, **metric impact** (the north star from step 2), **feasibility**, and
  **learning** (which idea tests the riskiest assumption). Treat the other ideas as a conditional
  roadmap: what would need to be true for each to come next, what evidence would change the order,
  and which capabilities from the first one unlock them.

### 6. MVP (the smallest version)
- **Start with the prerequisite:** what has to work before *any* value exists? The MVP is the
  smallest feature set that delivers value *and* tests that prerequisite.
- **Say explicitly what you're leaving out and why.** Every kept feature should prove the core
  value or move the north star.
- **Showing it:** if sketching, show only the one or two highest-value moments. If prototyping,
  see [sense-live-prototyping.md](sense-live-prototyping.md).

## Rubric: all product sense questions (5 dimensions, Strong No Hire → Strong Hire)
Structure is now the minimum. **Prototyping ability is the fastest-growing differentiator.**
1. **Business acumen:** why *this company* builds it: mission, model, competitive gap, why now.
   One sentence on timing beats three on market size. AI-native companies: "we could use AI to
   personalize it" is No Hire; naming what the technology can and can't do *yet*, and designing
   around it, is Strong Hire. Strong Hire overall: the interviewer learns something from the
   strategy section.
2. **User-centricity:** could the segment only belong to this product? Does the pain feel
   *discovered* rather than retrieved? Does it come from different root-cause buckets? Is the
   prioritization multi-dimensional, tied to mission, technology limits, and signal quality? A
   rushed segment produces generic pain.
3. **Product taste:** ideas are distinct (*test: each one could fail independently*), grounded in
   the root problem, and at least one shows a longer arc. "Too complex" isn't a reason to drop
   something; "needs behavioral modeling the tech can't support yet" is. Conviction plus precise
   deprioritization (what would need to be true). Strong Hire: at least one idea surprises the
   interviewer, and the answer would differ for a different company.
4. **Prototyping ability:** the concept becomes one or two concrete screens, every decision is
   narrated, the prototype is a prop and not the deliverable, and implementation follow-ups are
   handled calmly. Strong Hire: covers empty states, failure states, and production readiness.
   The narration would be valuable even without the prototype.
5. **Communication & collaboration:** the interviewer always knows where you are. Clear
   transitions, check-ins at decisions, an invitation to push back. **The end of the main answer
   isn't the end:** Meta moves into a conflicting-metric scenario, AI-native companies probe
   implementation, and anyone may probe ethics. Handle these as extensions of your answer.

## Variants
- **Improve an existing product:** start from the product's current users and where they *exit*
  the product to finish the job. The usage-stage lens (new, power, lapsed) works well here.
- **Novel tech:** the clarifying step *is* the interview. Interrogate the mechanics, accuracy,
  hardware, constraints, and safety before forming any product opinion.

## Traps
- Generic segments.
- Pain points arrived with rather than discovered.
- Three features of one idea.
- Ideas solving different problems.
- Choosing by "most impactful."
- An MVP that's an intake form.
- Skipping what you're cutting.
- Treating strategy as a preamble.
- Stopping when the main answer ends.

## More tips
- **Clarifying, two modes:** *ask directly* about terms that describe the technology or core
  mechanic, or words with several valid meanings (these are definitions you need). *State and
  confirm* product context (market, timeline, team, scope, standalone vs. inside an existing
  product). Don't make the interviewer do your scoping.
- **Underline every load-bearing word** and define each one. Most candidates define the first
  obvious term ("sports") and skip the others ("together"). Then say what's now in scope.
- **Timing:** a standard prompt gets 60 to 90 seconds of clarifying. A novel-tech prompt gets 3
  to 4 minutes, because there clarifying is most of the interview.
- **Lenses, annotated:** usage stage is weak for novel products; demographics is the most
  overused lens.
- **"Casual / regular / power users" describes engagement, not people.**
- **If the pain sounds like a schedule, you haven't found the friction.** Aim for three distinct
  pains that don't overlap and aren't too specific or too broad. OpenAI pushes back on "it's the
  most painful" as the only reason.
- **Feature vs. solution:** "a distress notification" is a feature. "A real-time signal that
  closes the owner's feedback loop" is a solution. Get the solution direction first.
