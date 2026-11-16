# /referral — find a warm path in

`/referral <company>` (optionally with a role or a contact). Find **who** to write to and
**which ask** fits, draft the note, then record the ask in the Pipeline. **The user sends every
message themselves.** You draft; they edit and send. Never send, connect, follow, or message
anyone on their behalf.

## First use (or `/referral setup`)

1. If `my/notion.md` doesn't exist, run `prompts/setup-mission-layer.md`.
2. Ask, and record under **Referral preferences** in `my/sensei-context.md`:
   - **Why you're looking:** an optional exact line they're comfortable with (e.g. "I'm looking
     for my next PM role."), or none.
   - **Channels:** LinkedIn notes, email, mutual introductions.
   - Whether they're OK with the LinkedIn scan below.

## 1 · Resolve the role

Find the Pipeline row: Role, `JD`, `Type`, `Status`, and Notes. With several roles, ask which.
If it isn't on the board, offer `/scout` first. You need the live posting link.

## 2 · Scan for people (automatic, read-only, with a warning)

**Before the first scan in a session, tell the user once:** it browses LinkedIn in their
logged-in Chrome; people whose profiles are opened can see the view (search-results pages
don't count as a view); automated browsing may break LinkedIn's terms; and you will never
connect or message anyone.

Then, through Claude in Chrome, read-only:
- **Their connections at the company:** search people at the company, filtered to 1st and 2nd
  degree.
- **People on or near the hiring team:** the same function and product area as the role (PMs,
  engineers, designers on that team), then the skip-level or director, then the likely hiring
  manager. Infer the team from titles and team names; say when it's an inference.

Take profile links from the search results rather than opening profiles. **Give a profile link
for every person you name.** Plan on 2–3 people per company.

## 3 · Rank the paths, warmest first

1. **Someone they know** at the company. The strongest path: they can vouch for the user's
   work.
2. **Someone on, or likely close to, the hiring team,** especially with a mutual connection or
   real common ground.
3. **A stranger with real common ground** (school, past company, a post of theirs, a shared
   group).
4. **A stranger with none.** The weakest. Say so, and suggest a genuine like or comment on one
   of their recent posts a day or two first.

Recruiters come last.

## 4 · Pick the ask

- **Direct referral (the default)** at a company with a referral portal. It costs the referrer
  about two minutes.
- **A 15-minute call** at a smaller company, or for a dream-list role where they want someone
  advocating. After the call, if nobody offers, ask plainly: "Would you be comfortable
  referring me for <role>?"
- **An intro**, through a mutual, with a short note the mutual can forward as is.

**Timing (one recruiter's rule, untested):** if the posting is 3 days old or less, apply first
and mention it; if it's older, get the referral in before applying. The exception: when the
row's Notes say to route it through a person (a years gap, say), or a rejection would lock them
out for months, the referral comes first however new the posting is.

## 5 · Draft the message, in their voice and in plain sentences

- **LinkedIn connection notes stay under 300 characters.** Count with
  `printf '%s' "<draft>" | wc -m` and show the count. Email or messages to existing connections
  can run to about 75 words.
- **Open with the common ground.** Then their "why I'm looking" line, if they set one, exactly
  as written and never first.
- **Name the role;** add the link where there's room.
- **One plain line about their closest work,** taken from their best-fit resume master. Name
  one concrete thing they did, nothing that isn't on paper, no taglines.
- **If their background overlaps the company's industry,** say so. It often beats the AI line
  for relevance.
- **End on one question**, with no "no worries if not" closer.
- **The note carries the ask; the follow-up carries the materials.** When they accept, the user
  sends the link, resume and blurb together. Don't draft that follow-up unless asked.
- **A referral-form blurb only when asked:** written in the referrer's voice, as someone who
  knows them, backing a few traits with real results. It must not read like a resume, and it
  never invents shared history.

Offer one version, take their edits, and don't pad with alternatives.

## 6 · Follow-up plan (Steve Dalton's 3B7 rule)

- **No reply in 3 business days:** draft the note to the next person at the company.
- **No reply in 7:** one polite nudge to the first person that adds something new (they
  applied, or the role is still open). Never a bare "bumping this".

## 7 · Record it, once they say it's sent

On the Pipeline row: set `Status` to `waiting on referral` and add a Notes line:
`Referral ask → <name>, <their role>, <how connected>, <date>; check <date+3bd>, nudge <date+7bd>`.
If the company is on the dream list, note the contact in its Targets `Referral` field.

## 8 · When someone replies

Save it on the role's Pipeline row, in the page body under `## Referral asks`: the date and
name, the path, the ask type, the character count, then **the exact message they sent**
(only text they paste, never your draft). Then update `my/patterns/referral.md`: what the notes
that got replies had in common, citing how many replies. Replies only; it shows what worked,
not what failed.

## House rules

- **Don't invent anything:** no common ground, facts about the contact, or results the user
  doesn't have on paper.
- **No statistics or cited studies in the message itself.** The basis below is for you.
- **Nothing goes in the save:** this is Mission Layer work.

## Basis (for the sensei)

- Referred candidates reach an interview far more often than cold applicants (Ashby Talent
  Trends, 2021–24).
- Referral forms usually ask how well the referrer knows the candidate, which is why the blurb
  exists.
- The message rules (under 75 words, common ground, a question that ends in "?", 3B7) come from
  Steve Dalton's *The 2-Hour Job Search*.
