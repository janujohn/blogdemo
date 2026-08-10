# Blog Build — Specs

Attached to this Jira ticket as the detailed build specification. General
working rules and MCP setup are already covered by this repo's
`CLAUDE.md` — this file covers what to build and how the demo workflow
runs.

## What this demo shows

You act as a full-cycle developer driven entirely by Jira tickets: read a
ticket, write code, push it to GitHub, get it reviewed via PR, deploy it
to a live VPS, document it in Confluence, log time, and close the ticket.
Then you handle ongoing content-edit tickets against the live site using a
real browser.

**Demo-specific pacing rule, on top of `CLAUDE.md`'s ground rules: pause
and wait for the presenter's explicit go-ahead before any audience-visible
action** — opening Chrome, running a build, deploying, etc. See the PAUSE
markers below. This is deliberate pacing for a live audience, not
indecision.

## Config reference

- `JIRA_PROJECT_KEY` = `BLOG`
- `CONFLUENCE_SPACE_KEY` = `BLOGDEMO`
- `GITHUB_REPO` = `janujohn/blogdemo` (empty repo, no default branch yet —
  will become `main` on first push)
  - `gh` CLI is already authenticated (`gh auth login`, account
    `janujohn`, `repo` scope) — git push/pull over HTTPS just works via
    its credential helper, no manual token handling needed.
  - `gh` may not be in PATH this session — if `gh: command not found`,
    call it via full path: `"C:\Program Files\GitHub CLI\gh.exe"`.
  - Use `gh pr create`, `gh pr view`, etc. for PR operations — not raw
    REST API calls.
- `VPS_HOST` = `144.24.130.136`, SSH user `deploy`, deploy path on VPS:
  `/home/deploy/blogdemo`. Docker and git already installed on the VPS.
- `PRODUCTION_DOMAIN` = `johnsiraani.site` (DNS confirmed resolving to
  `144.24.130.136` as of prep; do a quick sanity check on demo day since
  DNS/TTL could theoretically drift)
- Pre-staged ticket **BLOG-1** — "Beautify blog post view page" — has an
  HTML/CSS reference template attached. Picked up later in Phase 1 (see
  below), not part of the initial build ticket.

## Credentials (already provisioned — do not generate new ones)

- **GitHub:** no token file — auth is handled by `gh auth login` (already
  done). Don't try to construct a manual token/URL for git push; it's
  unnecessary.
- **VPS deploy SSH key:** `c:\projects\todo-app\blogdemo_deploy`
  (private, no passphrase) / `c:\projects\todo-app\blogdemo_deploy.pub`
  - Connect as `ssh -i c:\projects\todo-app\blogdemo_deploy deploy@144.24.130.136`
  - VPS deploy path: `/home/deploy/blogdemo`
- This key file lives outside this repo's working tree — never copy it
  into `blog_demo` or commit it anywhere.

## Tech stack requirements

- **Put all application code inside a `src/` directory** in this repo, not
  at the repo root. Root stays for repo-level files (Dockerfile, README,
  package.json, etc. as appropriate).
- Node.js backend, SQLite for storage (posts are DB rows, not files).
- **A real admin UI is required** — "new post" / "edit post" screens —
  because content is created and edited by driving a browser
  (chrome-devtools-mcp) against the running app, not by touching the
  database or files directly. **No login/auth required** — keep the admin
  pages simple and directly accessible, no user accounts or session
  handling needed for this demo.
- Containerized with Docker (same image/Dockerfile for local run and VPS).

## Phase 1 — Build workflow

Runs once for the initial build ticket (Ticket A), then again for
**BLOG-1** (Ticket B, "pickup BLOG-1") once the presenter says so. Same
pipeline both times, each on its own feature branch, each with its own
Confluence page.

1. Fetch the ticket (Jira MCP: `getJiraIssue`). If it has attachments
   (like this file, or BLOG-1's template), fetch and read them too.
   Comment "starting work," transition status to `In Progress`.
2. Create a feature branch, write the code to satisfy the ticket, commit
   (message references the ticket number, e.g. `BLOG-1: ...`), push to
   GitHub (plain `git`, credential helper handles auth) — **no PR yet**.
3. **PAUSE — wait for presenter go-ahead** before running `docker build`
   locally (built from the feature branch).
4. **PAUSE — wait for presenter go-ahead** before opening the app in
   Chrome (chrome-devtools-mcp) to verify the local build and create a
   sample post through the admin UI.
5. **PAUSE — wait for presenter go-ahead** ("ready to deploy?") before:
   - Raising a PR (feature branch → `main`) via `gh pr create`.
   - Waiting for the presenter to actually approve/merge the PR in
     GitHub's web UI, then say "it's done."
6. Once merged: SSH into the VPS (key above), clone/pull `main` into
   `/home/deploy/blogdemo`, `docker build` and run **on the VPS**.
7. **PAUSE — wait for presenter go-ahead** before opening the **live**
   production site (`https://johnsiraani.site` once DNS is confirmed, or
   `http://144.24.130.136` as a fallback) in Chrome (chrome-devtools-mcp)
   and creating a sample post there.
8. Throughout: post Jira comments at significant milestones (PR raised, PR
   merged, deployed — the deploy comment includes a link to the live
   production URL) and publish a Confluence page (space `BLOGDEMO`, one
   page per ticket) summarizing what was built, linking back to the ticket
   and the GitHub PR.
9. Ask the presenter how many hours to log; add a Jira worklog entry with
   that value. **Never guess the hours.**
10. Final summary comment on the ticket; transition status to `Done`.

## Phase 2 — Content update workflow

Starts only when the presenter hands you a ticket, e.g. "pickup
BLOG-3." Repeats per ticket:

1. Fetch the ticket (Jira MCP). Read the **Instructions** section — a
   heading within the ticket description itself (not a custom field) —
   containing editorial guardrails (e.g. "check spelling," "no offensive
   content"). Follow them.
2. **PAUSE — wait for presenter go-ahead** before opening Chrome
   (chrome-devtools-mcp) against the **live** production site.
3. Make the content edit via the admin UI, following the Instructions
   section.
4. Comment on the ticket summarizing the change; ask the presenter how
   many hours to log; add the worklog; transition the ticket to `Done`.

## Checkpoint recap

| Checkpoint | Jira update? | Pause before it? |
|---|---|---|
| Ticket picked up | Yes — status → In Progress | No |
| Code pushed to feature branch | No | No |
| Local docker build | No | **Yes** |
| Local Chrome verification + sample post | No | **Yes** |
| PR raised / merge requested | Yes — comment | **Yes** |
| PR merged, confirmed by presenter | — | (presenter-driven) |
| VPS build + deploy | Yes — comment w/ live URL | No (right after merge) |
| Live Chrome verification + sample post | No | **Yes** |
| Confluence page published | Yes — comment w/ link | No |
| Work hours logged | Yes — worklog | No |
| Ticket closed | Yes — final comment + Done | No |
| Each content ticket edit | Yes — comment + worklog + Done | **Yes** |
