# Credit

This folder is an unmodified copy of the `linkedin-search` skill from
[ai-job-search](https://github.com/ai-job-search-dev/ai-job-search) by Mads Lorentzen,
taken at upstream commit
[`3bfd525`](https://github.com/ai-job-search-dev/ai-job-search/tree/3bfd525/.agents/skills/linkedin-search)
(August 2026). It is used under the MIT License, reproduced in [LICENSE](LICENSE). Upstream has
changed since, so check there for newer versions.

Shadow Dojo's Patrol skill (`prompts/patrol.md`) calls this CLI to search LinkedIn's public job
pages.

## Paths

The upstream docs (`SKILL.md`, `cli/README.md`) refer to the upstream layout,
`.agents/skills/linkedin-search/`. In this repo the same files live here, so run the CLI from
`tools/job-discovery/linkedin-search/cli`:

```bash
npx -y tsx src/cli.ts search -q "product manager" -l "San Francisco, California, United States" --jobage 7 --format json
```

`bun run src/cli.ts …` also works if you have Bun.

## Terms

Upstream's warning applies here too: **personal use only.** It uses LinkedIn's public job
pages, and automated access is against LinkedIn's Terms of Service. Keep volume low, don't use
it commercially or for bulk data collection, and run it on your own responsibility.
