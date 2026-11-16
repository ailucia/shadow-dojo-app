# Mission Layer setup

Runs from `/initiate`, or the first time any mission skill runs and `my/notion.md` doesn't
exist. It creates the user's job-search workspace in Notion from `docs/mission-layer.md`.

1. **Check the Notion connector** with one read-only call (e.g. a search). If it fails, explain
   how to connect Notion in their agent and stop. Missions need it; training doesn't.
2. **Ask where to put it:** a parent page they choose, or a new top-level page.
3. **Create the hub page "Shadow Dojo"** with two sections:
   - **Databases:** links to the three databases below, filled in after step 4.
   - **Search settings:** target roles and level, dealbreakers (copied from
     `my/sensei-context.md`), and two empty subsections, *Patrol filters* and *Calls to
     protect*. These live in Notion so a scheduled cloud patrol can read them.
4. **Create the three databases** under the hub, exactly as specified in
   `docs/mission-layer.md`: **Patrol Pulls**, **Pipeline**, and **Targets** (the dream list),
   with their properties, select options, the Pipeline ↔ Targets relation, and the views.
5. **Save the links** to `my/notion.md`:

   ```markdown
   # Notion — Mission Layer
   - Hub page: <url>
   - Patrol Pulls: database <id> · data source <id>
   - Pipeline: database <id> · data source <id>
   - Targets (dream list): database <id> · data source <id>
   ```

6. **Confirm** with one read-only query of Pipeline, then tell the user what was created and
   where.

Never delete or restructure an existing database the user already has. If they want to reuse
one, map its properties to the schema and record the mapping in `my/notion.md`.
