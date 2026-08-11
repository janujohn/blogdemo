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
  App runs on **port 9090** on the VPS — see `CLAUDE.md` rule 13 for
  important constraints (shared box, other services + Traefik running,
  never touch anything but the blog app's own container).
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
  Use the fixed name **`blogdemo`** for the image/container, both locally
  and on the VPS (see `CLAUDE.md` rules 13-14).

## Phase 1 — Build workflow

**The full site gets built and verified locally first — nothing gets
deployed to the VPS until both build tickets are done.** Two tickets run
through the per-ticket loop below, in order: the initial build ticket
(Ticket A), then **BLOG-1** (Ticket B, "pickup BLOG-1") once the presenter
says so. Only after both are merged does a single deployment happen.

### Per-ticket loop (run once for the initial build ticket, then once for BLOG-1)

1. Fetch the ticket (Jira MCP: `getJiraIssue`). If it has attachments
   (like this file, or BLOG-1's template), fetch and read them too.
   Comment "starting work," transition status to `In Progress`.
2. Create a feature branch (off the latest `main` — for BLOG-1 this
   already includes the initial build), write the code to satisfy the
   ticket, commit (message references the ticket number, e.g.
   `BLOG-1: ...`), push to GitHub (plain `git`, credential helper handles
   auth) — **no PR yet**.
3. **PAUSE — wait for presenter go-ahead** before running `docker build`
   locally (built from the feature branch).
4. **PAUSE — wait for presenter go-ahead** before opening the app in
   Chrome (chrome-devtools-mcp) to verify the local build and create a
   sample post through the admin UI. (For the initial build ticket only:
   this is where `CLAUDE.md` rule 12's intentional bug shows up — surface
   it and wait for approval before fixing, per that rule.)
5. **PAUSE — wait for presenter go-ahead** before:
   - Raising a PR (feature branch → `main`) via `gh pr create`.
   - Waiting for the presenter to actually approve/merge the PR in
     GitHub's web UI, then say "it's done."
6. Once merged: comment on the ticket noting the merge, publish a
   Confluence page (space `BLOGDEMO`, one page per ticket) summarizing
   what was built, linking back to the ticket and the GitHub PR. Ask the
   presenter how many hours to log (**never guess**), add the worklog,
   transition the ticket to `Done`. **Do not deploy yet** — go back to
   step 1 for BLOG-1 if this was the initial build ticket; otherwise
   continue to Deployment below.

### Deployment (once, after both build tickets are merged — not per-ticket)

7. **PAUSE — wait for presenter go-ahead** before deploying. SSH into the
   VPS (key above), clone/pull `main` into `/home/deploy/blogdemo`
   (now contains both tickets' merged changes), `docker build` and run
   **on the VPS**, on port 9090 (see `CLAUDE.md` rule 13 for constraints).
8. **PAUSE — wait for presenter go-ahead** before opening the **live**
   production site (`https://johnsiraani.site` once DNS is confirmed, or
   `http://144.24.130.136:9090` as a fallback) in Chrome
   (chrome-devtools-mcp) and creating a sample post there.
9. Comment on both build tickets noting they're now live, with a link to
   the production URL.

## Phase 2 — Content update workflow

Starts only when the presenter hands you a ticket, e.g. "pickup
BLOG-3." **These only ever run against the live production site — never
against a local container.** Don't start or use a local build for this;
if nothing is running in production yet, that's a sign Phase 1 (including
deployment) isn't finished. Repeats per ticket:

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
| Confluence page published + worklog + Done | Yes | No |
| *(repeat per-ticket loop for BLOG-1)* | | |
| VPS build + deploy (once, after both tickets) | No | **Yes** |
| Live Chrome verification + sample post | No | **Yes** |
| Both tickets commented with live URL | Yes | No |
| Each content ticket edit (live site only) | Yes — comment + worklog + Done | **Yes** |
