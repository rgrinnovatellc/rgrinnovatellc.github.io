# Uddhav P. Gautam Website

Personal academic and technical website source for `https://rgrinnovatellc.github.io`, built with Jekyll.

## Overview

This repository powers a publication-focused personal website with:

- Research and publication pages.
- Technical blog posts.
- Team and profile sections driven by YAML data files.
- CV hosting via `cv/`.
- Static deployment to GitHub Pages.

The site uses Jekyll `4.3.3`, Jekyll Scholar for bibliography rendering, and Sass for styling.

## Tech Stack

- Ruby + Bundler
- Jekyll `4.3.3`
- Jekyll Scholar
- Kramdown (GFM parser)
- Sass (`assets/main.scss` + `_sass/` partials)

## Prerequisites

Install:

- Ruby (version compatible with Jekyll `4.3.3`)
- Bundler

Then install gems:

```bash
bundle install
```

## Local Development

Build once:

```bash
bundle exec jekyll build
```

Run a local preview server:

```bash
bundle exec rake serve
```

Why `rake serve` is preferred:

- It starts from port `4000`.
- If `4000` is busy, it automatically finds the next available local port.
- It runs with `JEKYLL_ENV=development`.

Open the URL printed in the terminal (usually `http://127.0.0.1:4000`).

Alternative direct serve command:

```bash
bundle exec jekyll serve --trace --host 127.0.0.1 --port 4001
```

## Common Commands

- Install dependencies: `bundle install`
- Build site: `bundle exec jekyll build`
- Serve with auto-port: `bundle exec rake serve`
- Serve on a fixed port: `bundle exec jekyll serve --trace --port 4001`

## Repository Layout

- `_config.yml`: Site metadata, navigation, plugin, markdown, and scholar configuration.
- `_pages/`: Top-level pages (`about`, `publications`, `blogs`, `team`, etc.).
- `_posts/`: Blog posts (`YYYY-MM-DD-title.md`).
- `_layouts/`: Page and content templates.
- `_includes/`: Reusable snippets (header, footer, analytics, utility includes).
- `_data/`: Structured YAML content (awards, people, grants, events, news, manuscripts).
- `_sass/`: Sass partials (`_theme.scss`, `_components.scss`, `_pages.scss`).
- `assets/`: Static assets, compiled styles entrypoint, bibliography files.
- `images/`: Image assets.
- `cv/`: CV and related documents.
- `_site/`: Generated output (build artifact; not source of truth).

## Content Editing Guide

### Pages

- Add or edit site pages in `_pages/`.
- Prefer `.html` for pages that contain Liquid templates, sections, or custom HTML structure.
- Use `.md` only for markdown-first content.

### Blog Posts

- Add posts in `_posts/` using this filename format:

```text
YYYY-MM-DD-your-post-title.md
```

- Include front matter at the top of each post (for example: `layout`, `title`, `date`, `categories`, `tags`).

### Data-Driven Sections

- Edit YAML files in `_data/` for structured sections such as:
	- People and team
	- News
	- Awards
	- Grants
	- Events

Changes in `_data/` are rendered by templates in `_layouts/` and `_includes/`.

### Publications

- Bibliography is managed with Jekyll Scholar.
- Main settings are in `_config.yml` under `scholar:`.
- Bibliography source is `assets/ref.bib`.
- Rendering template is `_layouts/bibtemplate.html`.

## Configuration Notes

- Core site identity and contact metadata: `_config.yml`
- Additional structured site metadata: `_data/site.yml`
- Navigation links are controlled in `_config.yml` under `nav_pages`.

## Deployment

This repository is configured for GitHub Pages-style static hosting.

Important for this repository:

- This site depends on `jekyll-scholar` and custom gems from `Gemfile`.
- In GitHub repository settings, set Pages Source to `GitHub Actions`.
- Do not use `Deploy from a branch` for this repo, because that path runs the restricted `actions/jekyll-build-pages` environment (`github-pages` gem / Jekyll 3.10) and does not support `jekyll-scholar` tags.

Typical deployment flow:

1. Commit and push source changes to the configured branch.
2. Let GitHub Pages (or your CI pipeline) build and publish the site.

Notes:

- `_site/` is the generated output directory.
- The `Rakefile` includes a `publish` task inherited from an old template remote; do not rely on that task unless you intentionally reconfigure its git remote.

If CI fails with a message like `Liquid syntax error: Unknown tag 'bibliography'`:

1. Open `Settings -> Pages` in GitHub.
2. Under `Build and deployment`, set `Source` to `GitHub Actions`.
3. Re-run the failed workflow or push a new commit.

## Troubleshooting

- Port already in use:
	- Use `bundle exec rake serve` to auto-select an available port.

- Liquid/HTML rendered as plain text:
	- Move the page from `.md` to `.html` if it contains significant raw HTML/Liquid.

- Build fails after gem changes:
	- Run `bundle install` again.
	- Re-run `bundle exec jekyll build` to verify.

## License

See `LICENSE`.