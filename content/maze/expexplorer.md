---
title: "expexplorer"
date: 2025-03-23T15:03:01+05:30
draft: false
description: "Online python interpretor"
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
# weight: 1
aliases: []
tags: ["python"]
author: "Yatharth Bhasin"
categories: []
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
hidemeta: false
comments: true

disableHLJS: false # to disable highlightjs
disableShare: false
hideSummary: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
UseHugoToc: false

cover:
    image: "<image path/url>" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: false # when using page bundles set this to true
    hidden: true # only hide on current single page

editPost:
    URL: "https://github.com/yatharthb97/yatharthb97.github.io/tree/main/content/maze"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---





<!-- Include Pyodide -->
<script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>

<!-- Container for background output (optional) -->
<div id="background-output" style="display: none;"></div>

<!-- Visible console for users -->
<div id="user-console">
  <textarea id="user-code"></textarea>
  <button onclick="runUserCode()">Run</button>
  <pre id="user-output"></pre>
</div>

<script>
  let pyodideReady = false;

  // Initialize Pyodide and run background code
  async function initializePyodide() {
    // Load Pyodide
    window.pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });

    // Install packages (e.g., numpy)
    await pyodide.loadPackage("micropip");
    await pyodide.runPythonAsync(`
      import micropip
      await micropip.install('numpy')
    `);

    // Run background code
    pyodide.runPython(`
      import numpy as np
      from js import document

      # Example: Precompute data
      precomputed_data = np.array([1, 2, 3]) * 10
      document.getElementById("background-output").innerHTML = "Background task completed!";
    `);

    pyodideReady = true;
  }

  // User-facing code execution
  async function runUserCode() {
    if (!pyodideReady) return;
    const code = document.getElementById("user-code").value;
    try {
      const result = pyodide.runPython(code);
      document.getElementById("user-output").textContent = result;
    } catch (err) {
      document.getElementById("user-output").textContent = err.message;
    }
  }

  // Start Pyodide on page load
  window.addEventListener("load", initializePyodide);
</script>