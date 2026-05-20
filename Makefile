SHELL := /bin/bash

BUNDLE_EXEC ?= bundle exec
ACT ?= act
ACT_ARTIFACT_DIR ?= .act-artifacts
TEX_ENGINE ?= pdflatex
BASEURL ?=
JEKYLL_CONFIG ?= _config.yml

LINK_WORKFLOW := .github/workflows/link-check.yml
PAGES_WORKFLOW := .github/workflows/jekyll.yml
PAGES_REPOS ?= rgrinnovatellc/rgrinnovatellc.github.io uddhavpgautam/uddhavpgautam.github.io

CV_TEX ?= cv/Resume_UddhavGautam.tex
CV_DIR := $(dir $(CV_TEX))
CV_FILE := $(notdir $(CV_TEX))
CV_BASE := $(basename $(CV_FILE))
CV_PDF := $(CV_DIR)$(CV_BASE).pdf
CV_PDF_AUX := "$(CV_DIR)$(CV_BASE).aux" "$(CV_DIR)$(CV_BASE).log" "$(CV_DIR)$(CV_BASE).out" "$(CV_DIR)$(CV_BASE).toc" "$(CV_DIR)$(CV_BASE).fls" "$(CV_DIR)$(CV_BASE).fdb_latexmk"

JEKYLL_BUILD_ARGS :=
ifneq ($(strip $(JEKYLL_CONFIG)),)
JEKYLL_BUILD_ARGS += --config "$(JEKYLL_CONFIG)"
endif
ifneq ($(strip $(BASEURL)),)
JEKYLL_BUILD_ARGS += --baseurl "$(BASEURL)"
endif

ifeq ($(strip $(MAKECMDGOALS)),)
$(error Use an explicit target (for example: make help, make serve, make build, make cv-pdf, make ci-local))
endif

.PHONY: help install serve build clean cv-pdf cv-pdf-clean check-links check-pages-build check-pages-config ci-local

help:
	@echo "Available targets:"
	@echo "  make install            - Install Ruby gems from Gemfile"
	@echo "  make serve              - Run Jekyll server (via rake, auto-picks a free port)"
	@echo "  make build              - Pristine Jekyll build (clean + build)"
	@echo "  make clean              - Clean Jekyll build output"
	@echo "  make cv-pdf             - Pristine CV PDF build (fresh compile; keeps only .pdf + .tex)"
	@echo "  make cv-pdf-clean       - Remove CV generated files (.pdf and LaTeX intermediates)"
	@echo "  make check-links        - Run .github/workflows/link-check.yml locally with act"
	@echo "  make check-pages-build  - Run Pages build job locally with act"
	@echo "  make check-pages-config - Verify both GitHub Pages repos use Actions deployment"
	@echo "  make ci-local           - Run local CI checks (build + cv-pdf + check-links + pages build)"

install:
	bundle install

serve:
	$(BUNDLE_EXEC) rake serve

build:
	$(BUNDLE_EXEC) jekyll clean
	$(BUNDLE_EXEC) jekyll build $(JEKYLL_BUILD_ARGS)

clean:
	$(BUNDLE_EXEC) jekyll clean

cv-pdf:
	@command -v $(TEX_ENGINE) >/dev/null || (echo "Missing $(TEX_ENGINE). Install TeX Live (e.g., texlive-latex-extra)." && exit 1)
	rm -f "$(CV_PDF)" $(CV_PDF_AUX)
	cd "$(CV_DIR)" && $(TEX_ENGINE) -interaction=nonstopmode -halt-on-error "$(CV_FILE)"
	cd "$(CV_DIR)" && $(TEX_ENGINE) -interaction=nonstopmode -halt-on-error "$(CV_FILE)"
	rm -f $(CV_PDF_AUX)

cv-pdf-clean:
	rm -f "$(CV_PDF)" $(CV_PDF_AUX)

check-links:
	@command -v $(ACT) >/dev/null || (echo "Missing act. Install it first: https://github.com/nektos/act" && exit 1)
	$(ACT) -W $(LINK_WORKFLOW) -j links

check-pages-build:
	@command -v $(ACT) >/dev/null || (echo "Missing act. Install it first: https://github.com/nektos/act" && exit 1)
	mkdir -p "$(ACT_ARTIFACT_DIR)"
	$(ACT) -W $(PAGES_WORKFLOW) -j build --artifact-server-path "$(ACT_ARTIFACT_DIR)"

check-pages-config:
	@command -v gh >/dev/null || (echo "Missing gh. Install GitHub CLI first." && exit 1)
	@failed=0; \
	for repo in $(PAGES_REPOS); do \
		build_type=$$(gh api "repos/$$repo/pages" --jq '.build_type' 2>/dev/null || true); \
		if [[ -z "$$build_type" ]]; then \
			echo "$$repo: unable to read Pages settings"; \
			failed=1; \
		elif [[ "$$build_type" != "workflow" ]]; then \
			echo "$$repo: build_type=$$build_type (expected workflow)"; \
			failed=1; \
		else \
			echo "$$repo: build_type=workflow"; \
		fi; \
	done; \
	exit $$failed

ci-local: build cv-pdf check-links check-pages-build
