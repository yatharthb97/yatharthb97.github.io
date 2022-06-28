---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
description: "Gallery with images."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
# weight: 1
aliases: []
tags: ["gallery", "photos", "images"]
categories: ["photos", "gallery"]
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

<div style="text-align: center;">
  Ⓒ Yatharth Bhasin, unless explicitly stated. Scroll down for credits.
</div>

<span hidden> Images </span>
{{< gallery dir="/images/gallery/" />}} {{< load-photoswipe >}}



### Credits

No credits.