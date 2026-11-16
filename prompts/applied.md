# /applied — log an application

The user just submitted an application. Record it in the **Pipeline** (Notion) fast. Nothing
goes in the save.

**First use:** if `my/notion.md` doesn't exist, run `prompts/setup-mission-layer.md` first.

1. **Find the row** by Company (and Role, if given).
   - **No match:** don't silently create a bare row. Offer a minimal row (Company, Role, Type,
     `Status: applied`), or a `/scout` first if it deserves a real call.
   - **Several roles:** ask which one.
2. **Stamp it:**
   - `Status: applied`.
   - `Applied` = today's real date.
   - Append a dated Notes line with the next step (e.g. referral or follow-up).
3. **Dream-list company** (the row has a `Target company`): on its Targets row, add 1 to
   `Slots used`, set `Last applied` to today, and set `Actionable` to `slots used` if that was
   the last slot in the window, else `applied`. If `Slots per window` is empty, set `applied`
   and don't guess a limit.
4. **Report** one line: what you set, and the next action.
