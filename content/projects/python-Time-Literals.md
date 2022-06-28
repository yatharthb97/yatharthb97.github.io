---
title: "Python Time Literals"
date: 2022-06-28T18:15:16+05:30
draft: true
description: "python Coding project - Time Literal parsing."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
# weight: 1
aliases: []
tags: ["projects"]
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

Safe and accurate parsing of time literals (values + units) is both commonplace and crutial. While `C++` has a mechanism through `STL chrono`, such a functionality is absent in python (as per my information). Here is my attempt to solve the issue.

## 