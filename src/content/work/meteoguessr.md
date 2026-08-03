---
title: MeteoGuessr
publishDate: 2024-01-01 00:00:00
url: https://0815weather.vercel.app
repo: https://github.com/Gnadi/0815weather
status: preview
tagline: A 3D weather globe with real data — and a guessing game that turns that data into clues.
description: A weather app with an interactive globe and a daily guessing game — identify cities or countries from their current weather data.
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
  - src: ../../assets/projects/meteoguessr/globe.webp
    alt: Interactive 3D globe next to a weather panel showing London's conditions and 5-day forecast
    caption: The globe, with current conditions and a five-day forecast for the selected city.
  - src: ../../assets/projects/meteoguessr/overlays.webp
    alt: Globe with a temperature overlay painted across continents and a colour legend
    caption: Weather overlays paint temperature, rain or wind across the whole globe, built from a 288-point sampling grid.
  - src: ../../assets/projects/meteoguessr/layers.webp
    alt: Globe layer view showing country borders and city markers
    caption: The layer toggle cycles between plain, borders, capitals and cities.
  - src: ../../assets/projects/meteoguessr/game-difficulty.webp
    alt: Weather IQ difficulty selection with easy, moderate, hard and extreme cards
    caption: Four difficulty levels, from guessing the country with every hint to guessing the city with almost none.
  - src: ../../assets/projects/meteoguessr/game-round.webp
    alt: A guessing round showing mystery weather data and an input asking which country it is
    caption: A round in progress. The weather data is the only clue you get.
---

This one started as a plain weather app and got more interesting when I realised the data
was already a puzzle. If you know it is 21 °C, humid, thundery and the five-day trend is
flat, you can narrow down where on Earth you are. That is a game.

MeteoGuessr is both halves: a genuine weather app built on an interactive 3D globe, and
a guessing game that reuses the same live data as its clues.

## The globe

The globe is Three.js, rotatable and zoomable, textured with NASA blue-marble imagery.
Click anywhere and you get current conditions — temperature, humidity, wind, pressure,
visibility — plus a five-day forecast. Cities can be searched by name and bookmarked as
favourites, kept in local storage, and a ticker along the bottom scrolls live
temperatures from major cities worldwide.

A layer toggle cycles the globe between plain, country borders, capitals and cities.
Separately, weather overlays paint temperature, precipitation or wind across the entire
sphere — those are built by sampling a 288-point grid (24 longitudes × 12 latitudes) and
interpolating it into a texture, which is the part of this project I enjoyed building most.

## Weather IQ

The game shows the weather of a mystery location and asks you to name it, across four
difficulty levels: from guessing the country with every hint available, up to guessing the
city with only a hemisphere and a first letter. Wrong guesses cost points, the penalty
scales with difficulty, and the high score is kept locally.

## How it is built

React 18 and Three.js, bundled by Vite, with a small Vitest suite over the coordinate
maths. Weather comes from **Open-Meteo**, geocoding from Open-Meteo's search API and
reverse geocoding from OpenStreetMap's Nominatim — all free and open, so the app needs no
API keys and costs nothing to run.

## Where it stands

Deployed as a preview. Everything described here works; what it does not yet have is the
polish of a finished product — the globe is heavy on first paint, and the game could use
more rounds and a shared daily challenge rather than a purely local high score.
