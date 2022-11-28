---
title: "Week9"
date: 2022-10-31T14:02:00Z
draft: false
description: "IBB Lecture class notes."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: true
# weight: 1
aliases: []
tags: ["classnotes"]
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



# The role of selection in the genetics of populations

<center>Isabel Gordo</center>

+ Describe genetic structure of populations
+ Make theories about the evolutionary forces acting on populations.
+ Concerned mainly with understandiong vsriation within species
+ Typically one focuses on the evolution of one or two loci at a time.

## Evolutionary Forces

+ Mutations (mistakes are unavoidable)
+ Natural selections (there is extensive variability in fitness within populations)
+ Migration (populations are structured)
+ Genetic Drift (every population is finite, and subject to stochastic events)

<u>Note</u>: Evolution involves the interplay with all the forces.



+ Hardy-Weinberg equilibrium: first milestone in Population Genetics in sexual diploids.
+ Mutation rate is around $10^{-9}$ per nucleotide site per generation.

## Effects of mutations

1. Neutral (don't affect fitness)
2. Effectively neutral (-1 < $N_s$ < 1)
3. Beneficial (causes adaptation)
4. Deleterious (cause degeneration)



## Neutral Theory of Molecular Evolution

+ Kimura's neutral model: Assumes that most variation observed within and across species can be explained by an equilibrium between variation generating mechanisms — mutation  — and a variation erosion mechanism — genetic drift.

+ **One such test is pN/pS:** the ratio of observed non-synonymous to synonymous polymorphism, compared to that expected if one assumes uniform mutation rates across the gene.

  **pN/pS should be 1 under neutral evolution.**

+ Selection as an evolutionary force — constant fitness.



## Frequency-dependent selection

+ Here fitness depend on the frequencies of genotypes in the population.
+ "A rare phenotype may be more popular in terms of sexual preference." — negative frequency dependedent selection.
+ There is also positive frequency based selection, which is the more obvious case.



# Probability of Fixation of Mutations under Selection

+ **Not every good allele is fixed and not every bad one is lost!**
+ Time of Fixation of a Benefitial Mutation: A mutation that confers a 1% benefit will take ~200 generations to reach a frequency close to fixation.



+ The decrease in populations , deleterious mutations can depart from their equilibrium frequency, be lost or go to fixation, all by stochastic drift.
+ Clonal interference: adaptations muttations arise faster tahn the time it takes for an individual mutation to get fixed.
+  When can populations avoid clonal interference? By using sexual recombination.



# Using Wright-Fisher model to understand the mechanisms of evolution

<center>Tiago Paixão</center>

1. Genetic Drift
2. Mutation
3. Selection



# Experimental evolution applied to cell biology

<center>Marco Fumasoni</center>



+ Cell Perturbations:
  + Gene deletion
  + Paralog (Express something which doesn't bwlong there)
  + Ortholog (Insert a foreign gene)
  + Ancestral allele
  + Partial loss of function (disturb a gene partially)
+ The 'Evolutionary repair' approach — as a methodology to study evolution.
  + DNA replication stress: specially visible in cancer cells, because they keep on dividing incessantly.



## Ageing in Cells

+ Three hypothetical reasons:
  + Harmful mutations
  + Antagonistic Pleiotrophy



# Community Ecology

+ > > Read: Modern Coexistance Theory (Chesson 2000)

+  Metabolism scales predictibly with size (mass)

+ Energy fluxes: intake and expenditure

+ Some concepts not discussed in the lecture:

  + Intraspecific trait variation
  + Priority effectss (species arrivaal)
  + Metacommunities (interacting communities)

+ Are all species equally important? **Foundation Species**.

+  Biodiversity is important because it gives you functional redundancy.

+  

# Ecology and Evolution in communities



+ Niche differences enables coexistence within different species.

+ Evolution in a stable environment maximizes carrying capacity $K$. [theory]

+ Density-dependence, resource competition, mortality affect life history traits (size, age at reproduction, etc)

+ Bacteria are the most common model organisms for studying ecology.

+ > > Malebra & Marshall 2019 Ecol [Danallelia micro-algae paper]

+ WTF is the **Metabolics theory**?

  + TODO





# Evolution of microbial Genomics

<center> Walden Kwong</center>



+ What do we measure?

  + G + C content (the composition of these amino acids)

  + Gernome size
  + Structural arrangements
  + Coding & non-coding content

+ Genome Size: Why are some bigger (or smaller) than others?

  + More genes == bigger genomes

  + Linear relationship in most **bacteria & archaea** ~1 kB, but thus relationship falls apart in prokaryotes.

  + In bacterial genomes: Use it or lose it!

  + How do bacteria lose the genes?

    + Selective advantage? or

      + Lower the $dN/dS$, stronger is the purifying selection.
      + Conclusions from the study: Purifying selection (probably) doesn't have a major impact on (bacterial) genome streamlining!
      + No relationship between genome size and growth rate or cell size!

    + Neutral Process ?

      + Neutral process — strong deletion bias, and is well established for baceria as of now.

        ```mermaid
        graph LR
        	Deletion-Bias --> Small-Genome
          Positive-Selection --> Big-Genome
          Purifying-Selection --> ??
        ```

    + Genetic Drift results in fixation of alleles inspite of the fluctuating frequencies fo alleles.

+ Genome Erosion - reduction to the extreme, which often leads to coupling of the bacteria with a certain host.

  + Disadvantages:
    + Rapid evolution, extreme drift
    + Fixation of deleterious mutations due to drift
    + Irreversible loss of genes
  + Muller's Ratchet: is genetic erosion a one way street to genetic oblivion?
    + Becuase in large and unrestricted populations — deleterious mutations are removed through recombination and these dewleterious mutations are less likely to get fixed by genetic drift.
    + In small, clonal populations — no way to recombine and more likely to fix and repeat cycle.
    + There are some mechanisms that are know, that help these bacterias avoid this trap:
      + Compensatory mutations
      + Just-enough recombination
      + Strong purifying selection
      + Symbiont replacement (doom for microbe, but not the host)
    +  

+ C - value paradox

+ Population size in eukaryotes: as in bacteria, effective population size (Ne) is postulated to strongly effect genome composition.

  + Eukaryotes have smaller populations than prokaryotes.
  + General trend upheld but variation depending on taxonomic group.

+ Whole Gene Duplication

+ Horizontal Gene transfer: What. is it? How common?

  + Upto 30% of thr genome of a bacteria may be acquired by HGT.
  + Pan genome of HGT: a prokaryotic species have no single defined gene set.

+ Euk. genomes have continued to evolve and gain complexity via endosymbiosis.

+ Constructive Neutral Evolution: complex functions can evolve with neutral changes to the network.



# Seminars



+ Horizontal gene transfer is common is prokaryotes (30% of genome can be acquired).
+ 

---

