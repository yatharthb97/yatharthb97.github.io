---
title: "Active Brownian Particles"
date: 2026-08-02T10:30:00+01:00
draft: false
description: "The workhorse model behind synthetic microswimmers, and the physics behind the random-walker on the search page."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
weight: 3
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

Active Brownian Particles (ABPs) are the model you reach for when you want the *simplest possible* description of a self-propelled particle, without committing to any particular biological or chemical mechanism. Instead of alternating between discrete runs and tumbles, an ABP moves continuously at a fixed speed along a body orientation that itself performs an ordinary random walk — not in space, but in angle. Picture a swimmer that never fully changes direction in one sharp event; it just slowly, continuously forgets which way it was pointing, the way a compass needle would if it were being nudged by random noise instead of a magnetic field. This is a reasonably good caricature of synthetic active colloids (Janus particles powered by a chemical reaction on one face) and is close enough to real microswimmer behavior that it shows up constantly in the active matter literature, including work adjacent to the kind of *Chlamydomonas* tracking this site's about-me page mentions.

The reason ABPs are worth knowing on their own, and not just as a variant of run-and-tumble, is the shape of the trajectories they produce: smooth, continuously curving paths rather than piecewise-straight ones. If that description sounds familiar, it should — it's essentially the same correlated random walk used for the particle simulation sitting on this site's search page, just without the reflecting speed clamp added there for visual effect. At short times the motion looks ballistic (the particle hasn't had time to forget its heading), and at long times, once the orientation has randomized many times over, it crosses over to an effective diffusive regime exactly like the run-and-tumble case — except now the "memory time" comes from continuous rotational diffusion rather than a discrete tumbling rate. At high densities, this same simple rule is also what drives one of the more surprising results in active matter physics: motility-induced phase separation, where purely repulsive, otherwise unremarkable particles spontaneously clump into dense and dilute regions just because self-propulsion makes it hard for them to get out of each other's way.

## Basic equations

Position evolves via self-propulsion along orientation $\hat{n}(\theta) = (\cos\theta, \sin\theta)$, plus ordinary translational noise:
$$
\frac{d\vec{r}}{dt} = v_0\, \hat{n}(\theta(t)) + \sqrt{2D_t}\, \vec{\xi}(t)
$$

The orientation itself performs a free rotational random walk, driven by rotational diffusion $D_r$:
$$
\frac{d\theta}{dt} = \sqrt{2D_r}\, \eta(t), \qquad \langle \eta(t)\eta(t') \rangle = \delta(t - t')
$$

The orientation correlation decays exponentially with a persistence time $\tau_r = 1/D_r$, giving a persistence length $\ell_p = v_0 \tau_r$, and at long times the effective diffusion coefficient in 2D is:
$$
D_{\text{eff}} = D_t + \frac{v_0^2}{2 D_r}
$$
