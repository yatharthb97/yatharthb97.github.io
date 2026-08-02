---
title: "Run-and-Tumble Particles"
date: 2026-08-02T10:15:00+01:00
draft: false
description: "How E. coli turns a biased coin flip into a search strategy."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
weight: 2
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

Run-and-tumble motion is the first model in this series that is trying to describe something a real organism actually does, rather than an idealized particle. It's the motility strategy of *E. coli* and many other flagellated bacteria: swim in a roughly straight line ("run") for about a second, then abruptly reorient in a random direction ("tumble") over a much shorter timescale, and repeat. Unlike the plain random walk, a run-and-tumble particle has a well-defined instantaneous velocity and moves ballistically over short times — it's only once you zoom out past several run lengths that the path starts looking diffusive again. The trick that makes this more than "a random walk with extra steps" is what the bacterium does with the tumbling itself: by biasing how long it runs (not which direction it tumbles into) based on whether the local chemical concentration is improving or worsening, it converts a directionless reorientation process into directed drift up a nutrient gradient, without ever computing a gradient outright.

This is also, not coincidentally, the mechanism behind the bacterial chemotaxis notes elsewhere in this section — the "biased random walk" described there is exactly the process formalized here. What's elegant about the model is how cleanly it separates two very different timescales and two very different kinds of randomness: the ballistic, deterministic-looking run, and the memoryless, Poisson-distributed tumble event. That separation is also precisely why the long-time behavior recovers something diffusion-like: on timescales much longer than the mean run duration, the direction the particle is currently pointing becomes irrelevant, and the details of individual runs wash out into an effective diffusion coefficient — just one that now depends on how fast the particle swims and how often it reorients, rather than being a bare material constant.

## Basic equations

Between tumbles, the particle moves ballistically at fixed speed $v_0$ along its current orientation $\hat{n}(t)$:
$$
\frac{d\vec{r}}{dt} = v_0\, \hat{n}(t)
$$

Tumbles are a Poisson process with rate $\lambda$ (mean run time $\tau = 1/\lambda$); at each tumble, $\hat{n}$ is redrawn, either fully randomly or with some angular bias:
$$
P(\text{no tumble in } [t, t+dt]) = 1 - \lambda\, dt, \qquad \langle \hat{n}(t) \cdot \hat{n}(t') \rangle = e^{-\lambda |t - t'|}
$$

At times long compared to $\tau$, the mean squared displacement crosses over from ballistic ($\langle r^2 \rangle \sim v_0^2 t^2$) to diffusive, with an effective diffusion coefficient set by the persistence time:
$$
D_{\text{eff}} = \frac{v_0^2 \tau}{d} = \frac{v_0^2}{d\,\lambda} \qquad \text{(d spatial dimensions)}
$$
