---
title: "Multiprocessing"
date: 2025-03-25T20:02:52Z
draft: false
description: "Notes."
ShowCanonicalLink: false
canonicalURL: ""
searchHidden: false
math: false
# weight: 1
aliases: []
tags: ["blog", "notes"]
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


+ Namespaces don't work:

```python
## Both the functions would fail to pickle, 
## instead just have a blank function in a module.
class Namespace:

    @staticmethod
    def test_static():
        return "Finished"

    def test():
        return "Finished"
```

```python
## This might work
exec(open("code/Trappy-Scopes/trackyscope/splitprocessor.py", "r").read()) 
```


+ Imports need to happen inside the function, also `PATH` list of each function is independent and needs to be redefined:


```python
def process_func():
    import sys
    sys.path.appen("path-to-your-module")

    ## Calculations
    return
```

```python
## Won't work
import time
def process_func():
    time.sleep(2)
    return "Finished"


## Works
def process_func():
    import time
    time.sleep(2)
    return "Finished"

```






cell1.client.get_versions(check=True)


import sys
print(sys.version)


https://distributed.dask.org/en/latest/memory.html
https://docs.python.org/3/library/pickle.html#what-can-be-pickled-and-unpickled
https://medium.com/csmadeeasy/bug-bytes-ii-solving-python-multiprocessing-locks-8258c9002d6
https://docs.python.org/3/library/multiprocessing.html#programming-guidelines