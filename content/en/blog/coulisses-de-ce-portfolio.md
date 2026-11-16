---
title: "Behind this portfolio"
description: "A drafting table, a live sea, a typeface that follows the cursor: how I built this site with Nuxt, and what I learned while optimising it."
date: "2026-11-16"
kind: case
cover: /blog/portfolio-en.webp
coverAlt: "The portfolio home page: “Web apps made for you.” on a dark grid, and the live sea off Urville at the bottom of the screen."
minutes: 5
draft: false
---

A developer’s portfolio is often a list of projects and a contact form. I wanted one that also shows how I work: caring about design as much as code, and shipping something fast and accessible. Here is how it’s made.

## A drafting table

The site opens on a “drafting table”: an almost black background, a fine grid like on a blueprint, and a single accent colour, a signal yellow. Some sections switch to a light sheet, with the same grid, for longer reading.

Each project, on the other hand, keeps its own identity. On its card and its page, Move Taxi Moto, Mariage, Kaplouf and Le Noël des copains wear the colours and typeface of the real app. You can tell at a glance that they are different projects, made for different people.

## A typeface that follows the cursor

The big headings are set in Anybody, a variable typeface: its weight and width can change continuously. Each letter reacts to the cursor and grows bolder or wider as it passes. On touch screens, a slow wave crosses the text instead.

Body text is in Instrument Sans, and the small labels in IBM Plex Mono, for a technical-drawing feel.

## The sea off Urville, live

Under the home page title, there is the sea. Not a random animation: the swell and the tide come live from Open-Meteo, for the waters off Urville-Nacqueville, where I live. A little surfer, “me”, rides the waves. Sometimes he falls off.

It’s a wink, but also a small data project: fetching two sources, combining them, and drawing the result on a canvas without slowing the page down.

## Previews that actually work

The project cards don’t just show screenshots. They redraw a piece of each interface, and you can use it: pick a trip and see the fare, change the number of wedding guests and watch the budget update, or spin the gift-draw wheel.

## Fast, accessible, and found by search engines

The site is generated ahead of time (Nuxt, static rendering) and served by Cloudflare. A few choices made the difference:

- **Fonts**: each project typeface only loads the weights it uses. Kaplouf’s title face went from 88 KB to 13 KB.
- **Images**: every screenshot also exists at 800 px, and the browser picks the right size for the screen.
- **Motion**: animations respect the system’s “reduce motion” setting, and a button lets you pause them.
- **Accessibility**: real headings, alt text, readable names for screen readers, tap targets large enough on mobile.
- **Search**: French and English with the right tags, a sitemap, structured data for Google.

The Lighthouse result: 100 for accessibility, best practices and SEO, and 99 to 100 for performance on desktop.

## What I learned while optimising it

On mobile, performance hit a ceiling. I first thought the culprit was the JavaScript that sizes the big heading. The performance trace pointed elsewhere: the heading appeared with a blur effect, and blurring type that large kept the graphics card busy. Removing the blur, without touching the rest of the animation, brought the first paint measured by Lighthouse from about 770 ms down to 110 ms.

The lesson: measure before you fix. My instinct was pointing at the wrong place.

## Little extras

- A hidden terminal: press ⌘K (or Ctrl K) and try `help`.
- The CV is built from the same data as the site, then exported to PDF: one source to keep up to date.
- A message waits for the curious in the browser console.

## Under the hood

Nuxt 4, Vue 3 and TypeScript, Tailwind CSS 4, @nuxtjs/i18n for the two languages, Nuxt Content for this blog, and project data written once for the site, the CV and the terminal.

If you’d like a site that suits you as well as this one suits me, [write to me](/en#contact).
