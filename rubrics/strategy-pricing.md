# Pricing questions

> **Category:** Product Strategy · **Type:** pricing (new product or price change) · [All rubrics](README.md)

**In one line:** First work out what the price has to accomplish. Then decide *where the money
comes from* before *how customers are charged*. Land on a number that sits between what the
customer values it at and what it costs to serve, then stress-test it. For AI products, every
query costs compute, so your heaviest users can be your least profitable ones.

---

## The framework (3 steps)

**1. Define the landscape.**
- **Product and customer:** who it's for, what value it gives, what they do instead today,
  whether it's a new product or a price change, and how price-sensitive they are.
- **Company goal:** adoption, profit, or share? Entering a market or defending one? A brand
  play?
- **Constraints:** competition (including indirect alternatives that set willingness to pay),
  **cost to serve and how it grows with heavier use**, international differences, cannibalizing
  an existing tier, and public perception (backlash, trust).
- End this step with the two or three criteria the price must satisfy.

**2. Choose a model, in two decisions and in this order.**

*Decision 1: where the money comes from.*

| Approach | Fits when | Examples |
|---|---|---|
| **Everyone pays** | Direct revenue is the goal, willingness to pay is established, or costs require it | Stripe, Adobe CC, Snowflake, most B2B SaaS |
| **Free, money made elsewhere** | Revenue comes from ads, data, or an adjacent business | Google Search, Alexa (Prime/hardware), Maps (Android/cloud) |
| **Part free, part paid** | Adoption is the bottleneck, and there's a natural moment when free users want more | Notion, Slack, ChatGPT, Claude, Duolingo |

*Decision 2: how customers are charged.*

| If everyone pays | Ask yourself | Pro / con |
|---|---|---|
| Dynamic | Is supply constrained and demand variable in real time? (surge, airline seats) | Captures peak demand / frustrates customers, needs real-time infrastructure |
| Usage-based / metered | Does value grow with usage, and will customers accept per-unit billing? (API per token, Twilio per SMS) | Aligns cost with value for B2B / billing uncertainty, consumers don't think in tokens |
| Fixed / one-time | Is the value delivered upfront? (app purchase, license) | Simple / no recurring revenue |
| Subscription | Do customers use it continuously? Do you need predictable revenue? | Predictable / churn when idle |
| Per-seat | Is value tied to each user? (Slack, Salesforce) | Scales with the team / blocks adoption if seats must be paid before anyone tries it |

| If free with indirect money | Ask yourself | Pro / con |
|---|---|---|
| Ad-supported | Do you have scale, and do ads fit the experience? | Monetizes everyone / misaligned, hurts focus or creative contexts |
| Ecosystem / loss leader | Does it drive a higher-margin adjacent business? | Free at scale is justified / needs a strong adjacent business |
| Cross-subsidy | Can one segment pay for another? (LinkedIn recruiters, X's paid API) | Broad adoption plus targeted revenue / free tier must stay genuinely useful |

| If part free, part paid | Ask yourself | Pro / con |
|---|---|---|
| Feature-gated | Is there a clean line between casual and serious use? (Notion databases, Spotify skips) | Clean upgrade story / the wrong gate kills the free tier |
| Usage-gated | Is there a measurable resource where heavy use creates the conversion moment? (Claude Free vs. Pro) | Conversion built into the product / free tier must show real value first |
| Time-limited trial | Is the value obvious fast and the decision quick? | Low friction, urgency / fails if value takes time to show |
| Hybrid (base + overage) | Do you need a predictable base and also want to capture heavy users? (Claude Pro, ChatGPT Plus) | Predictable and cost-aligned / complex, threshold calibration is critical |

**Gating AI products:** never set the free limit so low that users hit it before finishing
something useful.

**3. Determine the price.** Three anchors define a range:
- **Value ceiling:** what the outcome is worth (ROI for B2B; the cost of doing it manually for
  consumers).
- **Cost floor:** what it takes to serve a customer without losing money, *including inference*.
- **Competitive range:** a sanity check, not the answer. The whole market may be underpriced.

Pick a number in the range, then stress-test it for **cannibalization**, **positioning** (do the
price and limits signal the right quality?), and **launch vs. steady-state price** (if it starts
low, how does it go up?).

## Traps
- Jumping to a number before stating what the price must do.
- Choosing the charge structure before the money source.
- Ignoring cost to serve (fatal at AI companies).
- Anchoring only on competitors.
- Pricing in units the customer doesn't think in, like tokens.
- A free tier too small to reach value.
