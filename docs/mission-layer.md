# The Mission Layer (Notion)

The app is the **Training Layer**: ki, skills, the campaign, daily reps. The job search itself
(postings, roles in progress, companies you'd love to work at) lives in Notion, the **Mission
Layer**. `prompts/setup-mission-layer.md` creates it; this file is the schema it follows. Your
own database links live in `my/notion.md`, never in this repo.

## Who writes what

| Skill | Writes |
|---|---|
| `/patrol` | Every posting it sees, drops included, into **Patrol Pulls** with a first call. Never boards anything. |
| *You* | Review Patrol Pulls in the **Evals** view: change calls, mark `skip`, comment on misses. |
| `/harvest` | Answers your comments, tunes the patrol filters, then boards every non-`skip` row into **Pipeline**. |
| `/scout` | A deeper rep-or-target call on one role, written to **Pipeline**; dream companies go to **Targets**. |
| `/referral` | Records asks and replies on the role's **Pipeline** row. |
| `/applied`, `/forge`, `/kata` | Update **Pipeline** status (and Targets counters for dream companies). |

Nothing ever submits an application. You do that.

## 1. Patrol Pulls — discovery and review

| Property | Type | Notes |
|---|---|---|
| Company | title | |
| Role | text | |
| Disposition | select: target, rep, flag, skip | Patrol's first call; you change it |
| Decided-at | select: search-term, cheap-screen, hard-screen, read | Which stage made the call |
| Reason | text | Why, plus flags like `⚠ on-site` or `COMPANY-ESCALATION` |
| Comp | text | Posted range, or "not posted" |
| Location | text | `<city> · on-site / hybrid (N days) / remote / workplace unstated` |
| JD | url | |
| JD summary | text | 1–2 sentences on what the role is |
| Company Brief | text | What they do, plus a stability read |
| Date JD opened | date | Posting date |
| Run date | date | |

**View — Evals:** all rows, grouped by Run date, showing Disposition, Company Brief, Location,
Comp and Reason.

## 2. Pipeline — roles you're pursuing

| Property | Type | Notes |
|---|---|---|
| Company | title | |
| Role | text | |
| Type | select: rep, target | The direct call: rep = real stakes, practice-first; target = you'd want to land there |
| Status | select | See below |
| Applied | date | |
| JD | url | |
| JD summary, Company Brief, Comp, Location | text | Copied from Patrol Pulls or filled by Scout |
| Date JD opened | date | |
| Stability / Culture | select: Strong, Mixed, Risky | Set on reps and targets; a Risky read is the usual reason a role stays a rep |
| Stability rationale | text | One line plus a source URL |
| Target company | relation → Targets | Only for target roles at dream-list companies |
| Notes | text | Dated lines: `<date> <what happened>` |

**Status values:**
- **Open:** `to-apply`, `waiting on referral`, `applied`, `interviewing` (any human contact),
  `offer`.
- **Closed:** `rejected`, `ghosted` (silent 30+ days after Applied; moves back to `interviewing`
  if they reply), `passed` (you never applied or pulled out).

When closing a row, set the specific status and add a dated Notes line.

**Views:**
- **Default:** open statuses.
- **🎯 Target roles:** `Type = target`, open statuses, grouped by Target company.

## 3. Targets — the dream list

Companies you'd genuinely love to work at, one row per company. A company joins only by a
deliberate signal: a yes at the end of `/scout`, or a "dream list" comment at harvest. A target
*role* doesn't put its company here by itself.

| Property | Type | Notes |
|---|---|---|
| Company | title | |
| Actionable | select: open now, watching, applied, slots used, vetoed | `vetoed` = downgraded; Notes says why, and patrol skips it |
| Careers | url | The company's careers page |
| Cooldown | text | Reapplication window, `none` if uncapped |
| Slots per window, Slots used | number | Rate-limits your shots per company |
| Window resets, Last applied | date | |
| Referral | text | Who you know there |
| Notes | text | One line on *why* it's a dream company |
| Roles | relation → Pipeline | Reciprocal of Pipeline's Target company |

## Search settings (on the hub page)

The hub page holds the settings the mission skills read, so a scheduled cloud run can see them
too:
- **Target roles and level, and dealbreakers:** copied from `my/sensei-context.md` at setup.
- **Patrol filters:** search terms, locations, posting age, cheap-screen drops, hard screens.
  Written by `/patrol`'s first-use setup and tuned by `/harvest`, with a dated reason under each
  change.
- **Calls to protect:** a small golden set of past calls you confirmed. After any filter change,
  `/harvest` checks the new filters would still make each call.

### Editing the hub page

Fetch the page before editing it, and match your edit against the text as Notion stores it. The
Notion connector stores formatting as tags: bold comes back as `<b>…</b>`, italics as `<i>…</i>`
and inline code as `<code>…</code>`, so an edit written against your own Markdown won't match.
