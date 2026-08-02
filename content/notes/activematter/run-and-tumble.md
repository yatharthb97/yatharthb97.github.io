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

<div class="sim-controls">
  <label for="rtTumble">tumbling rate &lambda;</label>
  <input type="range" id="rtTumble" min="0.01" max="0.3" value="0.05" step="0.01">
  <span id="rtTumbleOut" class="sim-readout">0.05</span>
</div>

<canvas id="rtCanvas" class="sim-canvas"></canvas>

<script>
(function(){
  var canvas = document.getElementById('rtCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('rtTumble');
  var out = document.getElementById('rtTumbleOut');
  var W = 0, H = 0;
  var V0 = 2.2;
  var N = 10;
  var TRAIL_LEN = 100;
  var particles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    if (rect.width === 0 || rect.height === 0) return;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.forEach(function (p) {
      p.x = Math.min(p.x, W);
      p.y = Math.min(p.y, H);
    });
  }

  function newParticle() {
    return {
      x: W ? rand(W * 0.2, W * 0.8) : 0,
      y: H ? rand(H * 0.2, H * 0.8) : 0,
      theta: rand(0, Math.PI * 2),
      trail: []
    };
  }

  window.addEventListener('resize', resize);
  resize();
  for (var i = 0; i < N; i++) particles.push(newParticle());

  function outputLabel() {
    out.textContent = parseFloat(slider.value).toFixed(2);
  }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function step() {
    if (!W || !H) return;
    var lambda = parseFloat(slider.value);
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      if (Math.random() < lambda) {
        p.theta = rand(0, Math.PI * 2);
      }
      var nx = p.x + V0 * Math.cos(p.theta);
      var ny = p.y + V0 * Math.sin(p.theta);
      if (nx < 0) { nx = -nx; p.theta = Math.PI - p.theta; }
      if (nx > W) { nx = 2 * W - nx; p.theta = Math.PI - p.theta; }
      if (ny < 0) { ny = -ny; p.theta = -p.theta; }
      if (ny > H) { ny = 2 * H - ny; p.theta = -p.theta; }
      p.x = nx; p.y = ny;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LEN) p.trail.shift();
    });
    particles.forEach(function (p) {
      var n = p.trail.length;
      for (var i = 0; i < n; i++) {
        var pt = p.trail[i];
        var a = ((i + 1) / n) * 0.15;
        ctx.fillStyle = 'rgba(101,99,214,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#6563D6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  setInterval(step, 30);
})();
</script>

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

## Reference code

<div class="code-tabs">
<div class="code-tab-buttons">
<button type="button" class="code-tab-btn active" data-tab="js">JavaScript</button>
<button type="button" class="code-tab-btn" data-tab="py">Python</button>
</div>

<div class="code-tab-panel active" data-panel="js">

```javascript
(function(){
  var canvas = document.getElementById('rtCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('rtTumble');
  var out = document.getElementById('rtTumbleOut');
  var W = 0, H = 0;
  var V0 = 2.2;       // run speed
  var N = 10;
  var TRAIL_LEN = 100;
  var particles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    if (rect.width === 0 || rect.height === 0) return;
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles.forEach(function (p) {
      p.x = Math.min(p.x, W);
      p.y = Math.min(p.y, H);
    });
  }

  function newParticle() {
    return {
      x: W ? rand(W * 0.2, W * 0.8) : 0,
      y: H ? rand(H * 0.2, H * 0.8) : 0,
      theta: rand(0, Math.PI * 2),
      trail: []
    };
  }

  window.addEventListener('resize', resize);
  resize();
  for (var i = 0; i < N; i++) particles.push(newParticle());

  function outputLabel() {
    out.textContent = parseFloat(slider.value).toFixed(2);
  }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function step() {
    if (!W || !H) return;
    var lambda = parseFloat(slider.value); // tumble probability per tick
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      // Poisson tumbling: reorient completely at rate lambda
      if (Math.random() < lambda) {
        p.theta = rand(0, Math.PI * 2);
      }
      var nx = p.x + V0 * Math.cos(p.theta);
      var ny = p.y + V0 * Math.sin(p.theta);
      if (nx < 0) { nx = -nx; p.theta = Math.PI - p.theta; }
      if (nx > W) { nx = 2 * W - nx; p.theta = Math.PI - p.theta; }
      if (ny < 0) { ny = -ny; p.theta = -p.theta; }
      if (ny > H) { ny = 2 * H - ny; p.theta = -p.theta; }
      p.x = nx; p.y = ny;
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > TRAIL_LEN) p.trail.shift();
    });
    particles.forEach(function (p) {
      var n = p.trail.length;
      for (var i = 0; i < n; i++) {
        var pt = p.trail[i];
        var a = ((i + 1) / n) * 0.15;
        ctx.fillStyle = 'rgba(101,99,214,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#6563D6';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  setInterval(step, 30);
})();
```

</div>

<div class="code-tab-panel" data-panel="py">

```python
import numpy as np
import matplotlib.pyplot as plt


def run_and_tumble(n_particles=200, n_steps=2000, v0=1.0, tumble_rate=0.05, seed=0):
    """Simulate 2D run-and-tumble particles (Poisson tumbling, fixed run speed)."""
    rng = np.random.default_rng(seed)
    theta = rng.uniform(0, 2 * np.pi, size=n_particles)
    pos = np.zeros((n_particles, n_steps + 1, 2))

    for t in range(1, n_steps + 1):
        tumble = rng.random(n_particles) < tumble_rate
        theta[tumble] = rng.uniform(0, 2 * np.pi, size=tumble.sum())
        pos[:, t, 0] = pos[:, t - 1, 0] + v0 * np.cos(theta)
        pos[:, t, 1] = pos[:, t - 1, 1] + v0 * np.sin(theta)

    return pos


def mean_squared_displacement(pos):
    return np.sum(pos**2, axis=2).mean(axis=0)


if __name__ == "__main__":
    v0, tumble_rate = 1.0, 0.05
    pos = run_and_tumble(v0=v0, tumble_rate=tumble_rate)
    msd = mean_squared_displacement(pos)
    t = np.arange(len(msd))

    tau = 1 / tumble_rate
    d_eff = v0**2 * tau / 2   # 2D: D_eff = v0^2 * tau / d

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for p in range(8):
        axes[0].plot(pos[p, :, 0], pos[p, :, 1], lw=0.8)
    axes[0].set_title("Sample trajectories")
    axes[0].set_aspect("equal")

    axes[1].loglog(t[1:], msd[1:], label=r"$\langle r^2(t) \rangle$")
    axes[1].loglog(t[1:], v0**2 * t[1:]**2, "--", label="ballistic (short time)")
    axes[1].loglog(t[1:], 4 * d_eff * t[1:], ":", label="diffusive (long time)")
    axes[1].set_title(f"MSD, tumble rate = {tumble_rate}")
    axes[1].legend()

    plt.tight_layout()
    plt.savefig("run_and_tumble_msd.png", dpi=150)
```

</div>
</div>
