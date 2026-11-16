---
title: "Mariage : une appli pour organiser tout un mariage à deux"
description: "Invités, budget, plan de table, planning du jour J : comment j’ai conçu une appli où tout se recalcule ensemble, de l’idée à l’appli installée sur nos téléphones."
date: "2026-11-16"
kind: case
project: mariage
cover: /projects/mariage-dashboard.webp
coverAlt: "Le tableau de bord de Mariage : compte à rebours, invités prévus, coût estimé, réponses, budget et tâches à faire."
minutes: 6
draft: true
---

Organiser un mariage, c’est jongler avec une dizaine de listes qui dépendent les unes des autres. La liste des invités change le nombre de couverts, qui change le devis du traiteur, qui change le budget. Le plan de table dépend des réponses. Le déroulé du jour J dépend des prestataires. Dans un tableur, chaque changement oblige à tout reprendre à la main.

J’ai donc construit Mariage : une appli pour organiser tout un mariage à deux, sur le même espace, où tout se recalcule ensemble. On ajoute la tante Monique, et le traiteur, les tables et le vin d’honneur se mettent à jour.

**[À compléter : un mot sur le contexte, par exemple que c’était pour votre propre mariage, et ce qui vous a décidé à la publier.]**

## Ce que fait l’appli

- **Les invités, par foyer** : statut, repas ou vin d’honneur, adulte ou enfant, régime alimentaire, en un clic. Import et export CSV.
- **Les réponses** : chaque foyer reçoit un lien secret vers une page aux couleurs du mariage, et répond sans créer de compte.
- **Le budget** : par poste, avec les devis comparés, les paiements et les échéances, et un simulateur « Et si… ? ».
- **Le plan de table** : en glisser-déposer, avec le décor de la salle, un placement automatique par foyer et une version imprimable.
- **Le planning** : rétroplanning avec checklist, déroulé du jour J, carnet des prestataires.
- **Le reste** : hébergement et navettes des invités, cadeaux reçus et remerciements à envoyer.

![La page qu’ouvre un foyer avec son lien, sur téléphone : l’invitation, la date, le lieu, puis « Qui sera présent ? ».](/projects/mariage-rsvp.webp)

## Tout se recalcule ensemble

Le plus utile, c’est le lien entre les données. Le nombre d’invités au repas et au vin d’honneur alimente le coût estimé, poste par poste. Le simulateur permet de tester un scénario (« et si on invitait 20 personnes de plus ? ») sans toucher aux vrais chiffres.

![Les scénarios : on fait varier le nombre d’invités et le coût total se recalcule poste par poste.](/projects/mariage-scenarios.webp)

## Pensée pour deux

Les deux mariés travaillent sur le même espace, chacun sur son téléphone ou son ordinateur. L’appli s’installe comme une appli classique (PWA), avec un mode sombre, une recherche rapide (⌘K) et des exports PDF pour les prestataires : liste pour le traiteur, plan de table, déroulé du jour J.

![Le plan de table : les foyers à placer à gauche, une table d’honneur et des tables rondes, avec le placement automatique.](/projects/mariage-plan.webp)

## Les choix techniques

- **Laravel** pour les données, les calculs et les accès.
- **Inertia et Vue 3** pour une interface rapide, sans recharger la page.
- **Tailwind CSS et shadcn-vue** pour une interface cohérente, du téléphone à l’ordinateur.
- **PWA** pour l’installer sur le téléphone sans passer par un store.

## Ce que ça dit pour un projet pro

Sous le thème du mariage, c’est un vrai outil métier : des données liées entre elles, des calculs qui se mettent à jour, plusieurs personnes sur le même espace, des liens d’accès sans compte et des exports pour les partenaires. C’est exactement ce dont ont besoin beaucoup d’entreprises qui gèrent encore leurs commandes, leurs plannings ou leurs inscriptions dans un tableur.

**[À compléter : le lien vers l’appli quand elle sera publique.]**
