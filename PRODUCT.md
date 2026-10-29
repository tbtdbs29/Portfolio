# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: the tech network (developers, engineers, tech leads, hiring engineers) who land on the portfolio from LinkedIn or a shared link and want to understand, in a minute, who Thibault is, what he builds, and whether his work is credible. Secondary: anyone browsing his photography.

## Product Purpose

Personal portfolio of Thibault (Gaëtan) Dubois, software developer. It presents his professional work, personal projects, photography and the person behind the code. Success: a peer leaves with a clear picture of his current role, his flagship project, and a way to contact him.

## Positioning

A young developer who already ships AI in production inside a large enterprise: for about a year he has been building a multi-agent chatbot at Alcatel-Lucent Enterprise (for OmniVista Network Advisor). The portfolio itself carries a working AI assistant that answers questions about him.

## Operating Context

- Visitors arrive mostly from LinkedIn (profile: https://www.linkedin.com/in/thibault-dubois-6bb36a25a/), on desktop and mobile.
- The LinkedIn banner and profile copy are produced alongside this redesign and must tell the same story as the site.

## Capabilities and Constraints

- Static HTML/CSS/JS deployed on Vercel; `api/index.js` (Express, OpenAI `gpt-4o-mini`) serves `/api/chat` (assistant) and `/api/photos/:category` (gallery listing for `assets/voyage`, `assets/evt`).
- The assistant is kept, reworked: its knowledge base (system prompt) must reflect the current situation.
- French is the primary language; an English toggle exists today (FR/EN i18n in `classic/index.html`).
- Professional ALE projects are confidential: no source links, no internal details beyond what is already public on the site.
- Removed by request: the BUT competency framework (Réaliser, Optimiser…) and its "preuves" modals.

## Brand Commitments

- Name: Thibault Dubois (also "Thibault (Gaëtan) Dubois" on LinkedIn).
- Current title: Développeur logiciel, en intérim chez Alcatel-Lucent Enterprise, Brest, in the Artificial Intelligence team. No longer a student or apprentice.
- Education: BUT Informatique, IUT de Lannion — obtained. No engineering school planned (the old ISEN ambition is dropped).
- Visual direction pinned by the user: Apple-like — minimal, refined, premium, at the level of the best product sites. The previous dark "creative developer" look (noise overlay, custom cursor, uppercase Space Grotesk) is an anti-reference.
- Standing preference (2026-10-29): the Apple canon played straight — the light apple.com product page (iPhone / MacBook Air pages: white and #f5f5f7 grounds, centred headlines, rounded tiles, large imagery). The craft bar is apple.com itself. Themed concepts (the "contact sheet" film world) were tried and rejected by the user.

## Evidence on Hand

- Portrait photos: `assets/pdp.jpg`, `assets/pdp2.jpg`.
- CV: `assets/cv_thibault.pdf` (outdated: still says "Alternant", dates to verify).
- Project images in `assets/proj/` for: Chatbot Agents (ALE), Dashboard Data (ALE), SaaS Immo, Portfolio Pauline, Portfolio IA, 10heures, Decision Analysis, App Annonces, Sudoku, N-Dames, Sweded American Psycho, Triv'info Pursuit.
- Photography: ~170 travel photos (`assets/voyage/`), ~25 event photos (`assets/evt/`).
- Experience: ALE (apprenticeship 2024–2025: real-time data dashboard, predictive models; then interim developer, multi-agent chatbot ~1 year); S3P Web internship (2020); hospital service agent at EHPAD du pays de Daoulas (2022–2023).
- Passions: photography, motorcycling, weight training, running, swimming.
- Contact: td29460@gmail.com, LinkedIn.
- Absent, never fabricate: testimonials, client logos, metrics/benchmarks of ALE projects, years-of-experience counters, "projects delivered" counts.
- Open: status of the freelance / ImmoAI activity; exact start date of the interim contract.

## Product Principles

1. Show the work, not adjectives: projects and photos carry the page, claims stay factual.
2. The flagship is the multi-agent chatbot at ALE; everything else supports it.
3. One coherent story across site, LinkedIn banner and LinkedIn copy.
4. Restraint is the premium: fewer, better elements.

## Accessibility & Inclusion

Standard WCAG 2.2 AA; respect `prefers-reduced-motion`; no zoom lock (the old `user-scalable=no` goes).
