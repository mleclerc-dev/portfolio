---
title: "Mariage: an app to plan a whole wedding as a couple"
description: "Guests, budget, seating plan, big-day schedule: how I designed an app where everything is recalculated together, from the idea to the app installed on our phones."
date: "2026-11-16"
kind: case
project: mariage
cover: /projects/mariage-dashboard.webp
coverAlt: "The Mariage dashboard: countdown, expected guests, estimated cost, replies, budget and tasks to do."
minutes: 6
draft: true
---

Planning a wedding means juggling a dozen lists that depend on each other. The guest list changes the number of covers, which changes the caterer’s quote, which changes the budget. The seating plan depends on the replies. The big-day schedule depends on the suppliers. In a spreadsheet, every change means redoing everything by hand.

So I built Mariage: an app to plan a whole wedding as a couple, in one shared space, where everything is recalculated together. Add Aunt Monique, and the catering, the tables and the drinks reception update.

**[To complete: a word on the context, for example that it was for your own wedding, and what made you decide to publish it.]**

## What the app does

- **Guests, by household**: status, meal or drinks only, adult or child, diet, in one click. CSV import and export.
- **Replies**: each household gets a secret link to a page in the wedding’s colours, and replies without creating an account.
- **Budget**: by item, with quotes side by side, payments and due dates, and a “What if…?” simulator.
- **Seating plan**: drag and drop, with the venue’s layout, automatic placement by household and a printable version.
- **Planning**: a countdown checklist, the big-day run sheet, the supplier address book.
- **The rest**: guests’ lodging and shuttles, gifts received and thank-you notes to send.

![The page a household opens from its link, on a phone: the invitation, date and venue, then “Who will be there?”.](/projects/mariage-rsvp.webp)

## Everything recalculated together

The most useful part is how the data is linked. The number of guests at the meal and at the drinks reception feeds the estimated cost, line by line. The simulator lets you try a scenario (“what if we invited 20 more people?”) without touching the real figures.

![Scenarios: change the guest count and the total cost is recalculated line by line.](/projects/mariage-scenarios.webp)

## Built for two

Both partners work in the same space, each on their phone or computer. The app installs like a regular app (PWA), with a dark mode, quick search (⌘K) and PDF exports for suppliers: the list for the caterer, the seating plan, the big-day run sheet.

![The seating plan: households to seat on the left, a top table and round tables, with automatic placement.](/projects/mariage-plan.webp)

## Technical choices

- **Laravel** for the data, the calculations and access.
- **Inertia and Vue 3** for a fast interface, without page reloads.
- **Tailwind CSS and shadcn-vue** for a consistent interface, from phone to desktop.
- **PWA** to install it on a phone without going through an app store.

## What it says about a business project

Under the wedding theme, it’s a real business tool: linked data, calculations that update themselves, several people in the same space, access links without accounts, and exports for partners. That’s exactly what many businesses still running their orders, schedules or sign-ups in a spreadsheet need.

**[To complete: the link to the app once it is public.]**
