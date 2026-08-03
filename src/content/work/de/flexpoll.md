---
title: FlexPoll
publishDate: 2024-06-01 00:00:00
url: https://flexpoll.app
repo: https://github.com/Gnadi/0815Poll
status: live
tagline: Sieben Umfrageformate, kein Konto zum Abstimmen — und alles quelloffen.
description: Open-Source-Umfragen jenseits von Ja / Nein — Ranking, Terminfindung, Ort, Priorität, Bild und vollständig anpassbare Umfragen. Kein Login zum Abstimmen nötig.
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
  - src: ../../../assets/projects/flexpoll/landing.webp
    alt: FlexPoll-Startseite mit der Überschrift "Every kind of poll. Completely free."
    caption: Die Startseite. Zum Stöbern und Abstimmen braucht es kein Konto.
  - src: ../../../assets/projects/flexpoll/dashboard.webp
    alt: FlexPoll-Dashboard mit Umfragen mehrerer Typen und laufenden Stimmenzahlen
    caption: Das Dashboard mit eigenen Umfragen, Community-Umfragen und aktuellen Ergebnissen.
  - src: ../../../assets/projects/flexpoll/create-types.webp
    alt: Auswahl des Umfragetyps — Standard, Ranking, Termin, Ort, Custom, Priorität und Bild
    caption: Der erste Schritt beim Erstellen ist die Wahl des Formats — der Rest des Ablaufs passt sich daran an.
  - src: ../../../assets/projects/flexpoll/vote-standard.webp
    alt: Abstimmungsansicht einer klassischen Multiple-Choice-Umfrage
    caption: Eine Standardumfrage. Abstimmen funktioniert ohne Anmeldung.
  - src: ../../../assets/projects/flexpoll/vote-schedule.webp
    alt: Terminumfrage mit Kandidatentagen und Vormittags- sowie Nachmittagsslots
    caption: Terminumfragen sammeln Verfügbarkeiten pro Slot und zeigen die größte Überschneidung.
  - src: ../../../assets/projects/flexpoll/results-priority.webp
    alt: Ergebnisse einer Prioritätsumfrage mit Balkenranking, Insight-Panel und QR-Code
    caption: Ergebnisse aktualisieren sich live, und jede Umfrage bekommt Link und QR-Code.
---

Die meisten Umfragetools können genau eine Sache: eine Frage, ein paar Optionen, eine
Stimme pro Person. Das deckt nur einen kleinen Teil der Entscheidungen ab, die Gruppen
tatsächlich treffen. Einen Termin für acht Personen zu finden ist ein anderes Problem
als einen Namen auszuwählen, und ein Backlog zu priorisieren ist etwas anderes als sich
auf ein Lokal zu einigen.

FlexPoll ist mein Versuch, das alles in einem Werkzeug abzudecken. Kostenlos, quelloffen
unter der MIT-Lizenz, und zum Abstimmen braucht es nie ein Konto — Link verschicken,
Leute antworten, fertig.

## Sieben Arten zu fragen

- **Standard** — klassische Mehrfachauswahl, auf Wunsch mit mehreren Antworten pro Person.
- **Termin** — Tage und Zeitfenster vorschlagen, alle kreuzen an, was passt. Die Überschneidung entscheidet.
- **Ort** — Lokale auf einer Karte vorschlagen und darüber abstimmen, wo man sich trifft.
- **Ranking** — Optionen per Drag & Drop in eine Reihenfolge bringen. Ausgewertet wird mit Borda-Zählung, damit ein starker zweiter Platz nicht unter den Tisch fällt.
- **Priorität** — jede Person verteilt ein Punktebudget auf die Optionen. Ideal für Roadmaps, wo "alles ist wichtig" keine Antwort ist.
- **Bild** — Fotos als Optionen hochladen und über das schönste abstimmen.
- **Custom** — den Inhalt selbst in einem Rich-Text-Editor bauen, wenn keines der Formate passt.

## Mehr als nur abstimmen

Ergebnisse laufen über Firestore-Subscriptions live ein: Eine offene Ergebnisseite
aktualisiert sich, während Stimmen eintreffen, nicht erst beim Neuladen. Zu jeder Umfrage
gehören ein Teilen-Link, ein generierter QR-Code und eine WhatsApp-Aktion — die drei Wege,
auf denen Umfragen real verteilt werden. Umfragen lassen sich privat schalten, dann
tauchen sie nicht im öffentlichen Explore-Feed auf und sind nur über den direkten Link
erreichbar. Nach Ablauf der eingestellten Dauer schließen sie automatisch.

Dazu kommt eine Kontaktliste für Personen, die man häufig befragt, und optionale
Benachrichtigungen: Eingeladene Kontakte können per E-Mail informiert werden, Web-Push
läuft über Firebase Cloud Messaging mit einer Cloud Function, die eine Queue-Collection
abarbeitet.

## Wie es gebaut ist

Das Frontend ist React 19 mit TypeScript, gebaut mit Vite und gestylt mit Tailwind.
Routing übernimmt React Router v7, die App ist als installierbare PWA mit Dark Mode
ausgeliefert. Das Backend ist Firebase: Authentication für Konten, Firestore für Umfragen
und Stimmen, Cloud Functions für Push. Das Abstimmen läuft in Firestore-Transaktionen,
damit gleichzeitige Stimmen sich nicht gegenseitig überschreiben, und über die Zugriffe
entscheiden Security Rules — nicht das UI.

Herausgekommen ist ein Projekt ohne Server, den ich betreiben muss, und ohne laufende
Kosten. Genau deshalb kann ich "für immer kostenlos" auch wirklich halten.
