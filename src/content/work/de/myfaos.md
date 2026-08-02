---
title: myFAOS
publishDate: 2024-08-15 00:00:00
url: https://www.myfaos.app
repo: https://github.com/Gnadi/0815familyOS
status: live
tagline: Die unsichtbare Verwaltung des Familienalltags — Kalender, Aufgaben, Essen, Einkauf und Kinderunterlagen an einem Ort.
description: Die operative Schicht für das Familienleben — gemeinsamer Kalender, Haushaltsaufgaben und Dokumentation für Kinder, alles in einem privaten Hub. Für Familien mit jungen Kindern.
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
    alt: myFAOS-Dashboard mit heutigen Terminen, fälligen Aufgaben, Geburtstagen und Aufgabenverteilung
    orientation: portrait
    caption: Das Dashboard beantwortet eine Frage — wie sieht heute aus?
  - src: /assets/projects/myfaos/calendar.webp
    alt: Gemeinsamer Familienkalender mit farblich zugeordneten Terminen
    orientation: portrait
    caption: Ein gemeinsamer Kalender, farblich nach Familienmitglied.
  - src: /assets/projects/myfaos/tasks.webp
    alt: Haushaltsaufgaben mit Prioritäten und Zuständigkeiten
    orientation: portrait
    caption: Aufgaben mit Zuständigkeit und Priorität — samt Verteilung, damit sichtbar bleibt, wer gerade mehr trägt.
  - src: /assets/projects/myfaos/meals.webp
    alt: Wochenplan mit Frühstück, Mittag- und Abendessen pro Tag sowie Rezept-Tab
    orientation: portrait
    caption: Der Wochenplan fürs Essen, mit gespeicherten Lieblingsrezepten und Koch-Rotation.
  - src: /assets/projects/myfaos/shopping.webp
    alt: Gemeinsame Einkaufsliste nach Kategorien gruppiert
    orientation: portrait
    caption: Eine gemeinsame Einkaufsliste, die sich aus dem Wochenplan füllt.
  - src: /assets/projects/myfaos/health.webp
    alt: Impfpass pro Kind mit erledigten, fälligen und geplanten Einträgen
    orientation: portrait
    caption: Eine Gesundheitsakte pro Kind — was erledigt ist, was als Nächstes ansteht, plus PDF-Export.
---

Einen Haushalt mit kleinen Kindern zu organisieren ist ein Logistikproblem, auf das
niemand vorbereitet wird. Zwei Kalender, die nichts voneinander wissen, eine Aufgabenliste
irgendwo im Chatverlauf, das Abendessen um 18 Uhr entschieden — und eine Kinderärztin, die
nach einem Impfdatum fragt, das man zuletzt vor eineinhalb Jahren auf Papier gesehen hat.

myFAOS — Family Administration Operating System — ist der eine Ort, den ich mir dafür
gewünscht habe. Kein soziales Produkt, kein Tagebuch: die operative Schicht unter dem
Familienalltag, konsequent mobil gedacht, weil sie im Supermarktgang benutzt wird.

## Was drin ist

- **Dashboard** — Termine des Tages, fällige Aufgaben, anstehende Geburtstage und eine Verteilung, die zeigt, wer diese Woche tatsächlich mehr trägt.
- **Gemeinsamer Kalender** — Wochen- und Monatsansicht, farblich nach Familienmitglied, damit beide Eltern eine Wahrheit sehen statt zwei.
- **Aufgaben** — Haushalts-To-dos mit Zuständigkeit, Priorität und Fälligkeit.
- **Essen** — Wochenplan für Frühstück, Mittag- und Abendessen, eine Rezeptsammlung und eine Koch-Rotation.
- **Einkauf** — eine gemeinsame Liste, die sich aus dem Wochenplan speist und auf allen Geräten live aktualisiert.
- **Geschenkplaner** — Ideen pro Person und Anlass hinterlegt, damit Geburtstage keine Hektik mehr sind.
- **Dokumententresor** — die Unterlagen, die eine Familie braucht und nie findet.
- **Gesundheitsakte** — Impfpass pro Kind, mit Erledigtem, Fälligem und PDF-Export für die Kinderärztin.

Familien werden einmal angelegt und per Einladungscode betreten — Partnerin, Partner oder
Großeltern kommen also hinein, ohne dass jemand Konten verwalten muss.

## Wie es gebaut ist

React 18 mit Vite, gestylt mit Tailwind, geroutet mit React Router, Datumslogik über
date-fns. Der State läuft über React Context und Hooks — kein Redux, kein Zustand —, was
bei dieser Größe nachvollziehbarer geblieben ist als jeder Store es gewesen wäre.

Firebase liefert Authentication (E-Mail/Passwort und Google) und Firestore, wobei
`firestore.rules` die Zugriffskontrolle pro Familie durchsetzt: Keine Familie kann die
Daten einer anderen lesen. Dazu gibt es einen Demo-Modus mit lokal vorbefülltem Store, mit
dem sich das ganze Produkt ohne Anmeldung und ohne Zugriff auf die echte Datenbank
ausprobieren lässt.

## Wo es steht

Live und täglich im Einsatz — und das Projekt, an dem ich am häufigsten weiterbaue. Der
Impf-Export und der Weg vom Wochenplan zur Einkaufsliste existieren beide, weil sie vorher
im Alltag genervt haben. Neue Funktionen entstehen weiter in der Reihenfolge, in der sich
das echte Leben beschwert.
