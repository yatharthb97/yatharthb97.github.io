---
title: "Robustness in Bacterial Chemotaxis"
date: 2023-08-29T16:10:25+01:00
draft: false
description: "Notes from Uri Alon's book (Chapter 9)"
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: false
# weight: 1
aliases: []
tags: ["blog"]
categories: []
author: "Yatharth Bhasin"
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
    URL: "https://github.com/yatharthb97/yatharthb97.github.io/tree/main/content/"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---



+ Bacterial chemotaxis signal response: allows bacteria to navigate. Chemicals are either **attractants** or **repellants**.

+ Common attractants: sugars and amino acids serene and aspartate, and repellents such as certain metal ions and amino acid leucine.
+ bacteria can detect concentration gradients as small as a change of one molecule per cell volume across the cell length. They detect such gradients over background concentrations spanning five orders of magnitude. (no reference)
+ Biased random walk: walk straight for 1sec and then tumbes in about  0.1 sec. Ecoli keeps track of the gradient and then adjusts the **tumbling frequency** accordingly.
+ Chemotaxis sensses the temporal derivative of the concentration of attractants and repellents.
+ Animal cells, whose cell size is about $10\mu m$ and whose response takes minutes, can sense spatial gradients directly.

+ An experiment: Add Aspartate to a liquid sample. The steady state tumbling frequency increases in a unifrom distribution of the attractant. As the cell senses an "increasing gradient" in all directions. The frequency reduces from $1Hz$ to $0.1Hz$. Eventually, it settles back to the steady state value, in a response termed as **sensory adaptation**. This takes several seconds to several minutes based on the step change.
+ Bacterial chemotaxis shows **exact adaptation**, that is the steady-state tumbling frequency is well defined and would fallback to the same value with every step increase of the attractant. That is, the steady-state tumbling frequencyt is independent of the attractant levels. Barrying that the attractant concentration does not saturate the receptors.
+ The tumbling frequency is mediated by the probablity of the flagella motors to turn Clockwise (CW), heras the usual state is CCW and in synchrony.
+ 