# /harvest — learn from the review, then board

Run this after the user has reviewed the **Evals** view in Patrol Pulls (changed calls, marked
`skip`, left comments). Harvest doesn't search; that's `/patrol`. If nothing has been reviewed
yet, say so and stop.

**The board signal:** every Patrol Pulls row whose `Disposition` isn't `skip` gets boarded into
Pipeline. The user controls what boards by marking `skip`.

## 1 · Process their comments first: answer, act, tune

Read every row's comments, `skip` rows included. **Quote each comment back and say how you read
it** before acting. Then:

- **A question** ("is this actually remote?", "what's their runway?"): answer it with a quick
  live check, reply in the Notion comment thread, and update the row's Disposition if the
  answer changes the call.
- **An instruction** ("skip this", "make it a target"): set the Disposition.
- **A dream-list signal** ("dream list", "I'd love to work here"): add the company to
  **Targets** (dedupe by Company; Actionable, Careers, Cooldown, a one-line why). This
  deliberate signal is the only way harvest adds a company to the dream list.
- **A filter disagreement** ("this should've been skipped"):
  1. Find which stage got it wrong: search term, cheap screen, hard screen, or the read.
  2. Update **Search settings → Patrol filters** on the hub page, with a dated line saying why.
     Fetch the page first and edit against the text as stored (see "Editing the hub page" in
     `docs/mission-layer.md`).
  3. Add the row to **Calls to protect** as an example of the correct call.
  4. Reply confirming the change.

**After any filter change, check Calls to protect:** would the new filters still make each
protected call? If one breaks, tell the user before keeping the change.

## 2 · Board every non-skip row into Pipeline

Skip any row whose Company + Role is already in Pipeline. For the rest:

- **Company escalation first.** If Reason says `COMPANY-ESCALATION`, or the company is on the
  dream list but this role is a weak one for it, the surfaced role doesn't become the company's
  shot. Add the company to Targets as `watching` if it isn't there, and tell the user to
  `/scout <company>` for its real role. A strong target role at a dream-list company boards
  normally, with the `Target company` relation set.
- **Resolve flags** to rep or target using the Company Brief and their comment. Default to rep.
- **Create the Pipeline row:**
  - `Company`, `Role`, `Type`, and `Status: to-apply`.
  - Copy `JD`, `JD summary`, `Company Brief`, `Comp`, `Location` and `Date JD opened`.
  - `Stability / Culture` with its rationale.
  - A one-line why in `Notes`.
- **Target roles:** set the `Target company` relation only if the company is already on the
  dream list. A target role alone never adds its company.

## 3 · Report

- Questions answered, and any calls they changed.
- Instructions applied.
- Filters changed, with why, and the Calls-to-protect result.
- Rows boarded (reps vs targets, by name).
- Rows skipped as already in Pipeline.

Point them at the Pipeline and 🎯 Target roles views.
