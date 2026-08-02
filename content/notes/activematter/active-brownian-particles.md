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

## Interactive simulation

This is the same equation set driving the particle sim on this site's search page. Turn rotational diffusion down and the paths straighten into long, smooth arcs; turn it up and the particles forget their heading almost immediately, collapsing toward the jittery, memoryless look of the plain random walk.

<div class="sim-box">
  <div class="sim-controls">
    <label for="abpDr">rotational diffusion D<sub>r</sub></label>
    <input type="range" id="abpDr" min="0.001" max="0.05" value="0.01" step="0.001">
    <span id="abpDrOut" class="sim-readout">0.010</span>
  </div>
  <canvas id="abpCanvas" class="sim-canvas"></canvas>
</div>
<script>
(function(){
  var canvas = document.getElementById('abpCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('abpDr');
  var out = document.getElementById('abpDrOut');
  var W = 0, H = 0;
  var V0 = 2.0;
  var DT_TRANS = 0.02;
  var N = 10;
  var TRAIL_LEN = 100;
  var particles = [];

  function randn() {
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

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
      x: W ? W * Math.random() : 0,
      y: H ? H * Math.random() : 0,
      theta: Math.random() * Math.PI * 2,
      trail: []
    };
  }

  window.addEventListener('resize', resize);
  resize();
  for (var i = 0; i < N; i++) particles.push(newParticle());

  function outputLabel() { out.textContent = parseFloat(slider.value).toFixed(3); }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function step() {
    if (!W || !H) return;
    var Dr = parseFloat(slider.value);
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      p.theta += Math.sqrt(2 * Dr) * randn();
      var nx = p.x + V0 * Math.cos(p.theta) + Math.sqrt(2 * DT_TRANS) * randn();
      var ny = p.y + V0 * Math.sin(p.theta) + Math.sqrt(2 * DT_TRANS) * randn();
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

## Reference code

```javascript
(function(){
  var canvas = document.getElementById('abpCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('abpDr');
  var out = document.getElementById('abpDrOut');
  var W = 0, H = 0;
  var V0 = 2.0;          // self-propulsion speed
  var DT_TRANS = 0.02;   // translational noise strength
  var N = 10;
  var TRAIL_LEN = 100;
  var particles = [];

  function randn() {
    // Box-Muller transform for standard-normal noise
    var u = 1 - Math.random(), v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

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
      x: W ? W * Math.random() : 0,
      y: H ? H * Math.random() : 0,
      theta: Math.random() * Math.PI * 2,
      trail: []
    };
  }

  window.addEventListener('resize', resize);
  resize();
  for (var i = 0; i < N; i++) particles.push(newParticle());

  function outputLabel() { out.textContent = parseFloat(slider.value).toFixed(3); }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function step() {
    if (!W || !H) return;
    var Dr = parseFloat(slider.value);
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      // dtheta = sqrt(2 Dr) * eta(t)
      p.theta += Math.sqrt(2 * Dr) * randn();
      // dr/dt = v0 * n(theta) + sqrt(2 Dt) * xi(t)
      var nx = p.x + V0 * Math.cos(p.theta) + Math.sqrt(2 * DT_TRANS) * randn();
      var ny = p.y + V0 * Math.sin(p.theta) + Math.sqrt(2 * DT_TRANS) * randn();
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

```python
import numpy as np
import matplotlib.pyplot as plt


def active_brownian_particles(n_particles=200, n_steps=2000, v0=1.0,
                               Dr=0.05, Dt=0.01, dt=1.0, seed=0):
    """Simulate 2D Active Brownian Particles (self-propulsion + rotational diffusion)."""
    rng = np.random.default_rng(seed)
    theta = rng.uniform(0, 2 * np.pi, size=n_particles)
    pos = np.zeros((n_particles, n_steps + 1, 2))

    for t in range(1, n_steps + 1):
        theta = theta + np.sqrt(2 * Dr * dt) * rng.standard_normal(n_particles)
        noise = np.sqrt(2 * Dt * dt) * rng.standard_normal((n_particles, 2))
        pos[:, t, 0] = pos[:, t - 1, 0] + v0 * np.cos(theta) * dt + noise[:, 0]
        pos[:, t, 1] = pos[:, t - 1, 1] + v0 * np.sin(theta) * dt + noise[:, 1]

    return pos


def mean_squared_displacement(pos):
    return np.sum(pos**2, axis=2).mean(axis=0)


if __name__ == "__main__":
    v0, Dr, Dt = 1.0, 0.02, 0.01
    pos = active_brownian_particles(v0=v0, Dr=Dr, Dt=Dt)
    msd = mean_squared_displacement(pos)
    t = np.arange(len(msd))

    tau_r = 1 / Dr
    d_eff = Dt + v0**2 / (2 * Dr)

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for p in range(8):
        axes[0].plot(pos[p, :, 0], pos[p, :, 1], lw=0.8)
    axes[0].set_title("Sample trajectories")
    axes[0].set_aspect("equal")

    axes[1].loglog(t[1:], msd[1:], label=r"$\langle r^2(t) \rangle$")
    axes[1].loglog(t[1:], 4 * d_eff * t[1:], "--", label=r"$4 D_{eff} t$ (long time)")
    axes[1].axvline(tau_r, color="gray", ls=":", label=r"$\tau_r = 1/D_r$")
    axes[1].set_title(f"MSD, D_r = {Dr}")
    axes[1].legend()

    plt.tight_layout()
    plt.savefig("abp_msd.png", dpi=150)
```
