---
title: myFAOS
publishDate: 2024-08-15 00:00:00
url: https://www.myfaos.app
repo: https://github.com/Gnadi/0815familyOS
status: live
tagline: The boring, invisible admin of family life — calendar, tasks, meals, shopping and child records — in one private hub.
description: The operational layer for family life — shared calendar, household tasks, and child documentation in one private hub. Built for families with young children.
tags:
  - Family
  - Productivity
  - Web App
  - Side Project
stack:
  - React 18
  - Vite
  - Tailwind CSS
  - Firebase Auth
  - Cloud Firestore
  - React Router
  - date-fns
  - lucide-react
  - Cloudinary
  - Vitest
screenshots:
  - src: /assets/projects/myfaos/dashboard.webp
    alt: myFAOS dashboard showing today's appointments, due tasks, upcoming birthdays and workload split
    orientation: portrait
    caption: The dashboard answers one question — what does today look like?
  - src: /assets/projects/myfaos/calendar.webp
    alt: Shared family calendar with colour-coded events per family member
    orientation: portrait
    caption: One shared calendar, colour-coded per family member.
  - src: /assets/projects/myfaos/tasks.webp
    alt: Household task list with priorities and assignees
    orientation: portrait
    caption: Household tasks, assigned and prioritised — with a workload split so it stays visible who is carrying what.
  - src: /assets/projects/myfaos/meals.webp
    alt: Weekly meal plan with breakfast, lunch and dinner per day plus a recipe tab
    orientation: portrait
    caption: The weekly meal plan, with saved favourites and a cooking rotation.
  - src: /assets/projects/myfaos/shopping.webp
    alt: Shared shopping list grouped by category
    orientation: portrait
    caption: A shared shopping list that fills itself from the meal plan.
  - src: /assets/projects/myfaos/health.webp
    alt: Vaccination record per child with completed, due and planned entries
    orientation: portrait
    caption: A vaccination record per child, with what is done, what is due next, and a PDF export.
---

Running a household with small children is a logistics problem nobody trained you for.
Two calendars that do not talk to each other, a task list in a messaging thread, meals
decided at 6pm, and a paediatrician asking for a vaccination date you last saw on a piece
of paper eighteen months ago.

myFAOS — Family Administration Operating System — is the single place I wanted for all of
it. Not a social product, not a journal: the operational layer underneath family life,
mobile-first because it gets used standing in a supermarket aisle.

## What it covers

- **Dashboard** — today's appointments, tasks due, upcoming birthdays, and a workload split showing who is actually carrying more this week.
- **Shared calendar** — week and month views, colour-coded per family member, so both parents see one truth instead of two.
- **Tasks** — household to-dos with assignees, priorities and due dates.
- **Meals** — a weekly plan for breakfast, lunch and dinner, a saved recipe collection and a cooking rotation.
- **Shopping** — a shared list that carries over from the meal plan and updates live on every device.
- **Gift planner** — ideas parked per person and occasion, so birthdays stop being a scramble.
- **Document vault** — the papers a family needs and can never find.
- **Health records** — a vaccination record per child, showing what is done, what is due next, and exportable as a PDF for the paediatrician.

Families are created once and joined with an invite code, so a partner or a grandparent
gets in without an admin setting up accounts.

## How it is built

React 18 with Vite, styled with Tailwind, routed with React Router, and dated with
date-fns. State is plain React Context and hooks — no Redux, no Zustand — which for an app
of this size has stayed easier to follow than any store would have been.

Firebase provides Authentication (email/password and Google) and Firestore, with
`firestore.rules` enforcing per-family access control so one family can never read
another's data. The app also ships a demo mode backed by a local seeded store, so the
whole product can be explored without signing up and without touching the real database.

## Where it stands

Live and in daily use, and still the project I extend most often. The vaccination export
and the meal-plan-to-shopping-list flow both exist because they were annoying in practice
first, and features on that list keep arriving in the order real life complains about them.
