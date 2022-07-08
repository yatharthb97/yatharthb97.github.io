---
title: "Systems Biology Part - 1"
date: 2022-07-08T22:08:07+05:30
draft: true
description: "Notes from Uri Alon."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
# weight: 1
aliases: []
tags: ["blog"]
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
    URL: "https://github.com/yatharthb97/yatharthb97.github.io/tree/main/content/"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---

# C1 - Transcription Networks - Basic Concepts

The cell continuously monitors its environment and calculates the amount of each protein that is needed. The rate of production is controlled by **transcription networks.**

* To represent **environmental states**, cells use special proteins called **transcription factors** as *symbols*.
* Transcription factors are molecules that can rapidly switch between **active** and **inactive** molecular states, with rates determined by environmental factors.
* Transcription factors **bind to DNA** and regulate `read-rate` of genes.
* Transcription factors regulate their target genes to mobilize the appropriate protein response in each case.

```mermaid
graph TD;
	genes --transcribed--> mRNA --translated--> proteins;
    proteins--<<modify>>-->environment;
	environment --<what?>--> genes
```

**E. coli**: has an internal representation of about 300 degrees of freedom. Hence, it has 300 transcription factors.

## Transcription Network Model

**Gene**: a stretch of DNA whose sequence encodes the information needed for production of a protein.

**Transcription**: Gene is copied into a disposable mRNA molecule by RNA polymerase (RNAp).

**Promoter**: The number of mRNA produced per unit time is controlled by a regulatory region of DNA that **precedes** the gene which is called promoter. It regulates the *chemical affinity* of the DNA to mRNA (opposite is a **Repressor**).

Transcription factors bind to the 

```mermaid
graph LR
	Gene-- copied by RNAp into --> mRNA .- transcription;
	mRNA -- translated to --> Protein .- translation;
```



## Input Functions

## Dynamics & Response Time



# C2 - Autoregulation - A Network Motif

## Networks

## Autoregulation

