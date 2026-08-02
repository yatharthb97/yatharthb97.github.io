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
author: ["Yatharth Bhasin", "Claude"]
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

## Interactive simulation

Every walker below picks a brand-new random direction on every tick, with no memory of the step before it — watch how the cloud spreads apart even though no single walker is "trying" to go anywhere.

<div class="sim-box">
  <div class="sim-controls">
    <label for="rwParticles">walkers</label>
    <input type="range" id="rwParticles" min="1" max="40" value="15" step="1">
    <span id="rwParticlesOut" class="sim-readout">15</span>
  </div>
  <canvas id="rwCanvas" class="sim-canvas"></canvas>
</div>

<script>
(function(){
  var canvas = document.getElementById('rwCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('rwParticles');
  var out = document.getElementById('rwParticlesOut');
  var W = 0, H = 0;
  var STEP = 3;
  var TRAIL_LEN = 40;
  var walkers = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    if (rect.width === 0 || rect.height === 0) return;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function newWalker() {
    return { x: W / 2, y: H / 2, trail: [] };
  }

  function setCount(n) {
    while (walkers.length < n) walkers.push(newWalker());
    while (walkers.length > n) walkers.pop();
  }

  window.addEventListener('resize', resize);
  resize();
  setCount(parseInt(slider.value, 10));
  slider.addEventListener('input', function () {
    out.textContent = slider.value;
    setCount(parseInt(slider.value, 10));
  });

  function step() {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    walkers.forEach(function (p) {
      var angle = rand(0, Math.PI * 2);
      var nx = p.x + STEP * Math.cos(angle);
      var ny = p.y + STEP * Math.sin(angle);
      if (nx < 0) nx = -nx;
      if (nx > W) nx = 2 * W - nx;
      if (ny < 0) ny = -ny;
      if (ny > H) ny = 2 * H - ny;
      p.x = nx; p.y = ny;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LEN) p.trail.shift();
    });
    walkers.forEach(function (p) {
      var n = p.trail.length;
      for (var i = 0; i < n; i++) {
        var pt = p.trail[i];
        var a = ((i + 1) / n) * 0.2;
        ctx.fillStyle = 'rgba(101,99,214,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#6563D6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  setInterval(step, 30);
})();
</script>

## Reference code

The simulation above, and an equivalent NumPy version that verifies the $\langle r^2(t)\rangle = 2dDt$ scaling by fitting $D$ back out of simulated trajectories.

```javascript
(function(){
  var canvas = document.getElementById('rwCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('rwParticles');
  var out = document.getElementById('rwParticlesOut');
  var W = 0, H = 0;
  var STEP = 3;       // step length per tick
  var TRAIL_LEN = 40;
  var walkers = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    if (rect.width === 0 || rect.height === 0) return;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function newWalker() {
    return { x: W / 2, y: H / 2, trail: [] };
  }

  function setCount(n) {
    while (walkers.length < n) walkers.push(newWalker());
    while (walkers.length > n) walkers.pop();
  }

  window.addEventListener('resize', resize);
  resize();
  setCount(parseInt(slider.value, 10));
  slider.addEventListener('input', function () {
    out.textContent = slider.value;
    setCount(parseInt(slider.value, 10));
  });

  function step() {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    walkers.forEach(function (p) {
      // pure random-walk step: fresh random direction every tick, no memory
      var angle = rand(0, Math.PI * 2);
      var nx = p.x + STEP * Math.cos(angle);
      var ny = p.y + STEP * Math.sin(angle);
      if (nx < 0) nx = -nx;
      if (nx > W) nx = 2 * W - nx;
      if (ny < 0) ny = -ny;
      if (ny > H) ny = 2 * H - ny;
      p.x = nx; p.y = ny;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LEN) p.trail.shift();
    });
    walkers.forEach(function (p) {
      var n = p.trail.length;
      for (var i = 0; i < n; i++) {
        var pt = p.trail[i];
        var a = ((i + 1) / n) * 0.2;
        ctx.fillStyle = 'rgba(101,99,214,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#6563D6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  setInterval(step, 30);
})();
```

```python
import numpy as np
import matplotlib.pyplot as plt


def simple_random_walk(n_walkers=200, n_steps=500, step_size=1.0, seed=0):
    """Simulate independent 2D random walkers with i.i.d. Gaussian increments."""
    rng = np.random.default_rng(seed)
    # increments: N(0, step_size^2) per axis, per tick
    dx = rng.normal(0, step_size, size=(n_walkers, n_steps, 2))
    positions = np.cumsum(dx, axis=1)                      # r(t)
    positions = np.concatenate(
        [np.zeros((n_walkers, 1, 2)), positions], axis=1)  # prepend r(0) = 0
    return positions


def mean_squared_displacement(positions):
    """<r^2(t)> averaged over the walker ensemble."""
    r2 = np.sum(positions**2, axis=2)   # (n_walkers, n_steps+1)
    return r2.mean(axis=0)


if __name__ == "__main__":
    positions = simple_random_walk(n_walkers=200, n_steps=500, step_size=1.0)
    msd = mean_squared_displacement(positions)
    t = np.arange(len(msd))

    # Theory: <r^2(t)> = 2 * d * D * t, with d = 2 dimensions.
    # Here D = step_size^2 / 2 per axis, so <r^2> = 2 * step_size^2 * t = 4Dt.
    D_fit = np.polyfit(t[1:], msd[1:], 1)[0] / (2 * 2)
    print(f"Fitted diffusion coefficient D = {D_fit:.3f}")

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for w in range(10):
        axes[0].plot(positions[w, :, 0], positions[w, :, 1], lw=0.8)
    axes[0].set_title("Sample trajectories")
    axes[0].set_aspect("equal")

    axes[1].loglog(t[1:], msd[1:], label=r"$\langle r^2(t) \rangle$")
    axes[1].loglog(t[1:], 4 * D_fit * t[1:], "--", label=r"$4Dt$ (theory)")
    axes[1].set_title("Mean squared displacement")
    axes[1].legend()

    plt.tight_layout()
    plt.savefig("random_walk_msd.png", dpi=150)
```
