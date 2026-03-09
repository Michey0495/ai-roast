# Changelog

## 2026-03-10
### Security
- Patched 3 high-severity vulnerabilities via `npm audit fix`
  - express-rate-limit: IPv4-mapped IPv6 address bypass (GHSA-46wh-pxpv-q5gq)
  - hono: Cookie attribute injection (GHSA-5pq2-9x2x-5p6w)
  - hono: SSE control field injection (GHSA-p6xx-57qc-3wxr)

### Maintenance
- Verified build, TypeScript, and AI public files (robots.txt, llms.txt, agent.json)
- No open GitHub issues
- Redeployed to production
