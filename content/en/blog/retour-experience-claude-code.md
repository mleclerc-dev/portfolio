---
title: "Two days with Claude Code: an experience report"
description: "I reworked this whole portfolio paired with Claude Code: audits, design, SEO, performance, CV. What works very well, what needs care, and how I use it."
date: "2026-11-16"
kind: story
cover: /blog/portfolio-en.webp
coverAlt: "The portfolio home page: “Web apps made for you.” on a dark grid, and the live sea off Urville at the bottom of the screen."
draft: false
---

This portfolio already existed. It was tidy, but it didn’t say clearly enough what I offer, or to whom. I spent two days reworking it with Claude Code, Anthropic’s coding assistant, right inside my editor. Here is how it went, without embellishment.

## How we worked

My instructions were short, often a single sentence: “the button needs a background”, “the toolbox lacks colour”, “my photo looks pixelated”. Claude read the relevant code, suggested a fix, applied it, then checked the result in a real browser, with screenshots, on desktop and on mobile.

I looked and I decided. Copy, colours, what goes live and what waits: those stayed my calls. When a request was ambiguous, it asked rather than guessed.

## What worked really well

**Audits in parallel.** I asked for a full pass. Claude ran several agents at once: one on search, one on the copy from a client’s point of view, one on the interface. Each came back with a list of issues ranked by importance, pointing at the exact place in the code. Some were real bugs I had missed: for example, my robots.txt file stopped LinkedIn from showing the site’s share image.

**Measure before you fix.** On mobile, performance hit a ceiling. We suspected the JavaScript that sizes the big heading. The performance trace pointed elsewhere: a blur effect in the heading’s entrance kept the graphics card busy. Removing it brought the first paint measured by Lighthouse from about 770 ms down to 110 ms. My instinct was pointing at the wrong place; the measurement wasn’t.

**The thankless tasks, done properly.** The legal notice page, French typography rules, lighter versions of every image, regenerated share images, the CV exported to PDF in the site’s style, and commits split in my repository’s format. Nothing hard, but a lot of time saved.

## What needs care

**It can be wrong with confidence.** It took a domain name from an example file without checking it. An agent removed my name from the page title while optimising for search. One command produced an incomplete commit, caught before it was published. Nothing serious, because I was reviewing. But you do have to review.

**Invent nothing.** For the copy, I set a simple rule: no invented facts, no made-up numbers or testimonials. The audits flagged several claims to check, such as an online payment the project doesn’t offer, and I confirmed or corrected them myself.

**Sensitive data.** For the legal notice, I pasted my business registration sheet as it was. It only used what the law requires to be shown, and left out my social security number and date of birth, telling me so.

**Taste stays human.** The first CV was too dark, the photo too big, a heading didn’t feel right. It suggests, I adjust, it redoes. It’s a conversation, not a command you run once.

## What I take from it

Used as a pair, Claude Code saves me a great deal of time on execution, checks and everything that tends to get postponed. That leaves more time for what matters: understanding the need, designing, and deciding.

For my clients, it mainly changes one thing: more care for the same time. Accessibility, performance and search checks, often skipped for lack of time, become routine. And I review everything that goes to production, just as I did here.

Got a project in mind? [Let’s talk](/en#contact).
