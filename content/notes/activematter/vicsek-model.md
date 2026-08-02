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

## Interactive simulation

The order parameter $v_a$ from the equation above is computed live below every tick — watch it climb toward 1 as you lower the noise, and collapse toward 0 as you raise it. Unlike the earlier demos, this one uses a periodic domain (particles that leave one edge reappear on the opposite one), matching Vicsek's original formulation.

<div class="sim-box">
  <div class="sim-controls">
    <label for="vsNoise">noise &eta;</label>
    <input type="range" id="vsNoise" min="0" max="6.28" value="1.0" step="0.05">
    <span id="vsNoiseOut" class="sim-readout">1.00</span>
  </div>
  <canvas id="vsCanvas" class="sim-canvas"></canvas>
  <div class="sim-order">order parameter v<sub>a</sub> = <span id="vsOrderOut" class="sim-readout">0.00</span></div>
</div>

<script>
(function(){
  var canvas = document.getElementById('vsCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('vsNoise');
  var out = document.getElementById('vsNoiseOut');
  var orderOut = document.getElementById('vsOrderOut');
  var W = 0, H = 0;
  var N = 80;
  var V0 = 1.5;
  var R = 28;
  var boids = [];

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

  function initBoids() {
    boids = [];
    for (var i = 0; i < N; i++) {
      boids.push({ x: rand(0, W || 400), y: rand(0, H || 200), theta: rand(0, Math.PI * 2) });
    }
  }

  window.addEventListener('resize', resize);
  resize();
  initBoids();

  function outputLabel() { out.textContent = parseFloat(slider.value).toFixed(2); }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function wrap(v, max) {
    if (v < 0) return v + max;
    if (v >= max) return v - max;
    return v;
  }

  function step() {
    if (!W || !H) return;
    var eta = parseFloat(slider.value);
    var newTheta = new Array(N);
    var sumCos = 0, sumSin = 0;

    for (var i = 0; i < N; i++) {
      var sx = 0, sy = 0;
      for (var j = 0; j < N; j++) {
        var dx = boids[i].x - boids[j].x;
        var dy = boids[i].y - boids[j].y;
        if (dx * dx + dy * dy < R * R) {
          sx += Math.cos(boids[j].theta);
          sy += Math.sin(boids[j].theta);
        }
      }
      var avgTheta = Math.atan2(sy, sx);
      newTheta[i] = avgTheta + rand(-eta / 2, eta / 2);
    }

    for (var k = 0; k < N; k++) {
      boids[k].theta = newTheta[k];
      boids[k].x = wrap(boids[k].x + V0 * Math.cos(boids[k].theta), W);
      boids[k].y = wrap(boids[k].y + V0 * Math.sin(boids[k].theta), H);
      sumCos += Math.cos(boids[k].theta);
      sumSin += Math.sin(boids[k].theta);
    }

    var va = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
    if (orderOut) orderOut.textContent = va.toFixed(2);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#6563D6';
    boids.forEach(function (b) {
      var lx = b.x + 5 * Math.cos(b.theta);
      var ly = b.y + 5 * Math.sin(b.theta);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(b.x + 3 * Math.cos(b.theta + 2.4), b.y + 3 * Math.sin(b.theta + 2.4));
      ctx.lineTo(b.x + 3 * Math.cos(b.theta - 2.4), b.y + 3 * Math.sin(b.theta - 2.4));
      ctx.closePath();
      ctx.fill();
    });
  }
  setInterval(step, 40);
})();
</script>

## Reference code

```javascript
(function(){
  var canvas = document.getElementById('vsCanvas');
  var ctx = canvas.getContext('2d');
  var slider = document.getElementById('vsNoise');
  var out = document.getElementById('vsNoiseOut');
  var orderOut = document.getElementById('vsOrderOut');
  var W = 0, H = 0;
  var N = 80;           // number of boids
  var V0 = 1.5;          // speed
  var R = 28;            // neighborhood radius, px
  var boids = [];

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

  function initBoids() {
    boids = [];
    for (var i = 0; i < N; i++) {
      boids.push({ x: rand(0, W || 400), y: rand(0, H || 200), theta: rand(0, Math.PI * 2) });
    }
  }

  window.addEventListener('resize', resize);
  resize();
  initBoids();

  function outputLabel() { out.textContent = parseFloat(slider.value).toFixed(2); }
  slider.addEventListener('input', outputLabel);
  outputLabel();

  function wrap(v, max) {
    // periodic boundary conditions, matching Vicsek's original box
    if (v < 0) return v + max;
    if (v >= max) return v - max;
    return v;
  }

  function step() {
    if (!W || !H) return;
    var eta = parseFloat(slider.value);
    var newTheta = new Array(N);
    var sumCos = 0, sumSin = 0;

    for (var i = 0; i < N; i++) {
      var sx = 0, sy = 0;
      for (var j = 0; j < N; j++) {
        var dx = boids[i].x - boids[j].x;
        var dy = boids[i].y - boids[j].y;
        if (dx * dx + dy * dy < R * R) {
          sx += Math.cos(boids[j].theta);
          sy += Math.sin(boids[j].theta);
        }
      }
      // theta_i(t+dt) = <theta_j(t)>_{neighborhood} + noise
      var avgTheta = Math.atan2(sy, sx);
      newTheta[i] = avgTheta + rand(-eta / 2, eta / 2);
    }

    for (var k = 0; k < N; k++) {
      boids[k].theta = newTheta[k];
      boids[k].x = wrap(boids[k].x + V0 * Math.cos(boids[k].theta), W);
      boids[k].y = wrap(boids[k].y + V0 * Math.sin(boids[k].theta), H);
      sumCos += Math.cos(boids[k].theta);
      sumSin += Math.sin(boids[k].theta);
    }

    // v_a = (1 / N v0) * | sum_i v_i |, with |v_i| = v0, so this reduces to
    // the magnitude of the mean heading unit vector.
    var va = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
    if (orderOut) orderOut.textContent = va.toFixed(2);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#6563D6';
    boids.forEach(function (b) {
      var lx = b.x + 5 * Math.cos(b.theta);
      var ly = b.y + 5 * Math.sin(b.theta);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(b.x + 3 * Math.cos(b.theta + 2.4), b.y + 3 * Math.sin(b.theta + 2.4));
      ctx.lineTo(b.x + 3 * Math.cos(b.theta - 2.4), b.y + 3 * Math.sin(b.theta - 2.4));
      ctx.closePath();
      ctx.fill();
    });
  }
  setInterval(step, 40);
})();
```

```python
import numpy as np
import matplotlib.pyplot as plt


def vicsek_step(x, y, theta, L, v0=0.5, r=1.0, eta=0.3, rng=None):
    """One synchronous update of the Vicsek model on a periodic L x L box."""
    rng = rng or np.random.default_rng()
    n = len(x)
    new_theta = np.empty(n)

    for i in range(n):
        dx = (x - x[i] + L / 2) % L - L / 2   # periodic distance
        dy = (y - y[i] + L / 2) % L - L / 2
        neighbors = dx**2 + dy**2 < r**2
        avg_theta = np.arctan2(np.sin(theta[neighbors]).sum(),
                                np.cos(theta[neighbors]).sum())
        new_theta[i] = avg_theta + rng.uniform(-eta / 2, eta / 2)

    x = (x + v0 * np.cos(new_theta)) % L
    y = (y + v0 * np.sin(new_theta)) % L
    return x, y, new_theta


def order_parameter(theta, v0=0.5):
    vx = v0 * np.cos(theta)
    vy = v0 * np.sin(theta)
    return np.hypot(vx.sum(), vy.sum()) / (len(theta) * v0)


if __name__ == "__main__":
    rng = np.random.default_rng(0)
    n, L, v0, r, eta = 200, 20.0, 0.5, 1.0, 0.5

    x = rng.uniform(0, L, n)
    y = rng.uniform(0, L, n)
    theta = rng.uniform(-np.pi, np.pi, n)

    order_history = []
    for step in range(300):
        x, y, theta = vicsek_step(x, y, theta, L, v0, r, eta, rng)
        order_history.append(order_parameter(theta, v0))

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    axes[0].quiver(x, y, np.cos(theta), np.sin(theta), theta, cmap="twilight")
    axes[0].set_title(f"Final configuration (eta = {eta})")
    axes[0].set_aspect("equal")

    axes[1].plot(order_history)
    axes[1].set_title(r"Order parameter $v_a(t)$")
    axes[1].set_xlabel("step")

    plt.tight_layout()
    plt.savefig("vicsek_order.png", dpi=150)
```
