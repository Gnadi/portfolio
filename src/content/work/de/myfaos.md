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
ogImage: ../../../assets/projects/myfaos/de/og.webp
screenshots:
  - src: ../../../assets/projects/myfaos/de/dashboard.webp
    alt: myFAOS-Dashboard mit den heutigen Terminen und Schnellzugriff-Kacheln
    orientation: portrait
    caption: Das Dashboard beantwortet eine Frage — wie sieht heute aus?
  - src: ../../../assets/projects/myfaos/de/calendar.webp
    alt: Gemeinsame Wochenansicht mit Filtern pro Familienmitglied und zwei Terminen
    orientation: portrait
    caption: Ein gemeinsamer Kalender, filterbar nach Familienmitglied.
  - src: ../../../assets/projects/myfaos/de/tasks.webp
    alt: Aufgaben-Board mit Familien-Effizienzwert sowie Backlog- und Geplant-Spalte
    orientation: portrait
    caption: Aufgaben mit Zuständigkeit und Priorität — samt Verteilung, damit sichtbar bleibt, wer gerade mehr trägt.
  - src: ../../../assets/projects/myfaos/de/shopping.webp
    alt: Gemeinsame Einkaufsliste mit offenen Posten und zuletzt verwendeten Artikeln
    orientation: portrait
    caption: Eine gemeinsame Einkaufsliste — zuletzt Verwendetes ist einen Tipp entfernt.
  - src: ../../../assets/projects/myfaos/de/gifts.webp
    alt: Geschenkeplaner mit Budget-Fortschritt und Geschenkideen pro Kind
    orientation: portrait
    caption: Der Geschenkeplaner verfolgt Ideen, Status und was vom Budget übrig ist.
  - src: ../../../assets/projects/myfaos/de/health.webp
    alt: Impfpass eines Kindes mit anstehender Tetanus-Auffrischung
    orientation: portrait
    caption: Eine Gesundheitsakte pro Kind — was als Nächstes ansteht, plus PDF-Export.
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
