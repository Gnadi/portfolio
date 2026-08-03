---
title: Kaydo
publishDate: 2024-09-01 00:00:00
url: https://kaydo.app
repo: https://github.com/Gnadi/0815memories
status: live
tagline: Your family's own corner of the internet, at your own address, encrypted before it ever leaves the device.
description: A private, encrypted home for family memories — photos, journals, stories, and recipes, free of ads, AI training, and data selling.
tags:
  - Privacy
  - Encryption
  - Web App
  - Side Project
stack:
  - React
  - Vite
  - vite-react-ssg
  - Tailwind CSS
  - Firebase Auth
  - Cloud Firestore
  - Cloud Functions
  - Web Crypto (AES-256-GCM)
  - Cloudinary
  - Workbox PWA
  - i18next
  - Vitest
screenshots:
  - src: ../../assets/projects/kaydo/home-desktop.webp
    alt: Kaydo home feed with daily moment circles and rich memory cards
    caption: The memory feed, with Daily Moments across the top for quick everyday snapshots.
  - src: ../../assets/projects/kaydo/scrapbook-desktop.webp
    alt: Freeform scrapbook canvas with polaroid frames, stickers and text
    caption: The scrapbook is a freeform canvas — drag photos, stickers and text, then export the book as a PDF.
  - src: ../../assets/projects/kaydo/recipe-tree-desktop.webp
    alt: Recipe tree showing a family recipe with its forks and version history
    caption: Recipes are versioned and can be forked, so a grandmother's original and a grandchild's variation both survive.
  - src: ../../assets/projects/kaydo/journal-desktop.webp
    alt: Kid journal with dated entries written for a child to read later
    caption: Journals and letters, dated and written for the child to read years from now.
  - src: ../../assets/projects/kaydo/blackbox-desktop.webp
    alt: The Vault, holding high-fidelity originals and time-locked capsules
    caption: The Vault keeps full-resolution originals and time-locked capsules that stay sealed until a chosen date.
  - src: ../../assets/projects/kaydo/our-year-mobile.webp
    alt: Our Year review ritual on a phone, showing chapter questions for a couple
    orientation: portrait
    caption: Our Year is a review ritual for two — deliberately built for a phone on a sofa.
---

Every family photo I have ever uploaded somewhere ended up as training data, ad
inventory, or a subscription I would lose access to. Kaydo is the alternative I wanted
to exist: a private space a family actually owns, at its own address —
`yourname.kaydo.app` — with no ads, no AI training, and nothing sold on.

## Share

The heart of it is a memory feed of rich cards: photos, videos, voice memos, stories
and quotes. **Daily Moments** are story circles for the small everyday things that never
justify a full post. A smart timeline groups memories by season and surfaces "on this
day" lookbacks.

## Preserve

The **Vault** holds high-fidelity originals of the documents and photos that matter
most, including **time-locked capsules** that stay sealed until a date you pick. Letters
and kids' journals are dated entries written for the future. And everything can be
exported as a ZIP of plain, readable files plus structured JSON — NAS-friendly, no lock-in.
A memory platform you cannot leave is not a memory platform, it is a hostage situation.

## Create and evolve

The **recipe tree** treats family recipes like code: version history, forks and photo
logs across generations, so a grandmother's original and a grandchild's variation both
survive. The **digital scrapbook** is a freeform drag-and-drop canvas with polaroid
frames, stickers and text, exportable as a PDF. Each family can even design its own login
page — from starter templates up to a custom photo welcome screen.

## Just the two of you

**Our Year** is a recurring review ritual for a couple, on whatever day they choose. Each
chapter holds a shared look back — both partners answer the same five questions
independently, and the answers unlock only once both have handed in — a couple's quiz
rewritten every chapter, a letter to their future selves, and four keepsakes: one photo,
one song, one sentence, one moment. Nothing here assumes marriage, children, or
twelve-month cycles.

## Encryption, honestly

Photos, videos, voice memos, journal entries, recipes, scrapbooks and Vault content are
encrypted **client-side with AES-256-GCM** via the Web Crypto API before upload. Media is
stored as raw ciphertext, so the server never receives a renderable image. The only
deliberate exception is the public login-page artwork, which has to render before anyone
is authenticated.

Our Year goes further than the rest of the app: instead of trusting the UI, Firestore
security rules decide who may read what. A partner's answers are unreadable until both
have submitted, a sealed letter is unreadable until its open date, and a closed chapter
can no longer be edited — all covered by emulator tests.

One honest limitation, which I keep stated in the README as well: the per-family
encryption key currently lives in the family's Firestore document, so Kaydo is **not**
zero-knowledge yet. Moving to client-side key derivation is the intended path before I
make any such claim.

## How it is built

React and Vite, with `vite-react-ssg` pre-rendering the landing page to static HTML.
Firebase provides Auth, Firestore and Cloud Functions; Cloudinary stores the encrypted
media through signed uploads. It is an installable PWA with Workbox precaching and push
notifications, fully bilingual in English and German via i18next, and covered by a Vitest
suite plus Firestore rules tests.
