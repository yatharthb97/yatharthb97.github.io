---
title: "python"
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


<!-- Container for the interpreter -->
<div id="pyodide-interpreter">
  <div id="terminal" style="height: 60vh; background: #1e1e1e; color: #d4d4d4; 
        padding: 20px; font-family: 'Fira Code', monospace; overflow-y: auto;
        border-radius: 5px; position: relative;">
    <div id="output"></div>
    <div id="input-area" style="display: flex; align-items: center; margin-top: 10px;">
      <span style="color: #569cd6;">>>> </span>
      <div id="input" contenteditable="true" 
           style="flex-grow: 1; background: transparent; border: none; 
                  color: #d4d4d4; padding-left: 10px; outline: none; 
                  caret-color: white; white-space: pre-wrap;"
           spellcheck="false"></div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>

<script>
let pyodide;
let history = [];
let historyIndex = 0;
let currentInput = '';

// Initialize Pyodide with essential packages
async function initializePyodide() {
  pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    stdout: (text) => appendOutput(text, 'output'),
    stderr: (text) => appendOutput(text, 'error')
  });

  // Install default packages
  await pyodide.loadPackage(['micropip', 'numpy', 'pandas']);
  
  // Set up environment
  await pyodide.runPythonAsync(`
    import sys
    sys.displayhook = lambda x: None  # Disable default print hook
  `);

  appendOutput(`Python ${pyodide.runPython('import sys; sys.version.split()[0]}')}\n`, 'system');
  appendOutput('Type "help", "copyright", "credits" or "license" for more information.\n', 'system');
  updatePrompt();
}

// Output handling with ANSI escape code support
function appendOutput(text, type = 'normal') {
  const output = document.getElementById('output');
  const pre = document.createElement('div');
  
  // Basic ANSI color support
  text = text.replace(/\x1b\[31m/g, '<span style="color: #ff5555">')
             .replace(/\x1b\[32m/g, '<span style="color: #50fa7b">')
             .replace(/\x1b\[0m/g, '</span>');

  switch(type) {
    case 'error':
      pre.innerHTML = `<span style="color: #ff5555">${text}</span>`;
      break;
    case 'output':
      pre.innerHTML = `<span style="color: #bd93f9">${text}</span>`;
      break;
    case 'system':
      pre.innerHTML = `<span style="color: #6272a4">${text}</span>`;
      break;
    default:
      pre.textContent = text;
  }

  output.appendChild(pre);
  output.scrollTop = output.scrollHeight;
}

// Execute Python code with async support
async function execute(code) {
  try {
    const result = await pyodide.runPythonAsync(code);
    if(result !== undefined) {
      appendOutput(result.toString(), 'output');
    }
  } catch(err) {
    appendOutput(err.message, 'error');
  }
}

// Handle input events
document.getElementById('input').addEventListener('keydown', async (e) => {
  const input = document.getElementById('input');
  
  switch(e.key) {
    case 'Enter':
      e.preventDefault();
      const code = input.textContent.trim();
      
      if(code === 'clear') {
        document.getElementById('output').innerHTML = '';
        input.textContent = '';
        return;
      }
      
      if(code.length > 0) {
        history.push(code);
        historyIndex = history.length;
        appendOutput(`>>> ${code}`, 'input');
        
        await execute(code);
        input.textContent = '';
        updatePrompt();
      }
      break;

    case 'ArrowUp':
      e.preventDefault();
      if(historyIndex > 0) {
        historyIndex--;
        input.textContent = history[historyIndex];
      }
      break;

    case 'ArrowDown':
      e.preventDefault();
      if(historyIndex < history.length - 1) {
        historyIndex++;
        input.textContent = history[historyIndex];
      }
      break;

    case 'Tab':
      e.preventDefault();
      // Basic auto-completion
      const current = input.textContent;
      const matches = await pyodide.runPythonAsync(`
        dir(__import__('builtins')) + 
        dir(__import__('x'))
      `);
      const suggestions = matches.filter(m => m.startsWith(current));
      if(suggestions.length > 0) {
        input.textContent = suggestions[0];
      }
      break;
  }
});

function updatePrompt() {
  const prompt = document.querySelector('#input-area span');
  prompt.textContent = currentInput.length > 0 ? '... ' : '>>> ';
}

// Initialize when ready
window.addEventListener('load', initializePyodide);
</script>

<style>
/* Terminal-like styling */
#terminal {
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

#input[placeholder]:empty:before {
  content: attr(placeholder);
  color: #6272a4;
}

/* Custom scrollbar */
#terminal::-webkit-scrollbar {
  width: 8px;
}

#terminal::-webkit-scrollbar-track {
  background: #2d2d2d;
}

#terminal::-webkit-scrollbar-thumb {
  background: #44475a;
  border-radius: 4px;
}
</style>