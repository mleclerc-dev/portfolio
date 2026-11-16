---
title: "Move Taxi Moto : un moto-taxi réservé en trois clics"
description: "Comment j’ai construit le site, la réservation avec tarif calculé sur carte et le back-office d’un service de moto-taxi à Paris, en Nuxt et Laravel."
date: "2026-11-16"
kind: case
project: move-taxi
cover: /projects/taxi-home.webp
coverAlt: "L’accueil de movetaxi.fr : un moto-taxi devant l’Arc de triomphe, et le formulaire de réservation."
minutes: 5
draft: true
---

Move Taxi Moto est un service de moto-taxi à Paris et en Île-de-France : vers les aéroports, les gares, ou à la journée. Le client voulait qu’on puisse réserver une course seul, à toute heure, en connaissant le prix avant de commander. J’ai construit tout le service : le site, le parcours de réservation avec son calcul de tarif, les comptes clients et le back-office qui fait tourner les courses.

**[À compléter : comment se passaient les réservations avant le site (téléphone, messages…) et ce qui coinçait.]**

## Réserver en trois clics

Le cœur du projet, c’est le formulaire de réservation. Il tient en trois étapes :

1. on indique le départ et l’arrivée, ou une mise à disposition à l’heure ;
2. le trajet s’affiche sur la carte et le tarif est calculé aussitôt ;
3. on valide la course, au prix forfaitaire affiché.

Pas de devis à attendre, pas de surprise à l’arrivée : le prix est connu avant de commander. Pour les trajets les plus demandés, comme les aéroports, des forfaits fixes sont affichés directement.

![La page de réservation : une carte de Paris et de sa banlieue, et le formulaire « Calculer votre tarif ».](/projects/taxi-booking.webp)

## Un tarif calculé sur la carte

Le tarif dépend du trajet. Il est tracé sur une carte Google Maps, et le prix est calculé selon la grille du client : au trajet, ou en mise à disposition. Le client voit son prix forfaitaire avant de commander.

![La page des forfaits : Roissy-Charles-de-Gaulle à partir de 95 €, Orly 70 €, Le Bourget 75 €.](/projects/taxi-pricing.webp)

## Des comptes clients, et un back-office pour l’équipe

Les clients ont un compte pour retrouver leurs courses. L’annulation est gratuite jusqu’à 24 heures avant la prise en charge.

Côté équipe, le back-office regroupe les courses, les chauffeurs et les clients business. C’est l’outil du quotidien : on y voit ce qui arrive, qui part, et pour qui.

## Les choix techniques

- **Nuxt** pour le site et la réservation, rendu côté serveur : les pages se chargent vite et sont bien lues par Google.
- **Laravel** (PHP 8.5) pour l’API, le calcul des tarifs, les comptes et le back-office.
- **Google Maps** pour la carte, les adresses et les distances.

Un seul développeur du début à la fin, donc pas de perte entre la maquette et le code : ce qui a été dessiné est ce qui a été livré.

## Aujourd’hui

Le service est en production sur [movetaxi.fr](https://www.movetaxi.fr/).

**[À compléter : depuis quand le site est en ligne, et un ou deux chiffres si le client est d’accord (réservations par mois, part des courses réservées en ligne…). Idéalement, une phrase du client.]**

## Et pour votre activité ?

Le même principe marche pour beaucoup de services réservés à l’avance : VTC, navettes, location, activités de loisirs. Un formulaire simple, un prix calculé tout de suite, et un back-office pour s’organiser. Si vous avez ce genre de besoin, écrivez-moi : je vous dirai franchement ce qui est réaliste pour votre budget.
