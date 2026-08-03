---
title: MeteoGuessr
publishDate: 2024-01-01 00:00:00
url: https://0815weather.vercel.app
repo: https://github.com/Gnadi/0815weather
status: preview
tagline: Ein 3D-Wetterglobus mit echten Daten — und ein Ratespiel, das genau diese Daten zu Hinweisen macht.
description: Eine Wetter-App mit interaktivem Globus und einem täglichen Ratespiel — erkenne Städte oder Länder anhand ihrer aktuellen Wetterdaten.
tags:
  - Side Project
  - Open Source
  - Free
stack:
  - React 18
  - Three.js
  - Vite
  - Open-Meteo API
  - OpenStreetMap Nominatim
  - Vitest
screenshots:
  - src: ../../../assets/projects/meteoguessr/globe.webp
    alt: Interaktiver 3D-Globus neben einem Wetterpanel mit Londoner Werten und 5-Tage-Prognose
    caption: Der Globus mit aktuellen Werten und Fünf-Tage-Prognose für die gewählte Stadt.
  - src: ../../../assets/projects/meteoguessr/overlays.webp
    alt: Globus mit Temperatur-Overlay über den Kontinenten und Farblegende
    caption: Wetter-Overlays legen Temperatur, Regen oder Wind über den ganzen Globus — berechnet aus einem Raster von 288 Messpunkten.
  - src: ../../../assets/projects/meteoguessr/layers.webp
    alt: Globusansicht mit Ländergrenzen und Städtemarkierungen
    caption: Der Layer-Umschalter wechselt zwischen schlicht, Grenzen, Hauptstädten und Städten.
  - src: ../../../assets/projects/meteoguessr/game-difficulty.webp
    alt: Auswahl der Schwierigkeit im Spiel — Easy, Moderate, Hard und Extreme
    caption: Vier Schwierigkeitsgrade — vom Land mit allen Hinweisen bis zur Stadt mit fast keinen.
  - src: ../../../assets/projects/meteoguessr/game-round.webp
    alt: Eine Spielrunde mit unbekannten Wetterdaten und der Frage nach dem Land
    caption: Eine Runde im Spiel. Die Wetterdaten sind der einzige Hinweis.
---

Angefangen hat das als schlichte Wetter-App und wurde in dem Moment interessant, als mir
auffiel, dass die Daten selbst schon ein Rätsel sind. Wenn man weiß, dass es 21 °C hat,
schwül ist, gewittert und der Fünf-Tage-Trend flach verläuft, kann man ziemlich gut
eingrenzen, wo auf der Welt man gerade steht. Das ist ein Spiel.

MeteoGuessr ist beides: eine echte Wetter-App auf einem interaktiven 3D-Globus und ein
Ratespiel, das dieselben Live-Daten als Hinweise verwendet.

## Der Globus

Der Globus läuft auf Three.js, ist dreh- und zoombar und mit NASA-Blue-Marble-Bildern
texturiert. Ein Klick irgendwohin liefert die aktuellen Werte — Temperatur, Luftfeuchte,
Wind, Luftdruck, Sichtweite — plus eine Fünf-Tage-Prognose. Städte lassen sich per Namen
suchen und als Favoriten merken (im Local Storage), und ein Ticker am unteren Rand lässt
Live-Temperaturen aus Metropolen der ganzen Welt durchlaufen.

Ein Layer-Umschalter wechselt zwischen schlichtem Globus, Ländergrenzen, Hauptstädten und
Städten. Davon unabhängig legen Wetter-Overlays Temperatur, Niederschlag oder Wind über
die gesamte Kugel — berechnet aus einem Raster von 288 Messpunkten (24 Längen × 12
Breiten), das zu einer Textur interpoliert wird. Das war der Teil, den ich am liebsten
gebaut habe.

## Weather IQ

Das Spiel zeigt das Wetter eines unbekannten Orts und fragt nach dessen Namen, in vier
Schwierigkeitsgraden: vom Land mit allen verfügbaren Hinweisen bis zur Stadt mit nur einer
Hemisphäre und einem Anfangsbuchstaben. Falsche Tipps kosten Punkte, der Abzug wächst mit
der Schwierigkeit, und der Highscore bleibt lokal gespeichert.

## Wie es gebaut ist

React 18 und Three.js, gebündelt mit Vite, dazu eine kleine Vitest-Suite über die
Koordinatenrechnung. Die Wetterdaten kommen von **Open-Meteo**, die Städtesuche ebenfalls
von Open-Meteo, das Reverse-Geocoding von OpenStreetMaps Nominatim — alles frei und offen,
deshalb braucht die App keine API-Keys und verursacht keine Kosten.

## Wo es steht

Als Preview deployed. Alles hier Beschriebene funktioniert; was fehlt, ist der Feinschliff
eines fertigen Produkts — der Globus ist beim ersten Laden schwer, und dem Spiel täten
mehr Runden und eine gemeinsame Tagesherausforderung statt eines rein lokalen Highscores
gut.
