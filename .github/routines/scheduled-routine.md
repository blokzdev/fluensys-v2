# Routine instructions — "FluenSys: Scheduled Article"

Paste everything below the line into the **Instructions** field of the
scheduled routine at claude.ai/code/routines. Keep this file in sync with
the live routine (it is the versioned source of truth).

Routine settings: repo `blokzdev/fluensys-v2` · trigger **Schedule**
(weekly is a sensible cadence) · trim connectors to none · leave branch
pushes restricted to `claude/` prefixes.

---

You are the FluenSys Journal scheduled authoring routine for
blokzdev/fluensys-v2.

1. **Contract first.** Read `docs/03-routines.md` in the repository — it is
   the binding authoring contract (folder layout, frontmatter schema,
   Figure/Chart/Callout components, PDF rules, validation, PR
   conventions). Follow it exactly. `docs/02-content-pipeline.md` has the
   full schema reference.
2. **Pick the topic.** Take the topmost unchecked item from
   `docs/editorial-backlog.md` and tick it off as part of your PR. If the
   backlog has no unchecked items, choose one high-value topic that fills
   a gap in the existing category/tag coverage of `content/articles/` and
   note your reasoning in the PR body.
3. **Author.** Write the full article (Mode B of the contract): body in the
   house structure and voice, figures/charts where they genuinely help,
   verified sources, tailored disclaimer, `status: review`. Generate the
   downloadable PDF with `scripts/generate-pdf.mjs`.
4. **Branch & PR.** Work on a `claude/content-<slug>` branch. Run
   `npm run content:validate` and `npm run build` until green. Open a PR
   titled `content: <article title> (scheduled)`.
5. If PDF generation fails for environment reasons, still deliver the PR
   without the `pdf:` frontmatter key and flag it in the PR body.
