---
title: FlexPoll
publishDate: 2024-06-01 00:00:00
url: https://flexpoll.app
repo: https://github.com/Gnadi/0815Poll
status: live
tagline: Seven poll formats, no account needed to vote, and the whole thing is open source.
description: Open-source polls beyond yes / no — ranking, scheduling, location, priority, image, and fully custom polls. No login required to vote.
tags:
  - Open Source
  - Polls
  - Free
  - Side Project
stack:
  - React 19
  - TypeScript
  - Vite
  - Tailwind CSS
  - Firebase Auth
  - Cloud Firestore
  - React Router
  - Tiptap
  - Leaflet
  - Vercel
screenshots:
  - src: ../../assets/projects/flexpoll/landing.webp
    alt: FlexPoll landing page with the headline "Every kind of poll. Completely free."
    caption: The landing page. No account is needed to browse or vote.
  - src: ../../assets/projects/flexpoll/dashboard.webp
    alt: FlexPoll dashboard listing polls of several types with live vote counts
    caption: The dashboard, with your own polls, community polls and recent results.
  - src: ../../assets/projects/flexpoll/create-types.webp
    alt: Poll type picker showing standard, ranking, schedule, location, custom, priority and image polls
    caption: Picking a format is the first step of creating a poll — the rest of the flow adapts to it.
  - src: ../../assets/projects/flexpoll/vote-standard.webp
    alt: Voting screen for a standard multiple-choice poll
    caption: A standard poll. Voting works without signing in.
  - src: ../../assets/projects/flexpoll/vote-schedule.webp
    alt: Schedule poll showing candidate dates with morning and afternoon slots
    caption: Schedule polls collect availability per slot and surface the widest overlap.
  - src: ../../assets/projects/flexpoll/results-priority.webp
    alt: Priority poll results with a ranked bar chart, insight panel and QR code
    caption: Results update live, and every poll gets a share link and QR code.
---

Most polling tools do one thing: a question, a handful of options, one vote each.
That covers a small slice of the decisions people actually make together. Finding a
date that works for eight people is not the same problem as picking a name, and
ranking a backlog is not the same problem as choosing a restaurant.

FlexPoll is my attempt at one tool that handles all of them. It is free, open source
under the MIT licence, and voting never requires an account — you send a link, people
answer, that is the whole flow.

## Seven ways to ask

- **Standard** — classic multiple choice, optionally allowing more than one selection.
- **Schedule** — propose dates and time slots and let everyone tick what works. The overlap does the deciding.
- **Location** — suggest venues on a map and vote on where to meet.
- **Ranking** — drag options into order. Results are aggregated with Borda count, so a strong second place still counts for something.
- **Priority** — each voter gets a budget of points to spread across the options. Good for roadmaps, where "everything is important" is not an answer.
- **Image** — upload pictures as the options and vote on the one you like.
- **Custom** — build the poll body yourself in a rich-text editor when none of the above fits.

## Beyond the vote

Results stream in live over Firestore subscriptions, so an open results page updates as
votes arrive rather than on refresh. Every poll gets a share link, a generated QR code
and a WhatsApp share action — the three ways people actually distribute a poll. Polls
can be marked private so they stay out of the public Explore feed and are reachable only
by direct link, and they close automatically once their duration runs out.

There is a contacts list for people you poll often, and optional notifications: invited
contacts can be notified by email when a poll opens, and web push runs through Firebase
Cloud Messaging with a Cloud Function draining a queue collection.

## How it is built

The front end is React 19 with TypeScript, built by Vite and styled with Tailwind.
Routing is React Router v7, and the app ships as an installable PWA with a dark mode.
Firebase handles the backend: Authentication for accounts, Firestore for polls and votes,
and Cloud Functions for push. Vote casting runs inside Firestore transactions so
concurrent votes cannot clobber each other's counts, and security rules — not the UI —
decide who may write what.

The result is a project with no server to operate and no running cost, which is what
makes "free forever" a promise I can actually keep.
