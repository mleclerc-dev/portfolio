---
title: "Deux jours avec Claude Code : retour d’expérience"
description: "J’ai retravaillé tout ce portfolio en binôme avec Claude Code : audits, design, SEO, performance, CV. Ce qui marche très bien, ce qui demande de la vigilance, et comment je m’en sers."
date: "2026-11-16"
kind: story
cover: /blog/portfolio-fr.webp
coverAlt: "L’accueil du portfolio : « Des applis web faites pour vous. » sur une grille sombre, et la mer d’Urville en direct en bas de l’écran."
draft: true
---

Ce portfolio existait déjà. Il était propre, mais il ne disait pas assez clairement ce que je propose, ni à qui. J’ai passé deux jours à le retravailler avec Claude Code, l’assistant de programmation d’Anthropic, directement dans mon éditeur. Voici comment ça s’est passé, sans enjoliver.

## Comment on a travaillé

Mes consignes étaient courtes, souvent une seule phrase : « il manque un fond au bouton », « ça manque de couleur sur la boîte à outils », « la photo est pixelisée ». Claude lisait le code concerné, proposait une correction, l’appliquait, puis vérifiait le résultat dans un vrai navigateur, captures d’écran à l’appui, sur ordinateur et sur mobile.

Moi, je regardais et je tranchais. Les choix de textes, de couleurs, ce qui part en ligne et ce qui attend : ça restait mes décisions. Quand une demande était ambiguë, il posait la question plutôt que de deviner.

## Ce qui a vraiment bien marché

**Les audits en parallèle.** J’ai demandé une passe complète. Claude a lancé plusieurs agents en même temps : un sur le référencement, un sur les textes du point de vue d’un client, un sur l’interface. Chacun a rendu une liste de problèmes classés par importance, avec l’endroit exact dans le code. Certains étaient de vrais bugs que je n’avais pas vus : par exemple, mon fichier robots.txt empêchait LinkedIn d’afficher l’image de partage du site.

**Mesurer avant de corriger.** Sur mobile, la performance plafonnait. On soupçonnait le JavaScript qui ajuste la taille du grand titre. La trace de performance a montré autre chose : un effet de flou sur l’animation du titre occupait la carte graphique. En le retirant, le premier affichage mesuré par Lighthouse est passé d’environ 770 ms à 110 ms. Mon intuition visait le mauvais endroit, la mesure non.

**Les tâches ingrates, faites proprement.** La page de mentions légales, les espaces insécables de la typographie française, des versions allégées de chaque image, les images de partage à regénérer, le CV exporté en PDF dans le style du site, et des commits découpés au format de mon dépôt. Rien de difficile, mais beaucoup de temps gagné.

## Ce qui demande de la vigilance

**Il peut se tromper avec aplomb.** Il a repris un nom de domaine d’un fichier d’exemple sans le vérifier. Un agent a retiré mon nom du titre de la page en optimisant le référencement. Une commande a produit un commit incomplet, rattrapé avant d’être publié. Rien de grave, parce que je relisais. Mais il faut relire.

**Ne rien inventer.** Pour les textes, j’ai posé une règle simple : aucun fait inventé, pas de chiffres ni de témoignages imaginaires. Les audits ont signalé plusieurs affirmations à vérifier, comme un paiement en ligne que le projet ne propose pas, et c’est moi qui ai confirmé ou corrigé.

**Les données sensibles.** Pour les mentions légales, j’ai collé ma fiche d’auto-entrepreneur telle quelle. Il n’a repris que ce que la loi demande d’afficher et a laissé de côté le numéro de sécurité sociale et la date de naissance, en me le signalant.

**Le goût reste humain.** Le premier CV était trop sombre, la photo trop grande, un titre ne me plaisait pas. Il propose, j’ajuste, il refait. C’est un dialogue, pas une commande qu’on lance une fois.

## Ce que j’en retiens

Utilisé comme un binôme, Claude Code me fait gagner un temps considérable sur l’exécution, les vérifications et tout ce qu’on remet à plus tard. Ça me laisse plus de temps pour ce qui compte : comprendre le besoin, concevoir, et décider.

Pour mes clients, ça change surtout une chose : plus de soin pour le même temps. Les vérifications d’accessibilité, de performance et de référencement, qu’on saute souvent faute de temps, deviennent systématiques. Et je relis tout ce qui part en production, comme je l’ai fait ici.

Un projet en tête ? [Parlons-en](/#contact).
