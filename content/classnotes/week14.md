---
title: "Week14"
date: 2022-12-06T10:33:04Z
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



# Statistics



+ Should falsify an explatory model, not a null model.



## Bayesian Statistics



+ It is a framework to build statistical models.

+ It extends proportional logic (true/flase) to continuous plausability.

+ More complex to obtain analytical results: but easy to compute computationally (MCMC technique).

+ **Models with more ways to realize the data are more plausable.**

+ > What is a Random-walk Metropolis ?



## Outliers: Robust linear regression

+ Instead of discarding outliers, we can do Rank-tests (Mann-Whitney test)
+ For outliers: Use distributions with fatter tails. The outliers are then penalised less, and a better linear regression model is achieved which includes outliers.
+ **Robust linear regression** is just a linear regression, but with **Student T-distribution.**



## Pooling of Data

+ Complete pooling: ignore group structure and estimate global effects.
+ Unpooled data: estimate effect in each group seperately.
  + This has low quality of estimates in smaller groups.
+ Partial pooling: assume each group can be different, but they are all part of some larger group. There could be deviations from the large group but not arbitrary.



## Poisson Regression Coefficients

+ Link function for probabilities: **log-odds** to map probabilities to a linear 

$$
- \infty <  log \frac {p}{1-p} < \infty
$$

+ Inverse of log-odds or the intercept:

$$
\frac {1}{1 + e^{\beta_0}}
$$

# Zero-inflated models


$$
ZIP(k, \lambda, p_0) = 
\begin{array}
\{ &
	\begin{array}
		\\
		p_{0} + (1-p_0)Poi(0, \lambda) &  k=0 \\
	 (1-p_0)Poi(k, \lambda) &  k > 0
	\end{array}
\end{array}
$$
 

We now have 2 generalised linear models:

+ One for the probability of zeros (binomial)
+ One for the number of eggs (Poisson)



In R:

```R
obs = pm.ZeroInflatedPoisson("eggs", psi=1-p0, theta=mu, observed=data)
```



# Survival Analysis

+ Track subject and "death" events.
+ Right censoring: the event has not occured at the end of the study.
+ Left censoring: TODO
+ Traditionally used to study lifespan, but can be used to study other things as well:
+ Survival Function:

$$
S(t) = P(T > t)
$$

## How to included censoring in your model? | Kaplan-Meier



+ Includes **Right-censoring** events.

$$
\hat S = \sum_{t_i < t} \frac {n_i - d_i}{n_i}
$$

$n_i$ : number of at-risk individuals at time.

$d_i$ : number of deaths until time $t_i$.



Standard Error formula:
$$
SE(S(t)) = S(t) \sqrt{\sum \frac {d_i}{n_i(n_i - d_i)}}
$$


