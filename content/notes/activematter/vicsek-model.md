---
title: "The Vicsek Model"
date: 2026-08-02T10:45:00+01:00
draft: false
description: "Where flocking comes from: the model that turned collective motion into a phase transition."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
weight: 4
aliases: []
tags: ["blog", "active matter", "notes"]
author: "Yatharth Bhasin"
categories: []
showToc: true
TocOpen: false
hidemeta: false
comments: true

disableHLJS: false
disableShare: false
hideSummary: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false

cover:
    image: "<image path/url>"
    alt: "<alt text>"
    caption: "<text>"
    relative: false
    hidden: true

editPost:
    URL: "https://github.com/yatharthb97/yatharthb97.github.io/tree/main/content/"
    Text: "Suggest Changes"
    appendFilePath: true
---

Every model earlier in this section describes a single particle, on its own, ignoring everyone else. The Vicsek model is the point where this series stops being about individuals and starts being about crowds. The rule is almost insultingly simple: each particle moves at a fixed speed, and at every time step it adopts the average heading of every other particle within some fixed radius, plus a bit of random noise thrown in to keep things honest. There's no leader, no global coordination, and no particle that's aware of anything beyond its own local neighborhood. And yet, tune the amount of noise down (or the density up) past a critical point, and the whole system spontaneously locks into a common direction of travel — a flock, a school, a swarm — indistinguishable in spirit from the murmurations of starlings or the coordinated streaming of dense bacterial colonies.

What made this model a landmark rather than just a cute simulation is that the transition from disordered motion to collective flocking behaves like a genuine phase transition, with an order parameter (the degree of overall alignment) that turns on continuously or abruptly depending on the noise level, density, and the details of the interaction rule. It's a striking example of a system where the *only* new ingredient, relative to the single-particle active matter models earlier in this series, is a local alignment interaction — there's no attraction, no repulsion beyond avoiding total overlap, and no explicit leader-follower structure, yet order emerges anyway. It's also a useful reminder of where this whole series is headed: from a memoryless random walker, to a particle with a persistent direction, to a particle that pays attention to its neighbors — each step adding one more piece of structure, and each one buying a qualitatively new kind of behavior.

## Basic equations

Each particle $i$ moves at fixed speed $v_0$ along its current heading $\theta_i$:
$$
\vec{x}_i(t + \Delta t) = \vec{x}_i(t) + v_0\, \big(\cos\theta_i(t),\, \sin\theta_i(t)\big)\, \Delta t
$$

The heading is updated to the local average direction of all particles within a neighborhood radius $r$ (including itself), plus noise $\eta_i$ drawn uniformly from $[-\eta/2, \eta/2]$:
$$
\theta_i(t + \Delta t) = \langle \theta_j(t) \rangle_{j \in \text{neighborhood}_i(r)} + \eta_i(t)
$$

Collective order is measured by the polar order parameter, which is near zero for disordered motion and approaches 1 for a fully aligned flock:
$$
v_a = \frac{1}{N v_0} \left| \sum_{i=1}^{N} \vec{v}_i \right|
$$
