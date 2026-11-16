---
title: "Les coulisses de ce portfolio"
description: "Une table à dessin, une mer en direct, une police qui réagit au curseur : comment j’ai construit ce site en Nuxt, et ce que j’ai appris en l’optimisant."
date: "2026-11-16"
kind: case
cover: /blog/portfolio-fr.webp
coverAlt: "L’accueil du portfolio : « Des applis web faites pour vous. » sur une grille sombre, et la mer d’Urville en direct en bas de l’écran."
minutes: 5
draft: false
---

Un portfolio de développeur, c’est souvent une liste de projets et un formulaire de contact. J’en voulais un qui montre aussi ma façon de travailler : soigner le design autant que le code, et livrer quelque chose de rapide et accessible. Voici comment il est fait.

## Une table à dessin

Le site s’ouvre sur une « table à dessin » : un fond presque noir, une grille fine comme sur un plan, et une seule couleur d’accent, un jaune signal. Certaines sections passent sur une feuille claire, avec la même grille, pour les textes plus longs.

Chaque projet, en revanche, garde sa propre identité. Sur sa carte et sur sa page, Move Taxi Moto, Mariage, Kaplouf et Le Noël des copains reprennent les couleurs et la police de la vraie appli. On voit tout de suite que ce sont des projets différents, faits pour des gens différents.

## Une police qui réagit au curseur

Les grands titres sont composés en Anybody, une police variable : sa graisse et sa largeur peuvent varier en continu. Chaque lettre réagit à la position du curseur et s’épaissit ou s’élargit quand on passe dessus. Sur écran tactile, une vague lente traverse le texte à la place.

Le texte courant est en Instrument Sans, et les petites étiquettes en IBM Plex Mono, pour l’esprit « plan technique ».

## La mer d’Urville, en direct

Sous le titre de l’accueil, il y a la mer. Pas une animation au hasard : la houle et la marée viennent en direct d’Open-Meteo, pour le large d’Urville-Nacqueville, là où je vis. Un petit surfeur, « moi », se laisse porter par les vagues. Il lui arrive de tomber.

C’est un clin d’œil, mais aussi un vrai petit projet de données : récupérer deux sources, les combiner, et dessiner le résultat dans un canvas sans ralentir la page.

## Des aperçus qui marchent vraiment

Les cartes des projets ne montrent pas seulement des captures. Elles redessinent un morceau de chaque interface, et on peut s’en servir : choisir un trajet et voir le prix de la course, faire varier le nombre d’invités d’un mariage et voir le budget se recalculer, ou faire tourner la roue du tirage au sort.

## Rapide, accessible, et bien référencé

Le site est généré à l’avance (Nuxt, rendu statique) puis servi par Cloudflare. Quelques choix ont compté :

- **Les polices** : chaque police de projet ne charge que les graisses qu’elle utilise. La police du titre de Kaplouf est passée de 88 Ko à 13 Ko.
- **Les images** : chaque capture existe en version 800 px, et le navigateur choisit la bonne taille selon l’écran.
- **Les animations** : elles respectent le réglage « réduire les animations » du système, et un bouton permet de les mettre en pause.
- **L’accessibilité** : vrais titres, textes alternatifs, noms lisibles pour les lecteurs d’écran, zones de clic assez grandes sur mobile.
- **Le référencement** : site en français et en anglais avec les bonnes balises, plan du site, données structurées pour Google.

Résultat sur Lighthouse : 100 en accessibilité, en bonnes pratiques et en SEO, et 99 à 100 en performance sur ordinateur.

## Ce que j’ai appris en l’optimisant

Sur mobile, la performance plafonnait. J’ai d’abord cru que le coupable était le JavaScript qui ajuste la taille du grand titre. La trace de performance a montré autre chose : le titre apparaissait avec un effet de flou, et ce flou sur un texte aussi grand occupait la carte graphique. En le retirant, sans toucher au reste de l’animation, le premier affichage mesuré par Lighthouse est passé d’environ 770 ms à 110 ms.

La leçon : mesurer avant de corriger. L’intuition visait le mauvais endroit.

## Les petits plus

- Un terminal caché : tapez ⌘K (ou Ctrl K) et essayez `help`.
- Le CV est généré à partir des mêmes données que le site, puis exporté en PDF : une seule source à tenir à jour.
- Un message attend les curieux dans la console du navigateur.

## Sous le capot

Nuxt 4, Vue 3 et TypeScript, Tailwind CSS 4, @nuxtjs/i18n pour les deux langues, Nuxt Content pour ce blog, et des données de projet écrites une seule fois pour le site, le CV et le terminal.

Si vous voulez un site qui vous ressemble autant que celui-ci me ressemble, [écrivez-moi](/#contact).
