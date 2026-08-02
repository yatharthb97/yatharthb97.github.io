---
title: "Simple Random Walks"
date: 2026-08-02T10:00:00+01:00
draft: false
description: "The null model everything else in this series gets compared against."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
weight: 1
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

A simple random walk is the least interesting-looking process that turns out to be the most load-bearing idea in this whole series. A particle sits at some position, and at every tick of a clock it takes a step in a random direction, completely independent of every step that came before it. There is no memory, no preferred direction, and no notion of "trying" to go anywhere. And yet, out of this featureless rule comes one of the most robust results in statistical physics: the particle's typical distance from its starting point grows with the square root of time, not linearly with it. That single scaling law is the fingerprint of diffusion, and it shows up whether the walker is a pollen grain being kicked by water molecules, a photon bouncing through the sun's interior, or a foraging animal with no memory of where it has already searched.

What makes the random walk worth starting with, rather than a historical curiosity, is that every model further down this series is really an argument about how a system deviates from it. Run-and-tumble bacteria and active Brownian particles both look like biased, correlated random walks over long enough timescales; a flock in the Vicsek model is what happens when many random walkers start listening to their neighbors instead of ignoring them entirely. So the plain random walk isn't just the simplest model here, it's the ruler everything else gets measured against: is this system diffusive, is it faster than diffusive (superdiffusive, ballistic), or does it show some richer crossover between the two regimes?

## Basic equations

In discrete time, a walker takes independent, identically distributed steps $\xi_i$:
$$
x(t + \Delta t) = x(t) + \xi(t), \qquad \langle \xi(t) \rangle = 0, \quad \langle \xi(t)\,\xi(t') \rangle = 2D\,\Delta t\ \delta_{tt'}
$$

Because the steps are uncorrelated, variances add, and the mean squared displacement (MSD) grows linearly in time:
$$
\langle x^2(t) \rangle = 2Dt \quad \text{(1D)}, \qquad \langle r^2(t) \rangle = 2dDt \quad \text{(d dimensions)}
$$

In the continuum limit, the probability density $P(x,t)$ of finding the walker at position $x$ obeys the diffusion equation:
$$
\frac{\partial P}{\partial t} = D\,\frac{\partial^2 P}{\partial x^2}
$$

whose solution starting from a point source is the familiar spreading Gaussian, $P(x,t) = \frac{1}{\sqrt{4\pi D t}}\, e^{-x^2/4Dt}$.
