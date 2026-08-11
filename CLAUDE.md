# Working Rules for This Project

These rules apply to all work in this repository. Follow them strictly.

1. **Ask one question at a time.** Never present a batch or numbered list of
   questions. Ask the single most important/blocking question, wait for the
   answer, then ask the next one if still needed.

2. **Challenge ideas — don't accept them blindly.** When a plan or approach
   is proposed (by the user or by Claude itself), actively look for
   weaknesses, risks, or better alternatives and raise them. Discuss and
   jointly decide rather than silently agreeing and executing.

3. **Never silently change course.** If an approach isn't working as
   expected, do not improvise or switch to an alternate solution on your
   own. Stop and ask the user to confirm before changing direction.

4. **Never perform a destructive action without explicit approval.** This
   is a hard requirement in this project, not just a fallback default.

5. **Never use claude-in-chrome for browser automation.** Always use
   chrome-devtools-mcp instead. This applies everywhere in this project,
   including quick ad-hoc previews — not just the live demo flow.

6. **Every git commit must reference its Jira ticket number**, e.g.
   `BLOG-1: add post view page`. No commits without a ticket reference.

7. **Once a ticket's implementation is built, create a Confluence page
   documenting it before closing the ticket.** This applies to every
   ticket that involves writing code (initial build, feature tickets like
   BLOG-1), not just the original sample ticket.

8. **MCP setup.** At the start of a session in this repo, check whether
   the **Atlassian MCP** and **chrome-devtools-mcp** servers are already
   connected (e.g. via available tools). If not, guide the user through
   connecting them:
   - Atlassian: `claude mcp add --transport sse atlassian https://mcp.atlassian.com/v1/mcp -s user`
     (use the `/v1/mcp` Streamable HTTP endpoint, not `/v1/sse` — the SSE
     endpoint is deprecated).
   - chrome-devtools-mcp: `claude mcp add chrome-devtools -s user -- npx chrome-devtools-mcp@latest`
   - Either requires a Claude Code restart to take effect — tell the user
     to restart and resume this session if you just added one.
   - Wait for the user to authenticate with Atlassian (`/mcp`, OAuth in
     browser) before doing anything that needs Jira/Confluence access.

9. **Find your build spec from the Jira ticket.** The detailed
   requirements for what to build live as a `specs.md` attachment on a
   Jira ticket (project `BLOG`) — not as a local file in this repo. If you
   don't already know the ticket number, **ask the user for it** — do not
   assume or guess one. Once you have it, fetch the ticket and its
   attachment before starting work.

10. **Jira attachments — no MCP tool, use REST API + token.** The
    Atlassian MCP toolset has **no tool for uploading or downloading Jira
    attachments** — this includes `specs.md` itself, so you need this
    method before you can even read your build spec. To download an
    attachment:
    1. Call `getJiraIssue` with `fields: ["attachment"]` to get each
       attachment's `content` URL, e.g.
       `https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3/attachment/content/{id}`.
    2. Download it with a Jira-scoped Atlassian API token (Bearer auth):
       `curl -s -L -H "Authorization: Bearer $(cat token)" -o <local-path> "<content URL>"`
       (if Bearer auth fails, fall back to Basic auth:
       `-u "<email>:$(cat token)"`).
    3. The token lives at `blog_demo/token` — already `.gitignore`d, don't
       remove that entry.
    There's no equivalent automated upload path — attaching a file to a
    ticket still has to be done manually via the Jira web UI.

11. **Never run Node.js (or any app runtime) directly on the local
    machine.** Always build and run the application via Docker, even
    during local development/iteration — no bare `npm install`,
    `npm start`, `node ...` outside a container. Docker is available
    locally; use it for every build and run step, local or on the VPS.

12. **Plant one intentional, visible bug in the initial build only**
    (the first ticket — not BLOG-1, not content tickets, just the very
    first build). Requirements for the bug:
    - Must NOT break `docker build` or `docker run` — the container has
      to actually start and the app has to load.
    - Must produce a clear, visible problem the *first* time the app is
      opened in Chrome — a console error, a broken section of the page,
      or a failed network request. Something an audience can actually
      see, not a subtle edge case.
    - Keep it small and explainable (e.g. a typo in a variable/selector,
      a wrong API path, an off-by-one) — not something that looks like
      sloppy work.
    Do not pre-emptively fix it during code review or before that first
    Chrome open — it needs to actually be visibly broken at that pause
    point (step 4 in `specs.md`'s Phase 1 workflow). Once it's been seen
    (check console messages and the rendered page via chrome-devtools-mcp):
    - **Stop and tell the presenter there's a bug** — describe what's
      broken — **and wait for explicit go-ahead before fixing it.** Do
      not skip this step or fix it silently.
    - Upon approval: diagnose and fix it, then automatically reload the
      page in Chrome to show the fix working — no separate go-ahead
      needed for the fix-and-reload itself once approved. This showcases
      live debugging.

13. **The production VPS is a shared box, not a dedicated one — treat it
    with extreme care.** Other services are already running on it,
    including a **Traefik** reverse proxy.
    - The blog app runs on **port 9090** on the VPS, directly, standalone
      — nothing else.
    - **Never stop, restart, modify, or otherwise touch any container or
      service on the VPS other than the blog demo's own container.**
      Read-only checks (`docker ps`, `docker inspect`, etc.) are fine for
      awareness; never act on anything you find there beyond that.
    - **Never register or deploy the blog app through Traefik** — no
      Traefik labels, no reverse-proxy config changes, no touching
      Traefik's config at all. Bind the container directly to port 9090
      and stop there.
    - Always use the fixed name **`blogdemo`** for this app's Docker
      image and container, both locally and on the VPS — this makes
      cleanup (rule 14) and the "never touch other services" rule above
      unambiguous.

14. **Demo cleanup — only when the user explicitly asks** (e.g. "cleanup
    the demo," "reset for another demo run"). Never do this proactively or
    as a side effect of anything else — it's destructive. Jira, Confluence,
    and GitHub cleanup is handled manually by the user; don't touch those.
    When asked, do exactly this:
    - **Local `blog_demo` directory:** remove all generated application
      files — app code, `.git`, `Dockerfile`, `package.json`,
      `node_modules`, `.gitignore`, any build artifacts. Leave `CLAUDE.md`
      and credential files (e.g. `token`) untouched unless told to remove
      those too.
    - **Local Docker:** stop and remove the local `blogdemo` container and
      image.
    - **VPS Docker:** SSH in, stop and remove the `blogdemo` container and
      image, and clear out `/home/deploy/blogdemo`. This is a shared
      production box (rule 13) — only ever touch things named `blogdemo`,
      never anything else, even during cleanup.
