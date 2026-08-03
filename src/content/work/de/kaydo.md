---
title: Kaydo
publishDate: 2024-09-01 00:00:00
url: https://kaydo.app
repo: https://github.com/Gnadi/0815memories
status: live
tagline: Die eigene Ecke des Internets für die Familie — unter eigener Adresse, verschlüsselt schon vor dem Upload.
description: Ein privater, verschlüsselter Ort für Familienerinnerungen — Fotos, Tagebücher, Geschichten und Rezepte, ohne Werbung, KI-Training oder Datenverkauf.
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
  - src: ../../../assets/projects/kaydo/home-desktop.webp
    alt: Kaydo-Startseite mit Daily-Moments-Kreisen und Erinnerungskarten
    caption: Der Erinnerungs-Feed, oben die Daily Moments für die kleinen Momente des Alltags.
  - src: ../../../assets/projects/kaydo/scrapbook-desktop.webp
    alt: Freie Scrapbook-Fläche mit Polaroid-Rahmen, Stickern und Text
    caption: Das Scrapbook ist eine freie Fläche — Fotos, Sticker und Text ziehen, fertige Bücher als PDF exportieren.
  - src: ../../../assets/projects/kaydo/recipe-tree-desktop.webp
    alt: Rezeptbaum mit einem Familienrezept, seinen Forks und der Versionsgeschichte
    caption: Rezepte sind versioniert und lassen sich forken — Omas Original und die Variante des Enkelkindes bleiben beide erhalten.
  - src: ../../../assets/projects/kaydo/journal-desktop.webp
    alt: Kindertagebuch mit datierten Einträgen, geschrieben zum späteren Lesen
    caption: Tagebücher und Briefe, datiert und geschrieben für das Kind von morgen.
  - src: ../../../assets/projects/kaydo/blackbox-desktop.webp
    alt: Der Tresor mit Originalen in voller Auflösung und zeitversiegelten Kapseln
    caption: Der Tresor bewahrt Originale in voller Auflösung und zeitversiegelte Kapseln, die erst zum gewählten Datum aufgehen.
  - src: ../../../assets/projects/kaydo/our-year-mobile.webp
    alt: Das Ritual "Our Year" am Handy mit den Kapitelfragen für ein Paar
    orientation: portrait
    caption: Our Year ist ein Ritual zu zweit — bewusst für das Handy auf der Couch gebaut.
---

Jedes Familienfoto, das ich je irgendwo hochgeladen habe, ist am Ende Trainingsmaterial,
Werbefläche oder ein Abo geworden, dessen Zugang irgendwann wegfällt. Kaydo ist die
Alternative, die ich mir gewünscht hätte: ein privater Ort, der einer Familie wirklich
gehört, unter eigener Adresse — `name.kaydo.app` — ohne Werbung, ohne KI-Training, ohne
Weiterverkauf.

## Teilen

Herzstück ist ein Feed aus Erinnerungskarten: Fotos, Videos, Sprachnotizen, Geschichten
und Zitate. **Daily Moments** sind Story-Kreise für die kleinen Dinge, für die sich ein
eigener Beitrag nie lohnt. Eine Timeline gruppiert Erinnerungen nach Jahreszeiten und
holt "an diesem Tag"-Rückblicke hervor.

## Bewahren

Der **Tresor** verwahrt Dokumente und Fotos in voller Auflösung, inklusive
**zeitversiegelter Kapseln**, die bis zu einem selbst gewählten Datum verschlossen
bleiben. Briefe und Kindertagebücher sind datierte Einträge, geschrieben für später.
Und alles lässt sich als ZIP aus lesbaren Dateien plus strukturiertem JSON exportieren —
NAS-tauglich, ohne Lock-in. Eine Plattform für Erinnerungen, die man nicht verlassen kann,
ist keine Plattform, sondern eine Geiselnahme.

## Gestalten und weitergeben

Der **Rezeptbaum** behandelt Familienrezepte wie Code: Versionsgeschichte, Forks und
Foto-Logs über Generationen hinweg. Omas Original und die Variante des Enkelkindes
bleiben beide erhalten. Das **digitale Scrapbook** ist eine freie Fläche mit
Polaroid-Rahmen, Stickern und Text, exportierbar als PDF. Jede Familie kann sich sogar
die eigene Login-Seite gestalten — von Vorlagen bis zur eigenen Foto-Willkommensseite.

## Nur zu zweit

**Our Year** ist ein wiederkehrendes Rückblick-Ritual für ein Paar, an einem selbst
gewählten Tag. Jedes Kapitel enthält einen gemeinsamen Rückblick — beide beantworten
dieselben fünf Fragen unabhängig voneinander, sichtbar wird alles erst, wenn beide
abgegeben haben —, ein Paar-Quiz mit jedes Mal neu geschriebenen Fragen, einen Brief an
das zukünftige Ich und vier Andenken: ein Foto, ein Lied, ein Satz, ein Moment. Nichts
davon setzt Ehe, Kinder oder Zwölfmonatszyklen voraus.

## Verschlüsselung, ehrlich beschrieben

Fotos, Videos, Sprachnotizen, Tagebucheinträge, Rezepte, Scrapbooks und Tresorinhalte
werden vor dem Upload **clientseitig mit AES-256-GCM** über die Web Crypto API
verschlüsselt. Medien liegen als reiner Chiffretext, der Server bekommt also nie ein
darstellbares Bild. Die einzige bewusste Ausnahme sind die öffentlichen Grafiken der
Login-Seite, die schon vor jeder Anmeldung gerendert werden müssen.

Our Year geht noch weiter: Statt dem UI zu vertrauen, entscheiden Firestore Security
Rules, wer was lesen darf. Die Antworten der Partnerin oder des Partners bleiben
unlesbar, bis beide abgegeben haben, ein versiegelter Brief bleibt bis zum Öffnungsdatum
unlesbar, und ein abgeschlossenes Kapitel lässt sich nicht mehr ändern — abgesichert
durch Emulator-Tests.

Eine ehrliche Einschränkung, die auch im README steht: Der Schlüssel pro Familie liegt
derzeit im Firestore-Dokument der Familie. Kaydo ist damit noch **nicht** zero-knowledge.
Der Weg dorthin führt über clientseitige Schlüsselableitung, und erst danach werde ich
das auch behaupten.

## Wie es gebaut ist

React und Vite, wobei `vite-react-ssg` die Landingpage als statisches HTML vorrendert.
Firebase liefert Auth, Firestore und Cloud Functions, Cloudinary speichert die
verschlüsselten Medien über signierte Uploads. Das Ganze ist eine installierbare PWA mit
Workbox-Precaching und Push-Benachrichtigungen, vollständig zweisprachig (Deutsch und
Englisch) über i18next und abgedeckt durch eine Vitest-Suite plus Tests der
Firestore-Rules.
