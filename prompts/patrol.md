# /patrol — daily job discovery

Finds fresh postings, screens them, and **stages** every one in Patrol Pulls with a first call
for the user to review. Patrol never boards anything into Pipeline (that's `/harvest`) and
never applies to anything.

## First use (or `/patrol setup`)

1. If `my/notion.md` doesn't exist, run `prompts/setup-mission-layer.md`.
2. **Check the scraper runs:** `cd tools/job-discovery/linkedin-search/cli && npx -y tsx
   src/cli.ts --help` (or `bun run src/cli.ts --help`). Tell the user its terms: it reads
   LinkedIn's public job pages, and automated access is against LinkedIn's Terms of Service, so
   it's for personal use at low volume only (see that folder's `NOTICE.md`).
3. **Agree the filters with the user** and write them under **Search settings → Patrol filters**
   on the Notion hub page (fetch it first; see "Editing the hub page" in `docs/mission-layer.md`):
   - **Search terms:** suggest them from their target role (e.g. AI Product Manager, Product
     Manager Machine Learning, Platform Product Manager). Recall-first; the screens add
     precision.
   - **Locations:** each city they'd work in, plus a nationwide `--remote remote` pass if remote
     is acceptable. A city-scoped search misses remote roles posted under other cities.
   - **Posting age:** `--jobage 7` for a daily run.
   - **Cheap-screen drops:** title patterns that are clearly out of range (e.g. product
     marketing, hardware). Ask which levels to drop: for a Senior target, usually Staff,
     Principal, Group, Lead and Director titles, which otherwise crowd out half the results.
   - **Hard screens:** their dealbreakers, as checks.
4. **Offer to schedule it daily** (below).

## A run

**0 · Read state.** Read the Patrol filters and dealbreakers from the hub page, existing
Pipeline and Patrol Pulls rows (so nothing resurfaces), and the Targets list.

**1 · Search.** For every term and location in the filters, run:

```
npx -y tsx src/cli.ts search -q "<term>" -l "<location>" --jobage 7 --format json
npx -y tsx src/cli.ts search -q "<term>" -l "United States" --remote remote --jobage 7 --format json
```

Dedupe by posting (JD link, or company + role), not by company.

**2 · Cheap screen** on the search fields only:
- Already known (in Pipeline or Patrol Pulls).
- Wrong location (re-check it; LinkedIn's filter is fuzzy).
- An obviously out-of-range title.

Keep the survivor list short; this protects the low-volume footprint.

**3 · Detail fetch** for survivors: `npx -y tsx src/cli.ts detail <id> --format plain`. This
gets the full JD and, often, the posted pay range.

**4 · Hard screens:**
- **Dealbreakers,** with a quick live check of stage and recent layoffs.
- **Pay floor:** no range posted means flag, not drop.
- **Workplace type:** read it from the JD and write `Location` as `<city> · on-site / hybrid (N
  days) / remote / workplace unstated`. Add `⚠ on-site` to Reason. On-site is flagged, never
  auto-dropped.

**5 · First call:** `rep`, `target`, `flag` (genuinely unclear), or `skip`, at triage depth.
Targets still need a `/scout`.

**Company escalation:** if a strong company (already on the dream list, or one that clearly
clears the dealbreakers) surfaces with a weak role, tag Reason `COMPANY-ESCALATION` so harvest
routes the company to `/scout` instead of letting the weak role define it.

**6 · Log every posting, drops included,** into **Patrol Pulls**:
- `Disposition`, `Decided-at`, `Reason`.
- `Comp`, `Location`, `JD`.
- `JD summary`: 1–2 sentences.
- `Company Brief`: what they do, plus a stability read, for every survivor.
- `Date JD opened`, `Run date`.

The drops are where filter mistakes hide.

**7 · Report:** how many were found, how many survived each screen, the new reps and targets by
name, and anything flagged. Point the user at the **Evals** view: change calls, mark `skip`,
and comment on misses. Then `/harvest` does the rest.

## Run it daily as a scheduled routine

**The AI sets it up:** offer to create a daily routine with the agent's scheduler (in Claude
Code, the `/schedule` skill). The routine needs:
- **Repo:** the user's GitHub copy of shadow-dojo-app, so the cloud run has these prompts and
  the scraper.
- **Connector:** Notion.
- **Schedule:** daily, at a morning time in the user's timezone.
- **Prompt:** "Run prompts/patrol.md. Read the Mission Layer links and all settings from the
  Shadow Dojo hub page in Notion (the my/ folder isn't available in the cloud). Stage into
  Patrol Pulls and stop."

Confirm the details with the user before creating it, then do one test run.

**The user sets it up:** in claude.ai, create a scheduled routine with the same repo,
connector, schedule and prompt.

**If LinkedIn blocks the cloud run** (empty results or HTTP 429/999), say so and fall back to a
local scheduled task on the user's machine.
