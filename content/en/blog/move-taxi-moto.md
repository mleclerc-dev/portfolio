---
title: "Move Taxi Moto: a motorbike taxi booked in three clicks"
description: "How I built the website, the booking flow with a map-based fare and the back office of a Paris motorbike taxi service, with Nuxt and Laravel."
date: "2026-11-16"
kind: case
project: move-taxi
cover: /projects/taxi-home.webp
coverAlt: "The movetaxi.fr home page: a motorbike taxi by the Arc de Triomphe, and the booking form."
minutes: 5
draft: true
---

Move Taxi Moto is a motorbike taxi service in Paris and the surrounding region: to the airports, the stations, or by the day. The client wanted customers to book a ride on their own, at any hour, knowing the price before ordering. I built the whole service: the website, the booking flow with its fare calculation, customer accounts and the back office that runs the rides.

**[To complete: how bookings worked before the site (phone, messages…) and what wasn’t working.]**

## Booking in three clicks

The heart of the project is the booking form. It takes three steps:

1. enter the pick-up and drop-off, or book a driver by the hour;
2. the route appears on the map and the fare is calculated straight away;
3. confirm the ride, at the flat price shown.

No quote to wait for, no surprise on arrival: the price is known before ordering. For the most requested trips, such as the airports, flat rates are shown up front.

![The booking page: a map of Paris and its suburbs, and the “Calculate your fare” form.](/projects/taxi-booking.webp)

## A fare worked out on the map

The fare depends on the route. It is drawn on a Google Maps map, and the price is worked out from the client’s rates: per trip, or by the hour. Customers see their flat price before ordering.

![The flat rates page: Roissy-Charles-de-Gaulle from €95, Orly €70, Le Bourget €75.](/projects/taxi-pricing.webp)

## Customer accounts, and a back office for the team

Customers have an account to find their rides. Cancellation is free up to 24 hours before pick-up.

For the team, the back office brings together rides, drivers and business customers. It’s the everyday tool: what’s coming in, who’s leaving, and for whom.

## Technical choices

- **Nuxt** for the website and the booking flow, rendered on the server: pages load fast and are read well by Google.
- **Laravel** (PHP 8.5) for the API, the fares, the accounts and the back office.
- **Google Maps** for the map, addresses and distances.

One developer from start to finish, so nothing lost between the mock-up and the code: what was designed is what was shipped.

## Today

The service is live at [movetaxi.fr](https://www.movetaxi.fr/).

**[To complete: since when the site has been live, and one or two numbers if the client agrees (bookings per month, share of rides booked online…). Ideally, a sentence from the client.]**

## And for your business?

The same approach works for many services booked in advance: private hire, shuttles, rentals, leisure activities. A simple form, a price worked out straight away, and a back office to stay organised. If that sounds like your needs, write to me: I’ll tell you honestly what is realistic for your budget.
