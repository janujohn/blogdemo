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
