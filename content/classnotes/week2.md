---
title: "STATISTICS AND QUANTITATIVE BIOLOGY | IBB Lecture"
date: 2022-09-12T09:30:00+05:30
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


## Introduction



+ **Z distribution** is a special **normal distribution** with mean 0 and deviations 1.
+ **Quantiles** is splitting the distribution into different sizes based on probability mass.
+ **SEM (Standard Error of means)** is the same as the variance of the sample.
+ 95% of the normal distribution is within **2 $\sigma$** (standard deviations) of the mean.
+ 0.025 quanta: 
+ Median is the point of the 50% quantile.



##  Lecture 2

+ $\mu$ and $\sigma$ are usually unknown. Thats why we use Greek letters. They are for the gods to know.

+ $E(x)$ is the expected value, which is our measurement of the **mean**. For m samples:
  $$
  E(x) = \sum_{i=1}^{m} f_i X_i = \sum \frac{1}{m} X_i
  $$

+ 

+ The variance is defined as:
  $$
  S^2 = E \Big(\sum_{i=1}^{m}(X_i - m)^2 \Big) = \sum \frac{1}{n-1} \Big( x_i - m \Big)^2
  $$
  
+ In R:

  + **dnorm** : is the Probaility Density Function.
  + **pnorm** : is the Cumulative Density Function.
  + **qnorm** : is the Inverse CDF. Get $X$ from $p(X)$.

+ For CLT, we need random independent and identical (iid) variables. But for large $n$ and finite variance for each of the variables, the **identical** criteria can be dropped.

+ For small sample sizes, we use the quantiles of the **t-distribution** instead of the **z-distribution**.




## Lecture 3

### Maximum Likelihood Estimation

+ We consider the exponential distribution:
  $$
  f(x, \lambda) = \lambda e^{- \lambda x}
  $$

+ Maximum Likelihood Estimation of the distribution is done to find the correct parameter. [Curve Fitting]

### Hypothesis Testing

+ A $\chi^2$ distribution is defined as a sum of square of $k$ Normal Distributions $\N(0, 1)$. $k$ is also the **degrees of freedom**, which is the only parameter that the distribution takes as input.
  $$
  \chi ^2 = \sum_{i}^{k} Z_i^2
  $$

+ > > Chi squared distribution

+ > > Emperical Cumulative Distribution Graph

+ > > Difference between one tail and two tail

+ ```mermaid
  flowchart TD
  	X((X)) --> non-parametric
  	X --> parametric
  	X --> proportions
  	non-parametric --> Wilcox-Test
  	non-parametric --> Kraken-Wallas...
  	
  	parametric --> ANOVA
  	parametric --> t-test
  	
  ```

+ > > Why is **proportions** a unique data type?

+ Fisher test can only be used for **2X2 table**, whereas $\chi^2$ test can be used for n-column tables.

+ > > Fisher -> you get Hyper-geometric distribution

+ In R the functions are `fisher.test` and `chisq.test`.

+ Fisher Test: Odds ratio
