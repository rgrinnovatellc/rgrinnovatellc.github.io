# CMS Editing Setup

This site is public GitHub Pages output, so the editing layer must not depend on
secrets committed to this repository. The committed pieces are safe to publish:

- `admin/index.html` loads a version-pinned Decap CMS script with subresource
  integrity.
- `admin/config.yml` describes public repository, branch, content collections,
  media folder, and editorial workflow.
- `_includes/cms-editor-toolbar.html` adds a persistent **Edit this page** button
  that links from a live page to the matching CMS entry.

## What Is Editable

- Top-level pages in `_pages/`.
- Blog post wrappers in `_posts/`.
- Blog article HTML files in `_includes/blogs_html/`.
- Uploaded media in `images/uploads/`.

Structured YAML data in `_data/`, BibTeX in `assets/ref.bib`, PDFs, and CV files
remain normal repository edits for now. Those can be modeled later, but several
current `_data/*.yml` files are top-level YAML lists, which should not be forced
into a CMS shape without refactoring the templates at the same time.

The blog article HTML collection uses HTML-comment front matter if the CMS ever
needs to persist metadata, so that metadata will not appear visibly when Jekyll
includes the file in a post.

## Authentication Choices

The current CMS backend is:

```yaml
backend:
  name: github
  repo: rgrinnovatellc/rgrinnovatellc.github.io
  branch: master
```

That keeps GitHub as the source of truth:

- Users with write access to the repository can edit through the CMS workflow.
- Users without write access cannot publish from the CMS.
- This intentionally avoids Decap's open authoring/fork flow, because fork-based
  editing can fail or add friction for a site that is meant to be edited only by
  trusted collaborators.

GitHub OAuth still needs a server-side helper. Do one of these before expecting
production login to work:

1. **Use Netlify Identity/Git Gateway** if you are willing to connect the repo to
   Netlify for auth. In that case, switch the backend to `git-gateway` and keep
   secrets in the Netlify dashboard.
2. **Use a small OAuth proxy** while keeping the site on GitHub Pages. Decap's
   docs list external OAuth clients, including Cloudflare Worker options. The
   GitHub OAuth client secret belongs in that proxy's secret store, not in this
   repo. After the proxy is live, set only its public URL in `admin/config.yml`:

```yaml
backend:
  name: github
  repo: rgrinnovatellc/rgrinnovatellc.github.io
  branch: master
  base_url: https://cms-auth.example.com
  auth_endpoint: auth
```

## GitHub OAuth App

If using an OAuth proxy:

1. Create a GitHub OAuth App.
2. Set the callback URL to the proxy callback endpoint, usually
   `https://cms-auth.example.com/callback`.
3. Store the GitHub OAuth client secret only in the proxy platform's secret
   manager.
4. Add trusted editors as repository collaborators if they should publish
   directly.
5. Keep branch protection enabled if you want every CMS edit reviewed before it
   reaches `master`.

If Decap says it needs to fork the repository, check `admin/config.yml` and make
sure `open_authoring: true` is not enabled. Direct editor accounts should be
added to the GitHub repository or an organization team with write access.

## Public Toolbar

The toolbar is intentionally public navigation, not a security boundary.
Anyone can click it, but saving still requires GitHub OAuth and repository
permissions.

- **Edit this page** appears automatically on editable pages in local and
  production builds.
- `/admin/` includes a small recovery bar with **Site** and **Reset login**.
  Reset login clears stale Decap/Netlify CMS auth state from browser storage
  and reloads the CMS.

Visible editing actions:

- **Edit this page** opens the current `_pages/*` entry.
- On blog article pages, **Edit this page** opens the included article HTML file.

The Decap dashboard at `/admin/`, post wrapper settings, and raw GitHub source
links are internal maintenance tools. They are intentionally not shown in the
live-site editing toolbar.

## Local Testing

Build the static site:

```bash
make build
```

Serve locally:

```bash
make serve
```

Decap always writes to the configured GitHub repository unless you run a local
Decap backend proxy. `local_backend` is intentionally disabled in
`admin/config.yml` because this site is expected to use GitHub auth even during
local testing. Enable it only when you intentionally run a local Decap proxy.
