---
title: Hochbeet
publishDate: 2023-12-01 00:00:00
url: https://0815hochbeet.vercel.app
repo: https://github.com/Gnadi/0815hochbeet
status: preview
tagline: A raised-bed planner that knows which plants get along — and warns you before you plant the ones that don't.
description: A visual raised-bed planner built on companion-planting data — place plants to scale across all four seasons, and get warned about bad neighbours before they go in the ground.
tags:
  - Side Project
  - Open Source
  - Free
stack:
  - React 18
  - Vite
  - React Router
  - Firebase Auth
  - Cloud Firestore
  - localStorage
screenshots:
  - src: ../../assets/projects/hochbeet/planner.webp
    alt: Raised bed planner with plants drawn to scale as circles, a plant palette on the left and tips on the right
    caption: The planner. Every plant is drawn at its real spacing, so the bed fills up honestly.
  - src: ../../assets/projects/hochbeet/conflicts.webp
    alt: Conflict panel listing bad neighbours like carrot versus dill alongside good pairings
    caption: Bad neighbours are flagged with the reason — here, mature dill inhibiting carrot germination.
  - src: ../../assets/projects/hochbeet/dashboard.webp
    alt: Dashboard with a seasonal planting timeline and cards for two beds
    caption: The dashboard, with a seasonal timeline and every bed at a glance.
  - src: ../../assets/projects/hochbeet/seasons.webp
    alt: Season view comparing spring, summer, autumn and winter layouts with transition advice
    caption: Each bed holds four separate layouts, plus advice on what follows what.
  - src: ../../assets/projects/hochbeet/plants.webp
    alt: Plant encyclopedia entries with sun, water, yield and care notes
    caption: The plant library — spacing, sun, water, expected yield and care notes for all 21 species.
  - src: ../../assets/projects/hochbeet/calendar.webp
    alt: Month calendar with garden to-dos for the selected day
    caption: A calendar for the jobs a bed generates — sowing, pruning, mulching.
---

Companion planting is real horticulture with real evidence behind it, and it is almost
impossible to apply from a book. You are standing in front of a 200 × 100 cm box holding a
tray of seedlings, and the question "does dill belong next to carrots?" has an answer —
you just do not have it in your head.

Hochbeet puts that answer in the planner. You draw your bed, drag plants into it, and the
app tells you which neighbours help each other and which ones you are about to regret.

## Planning a bed

Beds are defined by real measurements and a shape — rectangle, L-shape, or freeform, where
you draw the outline cell by cell. Plants are then dropped in at centimetre positions and
rendered as circles at their **actual spacing**, so a single tomato visibly eats 60 cm of
your bed and you cannot cheat the geometry. Placement is collision-checked: if two plants
would overlap, the app refuses. Same species dropped nearby stack into a count instead.

Underneath sits a plant library of 21 species with spacing, sun and water needs, sowing
depth, weeks to harvest, botanical family, expected yield, and care notes — plus a
companion matrix drawn from Central European sources (Gertrud Franck's *Mischkulturen im
Gemüsegarten*, DGG, Sepp Brunner, Bioland guidance).

## What it tells you

- **Good and bad neighbours**, computed by distance rather than grid cells, with the reason spelled out — not just "bad", but *why* it is bad.
- **Fix my bed**, which iteratively swaps conflicting plants for compatible ones that score well against the same neighbours.
- **Crop rotation warnings** across seasons, so the same botanical family does not sit in the same spot year after year.
- **A yield estimate** and plant count for the current layout.
- **A sun map** across the bed, derived from the orientation you set during onboarding.

## Four seasons, one bed

Each bed holds four independent layouts — spring, summer, autumn, winter — and a season
view compares them side by side with transition advice: radish out, tomato in once the soil
is warm; beans before spinach because of the nitrogen they leave behind. There is also an
auto-plan wizard that generates a starting layout from your bed size, a goal (maximum
yield, low maintenance, or family-friendly) and the plants you actually want to grow.

Around that sit a calendar for the jobs a bed generates and a harvest log to record what
actually came out of it.

## How it is built

React 18 and Vite, deliberately small: no state library, no component framework, styling
written inline against a single theme file. The interesting code is not the UI, it is
`useBed` — placement, collision checks, undo/redo, companion scoring and the auto-repair
pass all live there.

Storage is **local first**. Everything is kept in `localStorage` and the app is fully
usable without an account; signing in adds optional Firestore sync across devices. If
Firebase is not configured at all, the app degrades to local-only rather than breaking,
which is how a tool like this should behave.

## Where it stands

A preview, and the least finished of my projects. The planner, seasons, conflict analysis,
auto-plan, calendar and harvest log all work; the UI is German-only, and what it is really
missing is a second year of my own use to find out which parts of it I actually reach for.
