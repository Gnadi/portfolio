---
title: Hochbeet
publishDate: 2023-12-01 00:00:00
url: https://0815hochbeet.vercel.app
repo: https://github.com/Gnadi/0815hochbeet
status: preview
tagline: Ein Hochbeet-Planer, der weiß, welche Pflanzen sich vertragen — und warnt, bevor die falschen nebeneinander landen.
description: Ein visueller Hochbeet-Planer auf Basis von Mischkultur-Daten — Pflanzen maßstabsgetreu über alle vier Jahreszeiten setzen und vor schlechten Nachbarn gewarnt werden, bevor sie in der Erde sind.
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
  - src: ../../../assets/projects/hochbeet/planner.webp
    alt: Hochbeet-Planer mit maßstabsgetreuen Pflanzenkreisen, Pflanzenpalette links und Tipps rechts
    caption: Der Planer. Jede Pflanze wird mit ihrem echten Abstand gezeichnet — das Beet füllt sich also ehrlich.
  - src: ../../../assets/projects/hochbeet/conflicts.webp
    alt: Konfliktliste mit schlechten Nachbarn wie Karotte und Dill sowie guten Kombinationen
    caption: Schlechte Nachbarn werden mit Begründung angezeigt — hier hemmt reifer Dill die Möhrenkeimung.
  - src: ../../../assets/projects/hochbeet/dashboard.webp
    alt: Dashboard mit Saisonkalender und Karten für zwei Beete
    caption: Das Dashboard mit Saisonkalender und allen Beeten auf einen Blick.
  - src: ../../../assets/projects/hochbeet/seasons.webp
    alt: Saisonansicht mit Frühling, Sommer, Herbst und Winter samt Übergangshinweisen
    caption: Jedes Beet hält vier eigene Belegungen — dazu Hinweise, was auf was folgt.
  - src: ../../../assets/projects/hochbeet/plants.webp
    alt: Pflanzenlexikon mit Sonne, Wasser, Ertrag und Pflegehinweisen
    caption: Das Pflanzenlexikon — Abstand, Sonne, Wasser, erwarteter Ertrag und Pflege für alle 21 Arten.
  - src: ../../../assets/projects/hochbeet/calendar.webp
    alt: Monatskalender mit Gartenaufgaben für den ausgewählten Tag
    caption: Ein Kalender für die Arbeiten, die ein Beet erzeugt — säen, ausgeizen, mulchen.
---

Mischkultur ist echte Gartenbaukunde mit belastbarer Datenlage — und aus einem Buch heraus
kaum anzuwenden. Man steht vor einer 200 × 100 cm großen Kiste, hat eine Palette Jungpflanzen
in der Hand, und die Frage "gehört Dill neben Karotten?" hat eine Antwort. Nur eben nicht
im Kopf.

Hochbeet steckt diese Antwort in den Planer. Man zeichnet sein Beet, zieht Pflanzen hinein,
und die App sagt, welche Nachbarn einander helfen — und welche man gleich bereuen wird.

## Ein Beet planen

Beete werden über echte Maße und eine Form definiert: Rechteck, L-Form oder frei gezeichnet,
Zelle für Zelle. Pflanzen landen dann auf Zentimeterpositionen und werden als Kreise mit
ihrem **tatsächlichen Standabstand** gezeichnet — eine einzelne Tomate frisst sichtbar 60 cm
Beet, und an der Geometrie lässt sich nicht vorbeimogeln. Die Platzierung prüft Kollisionen:
Würden sich zwei Pflanzen überlappen, verweigert die App. Dieselbe Art in der Nähe wird
stattdessen zu einer Stückzahl zusammengefasst.

Darunter liegt ein Pflanzenlexikon mit 21 Arten samt Abstand, Sonnen- und Wasserbedarf,
Saattiefe, Wochen bis zur Ernte, botanischer Familie, erwartetem Ertrag und Pflegehinweisen
— dazu eine Nachbarschaftsmatrix aus mitteleuropäischen Quellen (Gertrud Franck,
*Mischkulturen im Gemüsegarten*, DGG, Sepp Brunner, Bioland-Richtlinien).

## Was es dir sagt

- **Gute und schlechte Nachbarn**, berechnet über Abstände statt über Rasterzellen, mit ausformulierter Begründung — nicht nur "schlecht", sondern *warum*.
- **Fix my bed**: tauscht konfliktträchtige Pflanzen iterativ gegen verträgliche, die bei denselben Nachbarn gut abschneiden.
- **Fruchtfolge-Hinweise** über die Saisonen hinweg, damit dieselbe Pflanzenfamilie nicht Jahr für Jahr am selben Fleck sitzt.
- **Eine Ertragsschätzung** und Stückzahl für die aktuelle Belegung.
- **Eine Sonnenkarte** über das Beet, abgeleitet aus der Ausrichtung im Onboarding.

## Vier Saisonen, ein Beet

Jedes Beet hält vier unabhängige Belegungen — Frühling, Sommer, Herbst, Winter —, und eine
Saisonansicht stellt sie nebeneinander, samt Übergangshinweisen: Radieschen raus, Tomate
rein, sobald der Boden warm genug ist; Bohnen vor Spinat wegen des Stickstoffs, den sie
zurücklassen. Dazu kommt ein Assistent, der aus Beetgröße, Ziel (maximaler Ertrag,
pflegeleicht oder familienfreundlich) und den Wunschpflanzen eine Startbelegung generiert.

Drumherum liegen ein Kalender für die Arbeiten, die ein Beet erzeugt, und ein Ernte-Log
für das, was am Ende herauskam.

## Wie es gebaut ist

React 18 und Vite, bewusst klein gehalten: keine State-Bibliothek, kein
Komponenten-Framework, Styling inline gegen eine einzelne Theme-Datei. Der interessante
Code ist nicht das UI, sondern `useBed` — Platzierung, Kollisionsprüfung, Undo/Redo,
Nachbarschaftsbewertung und die automatische Reparatur stecken alle dort.

Gespeichert wird **lokal zuerst**: Alles liegt im `localStorage`, die App ist ohne Konto
vollständig nutzbar, und eine Anmeldung ergänzt optionale Firestore-Synchronisation über
Geräte hinweg. Ist Firebase gar nicht konfiguriert, fällt die App auf reinen Lokalbetrieb
zurück statt kaputtzugehen — so sollte sich ein solches Werkzeug verhalten.

## Wo es steht

Eine Preview und das am wenigsten fertige meiner Projekte. Planer, Saisonen,
Konfliktanalyse, Auto-Plan, Kalender und Ernte-Log funktionieren; das UI gibt es bislang
nur auf Deutsch. Was wirklich fehlt, ist ein zweites Gartenjahr eigener Nutzung, um
herauszufinden, welche Teile ich tatsächlich anfasse.
